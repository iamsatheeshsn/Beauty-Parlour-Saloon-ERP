<?php

namespace App\Repositories;

use App\DTOs\ActivityLog\ActivityLogDTO;
use App\Interfaces\ActivityLogRepositoryInterface;
use App\Models\ActivityLog;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class ActivityLogRepository implements ActivityLogRepositoryInterface
{
    public function create(ActivityLogDTO $dto): ActivityLog
    {
        return ActivityLog::query()->create([
            'user_id' => $dto->userId,
            'action' => $dto->action->value,
            'subject_type' => $dto->subjectType,
            'subject_id' => $dto->subjectId,
            'description' => $dto->description,
            'properties' => $dto->properties,
            'ip_address' => $dto->ipAddress,
            'user_agent' => $dto->userAgent,
        ]);
    }

    public function paginate(int $perPage = 15, ?int $userId = null, ?int $companyId = null): LengthAwarePaginator
    {
        return ActivityLog::query()
            ->with('user')
            ->when($userId, fn ($query) => $query->where('user_id', $userId))
            ->when($companyId, fn ($query) => $query->whereHas('user', fn ($q) => $q->where('company_id', $companyId)))
            ->latest()
            ->paginate($perPage);
    }

    public function recent(?int $companyId, int $limit = 10): Collection
    {
        return ActivityLog::query()
            ->with('user')
            ->when($companyId, fn ($query) => $query->whereHas('user', fn ($q) => $q->where('company_id', $companyId)))
            ->latest()
            ->limit($limit)
            ->get();
    }
}
