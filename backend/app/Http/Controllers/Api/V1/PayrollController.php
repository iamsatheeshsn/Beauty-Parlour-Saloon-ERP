<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\PayslipResource;
use App\Repositories\StaffLeaveRepository;
use App\Services\PayrollService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class PayrollController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly PayrollService $payrollService,
        private readonly StaffLeaveRepository $leaveRepository
    ) {
    }

    public function stats(Request $request): JsonResponse
    {
        $companyId = $this->payrollService->resolveCompanyId($request);

        return $this->successResponse(
            $this->payrollService->stats(
                $companyId,
                $request->input('period_start'),
                $request->input('period_end')
            ),
            'Payroll stats retrieved'
        );
    }

    public function staffOverview(Request $request): JsonResponse
    {
        $data = $request->validate([
            'period_start' => ['required', 'date'],
            'period_end' => ['required', 'date', 'after_or_equal:period_start'],
        ]);

        return $this->successResponse(
            $this->payrollService->staffOverview(
                $this->payrollService->resolveCompanyId($request),
                $data['period_start'],
                $data['period_end']
            ),
            'Staff payroll overview retrieved'
        );
    }

    public function pendingLeave(Request $request): JsonResponse
    {
        $companyId = $this->payrollService->resolveCompanyId($request);
        if (! $companyId) {
            return $this->successResponse([], 'Pending leave retrieved');
        }

        $leaves = $this->leaveRepository->pendingForCompany($companyId);

        return $this->successResponse(
            $leaves->map(fn ($leave) => [
                'id' => $leave->id,
                'user_id' => $leave->user_id,
                'user_name' => $leave->user?->name,
                'leave_type' => $leave->leave_type,
                'start_date' => $leave->start_date?->toDateString(),
                'end_date' => $leave->end_date?->toDateString(),
                'days' => $leave->days,
                'reason' => $leave->reason,
            ]),
            'Pending leave retrieved'
        );
    }

    public function preview(Request $request): JsonResponse
    {
        $data = $request->validate($this->payrollService->previewRules());

        return $this->successResponse(
            $this->payrollService->preview($data, $this->payrollService->resolveCompanyId($request)),
            'Payroll preview calculated'
        );
    }

    public function index(Request $request): JsonResponse
    {
        $paginator = $this->payrollService->paginate($request);

        return $this->successResponse([
            'data' => PayslipResource::collection($paginator->items()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ], 'Payslips retrieved');
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $payslip = $this->payrollService->findOrFail($id, $this->payrollService->resolveCompanyId($request));

        return $this->successResponse(new PayslipResource($payslip), 'Payslip retrieved');
    }

    public function generate(Request $request): JsonResponse
    {
        $data = $request->validate($this->payrollService->generateRules());
        $companyId = $this->payrollService->resolveCompanyId($request);
        $result = $this->payrollService->generate($data, $companyId, $request);

        if ($result instanceof Collection) {
            return $this->createdResponse([
                'generated_count' => $result->count(),
                'payslips' => PayslipResource::collection($result),
            ], "{$result->count()} payslip(s) generated");
        }

        return $this->createdResponse(new PayslipResource($result), 'Payslip generated');
    }

    public function approve(Request $request, int $id): JsonResponse
    {
        $payslip = $this->payrollService->approve($id, $this->payrollService->resolveCompanyId($request), $request);

        return $this->successResponse(new PayslipResource($payslip), 'Payslip approved');
    }

    public function markPaid(Request $request, int $id): JsonResponse
    {
        $payslip = $this->payrollService->markPaid($id, $this->payrollService->resolveCompanyId($request), $request);

        return $this->successResponse(new PayslipResource($payslip), 'Payslip marked as paid');
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $this->payrollService->delete($id, $this->payrollService->resolveCompanyId($request), $request);

        return $this->successResponse(null, 'Payslip deleted');
    }
}
