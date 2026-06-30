<?php

namespace App\Services;

use App\Enums\ActivityActionEnum;
use App\Enums\StockMovementTypeEnum;
use App\Exceptions\ApiException;
use App\Models\Product;
use App\Models\StockMovement;
use App\Repositories\StockMovementRepository;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Validation\Rule;

class StockMovementService
{
    public function __construct(
        private readonly StockMovementRepository $repository,
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
            $request->only(['branch_id', 'product_id', 'type'])
        );
    }

    public function consumeRules(): array
    {
        return [
            'branch_id' => ['nullable', 'integer', 'exists:branches,id'],
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'quantity' => ['required', 'numeric', 'min:0.001'],
            'appointment_id' => ['nullable', 'integer', 'exists:appointments,id'],
            'service_id' => ['nullable', 'integer', 'exists:services,id'],
            'description' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function adjustRules(): array
    {
        return [
            'branch_id' => ['nullable', 'integer', 'exists:branches,id'],
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'quantity' => ['required', 'numeric'],
            'description' => ['nullable', 'string', 'max:500'],
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function consume(array $data, ?int $companyId, Request $request): StockMovement
    {
        $product = $this->findProduct($data['product_id'], $companyId);
        $branchId = $data['branch_id'] ?? $request->user()?->branch_id;
        if (! $branchId) {
            throw new ApiException('Branch context required', 422);
        }

        $qty = (float) $data['quantity'];

        return $this->applyMovement(
            $companyId,
            $branchId,
            $product,
            -abs($qty),
            StockMovementTypeEnum::Consumption,
            [
                'appointment_id' => $data['appointment_id'] ?? null,
                'service_id' => $data['service_id'] ?? null,
                'reference' => null,
                'description' => $data['description'] ?? "Consumed {$qty} {$product->unit} of {$product->name}",
                'unit_cost' => $product->cost_price,
            ],
            $request
        );
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function adjust(array $data, ?int $companyId, Request $request): StockMovement
    {
        $product = $this->findProduct($data['product_id'], $companyId);
        $branchId = $data['branch_id'] ?? $request->user()?->branch_id;
        if (! $branchId) {
            throw new ApiException('Branch context required', 422);
        }

        $qty = (float) $data['quantity'];
        if ($qty == 0) {
            throw new ApiException('Adjustment quantity cannot be zero', 422);
        }

        $type = $qty > 0 ? StockMovementTypeEnum::Adjustment : StockMovementTypeEnum::Adjustment;

        return $this->applyMovement(
            $companyId,
            $branchId,
            $product,
            $qty,
            $type,
            [
                'description' => $data['description'] ?? 'Stock adjustment',
                'unit_cost' => $product->cost_price,
            ],
            $request
        );
    }

    public function lowStock(?int $companyId, ?int $branchId = null): Collection
    {
        if (! $companyId) {
            return collect();
        }

        return $this->repository->lowStock($companyId, $branchId);
    }

    public function stockLevels(?int $companyId, ?int $branchId = null): Collection
    {
        if (! $companyId) {
            return collect();
        }

        return $this->repository->stockLevels($companyId, $branchId);
    }

    /**
     * @param  array<string, mixed>  $context
     */
    public function applyMovement(
        ?int $companyId,
        int $branchId,
        Product $product,
        float $quantityDelta,
        StockMovementTypeEnum $type,
        array $context,
        Request $request
    ): StockMovement {
        if (! $companyId) {
            throw new ApiException('Company context required', 422);
        }

        if (! $product->track_inventory) {
            throw new ApiException('Product does not track inventory', 422);
        }

        $stock = $this->repository->getOrCreateStock($companyId, $branchId, $product->id);
        $newBalance = (float) $stock->quantity_on_hand + $quantityDelta;

        if ($newBalance < 0) {
            throw new ApiException('Insufficient stock on hand', 422);
        }

        $this->repository->updateStock($stock, $newBalance);

        $movement = $this->repository->createMovement([
            'company_id' => $companyId,
            'branch_id' => $branchId,
            'product_id' => $product->id,
            'stock_purchase_id' => $context['stock_purchase_id'] ?? null,
            'stock_purchase_item_id' => $context['stock_purchase_item_id'] ?? null,
            'sale_id' => $context['sale_id'] ?? null,
            'appointment_id' => $context['appointment_id'] ?? null,
            'service_id' => $context['service_id'] ?? null,
            'created_by' => $request->user()?->id,
            'type' => $type->value,
            'quantity' => $quantityDelta,
            'balance_after' => $newBalance,
            'unit_cost' => $context['unit_cost'] ?? $product->cost_price,
            'reference' => $context['reference'] ?? null,
            'description' => $context['description'] ?? $type->label(),
        ]);

        $this->activityLogService->log(
            action: ActivityActionEnum::Update,
            userId: $request->user()?->id,
            subject: $product,
            description: "{$type->label()}: {$product->name} ({$quantityDelta})",
            properties: ['resource' => 'StockMovement', 'id' => $movement->id, 'product_id' => $product->id],
            request: $request
        );

        return $movement->fresh(['product', 'branch', 'createdBy']);
    }

    protected function findProduct(int $id, ?int $companyId): Product
    {
        $product = Product::query()
            ->where('company_id', $companyId)
            ->where('is_active', true)
            ->find($id);

        if (! $product) {
            throw new ApiException('Product not found', 404);
        }

        return $product;
    }
}
