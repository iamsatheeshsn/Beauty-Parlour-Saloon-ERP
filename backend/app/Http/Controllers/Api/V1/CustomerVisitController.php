<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\CustomerVisitResource;
use App\Services\CustomerService;
use App\Services\CustomerVisitService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerVisitController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly CustomerVisitService $visitService,
        private readonly CustomerService $customerService
    ) {
    }

    public function index(Request $request, int $customerId): JsonResponse
    {
        if ($request->boolean('all')) {
            $visits = $this->visitService->list($customerId, $this->customerService->resolveCompanyId($request));

            return $this->successResponse(CustomerVisitResource::collection($visits), 'Visits retrieved');
        }

        $paginator = $this->visitService->paginate(
            $customerId,
            $this->customerService->resolveCompanyId($request),
            (int) $request->input('per_page', 15)
        );

        return $this->successResponse([
            'data' => CustomerVisitResource::collection($paginator->items()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ], 'Visits retrieved');
    }

    public function store(Request $request, int $customerId): JsonResponse
    {
        $data = $request->validate($this->visitService->storeRules());
        $visit = $this->visitService->create($customerId, $data, $this->customerService->resolveCompanyId($request), $request);

        return $this->createdResponse(new CustomerVisitResource($visit), 'Visit recorded');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $data = $request->validate($this->visitService->updateRules());
        $visit = $this->visitService->update($id, $data, $this->customerService->resolveCompanyId($request), $request);

        return $this->successResponse(new CustomerVisitResource($visit), 'Visit updated');
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $this->visitService->delete($id, $this->customerService->resolveCompanyId($request), $request);

        return $this->successResponse(null, 'Visit deleted');
    }
}
