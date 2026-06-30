<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\GalleryItemResource;
use App\Services\GalleryItemService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GalleryItemController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly GalleryItemService $galleryItemService
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        if ($request->boolean('all')) {
            $companyId = $this->galleryItemService->resolveCompanyId($request);

            return $this->successResponse(
                GalleryItemResource::collection(
                    $this->galleryItemService->listActive($companyId ?? 0)
                ),
                'Gallery items retrieved'
            );
        }

        $paginator = $this->galleryItemService->paginate($request);

        return $this->successResponse([
            'data' => GalleryItemResource::collection($paginator->items()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ], 'Gallery items retrieved');
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $item = $this->galleryItemService->findOrFail(
            $id,
            $this->galleryItemService->resolveCompanyId($request)
        );

        return $this->successResponse(new GalleryItemResource($item), 'Gallery item retrieved');
    }

    public function store(Request $request): JsonResponse
    {
        $companyId = $this->galleryItemService->resolveCompanyId($request);
        $data = $request->validate($this->galleryItemService->storeRules());
        $item = $this->galleryItemService->create($data, $companyId, $request);

        return $this->createdResponse(new GalleryItemResource($item), 'Gallery item created');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $companyId = $this->galleryItemService->resolveCompanyId($request);
        $data = $request->validate($this->galleryItemService->updateRules());
        $item = $this->galleryItemService->update($id, $data, $companyId, $request);

        return $this->successResponse(new GalleryItemResource($item), 'Gallery item updated');
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $companyId = $this->galleryItemService->resolveCompanyId($request);
        $this->galleryItemService->delete($id, $companyId, $request);

        return $this->successResponse(null, 'Gallery item deleted');
    }

    public function uploadImage(Request $request, int $id): JsonResponse
    {
        $request->validate(['image' => ['required', 'image', 'max:5120']]);
        $companyId = $this->galleryItemService->resolveCompanyId($request);
        $item = $this->galleryItemService->uploadImage($id, $companyId, $request->file('image'), $request);

        return $this->successResponse(new GalleryItemResource($item), 'Gallery image uploaded');
    }

    public function deleteImage(Request $request, int $id): JsonResponse
    {
        $companyId = $this->galleryItemService->resolveCompanyId($request);
        $item = $this->galleryItemService->deleteImage($id, $companyId, $request);

        return $this->successResponse(new GalleryItemResource($item), 'Gallery image removed');
    }
}
