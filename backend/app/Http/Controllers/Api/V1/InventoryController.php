<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\StockPurchaseStatusEnum;
use App\Http\Controllers\Controller;
use App\Http\Resources\BranchProductStockResource;
use App\Models\StockPurchase;
use App\Services\ProductCatalogService;
use App\Services\StockMovementService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly StockMovementService $movementService,
        private readonly ProductCatalogService $productCatalogService
    ) {
    }

    public function stats(Request $request): JsonResponse
    {
        $companyId = $this->movementService->resolveCompanyId($request);
        $branchId = $request->input('branch_id') ? (int) $request->input('branch_id') : $request->user()?->branch_id;

        $lowStock = $this->movementService->lowStock($companyId, $branchId);

        $pendingPurchases = 0;
        if ($companyId) {
            $pendingPurchases = StockPurchase::query()
                ->where('company_id', $companyId)
                ->whereIn('status', [
                    StockPurchaseStatusEnum::Ordered->value,
                    StockPurchaseStatusEnum::Partial->value,
                ])
                ->count();
        }

        return $this->successResponse([
            'total_products' => $this->productCatalogService->countActive($companyId),
            'low_stock_count' => $lowStock->count(),
            'pending_purchases' => $pendingPurchases,
        ], 'Inventory stats retrieved');
    }

    public function lowStock(Request $request): JsonResponse
    {
        $companyId = $this->movementService->resolveCompanyId($request);
        $branchId = $request->input('branch_id') ? (int) $request->input('branch_id') : $request->user()?->branch_id;
        $items = $this->movementService->lowStock($companyId, $branchId);

        return $this->successResponse(
            BranchProductStockResource::collection($items),
            'Low stock alerts retrieved'
        );
    }

    public function stockLevels(Request $request): JsonResponse
    {
        $companyId = $this->movementService->resolveCompanyId($request);
        $branchId = $request->input('branch_id') ? (int) $request->input('branch_id') : $request->user()?->branch_id;
        $items = $this->movementService->stockLevels($companyId, $branchId);

        return $this->successResponse(
            BranchProductStockResource::collection($items),
            'Stock levels retrieved'
        );
    }
}
