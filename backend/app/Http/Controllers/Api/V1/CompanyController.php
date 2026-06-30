<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\CompanyResource;
use App\Services\CompanyMasterService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CompanyController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly CompanyMasterService $companyMasterService
    ) {
    }

    public function show(Request $request): JsonResponse
    {
        $company = $this->companyMasterService->getForUser($request);

        return $this->successResponse(
            new CompanyResource($company),
            'Company retrieved successfully'
        );
    }

    public function update(Request $request): JsonResponse
    {
        $company = $this->companyMasterService->getForUser($request);
        $data = $request->validate($this->companyMasterService->updateRules($company->id));
        $company = $this->companyMasterService->update($request, $data);

        return $this->successResponse(
            new CompanyResource($company),
            'Company updated successfully'
        );
    }
}
