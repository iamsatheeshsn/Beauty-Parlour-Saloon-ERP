<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\SettingResource;
use App\Services\MasterDataService;
use App\Services\SettingMasterService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingController extends MasterDataController
{
    public function __construct(
        private readonly SettingMasterService $settingMasterService
    ) {
    }

    protected function service(): MasterDataService
    {
        return $this->settingMasterService;
    }

    protected function resourceClass(): string
    {
        return SettingResource::class;
    }

    public function uploadLogo(Request $request): JsonResponse
    {
        $setting = $this->settingMasterService->uploadAppLogo($request);

        return $this->successResponse(new SettingResource($setting), 'Application logo uploaded');
    }

    public function deleteLogo(Request $request): JsonResponse
    {
        $setting = $this->settingMasterService->deleteAppLogo($request);

        return $this->successResponse(new SettingResource($setting), 'Application logo removed');
    }

    public function uploadFavicon(Request $request): JsonResponse
    {
        $setting = $this->settingMasterService->uploadAppFavicon($request);

        return $this->successResponse(new SettingResource($setting), 'Favicon uploaded');
    }

    public function deleteFavicon(Request $request): JsonResponse
    {
        $setting = $this->settingMasterService->deleteAppFavicon($request);

        return $this->successResponse(new SettingResource($setting), 'Favicon removed');
    }

    public function uploadSalonInteriorImage(Request $request): JsonResponse
    {
        $setting = $this->settingMasterService->uploadSalonInteriorImage($request);

        return $this->successResponse(new SettingResource($setting), 'Salon interior image uploaded');
    }

    public function deleteSalonInteriorImage(Request $request): JsonResponse
    {
        $setting = $this->settingMasterService->deleteSalonInteriorImage($request);

        return $this->successResponse(new SettingResource($setting), 'Salon interior image removed');
    }

    public function uploadPageBanner(Request $request, string $key): JsonResponse
    {
        $setting = $this->settingMasterService->uploadPageBanner($request, $key);

        return $this->successResponse(new SettingResource($setting), 'Page banner uploaded');
    }

    public function deletePageBanner(Request $request, string $key): JsonResponse
    {
        $setting = $this->settingMasterService->deletePageBanner($request, $key);

        return $this->successResponse(new SettingResource($setting), 'Page banner removed');
    }
}
