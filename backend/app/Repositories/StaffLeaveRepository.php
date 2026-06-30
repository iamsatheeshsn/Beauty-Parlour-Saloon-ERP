<?php

namespace App\Repositories;

use App\Models\StaffLeaveRequest;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class StaffLeaveRepository
{
    public function paginateForUser(int $userId, int $companyId, int $perPage = 15): LengthAwarePaginator
    {
        return StaffLeaveRequest::query()
            ->with(['approver'])
            ->where('company_id', $companyId)
            ->where('user_id', $userId)
            ->orderByDesc('start_date')
            ->paginate($perPage);
    }

    public function listForUser(int $userId, int $companyId): Collection
    {
        return StaffLeaveRequest::query()
            ->with(['approver'])
            ->where('company_id', $companyId)
            ->where('user_id', $userId)
            ->orderByDesc('start_date')
            ->get();
    }

    public function pendingForCompany(int $companyId): Collection
    {
        return StaffLeaveRequest::query()
            ->with(['user'])
            ->where('company_id', $companyId)
            ->where('status', 'pending')
            ->orderBy('start_date')
            ->get();
    }

    public function findById(int $id, int $companyId): ?StaffLeaveRequest
    {
        return StaffLeaveRequest::query()
            ->with(['approver', 'user'])
            ->where('company_id', $companyId)
            ->find($id);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): StaffLeaveRequest
    {
        return StaffLeaveRequest::query()->create($data)->fresh(['approver']);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(StaffLeaveRequest $leave, array $data): StaffLeaveRequest
    {
        $leave->update($data);

        return $leave->fresh(['approver']);
    }

    public function delete(StaffLeaveRequest $leave): bool
    {
        return (bool) $leave->delete();
    }
}
