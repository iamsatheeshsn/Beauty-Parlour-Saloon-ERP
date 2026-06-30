<?php

namespace App\Repositories;

use App\Interfaces\CompanyRepositoryInterface;
use App\Models\Company;

class CompanyRepository implements CompanyRepositoryInterface
{
    public function getDefault(): ?Company
    {
        return Company::query()->where('is_active', true)->first();
    }

    public function findById(int $id): ?Company
    {
        return Company::query()->find($id);
    }
}
