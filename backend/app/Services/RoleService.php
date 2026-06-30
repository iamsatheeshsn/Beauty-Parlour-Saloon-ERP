<?php

namespace App\Services;

use App\Enums\ActivityActionEnum;
use App\Enums\RoleEnum;
use App\Exceptions\ApiException;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Validation\Rule;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleService
{
    public function __construct(
        private readonly ActivityLogService $activityLogService
    ) {
    }

    /**
     * @return Collection<int, Role>
     */
    public function all(): Collection
    {
        return Role::query()->with('permissions')->orderBy('name')->get();
    }

    public function findOrFail(int $id): Role
    {
        $role = Role::query()->with('permissions')->find($id);

        if (! $role) {
            throw new ApiException('Role not found', 404);
        }

        return $role;
    }

    public function storeRules(): array
    {
        return [
            'name' => ['required', 'string', 'max:50', Rule::unique('roles', 'name')],
            'permissions' => ['array'],
            'permissions.*' => ['string', 'exists:permissions,name'],
        ];
    }

    public function updateRules(int $id): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:50', Rule::unique('roles', 'name')->ignore($id)],
            'permissions' => ['array'],
            'permissions.*' => ['string', 'exists:permissions,name'],
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data, Request $request): Role
    {
        $permissions = $data['permissions'] ?? [];
        unset($data['permissions']);

        $data['guard_name'] = 'web';
        $role = Role::query()->create($data);
        $role->syncPermissions($permissions);
        $role->load('permissions');

        $this->log($request, ActivityActionEnum::Create, $role);

        return $role;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(int $id, array $data, Request $request): Role
    {
        $role = $this->findOrFail($id);
        $this->guardSystemRole($role, $request);

        $permissions = $data['permissions'] ?? null;
        unset($data['permissions']);

        if (! empty($data)) {
            $role->update($data);
        }

        if (is_array($permissions)) {
            $role->syncPermissions($permissions);
            app(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
        }

        $role->load('permissions');
        $this->log($request, ActivityActionEnum::Update, $role);

        return $role;
    }

    public function delete(int $id, Request $request): void
    {
        $role = $this->findOrFail($id);

        if (in_array($role->name, RoleEnum::values(), true)) {
            throw new ApiException('System roles cannot be deleted.', 403);
        }

        if (User::role($role->name)->exists()) {
            throw new ApiException('Cannot delete a role that is assigned to users.', 422);
        }

        $this->log($request, ActivityActionEnum::Delete, $role);
        $role->delete();
    }

    /**
     * @return Collection<int, Permission>
     */
    public function allPermissions(): Collection
    {
        return Permission::query()->orderBy('name')->get();
    }

    protected function guardSystemRole(Role $role, Request $request): void
    {
        $systemRoles = RoleEnum::values();

        if (! in_array($role->name, $systemRoles, true)) {
            return;
        }

        if ($role->name === RoleEnum::Owner->value) {
            throw new ApiException('The owner role cannot be modified.', 403);
        }

        if (! $request->user()?->hasRole(RoleEnum::Owner->value)) {
            throw new ApiException('Only owners can modify system roles.', 403);
        }
    }

    protected function log(Request $request, ActivityActionEnum $action, Role $role): void
    {
        $this->activityLogService->log(
            action: $action,
            userId: $request->user()?->id,
            subject: $role,
            description: "{$action->label()} role: {$role->name}",
            properties: ['resource' => 'Role', 'id' => $role->id],
            request: $request
        );
    }
}
