<?php

namespace App\Repositories;

use App\Models\Setting;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

class SettingMasterRepository extends BaseMasterRepository
{
    protected function modelClass(): string
    {
        return Setting::class;
    }

    protected function searchableColumns(): array
    {
        return ['key', 'group', 'description'];
    }

    protected function defaultRelations(): array
    {
        return ['branch'];
    }

    protected function companyScoped(): bool
    {
        return true;
    }

    protected function defaultOrder(): array
    {
        return ['group' => 'asc', 'key' => 'asc'];
    }

    protected function applyFilters(Builder $query, array $filters): void
    {
        parent::applyFilters($query, $filters);

        if (array_key_exists('branch_id', $filters) && $filters['branch_id'] !== null && $filters['branch_id'] !== '') {
            $query->where('branch_id', $filters['branch_id']);
        }
    }

    public function paginate(int $perPage = 15, array $filters = []): LengthAwarePaginator
    {
        return parent::paginate($perPage, $filters);
    }
}
