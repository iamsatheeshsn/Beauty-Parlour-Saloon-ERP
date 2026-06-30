<?php

namespace App\Services;

use App\Enums\ActivityActionEnum;
use App\Enums\CommissionRateTypeEnum;
use App\Exceptions\ApiException;
use App\Models\StaffCommissionRule;
use App\Repositories\StaffCommissionRepository;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class StaffCommissionService
{
    public function __construct(
        private readonly StaffCommissionRepository $repository,
        private readonly StaffService $staffService,
        private readonly ActivityLogService $activityLogService
    ) {
    }

    public function list(int $userId, ?int $companyId): array
    {
        $this->staffService->findOrFail($userId, $companyId);

        return $this->repository->listForUser($userId, $companyId ?? 0)->all();
    }

    public function storeRules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'service_category_id' => ['nullable', 'integer', 'exists:service_categories,id'],
            'rate_type' => ['required', Rule::enum(CommissionRateTypeEnum::class)],
            'rate_value' => ['required', 'numeric', 'min:0'],
            'min_sale_amount' => ['nullable', 'numeric', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
            'notes' => ['nullable', 'string'],
        ];
    }

    public function updateRules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'service_category_id' => ['nullable', 'integer', 'exists:service_categories,id'],
            'rate_type' => ['sometimes', Rule::enum(CommissionRateTypeEnum::class)],
            'rate_value' => ['sometimes', 'numeric', 'min:0'],
            'min_sale_amount' => ['nullable', 'numeric', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
            'notes' => ['nullable', 'string'],
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(int $userId, array $data, ?int $companyId, Request $request): StaffCommissionRule
    {
        $this->staffService->findOrFail($userId, $companyId);

        $rule = $this->repository->create([
            ...$data,
            'company_id' => $companyId,
            'user_id' => $userId,
            'is_active' => $data['is_active'] ?? true,
        ]);

        $this->log($request, ActivityActionEnum::Create, $rule);

        return $rule;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(int $id, array $data, ?int $companyId, Request $request): StaffCommissionRule
    {
        $rule = $this->findOrFail($id, $companyId);
        $updated = $this->repository->update($rule, $data);
        $this->log($request, ActivityActionEnum::Update, $updated);

        return $updated;
    }

    public function delete(int $id, ?int $companyId, Request $request): void
    {
        $rule = $this->findOrFail($id, $companyId);
        $this->log($request, ActivityActionEnum::Delete, $rule);
        $this->repository->delete($rule);
    }

    public function findOrFail(int $id, ?int $companyId): StaffCommissionRule
    {
        $rule = $this->repository->findById($id, $companyId ?? 0);

        if (! $rule) {
            throw new ApiException('Commission rule not found', 404);
        }

        return $rule;
    }

    protected function log(Request $request, ActivityActionEnum $action, StaffCommissionRule $rule): void
    {
        $this->activityLogService->log(
            action: $action,
            userId: $request->user()?->id,
            subject: $rule->user,
            description: "{$action->label()} commission rule for staff #{$rule->user_id}",
            properties: ['resource' => 'StaffCommissionRule', 'id' => $rule->id],
            request: $request
        );
    }
}
