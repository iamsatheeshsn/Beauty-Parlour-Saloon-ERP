<?php

namespace App\Utilities;

use Illuminate\Support\Str;

class StringUtility
{
    public static function slug(string $value): string
    {
        return Str::slug($value);
    }

    public static function maskEmail(string $email): string
    {
        [$name, $domain] = explode('@', $email);

        return substr($name, 0, 2).'***@'.$domain;
    }
}
