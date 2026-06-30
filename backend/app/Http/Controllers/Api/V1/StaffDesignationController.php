<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\StaffDesignationResource;
use App\Services\MasterDataService;
use App\Services\StaffDesignationService;

class StaffDesignationController extends MasterDataController
{
    public function __construct(
        private readonly StaffDesignationService $staffDesignationService
    ) {
    }

    protected function service(): MasterDataService
    {
        return $this->staffDesignationService;
    }

    protected function resourceClass(): string
    {
        return StaffDesignationResource::class;
    }
}
