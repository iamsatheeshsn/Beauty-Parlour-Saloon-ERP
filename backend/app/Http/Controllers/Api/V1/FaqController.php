<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\FaqResource;
use App\Services\FaqService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FaqController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly FaqService $faqService
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        if ($request->boolean('all')) {
            $companyId = $this->faqService->resolveCompanyId($request);

            return $this->successResponse(
                FaqResource::collection(
                    $this->faqService->listActive($companyId ?? 0)
                ),
                'FAQs retrieved'
            );
        }

        $paginator = $this->faqService->paginate($request);

        return $this->successResponse([
            'data' => FaqResource::collection($paginator->items()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ], 'FAQs retrieved');
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $faq = $this->faqService->findOrFail(
            $id,
            $this->faqService->resolveCompanyId($request)
        );

        return $this->successResponse(new FaqResource($faq), 'FAQ retrieved');
    }

    public function store(Request $request): JsonResponse
    {
        $companyId = $this->faqService->resolveCompanyId($request);
        $data = $request->validate($this->faqService->storeRules());
        $faq = $this->faqService->create($data, $companyId, $request);

        return $this->createdResponse(new FaqResource($faq), 'FAQ created');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $companyId = $this->faqService->resolveCompanyId($request);
        $data = $request->validate($this->faqService->updateRules());
        $faq = $this->faqService->update($id, $data, $companyId, $request);

        return $this->successResponse(new FaqResource($faq), 'FAQ updated');
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $companyId = $this->faqService->resolveCompanyId($request);
        $this->faqService->delete($id, $companyId, $request);

        return $this->successResponse(null, 'FAQ deleted');
    }
}
