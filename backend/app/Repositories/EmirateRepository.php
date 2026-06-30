<?php

namespace App\Repositories;

use App\Models\Emirate;

class EmirateRepository extends BaseMasterRepository
{
    protected function modelClass(): string
    {
        return Emirate::class;
    }

    protected function searchableColumns(): array
    {
        return ['name', 'code'];
    }

    protected function defaultRelations(): array
    {
        return ['country'];
    }
}
