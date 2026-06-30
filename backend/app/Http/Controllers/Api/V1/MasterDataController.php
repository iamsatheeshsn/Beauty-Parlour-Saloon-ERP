<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\MasterDataService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Pagination\LengthAwarePaginator;

abstract class MasterDataController extends Controller
{
    use ApiResponse;

    abstract protected function service(): MasterDataService;

    /**
     * @return class-string<JsonResource>
     */
    abstract protected function resourceClass(): string;

    public function index(Request $request): JsonResponse
    {
        if ($request->boolean('all')) {
            $items = $this->service()->listAll($request);

            return $this->successResponse(
                $this->resourceClass()::collection($items),
                'Records retrieved successfully'
            );
        }

        return $this->paginatedResponse(
            $this->service()->paginate($request),
            $this->resourceClass()
        );
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $model = $this->service()->findOrFail($id, $this->service()->resolveCompanyId($request));

        return $this->successResponse(
            new ($this->resourceClass())($model),
            'Record retrieved successfully'
        );
    }

    public function store(Request $request): JsonResponse
    {
        $companyId = $this->service()->resolveCompanyId($request);
        $data = $request->validate($this->service()->storeRules($companyId));
        $model = $this->service()->create($data, $companyId, $request);

        return $this->createdResponse(
            new ($this->resourceClass())($model),
            'Record created successfully'
        );
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $companyId = $this->service()->resolveCompanyId($request);
        $data = $request->validate($this->service()->updateRules($id, $companyId));
        $model = $this->service()->update($id, $data, $companyId, $request);

        return $this->successResponse(
            new ($this->resourceClass())($model),
            'Record updated successfully'
        );
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $this->service()->delete($id, $this->service()->resolveCompanyId($request), $request);

        return $this->successResponse(null, 'Record deleted successfully');
    }

    /**
     * @param  class-string<JsonResource>  $resourceClass
     */
    protected function paginatedResponse(LengthAwarePaginator $paginator, string $resourceClass): JsonResponse
    {
        return $this->successResponse([
            'data' => $resourceClass::collection($paginator->items()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ], 'Records retrieved successfully');
    }
}
