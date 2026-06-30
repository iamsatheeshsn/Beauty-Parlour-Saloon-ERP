<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Services\UserService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly UserService $userService
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        $paginator = $this->userService->paginate($request);

        return $this->successResponse([
            'data' => UserResource::collection($paginator->items()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ], 'Users retrieved successfully');
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $user = $this->userService->findOrFail($id, $request->user()?->company_id);

        return $this->successResponse(new UserResource($user), 'User retrieved successfully');
    }

    public function store(Request $request): JsonResponse
    {
        $companyId = $request->user()?->company_id;
        $data = $request->validate($this->userService->storeRules($companyId));
        $user = $this->userService->create($data, $companyId, $request);

        return $this->createdResponse(new UserResource($user), 'User created successfully');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $companyId = $request->user()?->company_id;
        $data = $request->validate($this->userService->updateRules($id, $companyId));
        $user = $this->userService->update($id, $data, $companyId, $request);

        return $this->successResponse(new UserResource($user), 'User updated successfully');
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $this->userService->delete($id, $request->user()?->company_id, $request);

        return $this->successResponse(null, 'User deleted successfully');
    }
}
