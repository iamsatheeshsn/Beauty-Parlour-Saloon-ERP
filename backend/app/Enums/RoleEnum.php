<?php

namespace App\Enums;

enum RoleEnum: string
{
    case Owner = 'owner';
    case Admin = 'admin';
    case Receptionist = 'receptionist';
    case Staff = 'staff';

    public function label(): string
    {
        return match ($this) {
            self::Owner => 'Owner',
            self::Admin => 'Admin',
            self::Receptionist => 'Receptionist',
            self::Staff => 'Staff',
        };
    }

    /**
     * @return list<string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
