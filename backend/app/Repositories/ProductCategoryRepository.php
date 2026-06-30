<?php

namespace App\Repositories;

use App\Models\ProductCategory;

class ProductCategoryRepository extends BaseMasterRepository
{
    protected function modelClass(): string
    {
        return ProductCategory::class;
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
