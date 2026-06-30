<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\ProductCategory;
use Illuminate\Database\Seeder;

class ProductCategorySeeder extends Seeder
{
    public function run(): void
    {
        $company = Company::query()->where('code', 'LUXE001')->firstOrFail();

        $categories = [
            ['code' => 'HAIR_PROD', 'name' => 'Hair Products', 'sort_order' => 1],
            ['code' => 'SKIN_PROD', 'name' => 'Skin & Facial', 'sort_order' => 2],
            ['code' => 'NAIL_PROD', 'name' => 'Nail Products', 'sort_order' => 3],
            ['code' => 'SPA_PROD', 'name' => 'Spa & Massage', 'sort_order' => 4],
            ['code' => 'RETAIL', 'name' => 'Retail & Accessories', 'sort_order' => 5],
            ['code' => 'CONSUMABLE', 'name' => 'Salon Consumables', 'sort_order' => 6],
        ];

        foreach ($categories as $category) {
            ProductCategory::query()->updateOrCreate(
                ['company_id' => $company->id, 'code' => $category['code']],
                array_merge($category, ['company_id' => $company->id, 'is_active' => true])
            );
        }
    }
}
