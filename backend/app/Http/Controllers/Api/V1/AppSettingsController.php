<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\SettingsService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AppSettingsController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly SettingsService $settingsService
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        return $this->successResponse(
            $this->settingsService->getAppSettings($request),
            'Application settings retrieved'
        );
    }
}
