<?php

namespace App\Services;

use App\DTOs\ActivityLog\ActivityLogDTO;
use App\Enums\ActivityActionEnum;
use App\Interfaces\ActivityLogRepositoryInterface;
use App\Models\ActivityLog;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class ActivityLogService
{
    public function __construct(
        private readonly ActivityLogRepositoryInterface $activityLogRepository
    ) {
    }

    public function log(
        ActivityActionEnum $action,
        ?int $userId = null,
        ?Model $subject = null,
        ?string $description = null,
        ?array $properties = null,
        ?Request $request = null
    ): ActivityLog {
        $dto = new ActivityLogDTO(
            action: $action,
            userId: $userId,
            subjectType: $subject ? $subject->getMorphClass() : null,
            subjectId: $subject?->getKey(),
            description: $description,
            properties: $properties,
            ipAddress: $request?->ip(),
            userAgent: $request?->userAgent(),
        );

        return $this->activityLogRepository->create($dto);
    }

    public function paginate(int $perPage = 15, ?int $userId = null, ?int $companyId = null): LengthAwarePaginator
    {
        return $this->activityLogRepository->paginate($perPage, $userId, $companyId);
    }

    public function recent(?int $companyId, int $limit = 10): Collection
    {
        return $this->activityLogRepository->recent($companyId, $limit);
    }
}
