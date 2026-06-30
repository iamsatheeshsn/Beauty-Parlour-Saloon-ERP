<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\ProductCategoryResource;
use App\Services\MasterDataService;
use App\Services\ProductCategoryService;

class ProductCategoryController extends MasterDataController
{
    public function __construct(
        private readonly ProductCategoryService $productCategoryService
    ) {
    }

    protected function service(): MasterDataService
    {
        return $this->productCategoryService;
    }

    protected function resourceClass(): string
    {
        return ProductCategoryResource::class;
    }
}
