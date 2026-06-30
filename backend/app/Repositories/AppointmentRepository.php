<?php

namespace App\Repositories;

use App\Models\Appointment;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Carbon;

class AppointmentRepository
{
    /** @var array<int, string> */
    protected array $relations = ['customer', 'staff', 'branch', 'items.service', 'bookedBy'];

    public function paginate(int $companyId, int $perPage = 15, array $filters = []): LengthAwarePaginator
    {
        return $this->query($companyId, $filters)
            ->orderByDesc('scheduled_at')
            ->paginate($perPage);
    }

    public function calendar(int $companyId, Carbon $start, Carbon $end, array $filters = []): Collection
    {
        return $this->query($companyId, $filters)
            ->whereBetween('scheduled_at', [$start, $end])
            ->whereNotIn('status', ['cancelled'])
            ->orderBy('scheduled_at')
            ->get();
    }

    public function findById(int $id, int $companyId): ?Appointment
    {
        return Appointment::query()
            ->with($this->relations)
            ->where('company_id', $companyId)
            ->find($id);
    }

    public function countForCompany(int $companyId): int
    {
        return Appointment::query()
            ->where('company_id', $companyId)
            ->whereNotIn('status', ['cancelled'])
            ->count();
    }

    public function countToday(int $companyId): int
    {
        return Appointment::query()
            ->where('company_id', $companyId)
            ->whereDate('scheduled_at', today())
            ->whereNotIn('status', ['cancelled', 'no_show'])
            ->count();
    }

    public function weeklyCounts(int $companyId): array
    {
        $labels = [];
        $data = [];

        for ($i = 6; $i >= 0; $i--) {
            $date = today()->subDays($i);
            $labels[] = $date->format('D');
            $data[] = Appointment::query()
                ->where('company_id', $companyId)
                ->whereDate('scheduled_at', $date)
                ->whereNotIn('status', ['cancelled'])
                ->count();
        }

        return ['labels' => $labels, 'data' => $data];
    }

    public function countPendingToday(int $companyId): int
    {
        return Appointment::query()
            ->where('company_id', $companyId)
            ->whereDate('scheduled_at', today())
            ->whereIn('status', ['scheduled', 'confirmed'])
            ->count();
    }

    /**
     * @return Collection<int, Appointment>
     */
    public function upcoming(int $companyId, int $limit = 5): Collection
    {
        return Appointment::query()
            ->with(['customer', 'staff', 'branch'])
            ->where('company_id', $companyId)
            ->where('scheduled_at', '>=', now())
            ->whereNotIn('status', ['cancelled', 'completed', 'no_show'])
            ->orderBy('scheduled_at')
            ->limit($limit)
            ->get();
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Appointment
    {
        return Appointment::query()->create($data)->fresh($this->relations);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(Appointment $appointment, array $data): Appointment
    {
        $appointment->update($data);

        return $appointment->fresh($this->relations);
    }

    public function delete(Appointment $appointment): bool
    {
        return (bool) $appointment->delete();
    }

    public function nextCode(int $companyId): string
    {
        $latest = Appointment::query()
            ->where('company_id', $companyId)
            ->where('code', 'like', 'APPT%')
            ->orderByRaw('CAST(SUBSTRING(code, 5) AS UNSIGNED) DESC')
            ->value('code');

        $number = $latest ? ((int) substr($latest, 4)) + 1 : 1;

        return 'APPT'.str_pad((string) $number, 4, '0', STR_PAD_LEFT);
    }

    protected function query(int $companyId, array $filters): Builder
    {
        return Appointment::query()
            ->with($this->relations)
            ->where('company_id', $companyId)
            ->when(! empty($filters['search']), function (Builder $q) use ($filters): void {
                $search = $filters['search'];
                $q->where(function (Builder $inner) use ($search): void {
                    $inner->where('code', 'like', "%{$search}%")
                        ->orWhereHas('customer', fn (Builder $c) => $c->where('name', 'like', "%{$search}%")->orWhere('phone', 'like', "%{$search}%"));
                });
            })
            ->when(! empty($filters['status']), fn (Builder $q) => $q->where('status', $filters['status']))
            ->when(! empty($filters['type']), fn (Builder $q) => $q->where('type', $filters['type']))
            ->when(! empty($filters['staff_id']), fn (Builder $q) => $q->where('staff_id', $filters['staff_id']))
            ->when(! empty($filters['branch_id']), fn (Builder $q) => $q->where('branch_id', $filters['branch_id']))
            ->when(! empty($filters['customer_id']), fn (Builder $q) => $q->where('customer_id', $filters['customer_id']))
            ->when(! empty($filters['date']), fn (Builder $q) => $q->whereDate('scheduled_at', $filters['date']));
    }
}
