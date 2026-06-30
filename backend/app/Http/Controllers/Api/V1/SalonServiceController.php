<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\SalonServiceResource;
use App\Services\SalonServiceCatalogService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SalonServiceController extends MasterDataController
{
    use ApiResponse;

    public function __construct(
        private readonly SalonServiceCatalogService $catalogService
    ) {
    }

    protected function service(): SalonServiceCatalogService
    {
        return $this->catalogService;
    }

    protected function resourceClass(): string
    {
        return SalonServiceResource::class;
    }

    public function stats(Request $request): JsonResponse
    {
        $companyId = $this->catalogService->resolveCompanyId($request);

        return $this->successResponse([
            'total' => $this->catalogService->countActive($companyId),
            'inactive' => \App\Models\SalonService::query()
                ->where('company_id', $companyId)
                ->where('is_active', false)
                ->count(),
        ], 'Service stats retrieved');
    }

    public function uploadImage(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'image' => ['required', 'image', 'max:5120'],
        ]);

        $service = $this->catalogService->uploadImage(
            $id,
            $this->catalogService->resolveCompanyId($request),
            $request->file('image'),
            $request
        );

        return $this->successResponse(new SalonServiceResource($service), 'Service image uploaded');
    }

    public function deleteImage(Request $request, int $id): JsonResponse
    {
        $service = $this->catalogService->deleteImage(
            $id,
            $this->catalogService->resolveCompanyId($request),
            $request
        );

        return $this->successResponse(new SalonServiceResource($service), 'Service image removed');
    }
}
