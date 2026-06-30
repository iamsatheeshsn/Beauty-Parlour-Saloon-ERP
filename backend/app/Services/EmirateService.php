<?php

namespace App\Services;

use App\Repositories\EmirateRepository;
use Illuminate\Validation\Rule;

class EmirateService extends MasterDataService
{
    public function __construct(EmirateRepository $repository)
    {
        parent::__construct($repository);
    }

    public function storeRules(?int $companyId = null): array
    {
        return [
            'country_id' => ['required', 'integer', 'exists:countries,id'],
            'name' => ['required', 'string', 'max:255'],
            'code' => [
                'required', 'string', 'max:10',
                Rule::unique('emirates')->where(fn ($q) => $q->where('country_id', request('country_id'))),
            ],
            'is_active' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
        ];
    }

    public function updateRules(int $id, ?int $companyId = null): array
    {
        return [
            'country_id' => ['sometimes', 'integer', 'exists:countries,id'],
            'name' => ['sometimes', 'string', 'max:255'],
            'code' => ['sometimes', 'string', 'max:10'],
            'is_active' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
        ];
    }
}
