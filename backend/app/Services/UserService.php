<?php

namespace App\Services;

use App\Enums\ActivityActionEnum;
use App\Enums\RoleEnum;
use App\Exceptions\ApiException;
use App\Interfaces\UserRepositoryInterface;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserService
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository,
        private readonly ActivityLogService $activityLogService
    ) {
    }

    public function paginate(Request $request): LengthAwarePaginator
    {
        return $this->userRepository->paginate(
            (int) $request->input('per_page', 15),
            $request->user()?->company_id,
            $request->input('search')
        );
    }

    public function findOrFail(int $id, ?int $companyId): User
    {
        $user = $companyId
            ? $this->userRepository->findByIdForCompany($id, $companyId)
            : $this->userRepository->findById($id);

        if (! $user) {
            throw new ApiException('User not found', 404);
        }

        return $user;
    }

    public function storeRules(?int $companyId): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')],
            'password' => ['required', 'string', 'min:8'],
            'phone' => ['nullable', 'string', 'max:30'],
            'employee_code' => [
                'nullable', 'string', 'max:20',
                Rule::unique('users', 'employee_code')->where(fn ($q) => $q->where('company_id', $companyId)),
            ],
            'branch_id' => ['nullable', 'integer', 'exists:branches,id'],
            'department_id' => ['nullable', 'integer', 'exists:departments,id'],
            'staff_designation_id' => ['nullable', 'integer', 'exists:staff_designations,id'],
            'role' => ['required', 'string', Rule::in(RoleEnum::values())],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }

    public function updateRules(int $id, ?int $companyId): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'max:255', Rule::unique('users', 'email')->ignore($id)],
            'password' => ['nullable', 'string', 'min:8'],
            'phone' => ['nullable', 'string', 'max:30'],
            'employee_code' => [
                'nullable', 'string', 'max:20',
                Rule::unique('users', 'employee_code')->where(fn ($q) => $q->where('company_id', $companyId))->ignore($id),
            ],
            'branch_id' => ['nullable', 'integer', 'exists:branches,id'],
            'department_id' => ['nullable', 'integer', 'exists:departments,id'],
            'staff_designation_id' => ['nullable', 'integer', 'exists:staff_designations,id'],
            'role' => ['sometimes', 'string', Rule::in(RoleEnum::values())],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data, ?int $companyId, Request $request): User
    {
        $role = $data['role'] ?? null;
        unset($data['role']);

        $data['password'] = Hash::make($data['password']);
        if ($companyId) {
            $data['company_id'] = $companyId;
        }

        $user = $this->userRepository->create($data);

        if ($role) {
            $user->syncRoles([$role]);
            $user->load('roles');
        }

        $this->log($request, ActivityActionEnum::Create, $user);

        return $user;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(int $id, array $data, ?int $companyId, Request $request): User
    {
        $user = $this->findOrFail($id, $companyId);
        $this->guardOwnerUser($user, $request);

        $role = $data['role'] ?? null;
        unset($data['role']);

        if (! empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user = $this->userRepository->update($user, $data);

        if ($role) {
            $user->syncRoles([$role]);
            $user->load('roles');
        }

        $this->log($request, ActivityActionEnum::Update, $user);

        return $user;
    }

    public function delete(int $id, ?int $companyId, Request $request): void
    {
        $user = $this->findOrFail($id, $companyId);

        if ($request->user()?->id === $user->id) {
            throw new ApiException('You cannot delete your own account.', 422);
        }

        $this->guardOwnerUser($user, $request);

        $this->log($request, ActivityActionEnum::Delete, $user);
        $this->userRepository->delete($user);
    }

    protected function guardOwnerUser(User $user, Request $request): void
    {
        if ($user->hasRole(RoleEnum::Owner->value) && ! $request->user()?->hasRole(RoleEnum::Owner->value)) {
            throw new ApiException('Only owners can modify owner accounts.', 403);
        }
    }

    protected function log(Request $request, ActivityActionEnum $action, User $user): void
    {
        $this->activityLogService->log(
            action: $action,
            userId: $request->user()?->id,
            subject: $user,
            description: "{$action->label()} user: {$user->name}",
            properties: ['resource' => 'User', 'id' => $user->id, 'email' => $user->email],
            request: $request
        );
    }
}
