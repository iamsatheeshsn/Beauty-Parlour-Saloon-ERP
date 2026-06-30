<?php

namespace App\Services;

use App\Enums\ActivityActionEnum;
use App\Exceptions\ApiException;
use App\Models\StaffSalary;
use App\Repositories\StaffSalaryRepository;
use Illuminate\Http\Request;

class StaffSalaryService
{
    public function __construct(
        private readonly StaffSalaryRepository $repository,
        private readonly StaffService $staffService,
        private readonly ActivityLogService $activityLogService
    ) {
    }

    public function list(int $userId, ?int $companyId): array
    {
        $this->staffService->findOrFail($userId, $companyId);

        return $this->repository->listForUser($userId, $companyId ?? 0)->all();
    }

    public function current(int $userId, ?int $companyId): ?StaffSalary
    {
        $this->staffService->findOrFail($userId, $companyId);

        return $this->repository->currentForUser($userId, $companyId ?? 0);
    }

    public function storeRules(): array
    {
        return [
            'base_salary' => ['required', 'numeric', 'min:0'],
            'housing_allowance' => ['nullable', 'numeric', 'min:0'],
            'transport_allowance' => ['nullable', 'numeric', 'min:0'],
            'other_allowance' => ['nullable', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string', 'max:10'],
            'effective_from' => ['required', 'date'],
            'effective_to' => ['nullable', 'date', 'after_or_equal:effective_from'],
            'notes' => ['nullable', 'string'],
        ];
    }

    public function updateRules(): array
    {
        return [
            'base_salary' => ['sometimes', 'numeric', 'min:0'],
            'housing_allowance' => ['nullable', 'numeric', 'min:0'],
            'transport_allowance' => ['nullable', 'numeric', 'min:0'],
            'other_allowance' => ['nullable', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string', 'max:10'],
            'effective_from' => ['sometimes', 'date'],
            'effective_to' => ['nullable', 'date'],
            'notes' => ['nullable', 'string'],
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(int $userId, array $data, ?int $companyId, Request $request): StaffSalary
    {
        $this->staffService->findOrFail($userId, $companyId);

        $salary = $this->repository->create([
            ...$data,
            'company_id' => $companyId,
            'user_id' => $userId,
            'currency' => $data['currency'] ?? 'AED',
        ]);

        $this->log($request, ActivityActionEnum::Create, $salary);

        return $salary;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(int $id, array $data, ?int $companyId, Request $request): StaffSalary
    {
        $salary = $this->findOrFail($id, $companyId);
        $updated = $this->repository->update($salary, $data);
        $this->log($request, ActivityActionEnum::Update, $updated);

        return $updated;
    }

    public function delete(int $id, ?int $companyId, Request $request): void
    {
        $salary = $this->findOrFail($id, $companyId);
        $this->log($request, ActivityActionEnum::Delete, $salary);
        $this->repository->delete($salary);
    }

    public function findOrFail(int $id, ?int $companyId): StaffSalary
    {
        $salary = $this->repository->findById($id, $companyId ?? 0);

        if (! $salary) {
            throw new ApiException('Salary record not found', 404);
        }

        return $salary;
    }

    protected function log(Request $request, ActivityActionEnum $action, StaffSalary $salary): void
    {
        $this->activityLogService->log(
            action: $action,
            userId: $request->user()?->id,
            subject: $salary->user,
            description: "{$action->label()} salary for staff #{$salary->user_id}",
            properties: ['resource' => 'StaffSalary', 'id' => $salary->id],
            request: $request
        );
    }
}
