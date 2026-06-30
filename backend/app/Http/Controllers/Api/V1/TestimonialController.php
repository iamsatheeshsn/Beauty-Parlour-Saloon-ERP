<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\TestimonialResource;
use App\Services\TestimonialService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly TestimonialService $testimonialService
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        if ($request->boolean('all')) {
            $companyId = $this->testimonialService->resolveCompanyId($request);

            return $this->successResponse(
                TestimonialResource::collection(
                    $this->testimonialService->listActive($companyId ?? 0)
                ),
                'Testimonials retrieved'
            );
        }

        $paginator = $this->testimonialService->paginate($request);

        return $this->successResponse([
            'data' => TestimonialResource::collection($paginator->items()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ], 'Testimonials retrieved');
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $testimonial = $this->testimonialService->findOrFail(
            $id,
            $this->testimonialService->resolveCompanyId($request)
        );

        return $this->successResponse(new TestimonialResource($testimonial), 'Testimonial retrieved');
    }

    public function store(Request $request): JsonResponse
    {
        $companyId = $this->testimonialService->resolveCompanyId($request);
        $data = $request->validate($this->testimonialService->storeRules());
        $testimonial = $this->testimonialService->create($data, $companyId, $request);

        return $this->createdResponse(new TestimonialResource($testimonial), 'Testimonial created');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $companyId = $this->testimonialService->resolveCompanyId($request);
        $data = $request->validate($this->testimonialService->updateRules());
        $testimonial = $this->testimonialService->update($id, $data, $companyId, $request);

        return $this->successResponse(new TestimonialResource($testimonial), 'Testimonial updated');
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $companyId = $this->testimonialService->resolveCompanyId($request);
        $this->testimonialService->delete($id, $companyId, $request);

        return $this->successResponse(null, 'Testimonial deleted');
    }
}
