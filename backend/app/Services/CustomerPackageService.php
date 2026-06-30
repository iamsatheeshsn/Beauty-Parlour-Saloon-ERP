<?php

namespace App\Services;

use App\Enums\ActivityActionEnum;
use App\Enums\CustomerPackageStatusEnum;
use App\Enums\PointTransactionTypeEnum;
use App\Exceptions\ApiException;
use App\Models\CustomerPackage;
use App\Models\ServicePackageItem;
use App\Repositories\CustomerPackageRepository;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class CustomerPackageService
{
    public function __construct(
        private readonly CustomerPackageRepository $repository,
        private readonly ServicePackageCatalogService $catalogService,
        private readonly CustomerService $customerService,
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
            $request->only(['search', 'status', 'customer_id'])
        );
    }

    public function forCustomer(Request $request, int $customerId): array
    {
        $companyId = $this->resolveCompanyId($request);
        if (! $companyId) {
            throw new ApiException('Company context required', 422);
        }

        $this->customerService->findOrFail($customerId, $companyId);

        return [
            'balance' => $this->repository->activeBalance($companyId, $customerId),
            'packages' => $this->repository->forCustomer($companyId, $customerId),
        ];
    }

    public function transactions(Request $request): LengthAwarePaginator
    {
        $companyId = $this->resolveCompanyId($request);
        if (! $companyId) {
            throw new ApiException('Company context required', 422);
        }

        return $this->repository->transactionPaginate(
            $companyId,
            (int) $request->input('per_page', 15),
            $request->only(['customer_id', 'customer_package_id', 'type', 'from', 'to'])
        );
    }

    public function findOrFail(int $id, ?int $companyId): CustomerPackage
    {
        if (! $companyId) {
            throw new ApiException('Company context required', 422);
        }

        $package = $this->repository->findById($id, $companyId);
        if (! $package) {
            throw new ApiException('Customer package not found', 404);
        }

        return $package;
    }

    public function purchaseRules(): array
    {
        return [
            'customer_id' => ['required', 'integer', 'exists:customers,id'],
            'service_package_id' => ['required', 'integer', 'exists:service_packages,id'],
            'branch_id' => ['nullable', 'integer', 'exists:branches,id'],
            'notes' => ['nullable', 'string'],
        ];
    }

    public function consumeRules(): array
    {
        return [
            'customer_id' => ['required', 'integer', 'exists:customers,id'],
            'customer_package_id' => ['nullable', 'integer', 'exists:customer_packages,id'],
            'service_id' => ['required', 'integer', 'exists:services,id'],
            'points' => ['nullable', 'integer', 'min:1'],
            'appointment_id' => ['nullable', 'integer', 'exists:appointments,id'],
            'sale_id' => ['nullable', 'integer', 'exists:sales,id'],
            'description' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function allocateRules(): array
    {
        return [
            'customer_id' => ['required', 'integer', 'exists:customers,id'],
            'customer_package_id' => ['required', 'integer', 'exists:customer_packages,id'],
            'points' => ['required', 'integer', 'min:1'],
            'description' => ['nullable', 'string', 'max:500'],
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function purchase(array $data, ?int $companyId, Request $request): CustomerPackage
    {
        if (! $companyId) {
            throw new ApiException('Company context required', 422);
        }

        $customer = $this->customerService->findOrFail($data['customer_id'], $companyId);
        $servicePackage = $this->catalogService->findOrFail($data['service_package_id'], $companyId);

        if (! $servicePackage->is_active) {
            throw new ApiException('This package is not available for purchase', 422);
        }

        $purchasedAt = now();
        $expiresAt = $servicePackage->validity_days
            ? $purchasedAt->copy()->addDays($servicePackage->validity_days)
            : null;

        return DB::transaction(function () use ($data, $companyId, $request, $customer, $servicePackage, $purchasedAt, $expiresAt) {
            $points = $servicePackage->points_included;

            $customerPackage = $this->repository->create([
                'company_id' => $companyId,
                'customer_id' => $customer->id,
                'service_package_id' => $servicePackage->id,
                'branch_id' => $data['branch_id'] ?? $request->user()?->branch_id,
                'sold_by' => $request->user()?->id,
                'code' => $this->repository->nextCode($companyId),
                'purchase_amount' => $servicePackage->totalPrice(),
                'points_allocated' => $points,
                'points_remaining' => $points,
                'points_consumed' => 0,
                'status' => CustomerPackageStatusEnum::Active->value,
                'purchased_at' => $purchasedAt,
                'expires_at' => $expiresAt,
                'notes' => $data['notes'] ?? null,
            ]);

            $balance = $this->repository->activeBalance($companyId, $customer->id);

            $this->repository->createTransaction([
                'company_id' => $companyId,
                'customer_id' => $customer->id,
                'customer_package_id' => $customerPackage->id,
                'created_by' => $request->user()?->id,
                'type' => PointTransactionTypeEnum::Purchase->value,
                'points' => $points,
                'balance_after' => $balance,
                'reference' => $customerPackage->code,
                'description' => "Purchased {$servicePackage->name} ({$points} points)",
            ]);

            $this->log($request, ActivityActionEnum::Create, $customerPackage);

            return $customerPackage->fresh(['customer', 'servicePackage', 'branch', 'soldBy']);
        });
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function consume(array $data, ?int $companyId, Request $request): CustomerPackage
    {
        if (! $companyId) {
            throw new ApiException('Company context required', 422);
        }

        $customer = $this->customerService->findOrFail($data['customer_id'], $companyId);
        $points = $this->resolvePointsCost($data, $companyId);

        $customerPackage = $this->repository->findConsumable(
            $companyId,
            $customer->id,
            $data['customer_package_id'] ?? null,
            $points
        );

        if (! $customerPackage) {
            throw new ApiException('Insufficient points or no active package found', 422);
        }

        return DB::transaction(function () use ($data, $companyId, $request, $customer, $customerPackage, $points) {
            $remaining = $customerPackage->points_remaining - $points;
            $consumed = $customerPackage->points_consumed + $points;
            $status = $remaining <= 0
                ? CustomerPackageStatusEnum::Exhausted->value
                : CustomerPackageStatusEnum::Active->value;

            $updated = $this->repository->update($customerPackage, [
                'points_remaining' => max(0, $remaining),
                'points_consumed' => $consumed,
                'status' => $status,
            ]);

            $balance = $this->repository->activeBalance($companyId, $customer->id);

            $this->repository->createTransaction([
                'company_id' => $companyId,
                'customer_id' => $customer->id,
                'customer_package_id' => $updated->id,
                'appointment_id' => $data['appointment_id'] ?? null,
                'sale_id' => $data['sale_id'] ?? null,
                'service_id' => $data['service_id'],
                'created_by' => $request->user()?->id,
                'type' => PointTransactionTypeEnum::Consumption->value,
                'points' => -$points,
                'balance_after' => $balance,
                'reference' => $updated->code,
                'description' => $data['description'] ?? "Consumed {$points} points for service",
            ]);

            $this->log($request, ActivityActionEnum::Update, $updated);

            return $updated->fresh(['customer', 'servicePackage', 'branch', 'soldBy']);
        });
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function allocate(array $data, ?int $companyId, Request $request): CustomerPackage
    {
        if (! $companyId) {
            throw new ApiException('Company context required', 422);
        }

        $customer = $this->customerService->findOrFail($data['customer_id'], $companyId);
        $customerPackage = $this->findOrFail($data['customer_package_id'], $companyId);

        if ($customerPackage->customer_id !== $customer->id) {
            throw new ApiException('Package does not belong to this customer', 422);
        }

        if ($customerPackage->status !== CustomerPackageStatusEnum::Active->value) {
            throw new ApiException('Cannot allocate points to inactive package', 422);
        }

        $points = (int) $data['points'];

        return DB::transaction(function () use ($data, $companyId, $request, $customer, $customerPackage, $points) {
            $updated = $this->repository->update($customerPackage, [
                'points_allocated' => $customerPackage->points_allocated + $points,
                'points_remaining' => $customerPackage->points_remaining + $points,
                'status' => CustomerPackageStatusEnum::Active->value,
            ]);

            $balance = $this->repository->activeBalance($companyId, $customer->id);

            $this->repository->createTransaction([
                'company_id' => $companyId,
                'customer_id' => $customer->id,
                'customer_package_id' => $updated->id,
                'created_by' => $request->user()?->id,
                'type' => PointTransactionTypeEnum::Allocation->value,
                'points' => $points,
                'balance_after' => $balance,
                'reference' => $updated->code,
                'description' => $data['description'] ?? "Manual allocation of {$points} points",
            ]);

            $this->log($request, ActivityActionEnum::Update, $updated);

            return $updated->fresh(['customer', 'servicePackage', 'branch', 'soldBy']);
        });
    }

    public function balance(int $customerId, ?int $companyId): int
    {
        if (! $companyId) {
            throw new ApiException('Company context required', 422);
        }

        $this->customerService->findOrFail($customerId, $companyId);

        return $this->repository->activeBalance($companyId, $customerId);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    protected function resolvePointsCost(array $data, int $companyId): int
    {
        if (! empty($data['points'])) {
            return (int) $data['points'];
        }

        if (! empty($data['customer_package_id'])) {
            $customerPackage = $this->repository->findById($data['customer_package_id'], $companyId);
            if ($customerPackage) {
                $item = ServicePackageItem::query()
                    ->where('service_package_id', $customerPackage->service_package_id)
                    ->where('service_id', $data['service_id'])
                    ->first();

                if ($item) {
                    return $item->points_cost;
                }
            }
        }

        throw new ApiException('Points cost not defined for this service. Please specify points.', 422);
    }

    protected function log(Request $request, ActivityActionEnum $action, CustomerPackage $package): void
    {
        $this->activityLogService->log(
            action: $action,
            userId: $request->user()?->id,
            subject: $package->customer,
            description: "{$action->label()} customer package {$package->code}",
            properties: ['resource' => 'CustomerPackage', 'id' => $package->id, 'code' => $package->code],
            request: $request
        );
    }
}
