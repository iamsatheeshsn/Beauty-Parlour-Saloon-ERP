<?php

namespace App\Repositories;

use App\Models\SalonService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class SalonServiceRepository extends BaseMasterRepository
{
    protected function modelClass(): string
    {
        return SalonService::class;
    }

    protected function searchableColumns(): array
    {
        return ['name', 'code', 'description'];
    }

    protected function defaultRelations(): array
    {
        return ['category'];
    }

    protected function companyScoped(): bool
    {
        return true;
    }

    protected function defaultOrder(): array
    {
        return ['sort_order' => 'asc', 'name' => 'asc'];
    }

    protected function applyFilters(Builder $query, array $filters): void
    {
        parent::applyFilters($query, $filters);

        if (! empty($filters['service_category_id'])) {
            $query->where('service_category_id', $filters['service_category_id']);
        }

        if (isset($filters['is_active']) && $filters['is_active'] !== '') {
            $query->where('is_active', filter_var($filters['is_active'], FILTER_VALIDATE_BOOLEAN));
        }
    }

    public function nextCode(int $companyId): string
    {
        $latest = SalonService::query()
            ->where('company_id', $companyId)
            ->where('code', 'like', 'SRV%')
            ->orderByRaw('CAST(SUBSTRING(code, 4) AS UNSIGNED) DESC')
            ->value('code');

        $number = $latest ? ((int) substr($latest, 3)) + 1 : 1;

        return 'SRV'.str_pad((string) $number, 4, '0', STR_PAD_LEFT);
    }
}
