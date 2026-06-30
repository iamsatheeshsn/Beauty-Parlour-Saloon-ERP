<?php

namespace App\Services;

use App\Repositories\DepartmentRepository;
use Illuminate\Validation\Rule;

class DepartmentService extends MasterDataService
{
    public function __construct(DepartmentRepository $repository)
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
            'name' => ['required', 'string', 'max:255'],
            'code' => [
                'required', 'string', 'max:20',
                Rule::unique('departments')->where(fn ($q) => $q->where('company_id', $companyId)),
            ],
            'description' => ['nullable', 'string'],
            'is_active' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
        ];
    }

    public function updateRules(int $id, ?int $companyId = null): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'code' => [
                'sometimes', 'string', 'max:20',
                Rule::unique('departments')->where(fn ($q) => $q->where('company_id', $companyId))->ignore($id),
            ],
            'description' => ['nullable', 'string'],
            'is_active' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
        ];
    }
}
