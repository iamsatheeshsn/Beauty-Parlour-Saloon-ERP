<?php

namespace App\Repositories;

use App\Models\Country;

class CountryRepository extends BaseMasterRepository
{
    protected function modelClass(): string
    {
        return Country::class;
    }

    protected function searchableColumns(): array
    {
        return ['name', 'iso_code', 'iso3_code'];
    }
}
