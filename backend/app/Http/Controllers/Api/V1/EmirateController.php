<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\EmirateResource;
use App\Services\EmirateService;
use App\Services\MasterDataService;

class EmirateController extends MasterDataController
{
    public function __construct(
        private readonly EmirateService $emirateService
    ) {
    }

    protected function service(): MasterDataService
    {
        return $this->emirateService;
    }

    protected function resourceClass(): string
    {
        return EmirateResource::class;
    }
}
