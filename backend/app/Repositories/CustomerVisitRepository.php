<?php

namespace App\Repositories;

use App\Models\CustomerVisit;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class CustomerVisitRepository
{
    public function paginateForCustomer(int $customerId, int $companyId, int $perPage = 15): LengthAwarePaginator
    {
        return CustomerVisit::query()
            ->with(['branch', 'staff'])
            ->where('company_id', $companyId)
            ->where('customer_id', $customerId)
            ->latest('visited_at')
            ->paginate($perPage);
    }

    public function listForCustomer(int $customerId, int $companyId): Collection
    {
        return CustomerVisit::query()
            ->with(['branch', 'staff'])
            ->where('company_id', $companyId)
            ->where('customer_id', $customerId)
            ->latest('visited_at')
            ->get();
    }

    public function findById(int $id, int $companyId): ?CustomerVisit
    {
        return CustomerVisit::query()
            ->with(['branch', 'staff', 'customer'])
            ->where('company_id', $companyId)
            ->find($id);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): CustomerVisit
    {
        return CustomerVisit::query()->create($data)->fresh(['branch', 'staff']);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(CustomerVisit $visit, array $data): CustomerVisit
    {
        $visit->update($data);

        return $visit->fresh(['branch', 'staff']);
    }

    public function delete(CustomerVisit $visit): bool
    {
        return (bool) $visit->delete();
    }
}
