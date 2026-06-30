<?php

namespace Database\Seeders;

use App\Enums\RoleEnum;
use App\Models\Branch;
use App\Models\Company;
use App\Models\Department;
use App\Models\StaffDesignation;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RolesSeeder::class,
            PermissionSeeder::class,
            CountrySeeder::class,
            EmiratesSeeder::class,
            CitySeeder::class,
            CompanySeeder::class,
            BranchSeeder::class,
            DepartmentSeeder::class,
            StaffDesignationSeeder::class,
            ExpenseCategorySeeder::class,
            PaymentMethodSeeder::class,
            ServiceCategorySeeder::class,
            SettingsSeeder::class,
            CustomerSeeder::class,
            StaffSeeder::class,
            SalonServiceSeeder::class,
            AppointmentSeeder::class,
            ServicePackageSeeder::class,
            ProductCategorySeeder::class,
            BrandSeeder::class,
            SupplierSeeder::class,
            ProductSeeder::class,
            InventorySeeder::class,
            ExpenseSeeder::class,
            SaleSampleSeeder::class,
            BlogPostSeeder::class,
            HomepageSlideSeeder::class,
            TestimonialSeeder::class,
            GalleryItemSeeder::class,
            FaqSeeder::class,
            WebsiteAssetsSeeder::class,
        ]);

        $company = Company::query()->where('code', 'LUXE001')->firstOrFail();
        $headOffice = Branch::query()->where('company_id', $company->id)->where('code', 'HQ')->first();
        $adminDept = Department::query()->where('company_id', $company->id)->where('code', 'ADMIN')->first();
        $hairDept = Department::query()->where('company_id', $company->id)->where('code', 'HAIR')->first();

        $ownerDesignation = StaffDesignation::query()->where('company_id', $company->id)->where('code', 'OWNER')->first();
        $mgrDesignation = StaffDesignation::query()->where('company_id', $company->id)->where('code', 'MGR')->first();
        $recepDesignation = StaffDesignation::query()->where('company_id', $company->id)->where('code', 'RECEP')->first();
        $stylistDesignation = StaffDesignation::query()->where('company_id', $company->id)->where('code', 'STY')->first();

        $owner = User::query()->updateOrCreate(
            ['email' => 'owner@luxebeauty.ae'],
            [
                'company_id' => $company->id,
                'branch_id' => $headOffice?->id,
                'department_id' => $adminDept?->id,
                'staff_designation_id' => $ownerDesignation?->id,
                'employee_code' => 'EMP001',
                'name' => 'Salon Owner',
                'phone' => '+971 50 123 4567',
                'password' => Hash::make('password'),
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );
        $owner->assignRole(RoleEnum::Owner->value);

        $admin = User::query()->updateOrCreate(
            ['email' => 'admin@luxebeauty.ae'],
            [
                'company_id' => $company->id,
                'branch_id' => $headOffice?->id,
                'department_id' => $adminDept?->id,
                'staff_designation_id' => $mgrDesignation?->id,
                'employee_code' => 'EMP002',
                'name' => 'System Admin',
                'phone' => '+971 50 234 5678',
                'password' => Hash::make('password'),
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );
        $admin->assignRole(RoleEnum::Admin->value);

        $receptionist = User::query()->updateOrCreate(
            ['email' => 'reception@luxebeauty.ae'],
            [
                'company_id' => $company->id,
                'branch_id' => $headOffice?->id,
                'department_id' => $adminDept?->id,
                'staff_designation_id' => $recepDesignation?->id,
                'employee_code' => 'EMP003',
                'name' => 'Front Desk',
                'phone' => '+971 50 345 6789',
                'password' => Hash::make('password'),
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );
        $receptionist->assignRole(RoleEnum::Receptionist->value);

        $staff = User::query()->updateOrCreate(
            ['email' => 'staff@luxebeauty.ae'],
            [
                'company_id' => $company->id,
                'branch_id' => $headOffice?->id,
                'department_id' => $hairDept?->id,
                'staff_designation_id' => $stylistDesignation?->id,
                'employee_code' => 'EMP004',
                'name' => 'Beauty Specialist',
                'phone' => '+971 50 456 7890',
                'password' => Hash::make('password'),
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );
        $staff->assignRole(RoleEnum::Staff->value);

        $this->call(AdditionalStaffSeeder::class);
    }
}
