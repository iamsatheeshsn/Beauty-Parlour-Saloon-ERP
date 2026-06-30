<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ActivityLogResource;
use App\Services\ActivityLogService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly ActivityLogService $activityLogService
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        $paginator = $this->activityLogService->paginate(
            (int) $request->input('per_page', 15),
            $request->input('user_id') ? (int) $request->input('user_id') : null,
            $request->user()?->company_id
        );

        return $this->successResponse([
            'data' => ActivityLogResource::collection($paginator->items()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ], 'Activity logs retrieved successfully');
    }
}
