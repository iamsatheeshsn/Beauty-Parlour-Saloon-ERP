<?php

namespace App\Repositories;

use App\Models\City;

class CityRepository extends BaseMasterRepository
{
    protected function modelClass(): string
    {
        return City::class;
    }

    protected function searchableColumns(): array
    {
        return ['name'];
    }

    protected function defaultRelations(): array
    {
        return ['country', 'emirate'];
    }
}
