<?php

namespace App\Repositories;

use App\Models\StaffDesignation;

class StaffDesignationRepository extends BaseMasterRepository
{
    protected function modelClass(): string
    {
        return StaffDesignation::class;
    }

    protected function searchableColumns(): array
    {
        return ['name', 'code'];
    }

    protected function defaultRelations(): array
    {
        return ['department'];
    }

    protected function companyScoped(): bool
    {
        return true;
    }
}
