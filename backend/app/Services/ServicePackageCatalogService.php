<?php

namespace App\Services;

use App\Enums\ActivityActionEnum;
use App\Enums\CustomerPackageStatusEnum;
use App\Enums\PointTransactionTypeEnum;
use App\Exceptions\ApiException;
use App\Models\CustomerPackage;
use App\Models\ServicePackage;
use App\Models\ServicePackageItem;
use App\Repositories\CustomerPackageRepository;
use App\Repositories\ServicePackageRepository;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class ServicePackageCatalogService
{
    public function __construct(
        private readonly ServicePackageRepository $repository,
        private readonly ActivityLogService $activityLogService
    ) {
    }

    public function resolveCompanyId(Request $request): ?int
    {
        return $request->user()?->company_id;
    }

    public function paginate(Request $request): LengthAwarePaginator
    {
        $companyId = $this->resolveCompanyId($request);
        if (! $companyId) {
            throw new ApiException('Company context required', 422);
        }

        return $this->repository->paginate(
            $companyId,
            (int) $request->input('per_page', 15),
            $request->only(['search', 'is_active'])
        );
    }

    public function listActive(Request $request): Collection
    {
        $companyId = $this->resolveCompanyId($request);
        if (! $companyId) {
            throw new ApiException('Company context required', 422);
        }

        return $this->repository->allActive($companyId);
    }

    public function findOrFail(int $id, ?int $companyId): ServicePackage
    {
        if (! $companyId) {
            throw new ApiException('Company context required', 422);
        }

        $package = $this->repository->findById($id, $companyId);
        if (! $package) {
            throw new ApiException('Package not found', 404);
        }

        return $package;
    }

    public function storeRules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'points_included' => ['required', 'integer', 'min:1'],
            'validity_days' => ['nullable', 'integer', 'min:1', 'max:3650'],
            'vat_rate' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'vat_inclusive' => ['sometimes', 'boolean'],
            'is_active' => ['sometimes', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'items' => ['nullable', 'array'],
            'items.*.service_id' => ['required_with:items', 'integer', 'exists:services,id'],
            'items.*.points_cost' => ['required_with:items', 'integer', 'min:1'],
            'items.*.quantity_included' => ['nullable', 'integer', 'min:1'],
        ];
    }

    public function updateRules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price' => ['sometimes', 'numeric', 'min:0'],
            'points_included' => ['sometimes', 'integer', 'min:1'],
            'validity_days' => ['nullable', 'integer', 'min:1', 'max:3650'],
            'vat_rate' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'vat_inclusive' => ['sometimes', 'boolean'],
            'is_active' => ['sometimes', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'items' => ['sometimes', 'array'],
            'items.*.service_id' => ['required_with:items', 'integer', 'exists:services,id'],
            'items.*.points_cost' => ['required_with:items', 'integer', 'min:1'],
            'items.*.quantity_included' => ['nullable', 'integer', 'min:1'],
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data, ?int $companyId, Request $request): ServicePackage
    {
        if (! $companyId) {
            throw new ApiException('Company context required', 422);
        }

        $items = $data['items'] ?? [];
        unset($data['items']);

        return DB::transaction(function () use ($data, $items, $companyId, $request) {
            $package = $this->repository->create([
                ...$data,
                'company_id' => $companyId,
                'code' => $this->repository->nextCode($companyId),
                'vat_rate' => $data['vat_rate'] ?? 0,
            ]);

            $this->syncItems($package, $items);
            $this->log($request, ActivityActionEnum::Create, $package);

            return $package->fresh(['items.service']);
        });
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(int $id, array $data, ?int $companyId, Request $request): ServicePackage
    {
        $package = $this->findOrFail($id, $companyId);
        $items = $data['items'] ?? null;
        unset($data['items']);

        return DB::transaction(function () use ($package, $data, $items, $request) {
            if ($items !== null) {
                $package->items()->delete();
                $this->syncItems($package, $items);
            }

            if (! empty($data)) {
                $package = $this->repository->update($package, $data);
            }

            $this->log($request, ActivityActionEnum::Update, $package);

            return $package->fresh(['items.service']);
        });
    }

    public function delete(int $id, ?int $companyId, Request $request): void
    {
        $package = $this->findOrFail($id, $companyId);
        $this->log($request, ActivityActionEnum::Delete, $package);
        $this->repository->delete($package);
    }

    public function stats(?int $companyId): array
    {
        if (! $companyId) {
            return ['total' => 0, 'inactive' => 0];
        }

        return [
            'total' => $this->repository->countActive($companyId),
            'inactive' => ServicePackage::query()
                ->where('company_id', $companyId)
                ->where('is_active', false)
                ->count(),
        ];
    }

    /**
     * @param  array<int, array<string, mixed>>  $items
     */
    protected function syncItems(ServicePackage $package, array $items): void
    {
        foreach ($items as $index => $item) {
            ServicePackageItem::query()->create([
                'service_package_id' => $package->id,
                'service_id' => $item['service_id'],
                'points_cost' => $item['points_cost'],
                'quantity_included' => $item['quantity_included'] ?? null,
                'sort_order' => $index + 1,
            ]);
        }
    }

    protected function log(Request $request, ActivityActionEnum $action, ServicePackage $package): void
    {
        $this->activityLogService->log(
            action: $action,
            userId: $request->user()?->id,
            subject: $package,
            description: "{$action->label()} package {$package->code}",
            properties: ['resource' => 'ServicePackage', 'id' => $package->id, 'code' => $package->code],
            request: $request
        );
    }
}
