<?php

namespace App\Enums;

enum CustomerPackageStatusEnum: string
{
    case Active = 'active';
    case Exhausted = 'exhausted';
    case Expired = 'expired';
    case Cancelled = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::Active => 'Active',
            self::Exhausted => 'Exhausted',
            self::Expired => 'Expired',
            self::Cancelled => 'Cancelled',
        };
    }
}
