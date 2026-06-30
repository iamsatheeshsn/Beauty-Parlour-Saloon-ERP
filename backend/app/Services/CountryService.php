<?php

namespace App\Services;

use App\Repositories\CountryRepository;
use Illuminate\Validation\Rule;

class CountryService extends MasterDataService
{
    public function __construct(CountryRepository $repository)
    {
        parent::__construct($repository);
    }

    public function storeRules(?int $companyId = null): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'iso_code' => ['required', 'string', 'size:2', Rule::unique('countries', 'iso_code')],
            'iso3_code' => ['nullable', 'string', 'size:3'],
            'phone_code' => ['nullable', 'string', 'max:10'],
            'currency_code' => ['nullable', 'string', 'max:3'],
            'is_active' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
        ];
    }

    public function updateRules(int $id, ?int $companyId = null): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'iso_code' => ['sometimes', 'string', 'size:2', Rule::unique('countries', 'iso_code')->ignore($id)],
            'iso3_code' => ['nullable', 'string', 'size:3'],
            'phone_code' => ['nullable', 'string', 'max:10'],
            'currency_code' => ['nullable', 'string', 'max:3'],
            'is_active' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
        ];
    }
}
