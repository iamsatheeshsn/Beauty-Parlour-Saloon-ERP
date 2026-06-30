<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\ExpenseCategoryResource;
use App\Services\ExpenseCategoryService;
use App\Services\MasterDataService;

class ExpenseCategoryController extends MasterDataController
{
    public function __construct(
        private readonly ExpenseCategoryService $expenseCategoryService
    ) {
    }

    protected function service(): MasterDataService
    {
        return $this->expenseCategoryService;
    }

    protected function resourceClass(): string
    {
        return ExpenseCategoryResource::class;
    }
}
