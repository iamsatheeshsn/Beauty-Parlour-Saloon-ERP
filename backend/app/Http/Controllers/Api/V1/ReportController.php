<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\ReportService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly ReportService $reportService
    ) {
    }

    public function summary(Request $request): JsonResponse
    {
        return $this->successResponse(
            $this->reportService->summary($request),
            'Report summary retrieved'
        );
    }

    public function sales(Request $request): JsonResponse
    {
        return $this->successResponse(
            $this->reportService->sales($request),
            'Sales report retrieved'
        );
    }

    public function customers(Request $request): JsonResponse
    {
        return $this->successResponse(
            $this->reportService->customers($request),
            'Customer report retrieved'
        );
    }

    public function staff(Request $request): JsonResponse
    {
        return $this->successResponse(
            $this->reportService->staff($request),
            'Staff report retrieved'
        );
    }

    public function inventory(Request $request): JsonResponse
    {
        return $this->successResponse(
            $this->reportService->inventory($request),
            'Inventory report retrieved'
        );
    }

    public function financial(Request $request): JsonResponse
    {
        return $this->successResponse(
            $this->reportService->financial($request),
            'Financial report retrieved'
        );
    }

    public function vat(Request $request): JsonResponse
    {
        return $this->successResponse(
            $this->reportService->vat($request),
            'VAT report retrieved'
        );
    }
}
