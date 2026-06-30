<?php

namespace Database\Seeders;

use App\Enums\AppointmentStatusEnum;
use App\Enums\AppointmentTypeEnum;
use App\Models\Appointment;
use App\Models\AppointmentItem;
use App\Models\Company;
use App\Models\Customer;
use App\Models\SalonService;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class AppointmentSeeder extends Seeder
{
    public function run(): void
    {
        $company = Company::query()->where('code', 'LUXE001')->firstOrFail();
        $stylist = User::query()->where('email', 'staff@luxebeauty.ae')->first();
        $receptionist = User::query()->where('email', 'reception@luxebeauty.ae')->first();
        $branchId = $stylist?->branch_id;

        $customers = Customer::query()->where('company_id', $company->id)->limit(5)->get();
        $services = SalonService::query()->where('company_id', $company->id)->where('is_active', true)->get()->keyBy('code');

        if ($customers->isEmpty() || $services->isEmpty()) {
            return;
        }

        Appointment::query()->where('company_id', $company->id)->each(function (Appointment $appt) {
            $appt->items()->delete();
            $appt->forceDelete();
        });

        $samples = [
            [
                'code' => 'APPT0001',
                'customer' => 0,
                'type' => AppointmentTypeEnum::WalkIn,
                'status' => AppointmentStatusEnum::InProgress,
                'scheduled_at' => now()->subMinutes(30),
                'service_codes' => ['SRV0001'],
            ],
            [
                'code' => 'APPT0002',
                'customer' => 1,
                'type' => AppointmentTypeEnum::Scheduled,
                'status' => AppointmentStatusEnum::Confirmed,
                'scheduled_at' => now()->addHours(2),
                'service_codes' => ['SRV0006'],
            ],
            [
                'code' => 'APPT0003',
                'customer' => 2,
                'type' => AppointmentTypeEnum::Scheduled,
                'status' => AppointmentStatusEnum::Scheduled,
                'scheduled_at' => now()->addDay()->setTime(10, 0),
                'service_codes' => ['SRV0002'],
            ],
            [
                'code' => 'APPT0004',
                'customer' => 3,
                'type' => AppointmentTypeEnum::Scheduled,
                'status' => AppointmentStatusEnum::Scheduled,
                'scheduled_at' => now()->addDay()->setTime(14, 30),
                'service_codes' => ['SRV0005', 'SRV0004'],
            ],
            [
                'code' => 'APPT0005',
                'customer' => 0,
                'type' => AppointmentTypeEnum::Scheduled,
                'status' => AppointmentStatusEnum::Completed,
                'scheduled_at' => now()->subDay()->setTime(11, 0),
                'service_codes' => ['SRV0008'],
                'completed_at' => now()->subDay()->setTime(12, 0),
            ],
            [
                'code' => 'APPT0006',
                'customer' => 4,
                'type' => AppointmentTypeEnum::Scheduled,
                'status' => AppointmentStatusEnum::Cancelled,
                'scheduled_at' => now()->addDays(2)->setTime(16, 0),
                'service_codes' => ['SRV0010'],
                'cancellation_reason' => 'Customer rescheduled',
            ],
        ];

        foreach ($samples as $sample) {
            $customer = $customers[$sample['customer'] % $customers->count()];
            $starts = Carbon::parse($sample['scheduled_at']);
            $duration = 0;
            $amount = 0;
            $itemRows = [];

            foreach ($sample['service_codes'] as $i => $code) {
                $service = $services->get($code);
                if (! $service) {
                    continue;
                }
                $duration += $service->duration_minutes;
                $amount += $service->totalPrice();
                $itemRows[] = [
                    'service' => $service,
                    'sort' => $i + 1,
                ];
            }

            if (empty($itemRows)) {
                continue;
            }

            $appointment = Appointment::query()->create([
                'company_id' => $company->id,
                'branch_id' => $branchId,
                'customer_id' => $customer->id,
                'staff_id' => $stylist?->id,
                'booked_by' => $receptionist?->id,
                'code' => $sample['code'],
                'type' => $sample['type']->value,
                'status' => $sample['status']->value,
                'scheduled_at' => $starts,
                'ends_at' => $starts->copy()->addMinutes($duration),
                'duration_minutes' => $duration,
                'total_amount' => $amount,
                'checked_in_at' => in_array($sample['status'], [AppointmentStatusEnum::CheckedIn, AppointmentStatusEnum::InProgress, AppointmentStatusEnum::Completed], true)
                    ? $starts->copy()->subMinutes(5) : null,
                'completed_at' => $sample['completed_at'] ?? null,
                'cancellation_reason' => $sample['cancellation_reason'] ?? null,
            ]);

            foreach ($itemRows as $row) {
                AppointmentItem::query()->create([
                    'appointment_id' => $appointment->id,
                    'salon_service_id' => $row['service']->id,
                    'staff_id' => $stylist?->id,
                    'service_name' => $row['service']->name,
                    'duration_minutes' => $row['service']->duration_minutes,
                    'price' => $row['service']->totalPrice(),
                    'sort_order' => $row['sort'],
                ]);
            }
        }
    }
}
