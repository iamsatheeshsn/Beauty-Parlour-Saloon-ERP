<?php

namespace App\Enums;

enum LeaveTypeEnum: string
{
    case Annual = 'annual';
    case Sick = 'sick';
    case Unpaid = 'unpaid';
    case Emergency = 'emergency';
    case Maternity = 'maternity';
    case Other = 'other';

    public function label(): string
    {
        return match ($this) {
            self::Annual => 'Annual Leave',
            self::Sick => 'Sick Leave',
            self::Unpaid => 'Unpaid Leave',
            self::Emergency => 'Emergency Leave',
            self::Maternity => 'Maternity Leave',
            self::Other => 'Other',
        };
    }

    /** @return list<string> */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
