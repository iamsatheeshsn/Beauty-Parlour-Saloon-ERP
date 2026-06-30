<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\ExpenseCategory;
use Illuminate\Database\Seeder;

class ExpenseCategorySeeder extends Seeder
{
    public function run(): void
    {
        $company = Company::query()->where('code', 'LUXE001')->firstOrFail();

        $categories = [
            ['code' => 'RENT', 'name' => 'Rent & Utilities', 'sort_order' => 1],
            ['code' => 'SALARY', 'name' => 'Salaries & Wages', 'sort_order' => 2],
            ['code' => 'SUPPLIES', 'name' => 'Salon Supplies', 'sort_order' => 3],
            ['code' => 'PRODUCTS', 'name' => 'Retail Products', 'sort_order' => 4],
            ['code' => 'MARKETING', 'name' => 'Marketing & Advertising', 'sort_order' => 5],
            ['code' => 'MAINT', 'name' => 'Maintenance & Repairs', 'sort_order' => 6],
            ['code' => 'INSURANCE', 'name' => 'Insurance', 'sort_order' => 7],
            ['code' => 'MISC', 'name' => 'Miscellaneous', 'sort_order' => 8],
        ];

        foreach ($categories as $category) {
            ExpenseCategory::query()->updateOrCreate(
                ['company_id' => $company->id, 'code' => $category['code']],
                array_merge($category, ['company_id' => $company->id, 'is_active' => true])
            );
        }

        $supplies = ExpenseCategory::query()
            ->where('company_id', $company->id)
            ->where('code', 'SUPPLIES')
            ->first();

        if ($supplies) {
            $subCategories = [
                ['code' => 'HAIR_PROD', 'name' => 'Hair Products'],
                ['code' => 'NAIL_PROD', 'name' => 'Nail Products'],
                ['code' => 'SKIN_PROD', 'name' => 'Skincare Products'],
            ];

            foreach ($subCategories as $index => $sub) {
                ExpenseCategory::query()->updateOrCreate(
                    ['company_id' => $company->id, 'code' => $sub['code']],
                    [
                        'company_id' => $company->id,
                        'parent_id' => $supplies->id,
                        'name' => $sub['name'],
                        'is_active' => true,
                        'sort_order' => $index + 1,
                    ]
                );
            }
        }
    }
}
