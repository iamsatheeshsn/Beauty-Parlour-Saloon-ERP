<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\StockMovementResource;
use App\Services\StockMovementService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StockMovementController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly StockMovementService $movementService
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        $paginator = $this->movementService->paginate($request);

        return $this->successResponse([
            'data' => StockMovementResource::collection($paginator->items()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ], 'Stock movements retrieved');
    }

    public function consume(Request $request): JsonResponse
    {
        $data = $request->validate($this->movementService->consumeRules());
        $movement = $this->movementService->consume(
            $data,
            $this->movementService->resolveCompanyId($request),
            $request
        );

        return $this->createdResponse(new StockMovementResource($movement), 'Stock consumed');
    }

    public function adjust(Request $request): JsonResponse
    {
        $data = $request->validate($this->movementService->adjustRules());
        $movement = $this->movementService->adjust(
            $data,
            $this->movementService->resolveCompanyId($request),
            $request
        );

        return $this->createdResponse(new StockMovementResource($movement), 'Stock adjusted');
    }
}
