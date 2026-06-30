<?php

namespace Database\Seeders;

use App\Enums\PaymentMethodTypeEnum;
use App\Models\Company;
use App\Models\PaymentMethod;
use Illuminate\Database\Seeder;

class PaymentMethodSeeder extends Seeder
{
    public function run(): void
    {
        $company = Company::query()->where('code', 'LUXE001')->firstOrFail();

        $methods = [
            ['code' => 'CASH', 'name' => 'Cash', 'type' => PaymentMethodTypeEnum::Cash, 'requires_reference' => false, 'sort_order' => 1],
            ['code' => 'CARD', 'name' => 'Credit / Debit Card', 'type' => PaymentMethodTypeEnum::Card, 'requires_reference' => true, 'sort_order' => 2],
            ['code' => 'BANK', 'name' => 'Bank Transfer', 'type' => PaymentMethodTypeEnum::BankTransfer, 'requires_reference' => true, 'sort_order' => 3],
            ['code' => 'ONLINE', 'name' => 'Online Payment', 'type' => PaymentMethodTypeEnum::Online, 'requires_reference' => true, 'sort_order' => 4],
            ['code' => 'APPLE_PAY', 'name' => 'Apple Pay', 'type' => PaymentMethodTypeEnum::Wallet, 'requires_reference' => false, 'sort_order' => 5],
            ['code' => 'TABBY', 'name' => 'Tabby (BNPL)', 'type' => PaymentMethodTypeEnum::Online, 'requires_reference' => true, 'sort_order' => 6],
            ['code' => 'CHEQUE', 'name' => 'Cheque', 'type' => PaymentMethodTypeEnum::Cheque, 'requires_reference' => true, 'sort_order' => 7],
        ];

        foreach ($methods as $method) {
            PaymentMethod::query()->updateOrCreate(
                ['company_id' => $company->id, 'code' => $method['code']],
                array_merge($method, [
                    'company_id' => $company->id,
                    'type' => $method['type']->value,
                    'is_active' => true,
                ])
            );
        }
    }
}
