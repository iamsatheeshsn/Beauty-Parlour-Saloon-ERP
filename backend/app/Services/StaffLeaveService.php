<?php

namespace App\Services;

use App\Enums\ActivityActionEnum;
use App\Enums\LeaveStatusEnum;
use App\Enums\LeaveTypeEnum;
use App\Exceptions\ApiException;
use App\Models\StaffLeaveRequest;
use App\Repositories\StaffLeaveRepository;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Validation\Rule;

class StaffLeaveService
{
    public function __construct(
        private readonly StaffLeaveRepository $repository,
        private readonly StaffService $staffService,
        private readonly ActivityLogService $activityLogService
    ) {
    }

    public function paginate(int $userId, ?int $companyId, int $perPage = 15): LengthAwarePaginator
    {
        $this->staffService->findOrFail($userId, $companyId);

        return $this->repository->paginateForUser($userId, $companyId ?? 0, $perPage);
    }

    public function list(int $userId, ?int $companyId): array
    {
        $this->staffService->findOrFail($userId, $companyId);

        return $this->repository->listForUser($userId, $companyId ?? 0)->all();
    }

    public function storeRules(): array
    {
        return [
            'leave_type' => ['required', Rule::enum(LeaveTypeEnum::class)],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'reason' => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function updateRules(): array
    {
        return [
            'leave_type' => ['sometimes', Rule::enum(LeaveTypeEnum::class)],
            'start_date' => ['sometimes', 'date'],
            'end_date' => ['sometimes', 'date'],
            'reason' => ['nullable', 'string', 'max:2000'],
            'status' => ['sometimes', Rule::enum(LeaveStatusEnum::class)],
            'admin_notes' => ['nullable', 'string', 'max:2000'],
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(int $userId, array $data, ?int $companyId, Request $request): StaffLeaveRequest
    {
        $this->staffService->findOrFail($userId, $companyId);

        $start = Carbon::parse($data['start_date']);
        $end = Carbon::parse($data['end_date']);
        $days = $start->diffInDays($end) + 1;

        $leave = $this->repository->create([
            ...$data,
            'company_id' => $companyId,
            'user_id' => $userId,
            'days' => $days,
            'status' => LeaveStatusEnum::Pending->value,
        ]);

        $this->log($request, ActivityActionEnum::Create, $leave);

        return $leave;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(int $id, array $data, ?int $companyId, Request $request): StaffLeaveRequest
    {
        $leave = $this->findOrFail($id, $companyId);

        if (isset($data['start_date'], $data['end_date'])) {
            $data['days'] = Carbon::parse($data['start_date'])->diffInDays(Carbon::parse($data['end_date'])) + 1;
        }

        if (isset($data['status']) && in_array($data['status'], [LeaveStatusEnum::Approved->value, LeaveStatusEnum::Rejected->value], true)) {
            $data['approved_by'] = $request->user()?->id;
            $data['approved_at'] = now();
        }

        $updated = $this->repository->update($leave, $data);
        $this->log($request, ActivityActionEnum::Update, $updated);

        return $updated;
    }

    public function delete(int $id, ?int $companyId, Request $request): void
    {
        $leave = $this->findOrFail($id, $companyId);
        $this->log($request, ActivityActionEnum::Delete, $leave);
        $this->repository->delete($leave);
    }

    public function findOrFail(int $id, ?int $companyId): StaffLeaveRequest
    {
        $leave = $this->repository->findById($id, $companyId ?? 0);

        if (! $leave) {
            throw new ApiException('Leave request not found', 404);
        }

        return $leave;
    }

    protected function log(Request $request, ActivityActionEnum $action, StaffLeaveRequest $leave): void
    {
        $this->activityLogService->log(
            action: $action,
            userId: $request->user()?->id,
            subject: $leave->user,
            description: "{$action->label()} leave request for staff #{$leave->user_id}",
            properties: ['resource' => 'StaffLeaveRequest', 'id' => $leave->id],
            request: $request
        );
    }
}
