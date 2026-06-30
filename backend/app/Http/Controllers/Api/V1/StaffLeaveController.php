<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\StaffLeaveResource;
use App\Services\StaffLeaveService;
use App\Services\StaffService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StaffLeaveController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly StaffLeaveService $service,
        private readonly StaffService $staffService
    ) {
    }

    public function index(Request $request, int $userId): JsonResponse
    {
        $companyId = $this->staffService->resolveCompanyId($request);

        if ($request->boolean('all')) {
            $leaves = $this->service->list($userId, $companyId);

            return $this->successResponse(StaffLeaveResource::collection($leaves), 'Leave requests retrieved');
        }

        $paginator = $this->service->paginate($userId, $companyId, (int) $request->input('per_page', 15));

        return $this->successResponse([
            'data' => StaffLeaveResource::collection($paginator->items()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ], 'Leave requests retrieved');
    }

    public function store(Request $request, int $userId): JsonResponse
    {
        $data = $request->validate($this->service->storeRules());
        $leave = $this->service->create($userId, $data, $this->staffService->resolveCompanyId($request), $request);

        return $this->createdResponse(new StaffLeaveResource($leave), 'Leave request created');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $data = $request->validate($this->service->updateRules());
        $leave = $this->service->update($id, $data, $this->staffService->resolveCompanyId($request), $request);

        return $this->successResponse(new StaffLeaveResource($leave), 'Leave request updated');
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $this->service->delete($id, $this->staffService->resolveCompanyId($request), $request);

        return $this->successResponse(null, 'Leave request deleted');
    }
}
