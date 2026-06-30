<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\StaffAttendanceResource;
use App\Http\Resources\StaffSalaryResource;
use App\Http\Resources\UserResource;
use App\Services\StaffService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StaffController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly StaffService $staffService
    ) {
    }

    public function dashboard(Request $request): JsonResponse
    {
        $data = $this->staffService->companyDashboard($this->staffService->resolveCompanyId($request));

        return $this->successResponse($data, 'Staff dashboard retrieved');
    }

    public function index(Request $request): JsonResponse
    {
        $paginator = $this->staffService->paginate($request);

        return $this->successResponse([
            'data' => UserResource::collection($paginator->items()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ], 'Staff retrieved successfully');
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $staff = $this->staffService->findWithDetails($id, $this->staffService->resolveCompanyId($request));

        return $this->successResponse(new UserResource($staff), 'Staff member retrieved');
    }

    public function memberDashboard(Request $request, int $id): JsonResponse
    {
        $data = $this->staffService->memberDashboard($id, $this->staffService->resolveCompanyId($request));

        return $this->successResponse([
            'staff' => new UserResource($data['staff']),
            'attendance_summary' => $data['attendance_summary'],
            'current_salary' => $data['current_salary'] ? new StaffSalaryResource($data['current_salary']) : null,
            'commission_rules_count' => $data['commission_rules'],
            'pending_leave' => $data['pending_leave'],
            'approved_leave_days' => $data['approved_leave_days'],
            'recent_attendance' => StaffAttendanceResource::collection($data['recent_attendance']),
            'expiring_documents' => $data['expiring_documents'],
        ], 'Staff dashboard retrieved');
    }

    public function store(Request $request): JsonResponse
    {
        $companyId = $this->staffService->resolveCompanyId($request);
        $data = $request->validate($this->staffService->storeRules($companyId));
        $staff = $this->staffService->create($data, $companyId, $request);

        return $this->createdResponse(new UserResource($staff), 'Staff member created');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $companyId = $this->staffService->resolveCompanyId($request);
        $data = $request->validate($this->staffService->updateRules($id, $companyId));
        $staff = $this->staffService->update($id, $data, $companyId, $request);

        return $this->successResponse(new UserResource($staff), 'Staff member updated');
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $this->staffService->delete($id, $this->staffService->resolveCompanyId($request), $request);

        return $this->successResponse(null, 'Staff member deleted');
    }

    public function uploadAvatar(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'avatar' => ['required', 'image', 'max:5120'],
        ]);

        $staff = $this->staffService->uploadAvatar(
            $id,
            $this->staffService->resolveCompanyId($request),
            $request->file('avatar'),
            $request
        );

        return $this->successResponse(new UserResource($staff), 'Profile photo uploaded');
    }

    public function deleteAvatar(Request $request, int $id): JsonResponse
    {
        $staff = $this->staffService->deleteAvatar(
            $id,
            $this->staffService->resolveCompanyId($request),
            $request
        );

        return $this->successResponse(new UserResource($staff), 'Profile photo removed');
    }
}
