<?php

namespace App\Services;

use App\Enums\ActivityActionEnum;
use App\Enums\AttendanceStatusEnum;
use App\Exceptions\ApiException;
use App\Models\StaffAttendance;
use App\Repositories\StaffAttendanceRepository;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Validation\Rule;

class StaffAttendanceService
{
    public function __construct(
        private readonly StaffAttendanceRepository $repository,
        private readonly StaffService $staffService,
        private readonly ActivityLogService $activityLogService
    ) {
    }

    public function paginate(int $userId, ?int $companyId, int $perPage = 15): LengthAwarePaginator
    {
        $this->staffService->findOrFail($userId, $companyId);

        return $this->repository->paginateForUser($userId, $companyId ?? 0, $perPage);
    }

    public function list(int $userId, ?int $companyId, ?string $month = null): array
    {
        $this->staffService->findOrFail($userId, $companyId);

        return $this->repository->listForUser($userId, $companyId ?? 0, $month)->all();
    }

    public function storeRules(): array
    {
        return [
            'attendance_date' => ['required', 'date'],
            'branch_id' => ['nullable', 'integer', 'exists:branches,id'],
            'check_in' => ['nullable', 'date_format:H:i'],
            'check_out' => ['nullable', 'date_format:H:i'],
            'status' => ['required', Rule::enum(AttendanceStatusEnum::class)],
            'notes' => ['nullable', 'string'],
        ];
    }

    public function updateRules(): array
    {
        return [
            'attendance_date' => ['sometimes', 'date'],
            'branch_id' => ['nullable', 'integer', 'exists:branches,id'],
            'check_in' => ['nullable', 'date_format:H:i'],
            'check_out' => ['nullable', 'date_format:H:i'],
            'status' => ['sometimes', Rule::enum(AttendanceStatusEnum::class)],
            'notes' => ['nullable', 'string'],
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(int $userId, array $data, ?int $companyId, Request $request): StaffAttendance
    {
        $staff = $this->staffService->findOrFail($userId, $companyId);

        $existing = $this->repository->findByDate($userId, $companyId ?? 0, $data['attendance_date']);
        if ($existing) {
            throw new ApiException('Attendance already recorded for this date', 422);
        }

        $attendance = $this->repository->create([
            ...$data,
            'company_id' => $companyId,
            'user_id' => $userId,
            'branch_id' => $data['branch_id'] ?? $staff->branch_id ?? $request->user()?->branch_id,
            'recorded_by' => $request->user()?->id,
        ]);

        $this->log($request, ActivityActionEnum::Create, $attendance);

        return $attendance;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(int $id, array $data, ?int $companyId, Request $request): StaffAttendance
    {
        $attendance = $this->findOrFail($id, $companyId);
        $updated = $this->repository->update($attendance, $data);
        $this->log($request, ActivityActionEnum::Update, $updated);

        return $updated;
    }

    public function delete(int $id, ?int $companyId, Request $request): void
    {
        $attendance = $this->findOrFail($id, $companyId);
        $this->log($request, ActivityActionEnum::Delete, $attendance);
        $this->repository->delete($attendance);
    }

    public function findOrFail(int $id, ?int $companyId): StaffAttendance
    {
        $attendance = $this->repository->findById($id, $companyId ?? 0);

        if (! $attendance) {
            throw new ApiException('Attendance record not found', 404);
        }

        return $attendance;
    }

    protected function log(Request $request, ActivityActionEnum $action, StaffAttendance $attendance): void
    {
        $this->activityLogService->log(
            action: $action,
            userId: $request->user()?->id,
            subject: $attendance->user,
            description: "{$action->label()} attendance for staff #{$attendance->user_id}",
            properties: ['resource' => 'StaffAttendance', 'id' => $attendance->id],
            request: $request
        );
    }
}
