<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\CustomerPackageResource;
use App\Http\Resources\CustomerPointTransactionResource;
use App\Services\CustomerPackageService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerPackageController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly CustomerPackageService $customerPackageService
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        $paginator = $this->customerPackageService->paginate($request);

        return $this->successResponse([
            'data' => CustomerPackageResource::collection($paginator->items()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ], 'Customer packages retrieved');
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $package = $this->customerPackageService->findOrFail(
            $id,
            $this->customerPackageService->resolveCompanyId($request)
        );

        return $this->successResponse(new CustomerPackageResource($package), 'Customer package retrieved');
    }

    public function forCustomer(Request $request, int $customerId): JsonResponse
    {
        $result = $this->customerPackageService->forCustomer($request, $customerId);

        return $this->successResponse([
            'balance' => $result['balance'],
            'packages' => CustomerPackageResource::collection($result['packages']),
        ], 'Customer package balance retrieved');
    }

    public function balance(Request $request, int $customerId): JsonResponse
    {
        $balance = $this->customerPackageService->balance(
            $customerId,
            $this->customerPackageService->resolveCompanyId($request)
        );

        return $this->successResponse(['balance' => $balance], 'Point balance retrieved');
    }

    public function transactions(Request $request): JsonResponse
    {
        $paginator = $this->customerPackageService->transactions($request);

        return $this->successResponse([
            'data' => CustomerPointTransactionResource::collection($paginator->items()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ], 'Point transactions retrieved');
    }

    public function purchase(Request $request): JsonResponse
    {
        $data = $request->validate($this->customerPackageService->purchaseRules());
        $package = $this->customerPackageService->purchase(
            $data,
            $this->customerPackageService->resolveCompanyId($request),
            $request
        );

        return $this->createdResponse(new CustomerPackageResource($package), 'Package purchased');
    }

    public function consume(Request $request): JsonResponse
    {
        $data = $request->validate($this->customerPackageService->consumeRules());
        $package = $this->customerPackageService->consume(
            $data,
            $this->customerPackageService->resolveCompanyId($request),
            $request
        );

        return $this->successResponse(new CustomerPackageResource($package), 'Points consumed');
    }

    public function allocate(Request $request): JsonResponse
    {
        $data = $request->validate($this->customerPackageService->allocateRules());
        $package = $this->customerPackageService->allocate(
            $data,
            $this->customerPackageService->resolveCompanyId($request),
            $request
        );

        return $this->successResponse(new CustomerPackageResource($package), 'Points allocated');
    }
}
