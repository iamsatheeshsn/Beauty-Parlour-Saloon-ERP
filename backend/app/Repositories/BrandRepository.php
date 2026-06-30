<?php

namespace App\Repositories;

use App\Models\Brand;

class BrandRepository extends BaseMasterRepository
{
    protected function modelClass(): string
    {
        return Brand::class;
    }

    protected function searchableColumns(): array
    {
        return ['name', 'code'];
    }

    protected function companyScoped(): bool
    {
        return true;
    }
}
