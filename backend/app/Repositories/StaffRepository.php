<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class StaffRepository
{
    public function paginate(int $companyId, int $perPage = 15, ?string $search = null, ?int $branchId = null, ?string $role = null): LengthAwarePaginator
    {
        return $this->baseQuery($companyId, $search, $branchId, $role)
            ->latest()
            ->paginate($perPage);
    }

    public function listAll(int $companyId, ?string $search = null, ?int $branchId = null): Collection
    {
        return $this->baseQuery($companyId, $search, $branchId)
            ->orderBy('name')
            ->get();
    }

    public function findById(int $id, int $companyId): ?User
    {
        return User::query()
            ->with(['roles', 'branch', 'department', 'staffDesignation'])
            ->where('company_id', $companyId)
            ->find($id);
    }

    public function findWithDetails(int $id, int $companyId): ?User
    {
        return User::query()
            ->with([
                'roles', 'branch', 'department', 'staffDesignation',
                'staffDocuments', 'staffSalaries', 'staffCommissionRules.serviceCategory',
            ])
            ->where('company_id', $companyId)
            ->find($id);
    }

    public function countActive(int $companyId): int
    {
        return User::query()
            ->where('company_id', $companyId)
            ->where('is_active', true)
            ->count();
    }

    protected function baseQuery(int $companyId, ?string $search, ?int $branchId = null, ?string $role = null): Builder
    {
        return User::query()
            ->with(['roles', 'branch', 'department', 'staffDesignation'])
            ->where('company_id', $companyId)
            ->when($branchId, fn (Builder $q) => $q->where('branch_id', $branchId))
            ->when($role, function (Builder $q) use ($role): void {
                $q->whereHas('roles', fn (Builder $r) => $r->where('name', $role));
            })
            ->when($search, function (Builder $q) use ($search): void {
                $q->where(function (Builder $inner) use ($search): void {
                    $inner->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('employee_code', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%");
                });
            });
    }
}
