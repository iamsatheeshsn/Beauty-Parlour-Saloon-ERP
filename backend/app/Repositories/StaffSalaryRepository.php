<?php

namespace App\Repositories;

use App\Models\StaffSalary;
use Illuminate\Database\Eloquent\Collection;

class StaffSalaryRepository
{
    public function listForUser(int $userId, int $companyId): Collection
    {
        return StaffSalary::query()
            ->where('company_id', $companyId)
            ->where('user_id', $userId)
            ->orderByDesc('effective_from')
            ->get();
    }

    public function findById(int $id, int $companyId): ?StaffSalary
    {
        return StaffSalary::query()
            ->where('company_id', $companyId)
            ->find($id);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): StaffSalary
    {
        return StaffSalary::query()->create($data);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(StaffSalary $salary, array $data): StaffSalary
    {
        $salary->update($data);

        return $salary->fresh();
    }

    public function delete(StaffSalary $salary): bool
    {
        return (bool) $salary->delete();
    }

    public function currentForUser(int $userId, int $companyId): ?StaffSalary
    {
        return StaffSalary::query()
            ->where('company_id', $companyId)
            ->where('user_id', $userId)
            ->where('effective_from', '<=', now())
            ->where(function ($q) {
                $q->whereNull('effective_to')->orWhere('effective_to', '>=', now());
            })
            ->orderByDesc('effective_from')
            ->first();
    }
}
