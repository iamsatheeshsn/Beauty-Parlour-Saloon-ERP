<?php

namespace App\Services;

use App\Enums\ActivityActionEnum;
use App\Exceptions\ApiException;
use App\Repositories\BaseMasterRepository;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

abstract class MasterDataService
{
    public function __construct(
        protected readonly BaseMasterRepository $repository
    ) {
    }

    abstract public function storeRules(?int $companyId = null): array;

    abstract public function updateRules(int $id, ?int $companyId = null): array;

    protected function companyScoped(): bool
    {
        return false;
    }

    protected function resourceLabel(): string
    {
        return Str::headline(class_basename($this->repository->getModelClass()));
    }

    public function paginate(Request $request): LengthAwarePaginator
    {
        $filters = $this->buildFilters($request);

        return $this->repository->paginate(
            (int) $request->input('per_page', 15),
            $filters
        );
    }

    /**
     * @return array<int, Model>
     */
    public function listAll(Request $request): array
    {
        return $this->repository->all($this->buildFilters($request));
    }

    public function findOrFail(int $id, ?int $companyId = null): Model
    {
        $model = $this->repository->findById($id, $companyId);

        if (! $model) {
            throw new ApiException('Record not found', 404);
        }

        return $model;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data, ?int $companyId = null, ?Request $request = null): Model
    {
        if ($this->companyScoped() && $companyId) {
            $data['company_id'] = $companyId;
        }

        $model = $this->repository->create($data);
        $this->logActivity(ActivityActionEnum::Create, $model, $request);

        return $model;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(int $id, array $data, ?int $companyId = null, ?Request $request = null): Model
    {
        $model = $this->findOrFail($id, $companyId);

        unset($data['company_id']);

        $updated = $this->repository->update($model, $data);
        $this->logActivity(ActivityActionEnum::Update, $updated, $request);

        return $updated;
    }

    public function delete(int $id, ?int $companyId = null, ?Request $request = null): void
    {
        $model = $this->findOrFail($id, $companyId);
        $this->logActivity(ActivityActionEnum::Delete, $model, $request);
        $this->repository->delete($model);
    }

    protected function buildFilters(Request $request): array
    {
        $filters = $request->only([
            'search',
            'country_id',
            'emirate_id',
            'department_id',
            'parent_id',
            'is_active',
            'group',
        ]);

        if ($this->companyScoped() && $request->user()?->company_id) {
            $filters['company_id'] = $request->user()->company_id;
        }

        return $filters;
    }

    public function resolveCompanyId(Request $request): ?int
    {
        return $request->user()?->company_id;
    }

    protected function logActivity(ActivityActionEnum $action, Model $model, ?Request $request): void
    {
        if (! $request) {
            return;
        }

        $name = $model->getAttribute('name') ?? $model->getAttribute('key') ?? $model->getAttribute('code') ?? "#{$model->getKey()}";

        app(ActivityLogService::class)->log(
            action: $action,
            userId: $request->user()?->id,
            subject: $model,
            description: "{$action->label()} {$this->resourceLabel()}: {$name}",
            properties: [
                'resource' => $this->resourceLabel(),
                'id' => $model->getKey(),
            ],
            request: $request
        );
    }
}
