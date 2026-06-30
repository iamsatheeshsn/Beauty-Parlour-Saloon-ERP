<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\ServiceCategory;
use Illuminate\Database\Seeder;

class ServiceCategorySeeder extends Seeder
{
    public function run(): void
    {
        $company = Company::query()->where('code', 'LUXE001')->firstOrFail();

        $categories = [
            ['code' => 'HAIR', 'name' => 'Hair Services', 'color' => '#7A2E3E', 'icon' => 'scissors', 'sort_order' => 1],
            ['code' => 'NAILS', 'name' => 'Nail Services', 'color' => '#B76E79', 'icon' => 'sparkles', 'sort_order' => 2],
            ['code' => 'SKIN', 'name' => 'Facial & Skin', 'color' => '#C9A46C', 'icon' => 'flower', 'sort_order' => 3],
            ['code' => 'SPA', 'name' => 'Spa & Massage', 'color' => '#5C2230', 'icon' => 'heart', 'sort_order' => 4],
            ['code' => 'MAKEUP', 'name' => 'Makeup & Bridal', 'color' => '#9B3D52', 'icon' => 'palette', 'sort_order' => 5],
            ['code' => 'WAX', 'name' => 'Waxing & Threading', 'color' => '#6B5B57', 'icon' => 'star', 'sort_order' => 6],
            ['code' => 'PACKAGES', 'name' => 'Packages & Combos', 'color' => '#D4A574', 'icon' => 'gift', 'sort_order' => 7],
        ];

        foreach ($categories as $category) {
            ServiceCategory::query()->updateOrCreate(
                ['company_id' => $company->id, 'code' => $category['code']],
                array_merge($category, ['company_id' => $company->id, 'is_active' => true])
            );
        }

        $hair = ServiceCategory::query()
            ->where('company_id', $company->id)
            ->where('code', 'HAIR')
            ->first();

        if ($hair) {
            $subServices = [
                ['code' => 'HAIR_CUT', 'name' => 'Haircut & Styling'],
                ['code' => 'HAIR_COLOR', 'name' => 'Hair Coloring'],
                ['code' => 'HAIR_TREAT', 'name' => 'Hair Treatments'],
            ];

            foreach ($subServices as $index => $sub) {
                ServiceCategory::query()->updateOrCreate(
                    ['company_id' => $company->id, 'code' => $sub['code']],
                    [
                        'company_id' => $company->id,
                        'parent_id' => $hair->id,
                        'name' => $sub['name'],
                        'is_active' => true,
                        'sort_order' => $index + 1,
                    ]
                );
            }
        }
    }
}
