<?php

namespace App\Repositories;

use App\Models\StaffAttendance;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class StaffAttendanceRepository
{
    public function paginateForUser(int $userId, int $companyId, int $perPage = 15): LengthAwarePaginator
    {
        return StaffAttendance::query()
            ->with(['branch', 'recordedBy'])
            ->where('company_id', $companyId)
            ->where('user_id', $userId)
            ->orderByDesc('attendance_date')
            ->paginate($perPage);
    }

    public function listForUser(int $userId, int $companyId, ?string $month = null): Collection
    {
        $query = StaffAttendance::query()
            ->with(['branch'])
            ->where('company_id', $companyId)
            ->where('user_id', $userId);

        if ($month) {
            $query->whereYear('attendance_date', substr($month, 0, 4))
                ->whereMonth('attendance_date', substr($month, 5, 2));
        }

        return $query->orderByDesc('attendance_date')->get();
    }

    public function findById(int $id, int $companyId): ?StaffAttendance
    {
        return StaffAttendance::query()
            ->with(['branch', 'recordedBy'])
            ->where('company_id', $companyId)
            ->find($id);
    }

    public function findByDate(int $userId, int $companyId, string $date): ?StaffAttendance
    {
        return StaffAttendance::query()
            ->where('company_id', $companyId)
            ->where('user_id', $userId)
            ->whereDate('attendance_date', $date)
            ->first();
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): StaffAttendance
    {
        return StaffAttendance::query()->create($data)->fresh(['branch', 'recordedBy']);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(StaffAttendance $attendance, array $data): StaffAttendance
    {
        $attendance->update($data);

        return $attendance->fresh(['branch', 'recordedBy']);
    }

    public function delete(StaffAttendance $attendance): bool
    {
        return (bool) $attendance->delete();
    }

    public function monthSummary(int $userId, int $companyId, string $month): array
    {
        $records = $this->listForUser($userId, $companyId, $month);

        return [
            'present' => $records->where('status', 'present')->count(),
            'absent' => $records->where('status', 'absent')->count(),
            'late' => $records->where('status', 'late')->count(),
            'half_day' => $records->where('status', 'half_day')->count(),
            'on_leave' => $records->where('status', 'on_leave')->count(),
            'total' => $records->count(),
        ];
    }
}
