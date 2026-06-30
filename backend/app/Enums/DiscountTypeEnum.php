<?php

namespace App\Enums;

enum DiscountTypeEnum: string
{
    case None = 'none';
    case Percentage = 'percentage';
    case Fixed = 'fixed';

    public function label(): string
    {
        return match ($this) {
            self::None => 'No Discount',
            self::Percentage => 'Percentage',
            self::Fixed => 'Fixed Amount',
        };
    }
}
