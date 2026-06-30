<?php

namespace App\Services;

use App\Repositories\CityRepository;
use Illuminate\Validation\Rule;

class CityService extends MasterDataService
{
    public function __construct(CityRepository $repository)
    {
        parent::__construct($repository);
    }

    public function storeRules(?int $companyId = null): array
    {
        return [
            'country_id' => ['required', 'integer', 'exists:countries,id'],
            'emirate_id' => ['required', 'integer', 'exists:emirates,id'],
            'name' => [
                'required', 'string', 'max:255',
                Rule::unique('cities')->where(fn ($q) => $q->where('emirate_id', request('emirate_id'))),
            ],
            'is_active' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
        ];
    }

    public function updateRules(int $id, ?int $companyId = null): array
    {
        return [
            'country_id' => ['sometimes', 'integer', 'exists:countries,id'],
            'emirate_id' => ['sometimes', 'integer', 'exists:emirates,id'],
            'name' => ['sometimes', 'string', 'max:255'],
            'is_active' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
        ];
    }
}
