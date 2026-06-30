<?php

namespace App\Http\Controllers\Api\V1;

use App\DTOs\Auth\LoginDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\AuthResource;
use App\Services\AuthService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly AuthService $authService
    ) {
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $dto = LoginDTO::fromArray($request->validated());
        $authResponse = $this->authService->login($dto, $request);

        return $this->successResponse(
            new AuthResource([
                'user' => $authResponse->user,
                'token' => $authResponse->token,
                'token_type' => $authResponse->tokenType,
            ]),
            'Login successful'
        );
    }

    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout($request);

        return $this->successResponse(null, 'Logout successful');
    }

    public function me(Request $request): JsonResponse
    {
        return $this->successResponse(
            $this->authService->me($request),
            'User profile retrieved'
        );
    }
}
