<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\StaffAttendanceResource;
use App\Services\StaffAttendanceService;
use App\Services\StaffService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StaffAttendanceController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly StaffAttendanceService $service,
        private readonly StaffService $staffService
    ) {
    }

    public function index(Request $request, int $userId): JsonResponse
    {
        $companyId = $this->staffService->resolveCompanyId($request);

        if ($request->boolean('all')) {
            $records = $this->service->list($userId, $companyId, $request->input('month'));

            return $this->successResponse(StaffAttendanceResource::collection($records), 'Attendance retrieved');
        }

        $paginator = $this->service->paginate($userId, $companyId, (int) $request->input('per_page', 15));

        return $this->successResponse([
            'data' => StaffAttendanceResource::collection($paginator->items()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ], 'Attendance retrieved');
    }

    public function store(Request $request, int $userId): JsonResponse
    {
        $data = $request->validate($this->service->storeRules());
        $record = $this->service->create($userId, $data, $this->staffService->resolveCompanyId($request), $request);

        return $this->createdResponse(new StaffAttendanceResource($record), 'Attendance recorded');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $data = $request->validate($this->service->updateRules());
        $record = $this->service->update($id, $data, $this->staffService->resolveCompanyId($request), $request);

        return $this->successResponse(new StaffAttendanceResource($record), 'Attendance updated');
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $this->service->delete($id, $this->staffService->resolveCompanyId($request), $request);

        return $this->successResponse(null, 'Attendance deleted');
    }
}
