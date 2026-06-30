<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ServicePackageResource;
use App\Services\ServicePackageCatalogService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ServicePackageController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly ServicePackageCatalogService $catalogService
    ) {
    }

    public function stats(Request $request): JsonResponse
    {
        return $this->successResponse(
            $this->catalogService->stats($this->catalogService->resolveCompanyId($request)),
            'Package stats retrieved'
        );
    }

    public function active(Request $request): JsonResponse
    {
        $packages = $this->catalogService->listActive($request);

        return $this->successResponse(
            ServicePackageResource::collection($packages),
            'Active packages retrieved'
        );
    }

    public function index(Request $request): JsonResponse
    {
        $paginator = $this->catalogService->paginate($request);

        return $this->successResponse([
            'data' => ServicePackageResource::collection($paginator->items()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ], 'Packages retrieved');
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $package = $this->catalogService->findOrFail($id, $this->catalogService->resolveCompanyId($request));

        return $this->successResponse(new ServicePackageResource($package), 'Package retrieved');
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate($this->catalogService->storeRules());
        $package = $this->catalogService->create($data, $this->catalogService->resolveCompanyId($request), $request);

        return $this->createdResponse(new ServicePackageResource($package), 'Package created');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $data = $request->validate($this->catalogService->updateRules());
        $package = $this->catalogService->update($id, $data, $this->catalogService->resolveCompanyId($request), $request);

        return $this->successResponse(new ServicePackageResource($package), 'Package updated');
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $this->catalogService->delete($id, $this->catalogService->resolveCompanyId($request), $request);

        return $this->successResponse(null, 'Package deleted');
    }
}
