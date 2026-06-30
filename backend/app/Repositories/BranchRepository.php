<?php

namespace App\Repositories;

use App\Models\Branch;

class BranchRepository extends BaseMasterRepository
{
    protected function modelClass(): string
    {
        return Branch::class;
    }

    protected function searchableColumns(): array
    {
        return ['name', 'code', 'email', 'phone'];
    }

    protected function defaultRelations(): array
    {
        return ['country', 'emirate', 'city'];
    }

    protected function companyScoped(): bool
    {
        return true;
    }

    protected function defaultOrder(): array
    {
        return ['name' => 'asc'];
    }
}
