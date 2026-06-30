<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\ServiceCategoryResource;
use App\Services\MasterDataService;
use App\Services\ServiceCategoryService;

class ServiceCategoryController extends MasterDataController
{
    public function __construct(
        private readonly ServiceCategoryService $serviceCategoryService
    ) {
    }

    protected function service(): MasterDataService
    {
        return $this->serviceCategoryService;
    }

    protected function resourceClass(): string
    {
        return ServiceCategoryResource::class;
    }
}
