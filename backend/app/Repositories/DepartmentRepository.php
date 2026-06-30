<?php

namespace App\Repositories;

use App\Models\Department;

class DepartmentRepository extends BaseMasterRepository
{
    protected function modelClass(): string
    {
        return Department::class;
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
