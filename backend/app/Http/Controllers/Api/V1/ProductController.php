<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Services\ProductCatalogService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends MasterDataController
{
    use ApiResponse;

    public function __construct(
        private readonly ProductCatalogService $catalogService
    ) {
    }

    protected function service(): ProductCatalogService
    {
        return $this->catalogService;
    }

    protected function resourceClass(): string
    {
        return ProductResource::class;
    }

    public function stats(Request $request): JsonResponse
    {
        $companyId = $this->catalogService->resolveCompanyId($request);

        return $this->successResponse([
            'total' => $this->catalogService->countActive($companyId),
            'inactive' => Product::query()
                ->where('company_id', $companyId)
                ->where('is_active', false)
                ->count(),
        ], 'Product stats retrieved');
    }

    public function uploadImage(Request $request, int $id): JsonResponse
    {
        $request->validate(['image' => ['required', 'image', 'max:5120']]);

        $product = $this->catalogService->uploadImage(
            $id,
            $this->catalogService->resolveCompanyId($request),
            $request->file('image'),
            $request
        );

        return $this->successResponse(new ProductResource($product), 'Product image uploaded');
    }

    public function deleteImage(Request $request, int $id): JsonResponse
    {
        $product = $this->catalogService->deleteImage(
            $id,
            $this->catalogService->resolveCompanyId($request),
            $request
        );

        return $this->successResponse(new ProductResource($product), 'Product image removed');
    }
}
