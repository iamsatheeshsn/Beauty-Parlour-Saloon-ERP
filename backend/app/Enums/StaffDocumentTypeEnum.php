<?php

namespace App\Enums;

enum StaffDocumentTypeEnum: string
{
    case Passport = 'passport';
    case EmiratesId = 'emirates_id';
    case Visa = 'visa';
    case LabourCard = 'labour_card';
    case Contract = 'contract';
    case Certificate = 'certificate';
    case Other = 'other';

    public function label(): string
    {
        return match ($this) {
            self::Passport => 'Passport',
            self::EmiratesId => 'Emirates ID',
            self::Visa => 'Visa',
            self::LabourCard => 'Labour Card',
            self::Contract => 'Employment Contract',
            self::Certificate => 'Certificate',
            self::Other => 'Other',
        };
    }

    /** @return list<string> */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
