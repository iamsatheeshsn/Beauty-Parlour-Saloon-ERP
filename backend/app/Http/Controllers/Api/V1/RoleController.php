<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\RoleResource;
use App\Services\RoleService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly RoleService $roleService
    ) {
    }

    public function index(): JsonResponse
    {
        $roles = $this->roleService->all();

        return $this->successResponse(
            RoleResource::collection($roles),
            'Roles retrieved successfully'
        );
    }

    public function show(int $id): JsonResponse
    {
        $role = $this->roleService->findOrFail($id);

        return $this->successResponse(new RoleResource($role), 'Role retrieved successfully');
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate($this->roleService->storeRules());
        $role = $this->roleService->create($data, $request);

        return $this->createdResponse(new RoleResource($role), 'Role created successfully');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $data = $request->validate($this->roleService->updateRules($id));
        $role = $this->roleService->update($id, $data, $request);

        return $this->successResponse(new RoleResource($role), 'Role updated successfully');
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $this->roleService->delete($id, $request);

        return $this->successResponse(null, 'Role deleted successfully');
    }
}
