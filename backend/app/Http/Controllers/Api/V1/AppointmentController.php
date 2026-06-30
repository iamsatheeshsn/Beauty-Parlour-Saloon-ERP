<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\AppointmentResource;
use App\Services\AppointmentService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly AppointmentService $appointmentService
    ) {
    }

    public function calendar(Request $request): JsonResponse
    {
        $appointments = $this->appointmentService->calendar($request);

        return $this->successResponse(
            AppointmentResource::collection($appointments),
            'Calendar appointments retrieved'
        );
    }

    public function index(Request $request): JsonResponse
    {
        $paginator = $this->appointmentService->paginate($request);

        return $this->successResponse([
            'data' => AppointmentResource::collection($paginator->items()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ], 'Appointments retrieved');
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $appointment = $this->appointmentService->findOrFail($id, $this->appointmentService->resolveCompanyId($request));

        return $this->successResponse(new AppointmentResource($appointment), 'Appointment retrieved');
    }

    public function walkIn(Request $request): JsonResponse
    {
        $data = $request->validate($this->appointmentService->walkInRules());
        $appointment = $this->appointmentService->createWalkIn(
            $data,
            $this->appointmentService->resolveCompanyId($request),
            $request
        );

        return $this->createdResponse(new AppointmentResource($appointment), 'Walk-in appointment created');
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate($this->appointmentService->bookingRules());
        $appointment = $this->appointmentService->createBooking(
            $data,
            $this->appointmentService->resolveCompanyId($request),
            $request
        );

        return $this->createdResponse(new AppointmentResource($appointment), 'Appointment booked');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $data = $request->validate($this->appointmentService->updateRules());
        $appointment = $this->appointmentService->update(
            $id,
            $data,
            $this->appointmentService->resolveCompanyId($request),
            $request
        );

        return $this->successResponse(new AppointmentResource($appointment), 'Appointment updated');
    }

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $data = $request->validate($this->appointmentService->statusRules());
        $appointment = $this->appointmentService->updateStatus(
            $id,
            $data,
            $this->appointmentService->resolveCompanyId($request),
            $request
        );

        return $this->successResponse(new AppointmentResource($appointment), 'Appointment status updated');
    }

    public function assignStaff(Request $request, int $id): JsonResponse
    {
        $data = $request->validate($this->appointmentService->assignStaffRules());
        $appointment = $this->appointmentService->assignStaff(
            $id,
            $data,
            $this->appointmentService->resolveCompanyId($request),
            $request
        );

        return $this->successResponse(new AppointmentResource($appointment), 'Staff assigned');
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $this->appointmentService->delete($id, $this->appointmentService->resolveCompanyId($request), $request);

        return $this->successResponse(null, 'Appointment deleted');
    }
}
