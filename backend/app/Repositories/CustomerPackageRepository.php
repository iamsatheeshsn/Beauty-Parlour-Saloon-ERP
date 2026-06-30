<?php

namespace App\Repositories;

use App\Enums\CustomerPackageStatusEnum;
use App\Models\CustomerPackage;
use App\Models\CustomerPointTransaction;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Carbon;

class CustomerPackageRepository
{
    /** @var array<int, string> */
    protected array $relations = ['customer', 'servicePackage', 'branch', 'soldBy'];

    public function paginate(int $companyId, int $perPage = 15, array $filters = []): LengthAwarePaginator
    {
        return $this->query($companyId, $filters)
            ->orderByDesc('purchased_at')
            ->paginate($perPage);
    }

    public function forCustomer(int $companyId, int $customerId, array $filters = []): Collection
    {
        return $this->query($companyId, array_merge($filters, ['customer_id' => $customerId]))
            ->orderByDesc('purchased_at')
            ->get();
    }

    public function findById(int $id, int $companyId): ?CustomerPackage
    {
        return CustomerPackage::query()
            ->with($this->relations)
            ->where('company_id', $companyId)
            ->find($id);
    }

    public function activeBalance(int $companyId, int $customerId): int
    {
        $this->expireOverdue($companyId, $customerId);

        return (int) CustomerPackage::query()
            ->where('company_id', $companyId)
            ->where('customer_id', $customerId)
            ->where('status', CustomerPackageStatusEnum::Active->value)
            ->sum('points_remaining');
    }

    public function findConsumable(int $companyId, int $customerId, ?int $customerPackageId, int $pointsNeeded): ?CustomerPackage
    {
        $this->expireOverdue($companyId, $customerId);

        $query = CustomerPackage::query()
            ->where('company_id', $companyId)
            ->where('customer_id', $customerId)
            ->where('status', CustomerPackageStatusEnum::Active->value)
            ->where('points_remaining', '>=', $pointsNeeded);

        if ($customerPackageId) {
            return $query->where('id', $customerPackageId)->first();
        }

        return $query
            ->orderByRaw('expires_at IS NULL')
            ->orderBy('expires_at')
            ->orderBy('purchased_at')
            ->first();
    }

    public function expireOverdue(int $companyId, ?int $customerId = null): void
    {
        $query = CustomerPackage::query()
            ->where('company_id', $companyId)
            ->where('status', CustomerPackageStatusEnum::Active->value)
            ->whereNotNull('expires_at')
            ->where('expires_at', '<', now());

        if ($customerId) {
            $query->where('customer_id', $customerId);
        }

        $query->update(['status' => CustomerPackageStatusEnum::Expired->value]);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): CustomerPackage
    {
        return CustomerPackage::query()->create($data)->fresh($this->relations);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(CustomerPackage $package, array $data): CustomerPackage
    {
        $package->update($data);

        return $package->fresh($this->relations);
    }

    public function nextCode(int $companyId): string
    {
        $latest = CustomerPackage::query()
            ->where('company_id', $companyId)
            ->where('code', 'like', 'CPKG%')
            ->orderByRaw('CAST(SUBSTRING(code, 5) AS UNSIGNED) DESC')
            ->value('code');

        $number = $latest ? ((int) substr($latest, 4)) + 1 : 1;

        return 'CPKG'.str_pad((string) $number, 4, '0', STR_PAD_LEFT);
    }

    public function transactionPaginate(int $companyId, int $perPage = 15, array $filters = []): LengthAwarePaginator
    {
        return $this->transactionQuery($companyId, $filters)
            ->orderByDesc('created_at')
            ->paginate($perPage);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function createTransaction(array $data): CustomerPointTransaction
    {
        return CustomerPointTransaction::query()->create($data);
    }

    protected function query(int $companyId, array $filters): Builder
    {
        return CustomerPackage::query()
            ->with($this->relations)
            ->where('company_id', $companyId)
            ->when(! empty($filters['customer_id']), fn (Builder $q) => $q->where('customer_id', $filters['customer_id']))
            ->when(! empty($filters['status']), fn (Builder $q) => $q->where('status', $filters['status']))
            ->when(! empty($filters['search']), function (Builder $q) use ($filters): void {
                $search = $filters['search'];
                $q->where(function (Builder $inner) use ($search): void {
                    $inner->where('code', 'like', "%{$search}%")
                        ->orWhereHas('customer', fn (Builder $c) => $c->where('name', 'like', "%{$search}%")->orWhere('phone', 'like', "%{$search}%"));
                });
            });
    }

    protected function transactionQuery(int $companyId, array $filters): Builder
    {
        return CustomerPointTransaction::query()
            ->with(['customer', 'customerPackage', 'service', 'createdBy', 'appointment'])
            ->where('company_id', $companyId)
            ->when(! empty($filters['customer_id']), fn (Builder $q) => $q->where('customer_id', $filters['customer_id']))
            ->when(! empty($filters['customer_package_id']), fn (Builder $q) => $q->where('customer_package_id', $filters['customer_package_id']))
            ->when(! empty($filters['type']), fn (Builder $q) => $q->where('type', $filters['type']))
            ->when(! empty($filters['from']), fn (Builder $q) => $q->where('created_at', '>=', Carbon::parse($filters['from'])->startOfDay()))
            ->when(! empty($filters['to']), fn (Builder $q) => $q->where('created_at', '<=', Carbon::parse($filters['to'])->endOfDay()));
    }
}
