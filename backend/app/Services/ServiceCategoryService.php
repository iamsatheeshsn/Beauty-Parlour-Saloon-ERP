<?php

namespace App\Services;

use App\Repositories\ServiceCategoryRepository;
use Illuminate\Validation\Rule;

class ServiceCategoryService extends MasterDataService
{
    public function __construct(ServiceCategoryRepository $repository)
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
            'parent_id' => ['nullable', 'integer', 'exists:service_categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'code' => [
                'required', 'string', 'max:20',
                Rule::unique('service_categories')->where(fn ($q) => $q->where('company_id', $companyId)),
            ],
            'description' => ['nullable', 'string'],
            'icon' => ['nullable', 'string', 'max:50'],
            'color' => ['nullable', 'string', 'max:20'],
            'is_active' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
        ];
    }

    public function updateRules(int $id, ?int $companyId = null): array
    {
        return [
            'parent_id' => ['nullable', 'integer', 'exists:service_categories,id'],
            'name' => ['sometimes', 'string', 'max:255'],
            'code' => [
                'sometimes', 'string', 'max:20',
                Rule::unique('service_categories')->where(fn ($q) => $q->where('company_id', $companyId))->ignore($id),
            ],
            'description' => ['nullable', 'string'],
            'icon' => ['nullable', 'string', 'max:50'],
            'color' => ['nullable', 'string', 'max:20'],
            'is_active' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
        ];
    }
}
