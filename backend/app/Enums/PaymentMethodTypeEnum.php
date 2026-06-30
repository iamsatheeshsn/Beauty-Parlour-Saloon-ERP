<?php

namespace App\Enums;

enum PaymentMethodTypeEnum: string
{
    case Cash = 'cash';
    case Card = 'card';
    case BankTransfer = 'bank_transfer';
    case Online = 'online';
    case Wallet = 'wallet';
    case Cheque = 'cheque';

    public function label(): string
    {
        return match ($this) {
            self::Cash => 'Cash',
            self::Card => 'Card',
            self::BankTransfer => 'Bank Transfer',
            self::Online => 'Online Payment',
            self::Wallet => 'Digital Wallet',
            self::Cheque => 'Cheque',
        };
    }
}
