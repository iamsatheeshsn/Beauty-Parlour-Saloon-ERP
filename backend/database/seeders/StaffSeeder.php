<?php

namespace Database\Seeders;

use App\Enums\AttendanceStatusEnum;
use App\Enums\CommissionRateTypeEnum;
use App\Enums\EmploymentTypeEnum;
use App\Enums\GenderEnum;
use App\Enums\LeaveStatusEnum;
use App\Enums\LeaveTypeEnum;
use App\Enums\StaffDocumentTypeEnum;
use App\Models\Company;
use App\Models\ServiceCategory;
use App\Models\StaffAttendance;
use App\Models\StaffCommissionRule;
use App\Models\StaffDocument;
use App\Models\StaffLeaveRequest;
use App\Models\StaffSalary;
use App\Models\User;
use Illuminate\Database\Seeder;

class StaffSeeder extends Seeder
{
    public function run(): void
    {
        $company = Company::query()->where('code', 'LUXE001')->firstOrFail();
        $hairCategory = ServiceCategory::query()->where('company_id', $company->id)->where('code', 'HAIR')->first();
        $skinCategory = ServiceCategory::query()->where('company_id', $company->id)->where('code', 'SKIN')->first();

        $profiles = [
            'owner@luxebeauty.ae' => [
                'gender' => GenderEnum::Female->value,
                'nationality' => 'UAE',
                'joining_date' => '2018-01-15',
                'employment_type' => EmploymentTypeEnum::FullTime->value,
                'emirates_id' => '784-1985-1234567-1',
                'address' => 'Dubai Marina, UAE',
                'emergency_contact_name' => 'Ahmed Al Mansoori',
                'emergency_contact_phone' => '+971501112233',
            ],
            'admin@luxebeauty.ae' => [
                'gender' => GenderEnum::Male->value,
                'nationality' => 'India',
                'joining_date' => '2019-06-01',
                'employment_type' => EmploymentTypeEnum::FullTime->value,
                'visa_number' => 'VISA-2019-45678',
                'visa_expiry' => now()->addMonths(8)->format('Y-m-d'),
                'address' => 'Business Bay, Dubai',
            ],
            'reception@luxebeauty.ae' => [
                'gender' => GenderEnum::Female->value,
                'nationality' => 'Philippines',
                'joining_date' => '2021-03-10',
                'employment_type' => EmploymentTypeEnum::FullTime->value,
                'visa_number' => 'VISA-2021-78901',
                'visa_expiry' => now()->addMonths(14)->format('Y-m-d'),
            ],
            'staff@luxebeauty.ae' => [
                'gender' => GenderEnum::Female->value,
                'nationality' => 'Lebanon',
                'joining_date' => '2020-09-01',
                'employment_type' => EmploymentTypeEnum::FullTime->value,
                'visa_number' => 'VISA-2020-34567',
                'visa_expiry' => now()->addDays(45)->format('Y-m-d'),
                'staff_notes' => 'Senior stylist — specialises in colour and bridal makeup.',
            ],
        ];

        foreach ($profiles as $email => $profile) {
            $user = User::query()->where('email', $email)->first();
            if (! $user) {
                continue;
            }

            $user->update($profile);
            $this->seedHrData($user, $company->id, $hairCategory?->id, $skinCategory?->id);
        }
    }

    protected function seedHrData(User $user, int $companyId, ?int $hairCategoryId, ?int $skinCategoryId): void
    {
        $user->staffDocuments()->delete();
        $user->staffSalaries()->delete();
        $user->staffAttendance()->delete();
        $user->staffLeaveRequests()->delete();
        $user->staffCommissionRules()->delete();

        StaffDocument::query()->create([
            'company_id' => $companyId,
            'user_id' => $user->id,
            'document_type' => StaffDocumentTypeEnum::Passport->value,
            'title' => 'Passport Copy',
            'document_number' => 'P'.str_pad((string) $user->id, 7, '0', STR_PAD_LEFT),
            'issue_date' => now()->subYears(5),
            'expiry_date' => now()->addYears(3),
        ]);

        if ($user->visa_number) {
            StaffDocument::query()->create([
                'company_id' => $companyId,
                'user_id' => $user->id,
                'document_type' => StaffDocumentTypeEnum::Visa->value,
                'title' => 'Residence Visa',
                'document_number' => $user->visa_number,
                'expiry_date' => $user->visa_expiry,
            ]);
        }

        $baseSalary = match ($user->employee_code) {
            'EMP001' => 25000,
            'EMP002' => 18000,
            'EMP003' => 8000,
            default => 12000,
        };

        StaffSalary::query()->create([
            'company_id' => $companyId,
            'user_id' => $user->id,
            'base_salary' => $baseSalary,
            'housing_allowance' => $baseSalary * 0.25,
            'transport_allowance' => 500,
            'currency' => 'AED',
            'effective_from' => $user->joining_date ?? now()->subYear(),
        ]);

        for ($i = 0; $i < 10; $i++) {
            $date = now()->subWeekdays($i);
            if ($date->isWeekend()) {
                continue;
            }

            StaffAttendance::query()->create([
                'company_id' => $companyId,
                'user_id' => $user->id,
                'branch_id' => $user->branch_id,
                'attendance_date' => $date->format('Y-m-d'),
                'check_in' => '09:00',
                'check_out' => '18:00',
                'status' => $i === 2 ? AttendanceStatusEnum::Late->value : AttendanceStatusEnum::Present->value,
                'recorded_by' => $user->id,
            ]);
        }

        if ($user->employee_code === 'EMP004') {
            StaffLeaveRequest::query()->create([
                'company_id' => $companyId,
                'user_id' => $user->id,
                'leave_type' => LeaveTypeEnum::Annual->value,
                'start_date' => now()->addDays(30),
                'end_date' => now()->addDays(34),
                'days' => 5,
                'status' => LeaveStatusEnum::Pending->value,
                'reason' => 'Family visit home country',
            ]);

            if ($hairCategoryId) {
                StaffCommissionRule::query()->create([
                    'company_id' => $companyId,
                    'user_id' => $user->id,
                    'service_category_id' => $hairCategoryId,
                    'name' => 'Hair Services Commission',
                    'rate_type' => CommissionRateTypeEnum::Percentage->value,
                    'rate_value' => 15,
                    'is_active' => true,
                ]);
            }

            if ($skinCategoryId) {
                StaffCommissionRule::query()->create([
                    'company_id' => $companyId,
                    'user_id' => $user->id,
                    'service_category_id' => $skinCategoryId,
                    'name' => 'Facial Commission',
                    'rate_type' => CommissionRateTypeEnum::Percentage->value,
                    'rate_value' => 10,
                    'is_active' => true,
                ]);
            }
        }
    }
}
