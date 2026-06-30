<?php

namespace App\Repositories;

use App\Models\StaffCommissionRule;
use Illuminate\Database\Eloquent\Collection;

class StaffCommissionRepository
{
    public function listForUser(int $userId, int $companyId): Collection
    {
        return StaffCommissionRule::query()
            ->with('serviceCategory')
            ->where('company_id', $companyId)
            ->where('user_id', $userId)
            ->orderByDesc('is_active')
            ->orderBy('name')
            ->get();
    }

    public function findById(int $id, int $companyId): ?StaffCommissionRule
    {
        return StaffCommissionRule::query()
            ->with('serviceCategory')
            ->where('company_id', $companyId)
            ->find($id);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): StaffCommissionRule
    {
        return StaffCommissionRule::query()->create($data)->fresh('serviceCategory');
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(StaffCommissionRule $rule, array $data): StaffCommissionRule
    {
        $rule->update($data);

        return $rule->fresh('serviceCategory');
    }

    public function delete(StaffCommissionRule $rule): bool
    {
        return (bool) $rule->delete();
    }
}
