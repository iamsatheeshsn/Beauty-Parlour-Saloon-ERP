<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\CountryResource;
use App\Services\CountryService;
use App\Services\MasterDataService;

class CountryController extends MasterDataController
{
    public function __construct(
        private readonly CountryService $countryService
    ) {
    }

    protected function service(): MasterDataService
    {
        return $this->countryService;
    }

    protected function resourceClass(): string
    {
        return CountryResource::class;
    }
}
