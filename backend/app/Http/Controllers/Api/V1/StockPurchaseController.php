<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\StockPurchaseResource;
use App\Services\StockPurchaseService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StockPurchaseController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly StockPurchaseService $purchaseService
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        $paginator = $this->purchaseService->paginate($request);

        return $this->successResponse([
            'data' => StockPurchaseResource::collection($paginator->items()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ], 'Purchase orders retrieved');
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $purchase = $this->purchaseService->findOrFail($id, $this->purchaseService->resolveCompanyId($request));

        return $this->successResponse(new StockPurchaseResource($purchase), 'Purchase order retrieved');
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate($this->purchaseService->storeRules());
        $purchase = $this->purchaseService->create(
            $data,
            $this->purchaseService->resolveCompanyId($request),
            $request
        );

        return $this->createdResponse(new StockPurchaseResource($purchase), 'Purchase order created');
    }

    public function receive(Request $request, int $id): JsonResponse
    {
        $data = $request->validate($this->purchaseService->receiveRules());
        $purchase = $this->purchaseService->receive(
            $id,
            $data,
            $this->purchaseService->resolveCompanyId($request),
            $request
        );

        return $this->successResponse(new StockPurchaseResource($purchase), 'Stock received');
    }
}
