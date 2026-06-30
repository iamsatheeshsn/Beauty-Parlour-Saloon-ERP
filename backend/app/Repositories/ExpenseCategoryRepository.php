<?php

namespace App\Repositories;

use App\Models\ExpenseCategory;

class ExpenseCategoryRepository extends BaseMasterRepository
{
    protected function modelClass(): string
    {
        return ExpenseCategory::class;
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
