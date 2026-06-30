<?php

namespace App\Repositories;

use App\Models\BranchProductStock;
use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

class StockMovementRepository
{
    public function paginate(int $companyId, int $perPage = 15, array $filters = []): LengthAwarePaginator
    {
        return $this->query($companyId, $filters)->orderByDesc('created_at')->paginate($perPage);
    }

    public function getOrCreateStock(int $companyId, int $branchId, int $productId): BranchProductStock
    {
        return BranchProductStock::query()->firstOrCreate(
            ['branch_id' => $branchId, 'product_id' => $productId],
            ['company_id' => $companyId, 'quantity_on_hand' => 0]
        );
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function createMovement(array $data): StockMovement
    {
        return StockMovement::query()->create($data);
    }

    public function updateStock(BranchProductStock $stock, float $quantity): BranchProductStock
    {
        $stock->update(['quantity_on_hand' => $quantity]);

        return $stock->fresh(['product', 'branch']);
    }

    public function lowStock(int $companyId, ?int $branchId = null): Collection
    {
        return BranchProductStock::query()
            ->with(['product.category', 'product.brand', 'branch'])
            ->where('company_id', $companyId)
            ->when($branchId, fn (Builder $q) => $q->where('branch_id', $branchId))
            ->whereHas('product', fn (Builder $q) => $q->where('track_inventory', true)->where('is_active', true))
            ->get()
            ->filter(function (BranchProductStock $stock) {
                $level = $stock->reorder_level_override ?? $stock->product?->reorder_level ?? 0;

                return $level > 0 && (float) $stock->quantity_on_hand <= (float) $level;
            })
            ->values();
    }

    public function stockLevels(int $companyId, ?int $branchId = null): Collection
    {
        return BranchProductStock::query()
            ->with(['product.category', 'product.brand', 'branch'])
            ->where('company_id', $companyId)
            ->when($branchId, fn (Builder $q) => $q->where('branch_id', $branchId))
            ->whereHas('product', fn (Builder $q) => $q->where('is_active', true))
            ->orderBy('product_id')
            ->get();
    }

    protected function query(int $companyId, array $filters): Builder
    {
        return StockMovement::query()
            ->with(['product', 'branch', 'createdBy', 'purchase'])
            ->where('company_id', $companyId)
            ->when(! empty($filters['branch_id']), fn (Builder $q) => $q->where('branch_id', $filters['branch_id']))
            ->when(! empty($filters['product_id']), fn (Builder $q) => $q->where('product_id', $filters['product_id']))
            ->when(! empty($filters['type']), fn (Builder $q) => $q->where('type', $filters['type']));
    }
}
