<?php

namespace Database\Seeders;

use App\Enums\EmploymentTypeEnum;
use App\Enums\GenderEnum;
use App\Enums\RoleEnum;
use App\Models\Branch;
use App\Models\Company;
use App\Models\Department;
use App\Models\Setting;
use App\Models\StaffDesignation;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdditionalStaffSeeder extends Seeder
{
    public function run(): void
    {
        $company = Company::query()->where('code', 'LUXE001')->first();

        if (! $company) {
            return;
        }

        $branch = Branch::query()
            ->where('company_id', $company->id)
            ->where('code', 'HQ')
            ->first();

        $departments = Department::query()
            ->where('company_id', $company->id)
            ->get()
            ->keyBy('code');

        $designations = StaffDesignation::query()
            ->where('company_id', $company->id)
            ->get()
            ->keyBy('code');

        $staffMembers = [
            [
                'email' => 'layla.mansour@luxebeauty.ae',
                'employee_code' => 'EMP005',
                'name' => 'Layla Mansour',
                'phone' => '+971 50 567 8901',
                'department' => 'HAIR',
                'designation' => 'SR_STY',
                'gender' => GenderEnum::Female->value,
                'nationality' => 'Lebanon',
                'joining_date' => '2019-04-12',
                'avatar' => 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=600&q=80',
                'staff_notes' => 'Senior colourist specialising in balayage and bridal hair.',
            ],
            [
                'email' => 'sarah.almazrouei@luxebeauty.ae',
                'employee_code' => 'EMP006',
                'name' => 'Sarah Al Mazrouei',
                'phone' => '+971 50 678 9012',
                'department' => 'HAIR',
                'designation' => 'STY',
                'gender' => GenderEnum::Female->value,
                'nationality' => 'UAE',
                'joining_date' => '2021-08-20',
                'avatar' => 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=600&q=80',
                'staff_notes' => 'Precision cuts and blow-dry specialist.',
            ],
            [
                'email' => 'priya.sharma@luxebeauty.ae',
                'employee_code' => 'EMP007',
                'name' => 'Priya Sharma',
                'phone' => '+971 50 789 0123',
                'department' => 'NAILS',
                'designation' => 'NAIL_TECH',
                'gender' => GenderEnum::Female->value,
                'nationality' => 'India',
                'joining_date' => '2020-11-05',
                'avatar' => 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
                'staff_notes' => 'Gel extensions and nail art expert.',
            ],
            [
                'email' => 'elena.volkov@luxebeauty.ae',
                'employee_code' => 'EMP008',
                'name' => 'Elena Volkov',
                'phone' => '+971 50 890 1234',
                'department' => 'SKIN',
                'designation' => 'ESTH',
                'gender' => GenderEnum::Female->value,
                'nationality' => 'Russia',
                'joining_date' => '2022-02-14',
                'avatar' => 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80',
                'staff_notes' => 'Hydrafacial and anti-ageing skincare treatments.',
            ],
            [
                'email' => 'maria.santos@luxebeauty.ae',
                'employee_code' => 'EMP009',
                'name' => 'Maria Santos',
                'phone' => '+971 50 901 2345',
                'department' => 'SPA',
                'designation' => 'THER',
                'gender' => GenderEnum::Female->value,
                'nationality' => 'Philippines',
                'joining_date' => '2021-05-18',
                'avatar' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
                'staff_notes' => 'Swedish and hot stone massage therapist.',
            ],
            [
                'email' => 'amira.khalid@luxebeauty.ae',
                'employee_code' => 'EMP010',
                'name' => 'Amira Khalid',
                'phone' => '+971 50 012 3456',
                'department' => 'MAKEUP',
                'designation' => 'MU_ART',
                'gender' => GenderEnum::Female->value,
                'nationality' => 'Egypt',
                'joining_date' => '2020-07-01',
                'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
                'staff_notes' => 'Bridal and evening glam makeup artist.',
            ],
            [
                'email' => 'james.okonkwo@luxebeauty.ae',
                'employee_code' => 'EMP011',
                'name' => 'James Okonkwo',
                'phone' => '+971 50 123 4560',
                'department' => 'HAIR',
                'designation' => 'JR_STY',
                'gender' => GenderEnum::Male->value,
                'nationality' => 'Nigeria',
                'joining_date' => '2023-09-10',
                'avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
                'staff_notes' => 'Men\'s grooming and contemporary styling.',
            ],
            [
                'email' => 'sofia.laurent@luxebeauty.ae',
                'employee_code' => 'EMP012',
                'name' => 'Sofia Laurent',
                'phone' => '+971 50 234 5670',
                'department' => 'SKIN',
                'designation' => 'ESTH',
                'gender' => GenderEnum::Female->value,
                'nationality' => 'France',
                'joining_date' => '2022-11-22',
                'avatar' => 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=600&q=80',
                'staff_notes' => 'Gold facial and luxury skincare rituals.',
            ],
        ];

        foreach ($staffMembers as $member) {
            $department = $departments->get($member['department']);
            $designation = $designations->get($member['designation']);

            if (! $department || ! $designation) {
                continue;
            }

            $user = User::query()->updateOrCreate(
                ['email' => $member['email']],
                [
                    'company_id' => $company->id,
                    'branch_id' => $branch?->id,
                    'department_id' => $department->id,
                    'staff_designation_id' => $designation->id,
                    'employee_code' => $member['employee_code'],
                    'name' => $member['name'],
                    'phone' => $member['phone'],
                    'password' => Hash::make('password'),
                    'is_active' => true,
                    'email_verified_at' => now(),
                    'gender' => $member['gender'],
                    'nationality' => $member['nationality'],
                    'joining_date' => $member['joining_date'],
                    'employment_type' => EmploymentTypeEnum::FullTime->value,
                    'avatar' => $member['avatar'],
                    'staff_notes' => $member['staff_notes'],
                ]
            );

            $user->syncRoles([RoleEnum::Staff->value]);
        }

        $this->ensureExistingStaffAvatars();
        $this->seedHomepageTeam($company->id);
    }

    private function seedHomepageTeam(int $companyId): void
    {
        $preferredEmails = [
            'layla.mansour@luxebeauty.ae',
            'priya.sharma@luxebeauty.ae',
            'elena.volkov@luxebeauty.ae',
            'amira.khalid@luxebeauty.ae',
        ];

        $ids = User::query()
            ->where('company_id', $companyId)
            ->whereIn('email', $preferredEmails)
            ->get()
            ->sortBy(fn (User $user) => array_search($user->email, $preferredEmails, true))
            ->pluck('id')
            ->values()
            ->all();

        if (count($ids) < 4) {
            $ids = User::query()
                ->where('company_id', $companyId)
                ->where('is_active', true)
                ->whereNotNull('staff_designation_id')
                ->whereNotIn('email', ['owner@luxebeauty.ae', 'admin@luxebeauty.ae'])
                ->orderBy('name')
                ->limit(4)
                ->pluck('id')
                ->all();
        }

        $ids = array_slice(array_values(array_unique($ids)), 0, 4);

        if ($ids === []) {
            return;
        }

        $existing = Setting::query()
            ->where('company_id', $companyId)
            ->whereNull('branch_id')
            ->where('key', 'homepage_team_ids')
            ->value('value');

        if ($existing !== null && $existing !== '' && $existing !== '[]') {
            return;
        }

        Setting::query()->updateOrCreate(
            ['company_id' => $companyId, 'branch_id' => null, 'key' => 'homepage_team_ids'],
            [
                'group' => 'website',
                'value' => json_encode($ids),
                'type' => 'json',
                'description' => 'Up to 4 staff IDs shown in the homepage Meet the Artists section',
                'is_public' => true,
            ]
        );
    }

    private function ensureExistingStaffAvatars(): void
    {
        $avatars = [
            'staff@luxebeauty.ae' => 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=600&q=80',
            'reception@luxebeauty.ae' => 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
        ];

        foreach ($avatars as $email => $avatar) {
            User::query()
                ->where('email', $email)
                ->where(function ($q): void {
                    $q->whereNull('avatar')->orWhere('avatar', '');
                })
                ->update(['avatar' => $avatar]);
        }
    }
}
