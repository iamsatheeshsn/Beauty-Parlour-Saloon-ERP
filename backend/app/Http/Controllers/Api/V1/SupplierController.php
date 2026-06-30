<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\SupplierResource;
use App\Services\MasterDataService;
use App\Services\SupplierService;

class SupplierController extends MasterDataController
{
    public function __construct(
        private readonly SupplierService $supplierService
    ) {
    }

    protected function service(): MasterDataService
    {
        return $this->supplierService;
    }

    protected function resourceClass(): string
    {
        return SupplierResource::class;
    }
}
