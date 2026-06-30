<?php

namespace App\Enums;

enum SaleLineTypeEnum: string
{
    case Service = 'service';
    case Package = 'package';
    case PackageRedemption = 'package_redemption';

    public function label(): string
    {
        return match ($this) {
            self::Service => 'Service',
            self::Package => 'Package',
            self::PackageRedemption => 'Package Redemption',
        };
    }
}
