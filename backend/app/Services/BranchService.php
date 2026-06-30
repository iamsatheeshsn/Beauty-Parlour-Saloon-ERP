<?php

namespace App\Services;

use App\Repositories\BranchRepository;
use Illuminate\Validation\Rule;

class BranchService extends MasterDataService
{
    public function __construct(BranchRepository $repository)
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
                Rule::unique('branches')->where(fn ($q) => $q->where('company_id', $companyId)),
            ],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'address' => ['nullable', 'string'],
            'country_id' => ['nullable', 'integer', 'exists:countries,id'],
            'emirate_id' => ['nullable', 'integer', 'exists:emirates,id'],
            'city_id' => ['nullable', 'integer', 'exists:cities,id'],
            'postal_code' => ['nullable', 'string', 'max:20'],
            'is_head_office' => ['sometimes', 'boolean'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }

    public function updateRules(int $id, ?int $companyId = null): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'code' => [
                'sometimes', 'string', 'max:20',
                Rule::unique('branches')->where(fn ($q) => $q->where('company_id', $companyId))->ignore($id),
            ],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'address' => ['nullable', 'string'],
            'country_id' => ['nullable', 'integer', 'exists:countries,id'],
            'emirate_id' => ['nullable', 'integer', 'exists:emirates,id'],
            'city_id' => ['nullable', 'integer', 'exists:cities,id'],
            'postal_code' => ['nullable', 'string', 'max:20'],
            'is_head_office' => ['sometimes', 'boolean'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
