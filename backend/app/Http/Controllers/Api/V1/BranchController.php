<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\BranchResource;
use App\Services\BranchService;
use App\Services\MasterDataService;

class BranchController extends MasterDataController
{
    public function __construct(
        private readonly BranchService $branchService
    ) {
    }

    protected function service(): MasterDataService
    {
        return $this->branchService;
    }

    protected function resourceClass(): string
    {
        return BranchResource::class;
    }
}
