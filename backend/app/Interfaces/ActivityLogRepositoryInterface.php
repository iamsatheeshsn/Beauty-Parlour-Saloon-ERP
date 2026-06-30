<?php

namespace App\Interfaces;

use App\DTOs\ActivityLog\ActivityLogDTO;
use App\Models\ActivityLog;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface ActivityLogRepositoryInterface
{
    public function create(ActivityLogDTO $dto): ActivityLog;

    public function paginate(int $perPage = 15, ?int $userId = null, ?int $companyId = null): LengthAwarePaginator;

    public function recent(?int $companyId, int $limit = 10): Collection;
}
