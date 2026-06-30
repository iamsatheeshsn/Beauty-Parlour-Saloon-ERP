<?php

namespace App\Repositories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Builder;

class ProductRepository extends BaseMasterRepository
{
    protected function modelClass(): string
    {
        return Product::class;
    }

    protected function searchableColumns(): array
    {
        return ['name', 'code', 'barcode', 'description'];
    }

    protected function defaultRelations(): array
    {
        return ['category', 'brand', 'defaultSupplier'];
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

        if (! empty($filters['product_category_id'])) {
            $query->where('product_category_id', $filters['product_category_id']);
        }

        if (! empty($filters['brand_id'])) {
            $query->where('brand_id', $filters['brand_id']);
        }
    }

    public function nextCode(int $companyId): string
    {
        $latest = Product::query()
            ->where('company_id', $companyId)
            ->where('code', 'like', 'PRD%')
            ->orderByRaw('CAST(SUBSTRING(code, 4) AS UNSIGNED) DESC')
            ->value('code');

        $number = $latest ? ((int) substr($latest, 3)) + 1 : 1;

        return 'PRD'.str_pad((string) $number, 4, '0', STR_PAD_LEFT);
    }

    public function countActive(int $companyId): int
    {
        return Product::query()
            ->where('company_id', $companyId)
            ->where('is_active', true)
            ->count();
    }
}
