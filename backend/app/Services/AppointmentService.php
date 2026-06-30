<?php

namespace App\Services;

use App\Enums\ActivityActionEnum;
use App\Enums\AppointmentStatusEnum;
use App\Enums\AppointmentTypeEnum;
use App\Exceptions\ApiException;
use App\Models\Appointment;
use App\Models\AppointmentItem;
use App\Models\SalonService;
use App\Repositories\AppointmentRepository;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class AppointmentService
{
    public function __construct(
        private readonly AppointmentRepository $repository,
        private readonly CustomerService $customerService,
        private readonly ActivityLogService $activityLogService
    ) {
    }

    public function resolveCompanyId(Request $request): ?int
    {
        return $request->user()?->company_id;
    }

    public function paginate(Request $request): LengthAwarePaginator
    {
        $companyId = $this->resolveCompanyId($request);

        if (! $companyId) {
            throw new ApiException('Company context required', 422);
        }

        return $this->repository->paginate(
            $companyId,
            (int) $request->input('per_page', 15),
            $this->filtersFromRequest($request)
        );
    }

    public function calendar(Request $request): Collection
    {
        $companyId = $this->resolveCompanyId($request);

        if (! $companyId) {
            throw new ApiException('Company context required', 422);
        }

        $start = Carbon::parse($request->input('start', now()->startOfWeek()));
        $end = Carbon::parse($request->input('end', now()->endOfWeek()));

        return $this->repository->calendar($companyId, $start, $end, $this->filtersFromRequest($request));
    }

    public function findOrFail(int $id, ?int $companyId): Appointment
    {
        if (! $companyId) {
            throw new ApiException('Company context required', 422);
        }

        $appointment = $this->repository->findById($id, $companyId);

        if (! $appointment) {
            throw new ApiException('Appointment not found', 404);
        }

        return $appointment;
    }

    public function baseRules(): array
    {
        return [
            'customer_id' => ['required', 'integer', 'exists:customers,id'],
            'branch_id' => ['nullable', 'integer', 'exists:branches,id'],
            'staff_id' => ['nullable', 'integer', 'exists:users,id'],
            'scheduled_at' => ['nullable', 'date'],
            'notes' => ['nullable', 'string'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.service_id' => ['required', 'integer', 'exists:services,id'],
            'items.*.staff_id' => ['nullable', 'integer', 'exists:users,id'],
        ];
    }

    public function bookingRules(): array
    {
        return array_merge($this->baseRules(), [
            'scheduled_at' => ['required', 'date', 'after_or_equal:now'],
            'status' => ['nullable', Rule::enum(AppointmentStatusEnum::class)],
        ]);
    }

    public function walkInRules(): array
    {
        return $this->baseRules();
    }

    public function updateRules(): array
    {
        return [
            'customer_id' => ['sometimes', 'integer', 'exists:customers,id'],
            'branch_id' => ['nullable', 'integer', 'exists:branches,id'],
            'staff_id' => ['nullable', 'integer', 'exists:users,id'],
            'scheduled_at' => ['sometimes', 'date'],
            'ends_at' => ['nullable', 'date', 'after:scheduled_at'],
            'notes' => ['nullable', 'string'],
            'items' => ['sometimes', 'array', 'min:1'],
            'items.*.service_id' => ['required_with:items', 'integer', 'exists:services,id'],
            'items.*.staff_id' => ['nullable', 'integer', 'exists:users,id'],
        ];
    }

    public function statusRules(): array
    {
        return [
            'status' => ['required', Rule::enum(AppointmentStatusEnum::class)],
            'cancellation_reason' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function assignStaffRules(): array
    {
        return [
            'staff_id' => ['required', 'integer', 'exists:users,id'],
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function createWalkIn(array $data, ?int $companyId, Request $request): Appointment
    {
        $this->customerService->findOrFail($data['customer_id'], $companyId);

        return $this->persistAppointment([
            ...$data,
            'type' => AppointmentTypeEnum::WalkIn->value,
            'status' => AppointmentStatusEnum::CheckedIn->value,
            'scheduled_at' => $data['scheduled_at'] ?? now(),
            'checked_in_at' => now(),
        ], $companyId, $request);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function createBooking(array $data, ?int $companyId, Request $request): Appointment
    {
        $this->customerService->findOrFail($data['customer_id'], $companyId);

        return $this->persistAppointment([
            ...$data,
            'type' => AppointmentTypeEnum::Scheduled->value,
            'status' => $data['status'] ?? AppointmentStatusEnum::Scheduled->value,
        ], $companyId, $request);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(int $id, array $data, ?int $companyId, Request $request): Appointment
    {
        $appointment = $this->findOrFail($id, $companyId);
        $items = $data['items'] ?? null;
        unset($data['items']);

        if ($items) {
            $appointment->items()->delete();
            $this->syncItems($appointment, $items, $companyId);
            $this->recalculateTotals($appointment);
        }

        if (! empty($data)) {
            $appointment = $this->repository->update($appointment, $data);
        }

        $this->log($request, ActivityActionEnum::Update, $appointment->fresh(['customer', 'staff', 'items']));

        return $appointment->fresh(['customer', 'staff', 'branch', 'items.service', 'bookedBy']);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function updateStatus(int $id, array $data, ?int $companyId, Request $request): Appointment
    {
        $appointment = $this->findOrFail($id, $companyId);
        $status = AppointmentStatusEnum::from($data['status']);

        $updates = ['status' => $status->value];

        if ($status === AppointmentStatusEnum::CheckedIn) {
            $updates['checked_in_at'] = now();
        }

        if ($status === AppointmentStatusEnum::InProgress) {
            $updates['checked_in_at'] = $appointment->checked_in_at ?? now();
        }

        if ($status === AppointmentStatusEnum::Completed) {
            $updates['completed_at'] = now();
        }

        if ($status === AppointmentStatusEnum::Cancelled) {
            $updates['cancellation_reason'] = $data['cancellation_reason'] ?? null;
        }

        $updated = $this->repository->update($appointment, $updates);
        $this->log($request, ActivityActionEnum::Update, $updated);

        return $updated;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function assignStaff(int $id, array $data, ?int $companyId, Request $request): Appointment
    {
        $appointment = $this->findOrFail($id, $companyId);
        $updated = $this->repository->update($appointment, ['staff_id' => $data['staff_id']]);
        $this->log($request, ActivityActionEnum::Update, $updated);

        return $updated;
    }

    public function delete(int $id, ?int $companyId, Request $request): void
    {
        $appointment = $this->findOrFail($id, $companyId);
        $this->log($request, ActivityActionEnum::Delete, $appointment);
        $this->repository->delete($appointment);
    }

    public function stats(?int $companyId): array
    {
        if (! $companyId) {
            return ['total' => 0, 'today' => 0];
        }

        return [
            'total' => $this->repository->countForCompany($companyId),
            'today' => $this->repository->countToday($companyId),
            'weekly' => $this->repository->weeklyCounts($companyId),
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     */
    protected function persistAppointment(array $data, ?int $companyId, Request $request): Appointment
    {
        if (! $companyId) {
            throw new ApiException('Company context required', 422);
        }

        $items = $data['items'];
        unset($data['items']);

        return DB::transaction(function () use ($data, $items, $companyId, $request) {
            $appointment = $this->repository->create([
                ...$data,
                'company_id' => $companyId,
                'code' => $this->repository->nextCode($companyId),
                'booked_by' => $request->user()?->id,
                'branch_id' => $data['branch_id'] ?? $request->user()?->branch_id,
            ]);

            $this->syncItems($appointment, $items, $companyId);
            $this->recalculateTotals($appointment);

            $appointment = $appointment->fresh(['customer', 'staff', 'branch', 'items.service', 'bookedBy']);
            $this->log($request, ActivityActionEnum::Create, $appointment);

            return $appointment;
        });
    }

    /**
     * @param  array<int, array<string, mixed>>  $items
     */
    protected function syncItems(Appointment $appointment, array $items, ?int $companyId): void
    {
        foreach ($items as $index => $item) {
            $service = SalonService::query()
                ->where('company_id', $companyId)
                ->where('is_active', true)
                ->find($item['service_id']);

            if (! $service) {
                throw new ApiException("Service #{$item['service_id']} not found or inactive", 422);
            }

            AppointmentItem::query()->create([
                'appointment_id' => $appointment->id,
                'salon_service_id' => $service->id,
                'staff_id' => $item['staff_id'] ?? $appointment->staff_id,
                'service_name' => $service->name,
                'duration_minutes' => $service->duration_minutes,
                'price' => $service->totalPrice(),
                'sort_order' => $index + 1,
            ]);
        }
    }

    protected function recalculateTotals(Appointment $appointment): void
    {
        $appointment->load('items');
        $duration = $appointment->items->sum('duration_minutes');
        $amount = $appointment->items->sum('price');
        $starts = Carbon::parse($appointment->scheduled_at);

        $appointment->update([
            'duration_minutes' => $duration,
            'total_amount' => $amount,
            'ends_at' => $starts->copy()->addMinutes($duration),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    protected function filtersFromRequest(Request $request): array
    {
        return $request->only(['search', 'status', 'type', 'staff_id', 'branch_id', 'customer_id', 'date']);
    }

    protected function log(Request $request, ActivityActionEnum $action, Appointment $appointment): void
    {
        $this->activityLogService->log(
            action: $action,
            userId: $request->user()?->id,
            subject: $appointment->customer,
            description: "{$action->label()} appointment {$appointment->code}",
            properties: ['resource' => 'Appointment', 'id' => $appointment->id, 'code' => $appointment->code],
            request: $request
        );
    }
}
