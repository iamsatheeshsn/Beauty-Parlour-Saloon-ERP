<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Company;
use Illuminate\Database\Seeder;

class BrandSeeder extends Seeder
{
    public function run(): void
    {
        $company = Company::query()->where('code', 'LUXE001')->firstOrFail();

        $brands = [
            ['code' => 'LOREAL', 'name' => "L'Oréal Professionnel", 'sort_order' => 1],
            ['code' => 'WELLA', 'name' => 'Wella Professionals', 'sort_order' => 2],
            ['code' => 'OLAPLEX', 'name' => 'Olaplex', 'sort_order' => 3],
            ['code' => 'DERMALOG', 'name' => 'Dermalogica', 'sort_order' => 4],
            ['code' => 'OPI', 'name' => 'OPI', 'sort_order' => 5],
            ['code' => 'GENERIC', 'name' => 'House Brand', 'sort_order' => 6],
        ];

        foreach ($brands as $brand) {
            Brand::query()->updateOrCreate(
                ['company_id' => $company->id, 'code' => $brand['code']],
                array_merge($brand, ['company_id' => $company->id, 'is_active' => true])
            );
        }
    }
}
