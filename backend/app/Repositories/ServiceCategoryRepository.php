<?php

namespace App\Repositories;

use App\Models\ServiceCategory;

class ServiceCategoryRepository extends BaseMasterRepository
{
    protected function modelClass(): string
    {
        return ServiceCategory::class;
    }

    protected function searchableColumns(): array
    {
        return ['name', 'code'];
    }

    protected function defaultRelations(): array
    {
        return ['parent'];
    }

    protected function companyScoped(): bool
    {
        return true;
    }
}
