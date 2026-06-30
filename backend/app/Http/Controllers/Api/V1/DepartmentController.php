<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\DepartmentResource;
use App\Services\DepartmentService;
use App\Services\MasterDataService;

class DepartmentController extends MasterDataController
{
    public function __construct(
        private readonly DepartmentService $departmentService
    ) {
    }

    protected function service(): MasterDataService
    {
        return $this->departmentService;
    }

    protected function resourceClass(): string
    {
        return DepartmentResource::class;
    }
}
