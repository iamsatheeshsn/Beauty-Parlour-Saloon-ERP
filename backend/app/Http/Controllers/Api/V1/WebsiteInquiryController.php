<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\WebsiteInquiryResource;
use App\Services\WebsiteInquiryService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WebsiteInquiryController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly WebsiteInquiryService $inquiryService
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        $paginator = $this->inquiryService->paginate($request);

        return $this->successResponse([
            'data' => WebsiteInquiryResource::collection($paginator->items()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ], 'Inquiries retrieved');
    }

    public function stats(Request $request): JsonResponse
    {
        $companyId = $this->inquiryService->resolveCompanyId($request);

        return $this->successResponse([
            'new_count' => $this->inquiryService->countNew($companyId),
        ], 'Inquiry stats retrieved');
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $inquiry = $this->inquiryService->findOrFail($id, $this->inquiryService->resolveCompanyId($request));

        return $this->successResponse(new WebsiteInquiryResource($inquiry), 'Inquiry retrieved');
    }

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $data = $request->validate($this->inquiryService->updateStatusRules());
        $inquiry = $this->inquiryService->updateStatus(
            $id,
            $data['status'],
            $this->inquiryService->resolveCompanyId($request),
            $request
        );

        return $this->successResponse(new WebsiteInquiryResource($inquiry), 'Inquiry status updated');
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $this->inquiryService->delete($id, $this->inquiryService->resolveCompanyId($request), $request);

        return $this->successResponse(null, 'Inquiry deleted');
    }
}
