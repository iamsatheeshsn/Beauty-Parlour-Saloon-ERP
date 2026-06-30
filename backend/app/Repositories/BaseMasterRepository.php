<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

abstract class BaseMasterRepository
{
    abstract protected function modelClass(): string;

    public function getModelClass(): string
    {
        return $this->modelClass();
    }

    /**
     * @return array<int, string>
     */
    protected function searchableColumns(): array
    {
        return ['name'];
    }

    /**
     * @return array<int, string>
     */
    protected function defaultRelations(): array
    {
        return [];
    }

    protected function companyScoped(): bool
    {
        return false;
    }

    /**
     * @return array<string, mixed>
     */
    protected function defaultOrder(): array
    {
        return ['sort_order' => 'asc', 'name' => 'asc'];
    }

    public function paginate(int $perPage = 15, array $filters = []): LengthAwarePaginator
    {
        $query = $this->newQuery();

        if ($this->companyScoped() && ! empty($filters['company_id'])) {
            $query->where('company_id', $filters['company_id']);
        }

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function (Builder $builder) use ($search): void {
                foreach ($this->searchableColumns() as $column) {
                    $builder->orWhere($column, 'like', "%{$search}%");
                }
            });
        }

        $this->applyFilters($query, $filters);

        foreach ($this->defaultOrder() as $column => $direction) {
            $query->orderBy($column, $direction);
        }

        return $query->paginate($perPage);
    }

    /**
     * @return array<int, Model>
     */
    public function all(array $filters = []): array
    {
        $query = $this->newQuery();

        if ($this->companyScoped() && ! empty($filters['company_id'])) {
            $query->where('company_id', $filters['company_id']);
        }

        $this->applyFilters($query, $filters);

        foreach ($this->defaultOrder() as $column => $direction) {
            $query->orderBy($column, $direction);
        }

        return $query->get()->all();
    }

    public function findById(int $id, ?int $companyId = null): ?Model
    {
        $query = $this->newQuery()->where('id', $id);

        if ($this->companyScoped() && $companyId) {
            $query->where('company_id', $companyId);
        }

        return $query->first();
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Model
    {
        /** @var Model $model */
        $model = $this->modelClass()::query()->create($data);

        return $model->fresh($this->defaultRelations());
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(Model $model, array $data): Model
    {
        $model->update($data);

        return $model->fresh($this->defaultRelations());
    }

    public function delete(Model $model): bool
    {
        return (bool) $model->delete();
    }

    protected function applyFilters(Builder $query, array $filters): void
    {
        if (! empty($filters['country_id'])) {
            $query->where('country_id', $filters['country_id']);
        }

        if (! empty($filters['emirate_id'])) {
            $query->where('emirate_id', $filters['emirate_id']);
        }

        if (! empty($filters['department_id'])) {
            $query->where('department_id', $filters['department_id']);
        }

        if (! empty($filters['parent_id'])) {
            $query->where('parent_id', $filters['parent_id']);
        }

        if (isset($filters['is_active'])) {
            $query->where('is_active', filter_var($filters['is_active'], FILTER_VALIDATE_BOOLEAN));
        }

        if (! empty($filters['group'])) {
            $query->where('group', $filters['group']);
        }
    }

    protected function newQuery(): Builder
    {
        $relations = $this->defaultRelations();

        return $this->modelClass()::query()->with($relations);
    }
}
