<?php

namespace App\Services;

use App\Enums\ActivityActionEnum;
use App\Enums\CustomerPackageStatusEnum;
use App\Enums\DiscountTypeEnum;
use App\Enums\PointTransactionTypeEnum;
use App\Enums\SaleLineTypeEnum;
use App\Enums\SaleStatusEnum;
use App\Exceptions\ApiException;
use App\Models\Customer;
use App\Models\CustomerPackage;
use App\Models\SalonService;
use App\Models\Sale;
use App\Models\ServicePackage;
use App\Models\ServicePackageItem;
use App\Repositories\CustomerPackageRepository;
use App\Repositories\CustomerVisitRepository;
use App\Repositories\SaleRepository;
use App\Support\VatCalculator;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class SaleService
{
    public function __construct(
        private readonly SaleRepository $repository,
        private readonly CustomerService $customerService,
        private readonly CustomerPackageService $customerPackageService,
        private readonly CustomerPackageRepository $customerPackageRepository,
        private readonly CustomerVisitRepository $visitRepository,
        private readonly SettingsService $settingsService,
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
            $request->only(['search', 'status', 'customer_id', 'from', 'to'])
        );
    }

    public function findOrFail(int $id, ?int $companyId): Sale
    {
        if (! $companyId) {
            throw new ApiException('Company context required', 422);
        }

        $sale = $this->repository->findById($id, $companyId);
        if (! $sale) {
            throw new ApiException('Invoice not found', 404);
        }

        return $sale;
    }

    public function checkoutRules(): array
    {
        return [
            'customer_id' => ['required', 'integer', 'exists:customers,id'],
            'appointment_id' => ['nullable', 'integer', 'exists:appointments,id'],
            'branch_id' => ['nullable', 'integer', 'exists:branches,id'],
            'discount_type' => ['nullable', Rule::enum(DiscountTypeEnum::class)],
            'discount_value' => ['nullable', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.line_type' => ['required', Rule::enum(SaleLineTypeEnum::class)],
            'items.*.service_id' => ['nullable', 'integer', 'exists:services,id'],
            'items.*.service_package_id' => ['nullable', 'integer', 'exists:service_packages,id'],
            'items.*.staff_id' => ['nullable', 'integer', 'exists:users,id'],
            'items.*.customer_package_id' => ['nullable', 'integer', 'exists:customer_packages,id'],
            'items.*.quantity' => ['nullable', 'integer', 'min:1'],
            'items.*.points' => ['nullable', 'integer', 'min:1'],
            'payments' => ['required', 'array', 'min:1'],
            'payments.*.payment_method_id' => ['required', 'integer', 'exists:payment_methods,id'],
            'payments.*.amount' => ['required', 'numeric', 'min:0.01'],
            'payments.*.reference' => ['nullable', 'string', 'max:100'],
        ];
    }

    public function previewRules(): array
    {
        return [
            'discount_type' => ['nullable', Rule::enum(DiscountTypeEnum::class)],
            'discount_value' => ['nullable', 'numeric', 'min:0'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.line_type' => ['required', Rule::enum(SaleLineTypeEnum::class)],
            'items.*.service_id' => ['nullable', 'integer', 'exists:services,id'],
            'items.*.service_package_id' => ['nullable', 'integer', 'exists:service_packages,id'],
            'items.*.customer_package_id' => ['nullable', 'integer', 'exists:customer_packages,id'],
            'items.*.quantity' => ['nullable', 'integer', 'min:1'],
            'items.*.points' => ['nullable', 'integer', 'min:1'],
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function preview(array $data, ?int $companyId, Request $request): array
    {
        if (! $companyId) {
            throw new ApiException('Company context required', 422);
        }

        return $this->buildTotals($data, $companyId, $request);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function checkout(array $data, ?int $companyId, Request $request): Sale
    {
        if (! $companyId) {
            throw new ApiException('Company context required', 422);
        }

        $customer = $this->customerService->findOrFail($data['customer_id'], $companyId);
        $built = $this->buildTotals($data, $companyId, $request);

        $paymentTotal = collect($data['payments'])->sum(fn ($p) => (float) $p['amount']);
        if (round($paymentTotal, 2) < round($built['total_amount'], 2)) {
            throw new ApiException('Payment amount is less than total due', 422);
        }

        $company = $this->settingsService->getCompany();
        $settings = $this->settingsService->getAppSettings($request);

        return DB::transaction(function () use ($data, $companyId, $request, $customer, $built, $company, $settings, $paymentTotal) {
            $sale = $this->repository->create([
                'company_id' => $companyId,
                'branch_id' => $data['branch_id'] ?? $request->user()?->branch_id,
                'customer_id' => $customer->id,
                'appointment_id' => $data['appointment_id'] ?? null,
                'sold_by' => $request->user()?->id,
                'code' => $this->repository->nextCode($companyId),
                'type' => ! empty($data['appointment_id']) ? 'appointment' : 'pos',
                'status' => SaleStatusEnum::Paid->value,
                'discount_type' => $built['discount_type'],
                'discount_value' => $built['discount_value'],
                'subtotal' => $built['subtotal'],
                'discount_amount' => $built['discount_amount'],
                'vat_amount' => $built['vat_amount'],
                'total_amount' => $built['total_amount'],
                'amount_paid' => round($paymentTotal, 2),
                'currency' => $settings['currency'] ?? 'AED',
                'vat_rate_snapshot' => $built['vat_rate'],
                'trn_snapshot' => $company?->trn_number,
                'points_redeemed' => $built['points_redeemed'],
                'notes' => $data['notes'] ?? null,
                'paid_at' => now(),
            ]);

            foreach ($built['lines'] as $index => $line) {
                $sale->items()->create([
                    ...$line,
                    'sale_id' => $sale->id,
                    'sort_order' => $index + 1,
                ]);
            }

            foreach ($data['payments'] as $payment) {
                $sale->payments()->create([
                    'payment_method_id' => $payment['payment_method_id'],
                    'amount' => $payment['amount'],
                    'reference' => $payment['reference'] ?? null,
                    'received_by' => $request->user()?->id,
                    'status' => 'completed',
                    'paid_at' => now(),
                ]);
            }

            $sale = $sale->fresh(['items', 'payments']);

            foreach ($sale->items as $item) {
                if ($item->line_type === SaleLineTypeEnum::PackageRedemption->value && $item->points_redeemed > 0) {
                    $this->customerPackageService->consume([
                        'customer_id' => $customer->id,
                        'customer_package_id' => $item->customer_package_id,
                        'service_id' => $item->salon_service_id,
                        'points' => $item->points_redeemed,
                        'appointment_id' => $data['appointment_id'] ?? null,
                        'sale_id' => $sale->id,
                        'description' => "POS redemption — {$sale->code}",
                    ], $companyId, $request);
                }

                if ($item->line_type === SaleLineTypeEnum::Package->value && $item->service_package_id) {
                    $this->fulfillPackagePurchase($sale, $item, $customer, $companyId, $request);
                }
            }

            $servicesSummary = $sale->items->pluck('description')->implode(', ');
            $visit = $this->visitRepository->create([
                'company_id' => $companyId,
                'customer_id' => $customer->id,
                'branch_id' => $sale->branch_id,
                'staff_id' => $request->user()?->id,
                'visited_at' => now(),
                'purpose' => 'POS Sale',
                'services_summary' => $servicesSummary,
                'amount_spent' => $sale->total_amount,
                'notes' => "Invoice {$sale->code}",
            ]);

            $this->recalculateCustomerStats($customer);

            $this->activityLogService->log(
                action: ActivityActionEnum::Create,
                userId: $request->user()?->id,
                subject: $customer,
                description: "Completed POS sale {$sale->code}",
                properties: ['resource' => 'Sale', 'id' => $sale->id, 'code' => $sale->code, 'visit_id' => $visit->id],
                request: $request
            );

            return $this->repository->findById($sale->id, $companyId);
        });
    }

    public function stats(?int $companyId): array
    {
        if (! $companyId) {
            return ['total_revenue' => 0, 'today_revenue' => 0, 'weekly' => ['labels' => [], 'data' => []]];
        }

        return [
            'total_revenue' => $this->repository->totalRevenue($companyId),
            'today_revenue' => $this->repository->todayRevenue($companyId),
            'weekly' => $this->repository->weeklyRevenue($companyId),
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    protected function buildTotals(array $data, int $companyId, Request $request): array
    {
        $settings = $this->settingsService->getAppSettings($request);
        $vatEnabled = (bool) ($settings['vat_enabled'] ?? false);
        $defaultVatRate = (float) ($settings['vat_rate'] ?? 0);

        $discountType = DiscountTypeEnum::tryFrom($data['discount_type'] ?? 'none') ?? DiscountTypeEnum::None;
        $discountValue = (float) ($data['discount_value'] ?? 0);

        $lines = [];
        $subtotal = 0;
        $vatAmount = 0;
        $pointsRedeemed = 0;

        foreach ($data['items'] as $item) {
            $lineType = SaleLineTypeEnum::from($item['line_type']);
            $qty = (int) ($item['quantity'] ?? 1);

            if ($lineType === SaleLineTypeEnum::PackageRedemption) {
                $service = $this->findService($item['service_id'] ?? 0, $companyId);
                $points = $this->resolveRedemptionPoints($item, $companyId);
                $pointsRedeemed += $points;

                $lines[] = [
                    'line_type' => $lineType->value,
                    'salon_service_id' => $service->id,
                    'service_package_id' => null,
                    'staff_id' => $item['staff_id'] ?? null,
                    'customer_package_id' => $item['customer_package_id'] ?? null,
                    'description' => "{$service->name} (Package Redemption)",
                    'quantity' => $qty,
                    'unit_price' => 0,
                    'vat_rate' => 0,
                    'vat_inclusive' => true,
                    'line_subtotal' => 0,
                    'line_vat' => 0,
                    'line_total' => 0,
                    'points_redeemed' => $points,
                ];

                continue;
            }

            if ($lineType === SaleLineTypeEnum::Package) {
                $package = $this->findPackage($item['service_package_id'] ?? 0, $companyId);
                $totals = VatCalculator::lineTotals(
                    (float) $package->price,
                    (float) $package->vat_rate,
                    (bool) $package->vat_inclusive,
                    $qty,
                    (float) $package->vat_rate > 0
                );

                $subtotal += $totals['line_total'];
                $vatAmount += $totals['line_vat'];

                $lines[] = [
                    'line_type' => $lineType->value,
                    'salon_service_id' => null,
                    'service_package_id' => $package->id,
                    'staff_id' => $item['staff_id'] ?? null,
                    'customer_package_id' => null,
                    'description' => $package->name,
                    'quantity' => $qty,
                    'unit_price' => $package->price,
                    'vat_rate' => $package->vat_rate,
                    'vat_inclusive' => $package->vat_inclusive,
                    ...$totals,
                    'points_redeemed' => 0,
                ];

                continue;
            }

            $service = $this->findService($item['service_id'] ?? 0, $companyId);
            $totals = VatCalculator::lineTotals(
                (float) $service->price,
                (float) $service->vat_rate,
                (bool) $service->vat_inclusive,
                $qty,
                (float) $service->vat_rate > 0
            );

            $subtotal += $totals['line_total'];
            $vatAmount += $totals['line_vat'];

            $lines[] = [
                'line_type' => SaleLineTypeEnum::Service->value,
                'salon_service_id' => $service->id,
                'service_package_id' => null,
                'staff_id' => $item['staff_id'] ?? null,
                'customer_package_id' => null,
                'description' => $service->name,
                'quantity' => $qty,
                'unit_price' => $service->price,
                'vat_rate' => $service->vat_rate,
                'vat_inclusive' => $service->vat_inclusive,
                ...$totals,
                'points_redeemed' => 0,
            ];
        }

        $discountAmount = VatCalculator::discountAmount($subtotal, $discountType, $discountValue);
        $ratio = $subtotal > 0 ? ($subtotal - $discountAmount) / $subtotal : 1;
        $adjustedVat = round($vatAmount * $ratio, 2);
        $totalAmount = round($subtotal - $discountAmount, 2);

        return [
            'lines' => $lines,
            'subtotal' => round($subtotal, 2),
            'discount_type' => $discountType->value,
            'discount_value' => $discountValue,
            'discount_amount' => $discountAmount,
            'vat_amount' => $adjustedVat,
            'total_amount' => $totalAmount,
            'points_redeemed' => $pointsRedeemed,
            'vat_rate' => $defaultVatRate,
            'vat_enabled' => $vatEnabled,
        ];
    }

    protected function findService(int $id, int $companyId): SalonService
    {
        $service = SalonService::query()
            ->where('company_id', $companyId)
            ->where('is_active', true)
            ->find($id);

        if (! $service) {
            throw new ApiException("Service #{$id} not found or inactive", 422);
        }

        return $service;
    }

    protected function findPackage(int $id, int $companyId): ServicePackage
    {
        $package = ServicePackage::query()
            ->where('company_id', $companyId)
            ->where('is_active', true)
            ->find($id);

        if (! $package) {
            throw new ApiException("Package #{$id} not found or inactive", 422);
        }

        return $package;
    }

    /**
     * @param  array<string, mixed>  $item
     */
    protected function resolveRedemptionPoints(array $item, int $companyId): int
    {
        if (! empty($item['points'])) {
            return (int) $item['points'];
        }

        if (! empty($item['customer_package_id']) && ! empty($item['service_id'])) {
            $cp = $this->customerPackageRepository->findById($item['customer_package_id'], $companyId);
            if ($cp) {
                $packageItem = ServicePackageItem::query()
                    ->where('service_package_id', $cp->service_package_id)
                    ->where('service_id', $item['service_id'])
                    ->first();

                if ($packageItem) {
                    return $packageItem->points_cost;
                }
            }
        }

        throw new ApiException('Points cost required for package redemption', 422);
    }

    protected function fulfillPackagePurchase(Sale $sale, $item, Customer $customer, int $companyId, Request $request): void
    {
        $package = ServicePackage::query()->find($item->service_package_id);
        if (! $package) {
            return;
        }

        $purchasedAt = now();
        $expiresAt = $package->validity_days ? $purchasedAt->copy()->addDays($package->validity_days) : null;
        $points = $package->points_included;

        $customerPackage = $this->customerPackageRepository->create([
            'company_id' => $companyId,
            'customer_id' => $customer->id,
            'service_package_id' => $package->id,
            'branch_id' => $sale->branch_id,
            'sold_by' => $request->user()?->id,
            'sale_id' => $sale->id,
            'code' => $this->customerPackageRepository->nextCode($companyId),
            'purchase_amount' => $item->line_total,
            'points_allocated' => $points,
            'points_remaining' => $points,
            'points_consumed' => 0,
            'status' => CustomerPackageStatusEnum::Active->value,
            'purchased_at' => $purchasedAt,
            'expires_at' => $expiresAt,
            'notes' => "Sold via invoice {$sale->code}",
        ]);

        $balance = $this->customerPackageRepository->activeBalance($companyId, $customer->id);

        $this->customerPackageRepository->createTransaction([
            'company_id' => $companyId,
            'customer_id' => $customer->id,
            'customer_package_id' => $customerPackage->id,
            'sale_id' => $sale->id,
            'created_by' => $request->user()?->id,
            'type' => PointTransactionTypeEnum::Purchase->value,
            'points' => $points,
            'balance_after' => $balance,
            'reference' => $sale->code,
            'description' => "Purchased {$package->name} via POS",
        ]);
    }

    protected function recalculateCustomerStats(Customer $customer): void
    {
        $visits = $customer->visits()->get();
        $customer->update([
            'total_visits' => $visits->count(),
            'total_spent' => $visits->sum('amount_spent'),
            'last_visit_at' => $visits->max('visited_at'),
        ]);
    }
}
