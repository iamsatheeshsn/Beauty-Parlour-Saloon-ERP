<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Department;
use App\Models\StaffDesignation;
use Illuminate\Database\Seeder;

class StaffDesignationSeeder extends Seeder
{
    public function run(): void
    {
        $company = Company::query()->where('code', 'LUXE001')->firstOrFail();

        $designations = [
            ['code' => 'OWNER', 'name' => 'Salon Owner', 'department' => 'ADMIN', 'level' => 5],
            ['code' => 'MGR', 'name' => 'Branch Manager', 'department' => 'ADMIN', 'level' => 4],
            ['code' => 'RECEP', 'name' => 'Receptionist', 'department' => 'ADMIN', 'level' => 2],
            ['code' => 'SR_STY', 'name' => 'Senior Stylist', 'department' => 'HAIR', 'level' => 4],
            ['code' => 'STY', 'name' => 'Hair Stylist', 'department' => 'HAIR', 'level' => 3],
            ['code' => 'JR_STY', 'name' => 'Junior Stylist', 'department' => 'HAIR', 'level' => 1],
            ['code' => 'NAIL_TECH', 'name' => 'Nail Technician', 'department' => 'NAILS', 'level' => 3],
            ['code' => 'ESTH', 'name' => 'Esthetician', 'department' => 'SKIN', 'level' => 3],
            ['code' => 'THER', 'name' => 'Spa Therapist', 'department' => 'SPA', 'level' => 3],
            ['code' => 'MU_ART', 'name' => 'Makeup Artist', 'department' => 'MAKEUP', 'level' => 3],
        ];

        foreach ($designations as $item) {
            $department = Department::query()
                ->where('company_id', $company->id)
                ->where('code', $item['department'])
                ->first();

            StaffDesignation::query()->updateOrCreate(
                ['company_id' => $company->id, 'code' => $item['code']],
                [
                    'company_id' => $company->id,
                    'department_id' => $department?->id,
                    'name' => $item['name'],
                    'level' => $item['level'],
                    'is_active' => true,
                    'sort_order' => $item['level'],
                ]
            );
        }
    }
}
