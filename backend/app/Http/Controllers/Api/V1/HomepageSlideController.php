<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\HomepageSlideResource;
use App\Services\HomepageSlideService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HomepageSlideController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly HomepageSlideService $slideService
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        if ($request->boolean('all')) {
            $companyId = $this->slideService->resolveCompanyId($request);
            $slides = $this->slideService->listActive($companyId ?? 0);

            return $this->successResponse(
                HomepageSlideResource::collection($slides),
                'Homepage slides retrieved'
            );
        }

        $paginator = $this->slideService->paginate($request);

        return $this->successResponse([
            'data' => HomepageSlideResource::collection($paginator->items()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ], 'Homepage slides retrieved');
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $slide = $this->slideService->findOrFail($id, $this->slideService->resolveCompanyId($request));

        return $this->successResponse(new HomepageSlideResource($slide), 'Homepage slide retrieved');
    }

    public function store(Request $request): JsonResponse
    {
        $companyId = $this->slideService->resolveCompanyId($request);
        $data = $request->validate($this->slideService->storeRules());
        $slide = $this->slideService->create($data, $companyId, $request);

        return $this->createdResponse(new HomepageSlideResource($slide), 'Homepage slide created');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $companyId = $this->slideService->resolveCompanyId($request);
        $data = $request->validate($this->slideService->updateRules());
        $slide = $this->slideService->update($id, $data, $companyId, $request);

        return $this->successResponse(new HomepageSlideResource($slide), 'Homepage slide updated');
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $companyId = $this->slideService->resolveCompanyId($request);
        $this->slideService->delete($id, $companyId, $request);

        return $this->successResponse(null, 'Homepage slide deleted');
    }

    public function uploadImage(Request $request, int $id): JsonResponse
    {
        $request->validate(['image' => ['required', 'image', 'max:5120']]);
        $companyId = $this->slideService->resolveCompanyId($request);
        $slide = $this->slideService->uploadImage($id, $companyId, $request->file('image'), $request);

        return $this->successResponse(new HomepageSlideResource($slide), 'Slide image uploaded');
    }

    public function deleteImage(Request $request, int $id): JsonResponse
    {
        $companyId = $this->slideService->resolveCompanyId($request);
        $slide = $this->slideService->deleteImage($id, $companyId, $request);

        return $this->successResponse(new HomepageSlideResource($slide), 'Slide image removed');
    }
}
