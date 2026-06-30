<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\StaffSalaryResource;
use App\Services\StaffSalaryService;
use App\Services\StaffService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StaffSalaryController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly StaffSalaryService $service,
        private readonly StaffService $staffService
    ) {
    }

    public function index(Request $request, int $userId): JsonResponse
    {
        $salaries = $this->service->list($userId, $this->staffService->resolveCompanyId($request));

        return $this->successResponse(StaffSalaryResource::collection($salaries), 'Salaries retrieved');
    }

    public function current(Request $request, int $userId): JsonResponse
    {
        $salary = $this->service->current($userId, $this->staffService->resolveCompanyId($request));

        return $this->successResponse(
            $salary ? new StaffSalaryResource($salary) : null,
            'Current salary retrieved'
        );
    }

    public function store(Request $request, int $userId): JsonResponse
    {
        $data = $request->validate($this->service->storeRules());
        $salary = $this->service->create($userId, $data, $this->staffService->resolveCompanyId($request), $request);

        return $this->createdResponse(new StaffSalaryResource($salary), 'Salary record created');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $data = $request->validate($this->service->updateRules());
        $salary = $this->service->update($id, $data, $this->staffService->resolveCompanyId($request), $request);

        return $this->successResponse(new StaffSalaryResource($salary), 'Salary record updated');
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $this->service->delete($id, $this->staffService->resolveCompanyId($request), $request);

        return $this->successResponse(null, 'Salary record deleted');
    }
}
