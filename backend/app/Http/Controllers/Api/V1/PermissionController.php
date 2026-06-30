<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\PermissionResource;
use App\Services\RoleService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class PermissionController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly RoleService $roleService
    ) {
    }

    public function index(): JsonResponse
    {
        $permissions = $this->roleService->allPermissions();

        return $this->successResponse(
            PermissionResource::collection($permissions),
            'Permissions retrieved successfully'
        );
    }
}
