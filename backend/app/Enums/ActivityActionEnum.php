<?php

namespace App\Enums;

enum ActivityActionEnum: string
{
    case Login = 'login';
    case Logout = 'logout';
    case Create = 'create';
    case Update = 'update';
    case Delete = 'delete';

    public function label(): string
    {
        return match ($this) {
            self::Login => 'Login',
            self::Logout => 'Logout',
            self::Create => 'Create',
            self::Update => 'Update',
            self::Delete => 'Delete',
        };
    }
}
