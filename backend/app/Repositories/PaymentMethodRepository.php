<?php

namespace App\Repositories;

use App\Models\PaymentMethod;

class PaymentMethodRepository extends BaseMasterRepository
{
    protected function modelClass(): string
    {
        return PaymentMethod::class;
    }

    protected function searchableColumns(): array
    {
        return ['name', 'code'];
    }

    protected function companyScoped(): bool
    {
        return true;
    }
}
