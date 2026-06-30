<?php

namespace App\Services;

use App\Enums\ActivityActionEnum;
use App\Enums\CommissionRateTypeEnum;
use App\Models\SalonService;
use App\Repositories\SalonServiceRepository;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class SalonServiceCatalogService extends MasterDataService
{
    public function __construct(
        private readonly SalonServiceRepository $salonServiceRepository
    ) {
        parent::__construct($salonServiceRepository);
    }

    protected function companyScoped(): bool
    {
        return true;
    }

    public function storeRules(?int $companyId = null): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'service_category_id' => ['nullable', 'integer', 'exists:service_categories,id'],
            'description' => ['nullable', 'string'],
            'duration_minutes' => ['required', 'integer', 'min:5', 'max:1440'],
            'price' => ['required', 'numeric', 'min:0'],
            'vat_rate' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'vat_inclusive' => ['sometimes', 'boolean'],
            'commission_rate' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'commission_type' => ['nullable', Rule::enum(CommissionRateTypeEnum::class)],
            'is_active' => ['sometimes', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }

    public function updateRules(int $id, ?int $companyId = null): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'service_category_id' => ['nullable', 'integer', 'exists:service_categories,id'],
            'description' => ['nullable', 'string'],
            'duration_minutes' => ['sometimes', 'integer', 'min:5', 'max:1440'],
            'price' => ['sometimes', 'numeric', 'min:0'],
            'vat_rate' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'vat_inclusive' => ['sometimes', 'boolean'],
            'commission_rate' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'commission_type' => ['nullable', Rule::enum(CommissionRateTypeEnum::class)],
            'is_active' => ['sometimes', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data, ?int $companyId = null, ?Request $request = null): Model
    {
        $data['code'] = $this->salonServiceRepository->nextCode($companyId ?? 0);
        $data['vat_rate'] = $data['vat_rate'] ?? 0;
        $data['commission_type'] = $data['commission_type'] ?? CommissionRateTypeEnum::Percentage->value;

        return parent::create($data, $companyId, $request);
    }

    protected function buildFilters(Request $request): array
    {
        $filters = parent::buildFilters($request);

        if ($request->filled('service_category_id')) {
            $filters['service_category_id'] = $request->input('service_category_id');
        }

        return $filters;
    }

    public function countActive(?int $companyId): int
    {
        if (! $companyId) {
            return 0;
        }

        return \App\Models\SalonService::query()
            ->where('company_id', $companyId)
            ->where('is_active', true)
            ->count();
    }

    public function uploadImage(int $id, ?int $companyId, UploadedFile $file, Request $request): SalonService
    {
        /** @var SalonService $service */
        $service = $this->findOrFail($id, $companyId);

        if ($service->image) {
            Storage::disk('public')->delete($service->image);
        }

        $path = $file->store("services/{$service->id}", 'public');
        $service->update(['image' => $path]);

        app(ActivityLogService::class)->log(
            action: ActivityActionEnum::Update,
            userId: $request->user()?->id,
            subject: $service,
            description: "Updated service image: {$service->name}",
            properties: ['resource' => 'SalonService', 'id' => $service->id],
            request: $request
        );

        return $service->fresh(['category']);
    }

    public function deleteImage(int $id, ?int $companyId, Request $request): SalonService
    {
        /** @var SalonService $service */
        $service = $this->findOrFail($id, $companyId);

        if ($service->image) {
            Storage::disk('public')->delete($service->image);
            $service->update(['image' => null]);
        }

        return $service->fresh(['category']);
    }
}
