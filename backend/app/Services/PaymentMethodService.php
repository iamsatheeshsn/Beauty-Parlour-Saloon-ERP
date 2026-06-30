<?php

namespace App\Services;

use App\Enums\PaymentMethodTypeEnum;
use App\Repositories\PaymentMethodRepository;
use Illuminate\Validation\Rule;

class PaymentMethodService extends MasterDataService
{
    public function __construct(PaymentMethodRepository $repository)
    {
        parent::__construct($repository);
    }

    protected function companyScoped(): bool
    {
        return true;
    }

    public function storeRules(?int $companyId = null): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'code' => [
                'required', 'string', 'max:20',
                Rule::unique('payment_methods')->where(fn ($q) => $q->where('company_id', $companyId)),
            ],
            'type' => ['required', Rule::enum(PaymentMethodTypeEnum::class)],
            'description' => ['nullable', 'string'],
            'requires_reference' => ['sometimes', 'boolean'],
            'is_active' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
        ];
    }

    public function updateRules(int $id, ?int $companyId = null): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'code' => [
                'sometimes', 'string', 'max:20',
                Rule::unique('payment_methods')->where(fn ($q) => $q->where('company_id', $companyId))->ignore($id),
            ],
            'type' => ['sometimes', Rule::enum(PaymentMethodTypeEnum::class)],
            'description' => ['nullable', 'string'],
            'requires_reference' => ['sometimes', 'boolean'],
            'is_active' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
        ];
    }
}
