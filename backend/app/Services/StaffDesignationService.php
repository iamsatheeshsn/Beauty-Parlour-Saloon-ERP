<?php

namespace App\Services;

use App\Repositories\StaffDesignationRepository;
use Illuminate\Validation\Rule;

class StaffDesignationService extends MasterDataService
{
    public function __construct(StaffDesignationRepository $repository)
    {
        parent::__construct($repository);
    }

    protected function companyScoped(): bool
    {
        return true;
    }

    public function storeRules(?int $companyId = null): array
    {
        return [
            'department_id' => ['nullable', 'integer', 'exists:departments,id'],
            'name' => ['required', 'string', 'max:255'],
            'code' => [
                'required', 'string', 'max:20',
                Rule::unique('staff_designations')->where(fn ($q) => $q->where('company_id', $companyId)),
            ],
            'level' => ['nullable', 'integer', 'min:1', 'max:10'],
            'description' => ['nullable', 'string'],
            'is_active' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
        ];
    }

    public function updateRules(int $id, ?int $companyId = null): array
    {
        return [
            'department_id' => ['nullable', 'integer', 'exists:departments,id'],
            'name' => ['sometimes', 'string', 'max:255'],
            'code' => [
                'sometimes', 'string', 'max:20',
                Rule::unique('staff_designations')->where(fn ($q) => $q->where('company_id', $companyId))->ignore($id),
            ],
            'level' => ['nullable', 'integer', 'min:1', 'max:10'],
            'description' => ['nullable', 'string'],
            'is_active' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
        ];
    }
}
