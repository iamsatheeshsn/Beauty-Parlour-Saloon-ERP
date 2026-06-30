<?php

namespace App\Enums;

enum EmploymentTypeEnum: string
{
    case FullTime = 'full_time';
    case PartTime = 'part_time';
    case Contract = 'contract';
    case Freelance = 'freelance';

    public function label(): string
    {
        return match ($this) {
            self::FullTime => 'Full Time',
            self::PartTime => 'Part Time',
            self::Contract => 'Contract',
            self::Freelance => 'Freelance',
        };
    }

    /** @return list<string> */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
