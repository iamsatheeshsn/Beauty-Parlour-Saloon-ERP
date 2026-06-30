<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\CityResource;
use App\Services\CityService;
use App\Services\MasterDataService;

class CityController extends MasterDataController
{
    public function __construct(
        private readonly CityService $cityService
    ) {
    }

    protected function service(): MasterDataService
    {
        return $this->cityService;
    }

    protected function resourceClass(): string
    {
        return CityResource::class;
    }
}
