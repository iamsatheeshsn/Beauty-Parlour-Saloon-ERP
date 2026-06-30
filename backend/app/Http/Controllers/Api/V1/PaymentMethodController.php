<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\PaymentMethodResource;
use App\Services\MasterDataService;
use App\Services\PaymentMethodService;

class PaymentMethodController extends MasterDataController
{
    public function __construct(
        private readonly PaymentMethodService $paymentMethodService
    ) {
    }

    protected function service(): MasterDataService
    {
        return $this->paymentMethodService;
    }

    protected function resourceClass(): string
    {
        return PaymentMethodResource::class;
    }
}
