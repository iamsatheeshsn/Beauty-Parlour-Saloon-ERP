<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Department;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        $company = Company::query()->where('code', 'LUXE001')->firstOrFail();

        $departments = [
            ['code' => 'HAIR', 'name' => 'Hair Services', 'description' => 'Cutting, coloring, styling', 'sort_order' => 1],
            ['code' => 'NAILS', 'name' => 'Nail Services', 'description' => 'Manicure, pedicure, nail art', 'sort_order' => 2],
            ['code' => 'SKIN', 'name' => 'Skin & Facial', 'description' => 'Facials, skincare treatments', 'sort_order' => 3],
            ['code' => 'SPA', 'name' => 'Spa & Wellness', 'description' => 'Massage, body treatments', 'sort_order' => 4],
            ['code' => 'MAKEUP', 'name' => 'Makeup & Bridal', 'description' => 'Makeup, bridal packages', 'sort_order' => 5],
            ['code' => 'ADMIN', 'name' => 'Administration', 'description' => 'Front desk and management', 'sort_order' => 6],
        ];

        foreach ($departments as $department) {
            Department::query()->updateOrCreate(
                ['company_id' => $company->id, 'code' => $department['code']],
                array_merge($department, ['company_id' => $company->id, 'is_active' => true])
            );
        }
    }
}
