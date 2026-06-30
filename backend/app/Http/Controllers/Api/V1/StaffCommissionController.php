<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\StaffCommissionResource;
use App\Services\StaffCommissionService;
use App\Services\StaffService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StaffCommissionController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly StaffCommissionService $service,
        private readonly StaffService $staffService
    ) {
    }

    public function index(Request $request, int $userId): JsonResponse
    {
        $rules = $this->service->list($userId, $this->staffService->resolveCompanyId($request));

        return $this->successResponse(StaffCommissionResource::collection($rules), 'Commission rules retrieved');
    }

    public function store(Request $request, int $userId): JsonResponse
    {
        $data = $request->validate($this->service->storeRules());
        $rule = $this->service->create($userId, $data, $this->staffService->resolveCompanyId($request), $request);

        return $this->createdResponse(new StaffCommissionResource($rule), 'Commission rule created');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $data = $request->validate($this->service->updateRules());
        $rule = $this->service->update($id, $data, $this->staffService->resolveCompanyId($request), $request);

        return $this->successResponse(new StaffCommissionResource($rule), 'Commission rule updated');
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $this->service->delete($id, $this->staffService->resolveCompanyId($request), $request);

        return $this->successResponse(null, 'Commission rule deleted');
    }
}
