<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\MasterDataController as BaseMasterDataController;
use App\Http\Resources\CustomerResource;
use App\Services\CustomerService;
use App\Services\MasterDataService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerController extends BaseMasterDataController
{
    use ApiResponse;

    public function __construct(
        private readonly CustomerService $customerService
    ) {
    }

    protected function service(): MasterDataService
    {
        return $this->customerService;
    }

    protected function resourceClass(): string
    {
        return CustomerResource::class;
    }

    public function searchByPhone(Request $request): JsonResponse
    {
        $request->validate(['phone' => ['required', 'string', 'min:7', 'max:30']]);

        $customer = $this->customerService->findByPhone(
            $request->input('phone'),
            $this->customerService->resolveCompanyId($request)
        );

        if (! $customer) {
            return $this->successResponse([
                'found' => false,
                'customer' => null,
            ], 'No customer found with this mobile number');
        }

        $customer->load(['branch', 'emirate', 'city']);

        return $this->successResponse([
            'found' => true,
            'customer' => new CustomerResource($customer),
        ], 'Customer found');
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $customer = $this->customerService->findWithHistory(
            $id,
            $this->customerService->resolveCompanyId($request)
        );

        return $this->successResponse(
            new CustomerResource($customer),
            'Customer retrieved successfully'
        );
    }

    public function uploadPhoto(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'photo' => ['required', 'image', 'max:2048'],
        ]);

        $customer = $this->customerService->uploadPhoto(
            $id,
            $this->customerService->resolveCompanyId($request),
            $request->file('photo'),
            $request
        );

        return $this->successResponse(new CustomerResource($customer), 'Photo uploaded successfully');
    }

    public function deletePhoto(Request $request, int $id): JsonResponse
    {
        $customer = $this->customerService->deletePhoto(
            $id,
            $this->customerService->resolveCompanyId($request),
            $request
        );

        return $this->successResponse(new CustomerResource($customer), 'Photo removed successfully');
    }

    public function history(Request $request, int $id): JsonResponse
    {
        $customer = $this->customerService->findWithHistory(
            $id,
            $this->customerService->resolveCompanyId($request)
        );

        $timeline = collect()
            ->merge($customer->visits->map(fn ($v) => [
                'type' => 'visit',
                'id' => $v->id,
                'title' => $v->purpose ?? 'Salon visit',
                'description' => $v->services_summary ?? $v->notes,
                'amount_spent' => $v->amount_spent,
                'occurred_at' => $v->visited_at?->toIso8601String(),
            ]))
            ->merge($customer->notes->map(fn ($n) => [
                'type' => 'note',
                'id' => $n->id,
                'title' => 'Staff note',
                'description' => $n->note,
                'author' => $n->user?->name,
                'occurred_at' => $n->created_at?->toIso8601String(),
            ]))
            ->sortByDesc('occurred_at')
            ->values();

        return $this->successResponse([
            'customer' => new CustomerResource($customer),
            'timeline' => $timeline,
        ], 'Customer history retrieved');
    }
}
