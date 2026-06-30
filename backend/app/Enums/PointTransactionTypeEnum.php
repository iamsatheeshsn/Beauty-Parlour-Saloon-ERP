<?php

namespace App\Enums;

enum PointTransactionTypeEnum: string
{
    case Purchase = 'purchase';
    case Allocation = 'allocation';
    case Consumption = 'consumption';
    case Refund = 'refund';
    case Expiry = 'expiry';
    case Adjustment = 'adjustment';

    public function label(): string
    {
        return match ($this) {
            self::Purchase => 'Package Purchase',
            self::Allocation => 'Point Allocation',
            self::Consumption => 'Point Consumption',
            self::Refund => 'Refund',
            self::Expiry => 'Expiry',
            self::Adjustment => 'Adjustment',
        };
    }
}
