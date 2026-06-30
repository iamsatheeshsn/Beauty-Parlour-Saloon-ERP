<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ActivityLogResource;
use App\Http\Resources\AppointmentResource;
use App\Http\Resources\CompanyResource;
use App\Repositories\AppointmentRepository;
use App\Repositories\ReportRepository;
use App\Services\ActivityLogService;
use App\Services\AppointmentService;
use App\Services\CustomerService;
use App\Services\SaleService;
use App\Services\SettingsService;
use App\Services\StaffService;
use App\Services\StockMovementService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly SettingsService $settingsService,
        private readonly ActivityLogService $activityLogService,
        private readonly CustomerService $customerService,
        private readonly StaffService $staffService,
        private readonly AppointmentService $appointmentService,
        private readonly SaleService $saleService,
        private readonly StockMovementService $stockMovementService,
        private readonly ReportRepository $reportRepository,
        private readonly AppointmentRepository $appointmentRepository
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        $company = $this->settingsService->getCompany();
        $companyId = $request->user()?->company_id;
        $branchId = $request->user()?->branch_id;

        $recentActivity = $this->activityLogService->recent($companyId, 10);
        $appointmentStats = $this->appointmentService->stats($companyId);
        $saleStats = $this->saleService->stats($companyId);
        $lowStock = $this->stockMovementService->lowStock($companyId, $branchId);

        $from = Carbon::now()->subDays(29)->toDateString();
        $to = Carbon::now()->toDateString();
        $topServices = $companyId
            ? $this->reportRepository->topServices($companyId, $from, $to, 5)
            : collect();

        $upcoming = $companyId
            ? $this->appointmentRepository->upcoming($companyId, 5)
            : collect();

        return $this->successResponse([
            'company' => $company ? new CompanyResource($company) : null,
            'stats' => [
                'total_appointments' => $appointmentStats['total'],
                'today_appointments' => $appointmentStats['today'],
                'pending_appointments' => $companyId ? $this->appointmentRepository->countPendingToday($companyId) : 0,
                'total_customers' => $this->customerService->countForCompany($companyId),
                'total_revenue' => $saleStats['total_revenue'],
                'today_revenue' => $saleStats['today_revenue'],
                'pending_payments' => $companyId ? $this->appointmentRepository->countPendingToday($companyId) : 0,
                'active_staff' => $this->staffService->countActive($companyId),
                'low_stock_count' => $lowStock->count(),
            ],
            'recent_activity' => ActivityLogResource::collection($recentActivity),
            'upcoming_appointments' => AppointmentResource::collection($upcoming),
            'charts' => [
                'revenue' => $saleStats['weekly'] ?? ['labels' => [], 'data' => []],
                'appointments' => $appointmentStats['weekly'] ?? ['labels' => [], 'data' => []],
                'services' => [
                    'labels' => $topServices->pluck('name')->values()->all(),
                    'data' => $topServices->pluck('revenue')->values()->all(),
                ],
            ],
        ], 'Dashboard data retrieved');
    }
}
