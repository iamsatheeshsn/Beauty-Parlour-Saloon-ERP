<?php

namespace App\DTOs\ActivityLog;

use App\Enums\ActivityActionEnum;

readonly class ActivityLogDTO
{
    public function __construct(
        public ActivityActionEnum $action,
        public ?int $userId = null,
        public ?string $subjectType = null,
        public ?int $subjectId = null,
        public ?string $description = null,
        public ?array $properties = null,
        public ?string $ipAddress = null,
        public ?string $userAgent = null,
    ) {
    }
}
