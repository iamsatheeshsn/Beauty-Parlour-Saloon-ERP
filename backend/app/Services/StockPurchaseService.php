<?php

namespace App\Services;

use App\Enums\ActivityActionEnum;
use App\Enums\StockMovementTypeEnum;
use App\Enums\StockPurchaseStatusEnum;
use App\Exceptions\ApiException;
use App\Models\Product;
use App\Models\StockPurchase;
use App\Models\StockPurchaseItem;
use App\Repositories\StockPurchaseRepository;
use App\Support\VatCalculator;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class StockPurchaseService
{
    public function __construct(
        private readonly StockPurchaseRepository $repository,
        private readonly StockMovementService $movementService,
        private readonly ActivityLogService $activityLogService
    ) {
    }

    public function resolveCompanyId(Request $request): ?int
    {
        return $request->user()?->company_id;
    }

    public function paginate(Request $request): LengthAwarePaginator
    {
        $companyId = $this->resolveCompanyId($request);
        if (! $companyId) {
            throw new ApiException('Company context required', 422);
        }

        return $this->repository->paginate(
            $companyId,
            (int) $request->input('per_page', 15),
            $request->only(['search', 'status', 'supplier_id'])
        );
    }

    public function findOrFail(int $id, ?int $companyId): StockPurchase
    {
        if (! $companyId) {
            throw new ApiException('Company context required', 422);
        }

        $purchase = $this->repository->findById($id, $companyId);
        if (! $purchase) {
            throw new ApiException('Purchase order not found', 404);
        }

        return $purchase;
    }

    public function storeRules(): array
    {
        return [
            'supplier_id' => ['required', 'integer', 'exists:suppliers,id'],
            'branch_id' => ['nullable', 'integer', 'exists:branches,id'],
            'reference' => ['nullable', 'string', 'max:100'],
            'notes' => ['nullable', 'string'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer', 'exists:products,id'],
            'items.*.quantity_ordered' => ['required', 'numeric', 'min:0.001'],
            'items.*.unit_cost' => ['required', 'numeric', 'min:0'],
            'items.*.vat_rate' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'items.*.batch_number' => ['nullable', 'string', 'max:50'],
            'items.*.expiry_date' => ['nullable', 'date'],
        ];
    }

    public function receiveRules(): array
    {
        return [
            'items' => ['required', 'array', 'min:1'],
            'items.*.item_id' => ['required', 'integer', 'exists:stock_purchase_items,id'],
            'items.*.quantity_received' => ['required', 'numeric', 'min:0.001'],
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data, ?int $companyId, Request $request): StockPurchase
    {
        if (! $companyId) {
            throw new ApiException('Company context required', 422);
        }

        $items = $data['items'];
        unset($data['items']);

        return DB::transaction(function () use ($data, $items, $companyId, $request) {
            $subtotal = 0;
            $vatTotal = 0;
            $lineRows = [];

            foreach ($items as $index => $item) {
                $product = Product::query()->where('company_id', $companyId)->find($item['product_id']);
                if (! $product) {
                    throw new ApiException("Product #{$item['product_id']} not found", 422);
                }

                $vatRate = (float) ($item['vat_rate'] ?? $product->vat_rate ?? 0);
                $totals = VatCalculator::lineTotals(
                    (float) $item['unit_cost'],
                    $vatRate,
                    false,
                    1,
                    true
                );
                $qty = (float) $item['quantity_ordered'];
                $lineSub = round($totals['line_subtotal'] * $qty, 2);
                $lineVat = round($totals['line_vat'] * $qty, 2);
                $lineTotal = round($totals['line_total'] * $qty, 2);

                $subtotal += $lineTotal;
                $vatTotal += $lineVat;

                $lineRows[] = [
                    'product_id' => $product->id,
                    'quantity_ordered' => $qty,
                    'quantity_received' => 0,
                    'unit_cost' => $item['unit_cost'],
                    'vat_rate' => $vatRate,
                    'line_subtotal' => $lineSub,
                    'line_vat' => $lineVat,
                    'line_total' => $lineTotal,
                    'batch_number' => $item['batch_number'] ?? null,
                    'expiry_date' => $item['expiry_date'] ?? null,
                    'sort_order' => $index + 1,
                ];
            }

            $purchase = $this->repository->create([
                ...$data,
                'company_id' => $companyId,
                'branch_id' => $data['branch_id'] ?? $request->user()?->branch_id,
                'created_by' => $request->user()?->id,
                'code' => $this->repository->nextCode($companyId),
                'status' => StockPurchaseStatusEnum::Ordered->value,
                'subtotal' => round($subtotal, 2),
                'vat_amount' => round($vatTotal, 2),
                'total_amount' => round($subtotal, 2),
                'ordered_at' => now(),
            ]);

            foreach ($lineRows as $row) {
                StockPurchaseItem::query()->create(['stock_purchase_id' => $purchase->id, ...$row]);
            }

            $purchase = $purchase->fresh(['supplier', 'branch', 'items.product']);
            $this->log($request, ActivityActionEnum::Create, $purchase);

            return $purchase;
        });
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function receive(int $id, array $data, ?int $companyId, Request $request): StockPurchase
    {
        $purchase = $this->findOrFail($id, $companyId);

        if ($purchase->status === StockPurchaseStatusEnum::Cancelled->value) {
            throw new ApiException('Cannot receive a cancelled purchase', 422);
        }

        return DB::transaction(function () use ($purchase, $data, $companyId, $request) {
            $allReceived = true;

            foreach ($data['items'] as $row) {
                /** @var StockPurchaseItem|null $item */
                $item = $purchase->items->firstWhere('id', $row['item_id']);
                if (! $item) {
                    continue;
                }

                $receiveQty = (float) $row['quantity_received'];
                $remaining = (float) $item->quantity_ordered - (float) $item->quantity_received;
                if ($receiveQty > $remaining + 0.0001) {
                    throw new ApiException("Receive quantity exceeds remaining for {$item->product?->name}", 422);
                }

                if ($receiveQty <= 0) {
                    continue;
                }

                $product = Product::query()->find($item->product_id);
                if (! $product) {
                    continue;
                }

                $item->update(['quantity_received' => (float) $item->quantity_received + $receiveQty]);

                $this->movementService->applyMovement(
                    $companyId,
                    $purchase->branch_id,
                    $product,
                    $receiveQty,
                    StockMovementTypeEnum::Purchase,
                    [
                        'stock_purchase_id' => $purchase->id,
                        'stock_purchase_item_id' => $item->id,
                        'reference' => $purchase->code,
                        'description' => "Received from PO {$purchase->code}",
                        'unit_cost' => $item->unit_cost,
                    ],
                    $request
                );

                if ((float) $item->fresh()->quantity_received < (float) $item->quantity_ordered) {
                    $allReceived = false;
                }
            }

            $purchase->refresh();
            $status = $allReceived && $purchase->items->every(
                fn (StockPurchaseItem $i) => (float) $i->quantity_received >= (float) $i->quantity_ordered
            )
                ? StockPurchaseStatusEnum::Received->value
                : StockPurchaseStatusEnum::Partial->value;

            $updated = $this->repository->update($purchase, [
                'status' => $status,
                'received_by' => $request->user()?->id,
                'received_at' => now(),
            ]);

            $this->log($request, ActivityActionEnum::Update, $updated);

            return $updated;
        });
    }

    protected function log(Request $request, ActivityActionEnum $action, StockPurchase $purchase): void
    {
        $this->activityLogService->log(
            action: $action,
            userId: $request->user()?->id,
            subject: $purchase,
            description: "{$action->label()} purchase {$purchase->code}",
            properties: ['resource' => 'StockPurchase', 'id' => $purchase->id, 'code' => $purchase->code],
            request: $request
        );
    }
}
