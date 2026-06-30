<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Company;
use App\Models\Expense;
use App\Models\ExpenseCategory;
use App\Models\PaymentMethod;
use App\Models\User;
use Illuminate\Database\Seeder;

class ExpenseSeeder extends Seeder
{
    public function run(): void
    {
        $company = Company::query()->where('code', 'LUXE001')->firstOrFail();
        $branch = Branch::query()->where('company_id', $company->id)->where('code', 'HQ')->first();
        $owner = User::query()->where('email', 'owner@luxebeauty.ae')->first();
        $cash = PaymentMethod::query()->where('company_id', $company->id)->where('code', 'CASH')->first();
        $card = PaymentMethod::query()->where('company_id', $company->id)->where('code', 'CARD')->first();

        $rent = ExpenseCategory::query()->where('company_id', $company->id)->where('code', 'RENT')->first();
        $supplies = ExpenseCategory::query()->where('company_id', $company->id)->where('code', 'SUPPLIES')->first();
        $marketing = ExpenseCategory::query()->where('company_id', $company->id)->where('code', 'MARKETING')->first();
        $maint = ExpenseCategory::query()->where('company_id', $company->id)->where('code', 'MAINT')->first();

        $entries = [
            [
                'code' => 'EXP'.now()->format('Y').'-00001',
                'expense_category_id' => $rent?->id,
                'payment_method_id' => $card?->id,
                'vendor_name' => 'Dubai Marina Properties',
                'description' => 'Monthly salon rent',
                'amount' => 15000.00,
                'total_amount' => 15000.00,
                'expense_date' => now()->startOfMonth()->toDateString(),
            ],
            [
                'code' => 'EXP'.now()->format('Y').'-00002',
                'expense_category_id' => $supplies?->id,
                'payment_method_id' => $cash?->id,
                'vendor_name' => 'Beauty Supply UAE',
                'description' => 'Hair color and shampoo restock',
                'amount' => 2450.00,
                'vat_rate' => 5,
                'vat_amount' => 122.50,
                'total_amount' => 2572.50,
                'vat_inclusive' => false,
                'expense_date' => now()->subDays(5)->toDateString(),
            ],
            [
                'code' => 'EXP'.now()->format('Y').'-00003',
                'expense_category_id' => $marketing?->id,
                'payment_method_id' => $card?->id,
                'vendor_name' => 'Instagram Ads',
                'description' => 'Social media campaign',
                'amount' => 800.00,
                'total_amount' => 800.00,
                'expense_date' => now()->subDays(12)->toDateString(),
            ],
            [
                'code' => 'EXP'.now()->format('Y').'-00004',
                'expense_category_id' => $maint?->id,
                'payment_method_id' => $cash?->id,
                'vendor_name' => 'AC Services LLC',
                'description' => 'AC maintenance and filter replacement',
                'amount' => 350.00,
                'vat_rate' => 5,
                'vat_amount' => 17.50,
                'total_amount' => 367.50,
                'vat_inclusive' => false,
                'expense_date' => now()->subDays(3)->toDateString(),
            ],
            [
                'code' => 'EXP'.now()->format('Y').'-00005',
                'expense_category_id' => $supplies?->id,
                'payment_method_id' => $card?->id,
                'vendor_name' => 'Spa Essentials Trading',
                'description' => 'Disposable towels and cotton pads',
                'amount' => 420.00,
                'total_amount' => 420.00,
                'expense_date' => now()->subDays(1)->toDateString(),
            ],
        ];

        foreach ($entries as $entry) {
            if (! $entry['expense_category_id']) {
                continue;
            }

            Expense::query()->updateOrCreate(
                ['company_id' => $company->id, 'code' => $entry['code']],
                array_merge($entry, [
                    'company_id' => $company->id,
                    'branch_id' => $branch?->id,
                    'created_by' => $owner?->id,
                ])
            );
        }
    }
}
