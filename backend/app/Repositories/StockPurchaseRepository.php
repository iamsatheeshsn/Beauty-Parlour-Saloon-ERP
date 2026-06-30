<?php

namespace App\Repositories;

use App\Models\StockPurchase;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

class StockPurchaseRepository
{
    /** @var array<int, string> */
    protected array $relations = ['supplier', 'branch', 'createdBy', 'receivedBy', 'items.product'];

    public function paginate(int $companyId, int $perPage = 15, array $filters = []): LengthAwarePaginator
    {
        return $this->query($companyId, $filters)->orderByDesc('created_at')->paginate($perPage);
    }

    public function findById(int $id, int $companyId): ?StockPurchase
    {
        return StockPurchase::query()->with($this->relations)->where('company_id', $companyId)->find($id);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): StockPurchase
    {
        return StockPurchase::query()->create($data)->fresh($this->relations);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(StockPurchase $purchase, array $data): StockPurchase
    {
        $purchase->update($data);

        return $purchase->fresh($this->relations);
    }

    public function nextCode(int $companyId): string
    {
        $year = now()->format('Y');
        $prefix = "PO{$year}-";
        $latest = StockPurchase::query()
            ->where('company_id', $companyId)
            ->where('code', 'like', $prefix.'%')
            ->orderByRaw('CAST(SUBSTRING(code, '.(strlen($prefix) + 1).') AS UNSIGNED) DESC')
            ->value('code');

        $number = $latest ? ((int) substr($latest, strlen($prefix))) + 1 : 1;

        return $prefix.str_pad((string) $number, 5, '0', STR_PAD_LEFT);
    }

    protected function query(int $companyId, array $filters): Builder
    {
        return StockPurchase::query()
            ->with($this->relations)
            ->where('company_id', $companyId)
            ->when(! empty($filters['status']), fn (Builder $q) => $q->where('status', $filters['status']))
            ->when(! empty($filters['supplier_id']), fn (Builder $q) => $q->where('supplier_id', $filters['supplier_id']))
            ->when(! empty($filters['search']), function (Builder $q) use ($filters): void {
                $search = $filters['search'];
                $q->where(function (Builder $inner) use ($search): void {
                    $inner->where('code', 'like', "%{$search}%")
                        ->orWhere('reference', 'like', "%{$search}%");
                });
            });
    }
}
