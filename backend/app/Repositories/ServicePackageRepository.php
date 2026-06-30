<?php

namespace App\Repositories;

use App\Models\ServicePackage;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class ServicePackageRepository
{
    /** @var array<int, string> */
    protected array $relations = ['items.service'];

    public function paginate(int $companyId, int $perPage = 15, array $filters = []): LengthAwarePaginator
    {
        return $this->query($companyId, $filters)
            ->orderBy('sort_order')
            ->orderBy('name')
            ->paginate($perPage);
    }

    public function allActive(int $companyId): Collection
    {
        return $this->query($companyId, ['is_active' => true])
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();
    }

    public function findById(int $id, int $companyId): ?ServicePackage
    {
        return ServicePackage::query()
            ->with($this->relations)
            ->where('company_id', $companyId)
            ->find($id);
    }

    public function countActive(int $companyId): int
    {
        return ServicePackage::query()
            ->where('company_id', $companyId)
            ->where('is_active', true)
            ->count();
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): ServicePackage
    {
        return ServicePackage::query()->create($data)->fresh($this->relations);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(ServicePackage $package, array $data): ServicePackage
    {
        $package->update($data);

        return $package->fresh($this->relations);
    }

    public function delete(ServicePackage $package): bool
    {
        return (bool) $package->delete();
    }

    public function nextCode(int $companyId): string
    {
        $latest = ServicePackage::query()
            ->where('company_id', $companyId)
            ->where('code', 'like', 'PKG%')
            ->orderByRaw('CAST(SUBSTRING(code, 4) AS UNSIGNED) DESC')
            ->value('code');

        $number = $latest ? ((int) substr($latest, 3)) + 1 : 1;

        return 'PKG'.str_pad((string) $number, 4, '0', STR_PAD_LEFT);
    }

    protected function query(int $companyId, array $filters): Builder
    {
        return ServicePackage::query()
            ->with($this->relations)
            ->where('company_id', $companyId)
            ->when(! empty($filters['search']), function (Builder $q) use ($filters): void {
                $search = $filters['search'];
                $q->where(function (Builder $inner) use ($search): void {
                    $inner->where('name', 'like', "%{$search}%")
                        ->orWhere('code', 'like', "%{$search}%");
                });
            })
            ->when(isset($filters['is_active']) && $filters['is_active'] !== '', function (Builder $q) use ($filters): void {
                $q->where('is_active', filter_var($filters['is_active'], FILTER_VALIDATE_BOOLEAN));
            });
    }
}
