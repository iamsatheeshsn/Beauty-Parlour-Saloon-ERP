<?php

namespace App\Enums;

enum StockMovementTypeEnum: string
{
    case Purchase = 'purchase';
    case Sale = 'sale';
    case Consumption = 'consumption';
    case Adjustment = 'adjustment';
    case TransferIn = 'transfer_in';
    case TransferOut = 'transfer_out';
    case Wastage = 'wastage';

    public function label(): string
    {
        return match ($this) {
            self::Purchase => 'Purchase',
            self::Sale => 'Sale',
            self::Consumption => 'Consumption',
            self::Adjustment => 'Adjustment',
            self::TransferIn => 'Transfer In',
            self::TransferOut => 'Transfer Out',
            self::Wastage => 'Wastage',
        };
    }
}
