<?php

namespace App\Repositories;

use App\Interfaces\UserRepositoryInterface;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

class UserRepository implements UserRepositoryInterface
{
    public function findByEmail(string $email): ?User
    {
        return User::query()->where('email', $email)->first();
    }

    public function findById(int $id): ?User
    {
        return User::query()->with(['roles', 'branch', 'department', 'staffDesignation'])->find($id);
    }

    public function findByIdForCompany(int $id, int $companyId): ?User
    {
        return User::query()
            ->with(['roles', 'branch', 'department', 'staffDesignation'])
            ->where('company_id', $companyId)
            ->find($id);
    }

    public function updateLastLogin(User $user): void
    {
        $user->update(['last_login_at' => now()]);
    }

    public function paginate(int $perPage = 15, ?int $companyId = null, ?string $search = null): LengthAwarePaginator
    {
        return User::query()
            ->with(['roles', 'branch', 'department', 'staffDesignation'])
            ->when($companyId, fn (Builder $q) => $q->where('company_id', $companyId))
            ->when($search, function (Builder $q) use ($search): void {
                $q->where(function (Builder $inner) use ($search): void {
                    $inner->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('employee_code', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate($perPage);
    }

    public function create(array $data): User
    {
        /** @var User $user */
        $user = User::query()->create($data);

        return $user->fresh(['roles', 'branch', 'department', 'staffDesignation']);
    }

    public function update(User $user, array $data): User
    {
        $user->update($data);

        return $user->fresh(['roles', 'branch', 'department', 'staffDesignation']);
    }

    public function delete(User $user): bool
    {
        return (bool) $user->delete();
    }
}
