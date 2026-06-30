<?php

namespace Database\Seeders;

use App\Enums\GenderEnum;
use App\Models\Branch;
use App\Models\City;
use App\Models\Company;
use App\Models\Customer;
use App\Models\CustomerNote;
use App\Models\CustomerVisit;
use App\Models\Emirate;
use App\Models\User;
use App\Support\PhoneNumber;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class CustomerSeeder extends Seeder
{
    public function run(): void
    {
        $company = Company::query()->where('code', 'LUXE001')->firstOrFail();
        $headOffice = Branch::query()->where('company_id', $company->id)->where('code', 'HQ')->first();
        $jumeirahBranch = Branch::query()->where('company_id', $company->id)->where('code', 'JUM')->first();
        $dubai = Emirate::query()
            ->whereHas('country', fn ($q) => $q->where('iso_code', 'AE'))
            ->where('code', 'DXB')
            ->first();
        $dubaiMarina = City::query()->where('emirate_id', $dubai?->id)->where('name', 'Dubai Marina')->first();
        $jumeirahCity = City::query()->where('emirate_id', $dubai?->id)->where('name', 'Jumeirah')->first();

        $owner = User::query()->where('email', 'owner@luxebeauty.ae')->first();
        $receptionist = User::query()->where('email', 'reception@luxebeauty.ae')->first();
        $stylist = User::query()->where('email', 'staff@luxebeauty.ae')->first();

        $customers = [
            [
                'code' => 'CUST0001',
                'name' => 'Fatima Al Mansoori',
                'phone' => '0501234567',
                'email' => 'fatima.mansoori@email.ae',
                'gender' => GenderEnum::Female,
                'date_of_birth' => '1992-03-15',
                'branch_id' => $headOffice?->id,
                'emirate_id' => $dubai?->id,
                'city_id' => $dubaiMarina?->id,
                'address' => 'Marina Gate Tower, Dubai Marina',
                'summary' => 'Regular client — prefers evening appointments. Loves balayage.',
                'is_active' => true,
                'notes' => [
                    ['user_id' => $receptionist?->id, 'note' => 'Prefers stylist Aisha. Allergic to certain hair dyes — check patch test.', 'is_pinned' => true],
                    ['user_id' => $stylist?->id, 'note' => 'Last balayage turned out great. Book 8-week touch-up.', 'is_pinned' => false],
                ],
                'visits' => [
                    ['branch_id' => $headOffice?->id, 'staff_id' => $stylist?->id, 'visited_at' => now()->subDays(14), 'purpose' => 'Hair colour', 'services_summary' => 'Balayage + trim', 'amount_spent' => 650.00],
                    ['branch_id' => $headOffice?->id, 'staff_id' => $stylist?->id, 'visited_at' => now()->subDays(60), 'purpose' => 'Haircut', 'services_summary' => 'Cut & blow-dry', 'amount_spent' => 180.00],
                ],
            ],
            [
                'code' => 'CUST0002',
                'name' => 'Sara Ahmed',
                'phone' => '0509876543',
                'email' => 'sara.ahmed@email.ae',
                'gender' => GenderEnum::Female,
                'date_of_birth' => '1988-07-22',
                'branch_id' => $jumeirahBranch?->id,
                'emirate_id' => $dubai?->id,
                'city_id' => $jumeirahCity?->id,
                'address' => 'Jumeirah Beach Residence',
                'summary' => 'VIP member — monthly facial package.',
                'is_active' => true,
                'notes' => [
                    ['user_id' => $receptionist?->id, 'note' => 'VIP — offer complimentary beverage on arrival.', 'is_pinned' => true],
                ],
                'visits' => [
                    ['branch_id' => $jumeirahBranch?->id, 'staff_id' => $stylist?->id, 'visited_at' => now()->subDays(7), 'purpose' => 'Facial', 'services_summary' => 'Gold facial + neck massage', 'amount_spent' => 420.00],
                    ['branch_id' => $jumeirahBranch?->id, 'staff_id' => $stylist?->id, 'visited_at' => now()->subDays(37), 'purpose' => 'Facial', 'services_summary' => 'Hydrating facial', 'amount_spent' => 350.00],
                    ['branch_id' => $jumeirahBranch?->id, 'staff_id' => $stylist?->id, 'visited_at' => now()->subDays(67), 'purpose' => 'Nails', 'services_summary' => 'Gel manicure & pedicure', 'amount_spent' => 280.00],
                ],
            ],
            [
                'code' => 'CUST0003',
                'name' => 'Mariam Hassan',
                'phone' => '0551234567',
                'email' => 'mariam.hassan@email.ae',
                'gender' => GenderEnum::Female,
                'date_of_birth' => '1995-11-08',
                'branch_id' => $headOffice?->id,
                'emirate_id' => $dubai?->id,
                'city_id' => $dubaiMarina?->id,
                'address' => 'Bluewaters Island',
                'summary' => 'Bridal package enquiry — wedding in December.',
                'is_active' => true,
                'notes' => [
                    ['user_id' => $owner?->id, 'note' => 'Interested in bridal makeup trial. Follow up with package quote.', 'is_pinned' => true],
                ],
                'visits' => [
                    ['branch_id' => $headOffice?->id, 'staff_id' => $receptionist?->id, 'visited_at' => now()->subDays(3), 'purpose' => 'Consultation', 'services_summary' => 'Bridal package consultation', 'amount_spent' => 0],
                ],
            ],
            [
                'code' => 'CUST0004',
                'name' => 'Layla Ibrahim',
                'phone' => '0523456789',
                'email' => 'layla.ibrahim@email.ae',
                'gender' => GenderEnum::Female,
                'date_of_birth' => '1990-01-30',
                'branch_id' => $headOffice?->id,
                'emirate_id' => $dubai?->id,
                'city_id' => $dubaiMarina?->id,
                'summary' => 'Walk-in client. Interested in waxing services.',
                'is_active' => true,
                'notes' => [],
                'visits' => [
                    ['branch_id' => $headOffice?->id, 'staff_id' => $stylist?->id, 'visited_at' => now()->subDays(21), 'purpose' => 'Waxing', 'services_summary' => 'Full leg wax + underarms', 'amount_spent' => 150.00],
                ],
            ],
            [
                'code' => 'CUST0005',
                'name' => 'Noura Khalid',
                'phone' => '0545678901',
                'email' => null,
                'gender' => GenderEnum::Female,
                'date_of_birth' => '1985-05-12',
                'branch_id' => $jumeirahBranch?->id,
                'emirate_id' => $dubai?->id,
                'city_id' => $jumeirahCity?->id,
                'address' => 'Umm Suqeim Road',
                'summary' => 'Spa regular — books massage every fortnight.',
                'is_active' => true,
                'notes' => [
                    ['user_id' => $stylist?->id, 'note' => 'Prefers firm pressure for massage. Room 3.', 'is_pinned' => false],
                ],
                'visits' => [
                    ['branch_id' => $jumeirahBranch?->id, 'staff_id' => $stylist?->id, 'visited_at' => now()->subDays(10), 'purpose' => 'Spa', 'services_summary' => 'Swedish massage 60 min', 'amount_spent' => 320.00],
                    ['branch_id' => $jumeirahBranch?->id, 'staff_id' => $stylist?->id, 'visited_at' => now()->subDays(24), 'purpose' => 'Spa', 'services_summary' => 'Hot stone massage', 'amount_spent' => 380.00],
                ],
            ],
            [
                'code' => 'CUST0006',
                'name' => 'Aisha Mohammed',
                'phone' => '0567890123',
                'email' => 'aisha.m@email.ae',
                'gender' => GenderEnum::Female,
                'date_of_birth' => '1998-09-18',
                'branch_id' => $headOffice?->id,
                'emirate_id' => $dubai?->id,
                'city_id' => $dubaiMarina?->id,
                'summary' => 'Student discount eligible.',
                'is_active' => true,
                'notes' => [],
                'visits' => [
                    ['branch_id' => $headOffice?->id, 'staff_id' => $stylist?->id, 'visited_at' => now()->subDays(45), 'purpose' => 'Nails', 'services_summary' => 'Classic manicure', 'amount_spent' => 95.00],
                ],
            ],
            [
                'code' => 'CUST0007',
                'name' => 'Hessa Ali',
                'phone' => '0589012345',
                'email' => 'hessa.ali@email.ae',
                'gender' => GenderEnum::Female,
                'date_of_birth' => '1982-12-05',
                'branch_id' => $headOffice?->id,
                'emirate_id' => $dubai?->id,
                'city_id' => $dubaiMarina?->id,
                'summary' => 'Inactive — moved abroad temporarily.',
                'is_active' => false,
                'notes' => [
                    ['user_id' => $receptionist?->id, 'note' => 'Client requested to pause appointments until March.', 'is_pinned' => false],
                ],
                'visits' => [
                    ['branch_id' => $headOffice?->id, 'staff_id' => $stylist?->id, 'visited_at' => now()->subMonths(4), 'purpose' => 'Haircut', 'services_summary' => 'Trim & style', 'amount_spent' => 160.00],
                ],
            ],
            [
                'code' => 'CUST0008',
                'name' => 'Rania Faisal',
                'phone' => '0501112233',
                'email' => 'rania.faisal@email.ae',
                'gender' => GenderEnum::Female,
                'date_of_birth' => '1993-04-25',
                'branch_id' => $jumeirahBranch?->id,
                'emirate_id' => $dubai?->id,
                'city_id' => $jumeirahCity?->id,
                'summary' => 'Makeup artist referral — brings friends often.',
                'is_active' => true,
                'notes' => [
                    ['user_id' => $owner?->id, 'note' => 'Referral source — offer loyalty points on group bookings.', 'is_pinned' => true],
                ],
                'visits' => [
                    ['branch_id' => $jumeirahBranch?->id, 'staff_id' => $stylist?->id, 'visited_at' => now()->subDays(5), 'purpose' => 'Makeup', 'services_summary' => 'Evening glam makeup', 'amount_spent' => 450.00],
                    ['branch_id' => $jumeirahBranch?->id, 'staff_id' => $stylist?->id, 'visited_at' => now()->subDays(35), 'purpose' => 'Makeup', 'services_summary' => 'Party makeup', 'amount_spent' => 380.00],
                ],
            ],
            [
                'code' => 'CUST0009',
                'name' => 'Dina Kareem',
                'phone' => '0554445566',
                'email' => 'dina.kareem@email.ae',
                'gender' => GenderEnum::Other,
                'date_of_birth' => '1991-08-14',
                'branch_id' => $headOffice?->id,
                'emirate_id' => $dubai?->id,
                'city_id' => $dubaiMarina?->id,
                'summary' => 'New client — first visit last week.',
                'is_active' => true,
                'notes' => [],
                'visits' => [
                    ['branch_id' => $headOffice?->id, 'staff_id' => $receptionist?->id, 'visited_at' => now()->subDays(8), 'purpose' => 'First visit', 'services_summary' => 'Consultation + eyebrow threading', 'amount_spent' => 75.00],
                ],
            ],
            [
                'code' => 'CUST0010',
                'name' => 'Yasmine Omar',
                'phone' => '0527778899',
                'email' => 'yasmine.omar@email.ae',
                'gender' => GenderEnum::Female,
                'date_of_birth' => '1987-06-03',
                'branch_id' => $jumeirahBranch?->id,
                'emirate_id' => $dubai?->id,
                'city_id' => $jumeirahCity?->id,
                'address' => 'Palm Jumeirah',
                'summary' => 'High spender — interested in premium packages.',
                'is_active' => true,
                'notes' => [
                    ['user_id' => $receptionist?->id, 'note' => 'Always requests private room. Chardonnay preferred.', 'is_pinned' => true],
                    ['user_id' => $stylist?->id, 'note' => 'Completed full spa day package — very satisfied.', 'is_pinned' => false],
                ],
                'visits' => [
                    ['branch_id' => $jumeirahBranch?->id, 'staff_id' => $stylist?->id, 'visited_at' => now()->subDays(2), 'purpose' => 'Spa package', 'services_summary' => 'Full day spa — massage, facial, nails', 'amount_spent' => 1200.00],
                    ['branch_id' => $jumeirahBranch?->id, 'staff_id' => $stylist?->id, 'visited_at' => now()->subDays(32), 'purpose' => 'Hair & nails', 'services_summary' => 'Blow-dry, gel nails', 'amount_spent' => 340.00],
                    ['branch_id' => $jumeirahBranch?->id, 'staff_id' => $stylist?->id, 'visited_at' => now()->subDays(62), 'purpose' => 'Facial', 'services_summary' => 'Anti-ageing facial', 'amount_spent' => 520.00],
                ],
            ],
        ];

        foreach ($customers as $row) {
            $notes = $row['notes'];
            $visits = $row['visits'];
            unset($row['notes'], $row['visits']);

            $phone = PhoneNumber::normalize($row['phone']) ?? $row['phone'];
            $gender = $row['gender'] instanceof GenderEnum ? $row['gender']->value : $row['gender'];

            $customer = Customer::query()->updateOrCreate(
                ['company_id' => $company->id, 'phone' => $phone],
                [
                    ...$row,
                    'company_id' => $company->id,
                    'phone' => $phone,
                    'gender' => $gender,
                ]
            );

            $customer->notes()->delete();
            $customer->visits()->delete();

            foreach ($notes as $note) {
                CustomerNote::query()->create([
                    'company_id' => $company->id,
                    'customer_id' => $customer->id,
                    'user_id' => $note['user_id'],
                    'note' => $note['note'],
                    'is_pinned' => $note['is_pinned'],
                ]);
            }

            foreach ($visits as $visit) {
                CustomerVisit::query()->create([
                    'company_id' => $company->id,
                    'customer_id' => $customer->id,
                    'branch_id' => $visit['branch_id'],
                    'staff_id' => $visit['staff_id'],
                    'visited_at' => $visit['visited_at'] instanceof Carbon ? $visit['visited_at'] : Carbon::parse($visit['visited_at']),
                    'purpose' => $visit['purpose'],
                    'services_summary' => $visit['services_summary'],
                    'amount_spent' => $visit['amount_spent'],
                    'notes' => $visit['notes'] ?? null,
                ]);
            }

            $visitStats = $customer->visits()->get();
            $customer->update([
                'total_visits' => $visitStats->count(),
                'total_spent' => $visitStats->sum('amount_spent'),
                'last_visit_at' => $visitStats->max('visited_at'),
            ]);
        }
    }
}
