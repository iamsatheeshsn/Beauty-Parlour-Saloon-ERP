<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\BrandResource;
use App\Services\BrandService;
use App\Services\MasterDataService;

class BrandController extends MasterDataController
{
    public function __construct(
        private readonly BrandService $brandService
    ) {
    }

    protected function service(): MasterDataService
    {
        return $this->brandService;
    }

    protected function resourceClass(): string
    {
        return BrandResource::class;
    }
}
