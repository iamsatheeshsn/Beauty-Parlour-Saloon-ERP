<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\SaleResource;
use App\Services\SaleService;
use App\Services\SettingsService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SaleController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly SaleService $saleService,
        private readonly SettingsService $settingsService
    ) {
    }

    public function stats(Request $request): JsonResponse
    {
        return $this->successResponse(
            $this->saleService->stats($this->saleService->resolveCompanyId($request)),
            'Sales stats retrieved'
        );
    }

    public function preview(Request $request): JsonResponse
    {
        $data = $request->validate($this->saleService->previewRules());

        return $this->successResponse(
            $this->saleService->preview($data, $this->saleService->resolveCompanyId($request), $request),
            'Sale preview calculated'
        );
    }

    public function checkout(Request $request): JsonResponse
    {
        $data = $request->validate($this->saleService->checkoutRules());
        $sale = $this->saleService->checkout($data, $this->saleService->resolveCompanyId($request), $request);

        return $this->createdResponse(new SaleResource($sale), 'Invoice created');
    }

    public function index(Request $request): JsonResponse
    {
        $paginator = $this->saleService->paginate($request);

        return $this->successResponse([
            'data' => SaleResource::collection($paginator->items()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ], 'Invoices retrieved');
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $sale = $this->saleService->findOrFail($id, $this->saleService->resolveCompanyId($request));

        return $this->successResponse(new SaleResource($sale), 'Invoice retrieved');
    }

    public function receipt(Request $request, int $id): JsonResponse
    {
        $sale = $this->saleService->findOrFail($id, $this->saleService->resolveCompanyId($request));
        $company = $this->settingsService->getCompany();
        $settings = $this->settingsService->getAppSettings($request);

        return $this->successResponse([
            'sale' => new SaleResource($sale),
            'company' => $company ? [
                'name' => $company->name,
                'trade_name' => $company->trade_name,
                'address' => $company->address,
                'phone' => $company->phone,
                'email' => $company->email,
                'trn_number' => $company->trn_number,
            ] : null,
            'settings' => [
                'currency' => $settings['currency'] ?? 'AED',
                'vat_enabled' => $settings['vat_enabled'] ?? false,
            ],
        ], 'Receipt data retrieved');
    }
}
