<?php

namespace App\Services;

use App\DTOs\Auth\AuthResponseDTO;
use App\DTOs\Auth\LoginDTO;
use App\Enums\ActivityActionEnum;
use App\Exceptions\AuthenticationException;
use App\Exceptions\UnauthorizedException;
use App\Http\Resources\UserResource;
use App\Interfaces\UserRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthService
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository,
        private readonly ActivityLogService $activityLogService
    ) {
    }

    public function login(LoginDTO $dto, Request $request): AuthResponseDTO
    {
        $user = $this->userRepository->findByEmail($dto->email);

        if (! $user || ! Hash::check($dto->password, $user->password)) {
            throw new AuthenticationException('Invalid email or password.');
        }

        if (! $user->is_active) {
            throw new UnauthorizedException('Your account has been deactivated.');
        }

        $deviceName = $dto->deviceName ?? 'web';
        $token = $user->createToken($deviceName)->plainTextToken;

        $this->userRepository->updateLastLogin($user);

        $this->activityLogService->log(
            action: ActivityActionEnum::Login,
            userId: $user->id,
            subject: $user,
            description: "User {$user->name} logged in",
            request: $request
        );

        return new AuthResponseDTO($user, $token);
    }

    public function logout(Request $request): void
    {
        $user = $request->user();

        if ($user) {
            $this->activityLogService->log(
                action: ActivityActionEnum::Logout,
                userId: $user->id,
                subject: $user,
                description: "User {$user->name} logged out",
                request: $request
            );

            $request->user()->currentAccessToken()?->delete();
        }
    }

    public function me(Request $request): array
    {
        $user = $request->user();
        $user->load('roles', 'permissions');

        return (new UserResource($user))->resolve();
    }
}
