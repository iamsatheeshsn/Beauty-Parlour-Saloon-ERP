<?php

namespace App\Enums;

enum AppointmentTypeEnum: string
{
    case WalkIn = 'walk_in';
    case Scheduled = 'scheduled';

    public function label(): string
    {
        return match ($this) {
            self::WalkIn => 'Walk-in',
            self::Scheduled => 'Scheduled',
        };
    }

    /** @return list<string> */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
