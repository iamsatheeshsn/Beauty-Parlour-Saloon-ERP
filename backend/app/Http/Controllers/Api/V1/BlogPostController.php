<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\BlogPostResource;
use App\Services\BlogPostService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BlogPostController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly BlogPostService $blogPostService
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        $paginator = $this->blogPostService->paginate($request);

        return $this->successResponse([
            'data' => BlogPostResource::collection($paginator->items()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ], 'Blog posts retrieved');
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $post = $this->blogPostService->findOrFail(
            $id,
            $this->blogPostService->resolveCompanyId($request)
        );

        return $this->successResponse(new BlogPostResource($post), 'Blog post retrieved');
    }

    public function store(Request $request): JsonResponse
    {
        $companyId = $this->blogPostService->resolveCompanyId($request);
        $data = $request->validate($this->blogPostService->storeRules($companyId));
        $post = $this->blogPostService->create($data, $companyId, $request);

        return $this->createdResponse(new BlogPostResource($post), 'Blog post created');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $companyId = $this->blogPostService->resolveCompanyId($request);
        $data = $request->validate($this->blogPostService->updateRules($id));
        $post = $this->blogPostService->update($id, $data, $companyId, $request);

        return $this->successResponse(new BlogPostResource($post), 'Blog post updated');
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $companyId = $this->blogPostService->resolveCompanyId($request);
        $this->blogPostService->delete($id, $companyId, $request);

        return $this->successResponse(null, 'Blog post deleted');
    }

    public function uploadFeaturedImage(Request $request, int $id): JsonResponse
    {
        $request->validate(['image' => ['required', 'image', 'max:5120']]);
        $companyId = $this->blogPostService->resolveCompanyId($request);
        $post = $this->blogPostService->uploadFeaturedImage($id, $companyId, $request->file('image'), $request);

        return $this->successResponse(new BlogPostResource($post), 'Featured image uploaded');
    }

    public function deleteFeaturedImage(Request $request, int $id): JsonResponse
    {
        $companyId = $this->blogPostService->resolveCompanyId($request);
        $post = $this->blogPostService->deleteFeaturedImage($id, $companyId, $request);

        return $this->successResponse(new BlogPostResource($post), 'Featured image removed');
    }
}
