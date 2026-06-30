<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ActivityLogResource;
use App\Services\ActivityLogService;
use App\Services\StockMovementService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly ActivityLogService $activityLogService,
        private readonly StockMovementService $stockMovementService
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $companyId = $user?->company_id;
        $branchId = $user?->branch_id;

        $recent = $this->activityLogService->recent($companyId, 12);
        $lowStock = $companyId
            ? $this->stockMovementService->lowStock($companyId, $branchId)
            : collect();

        $alerts = [];
        if ($lowStock->isNotEmpty()) {
            $alerts[] = [
                'type' => 'low_stock',
                'title' => 'Low stock alert',
                'message' => "{$lowStock->count()} product(s) below reorder level",
                'href' => '/inventory',
            ];
        }

        return $this->successResponse([
            'items' => ActivityLogResource::collection($recent),
            'count' => $recent->count(),
            'alerts' => $alerts,
        ], 'Notifications retrieved');
    }
}
