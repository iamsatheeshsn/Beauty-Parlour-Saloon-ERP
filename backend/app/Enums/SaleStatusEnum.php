<?php

namespace App\Enums;

enum SaleStatusEnum: string
{
    case Paid = 'paid';
    case Void = 'void';
    case Refunded = 'refunded';

    public function label(): string
    {
        return match ($this) {
            self::Paid => 'Paid',
            self::Void => 'Void',
            self::Refunded => 'Refunded',
        };
    }
}
