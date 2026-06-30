<?php

namespace App\Support;

class PhoneNumber
{
    public static function normalize(?string $phone): ?string
    {
        if ($phone === null || trim($phone) === '') {
            return null;
        }

        $digits = preg_replace('/\D+/', '', $phone);

        if ($digits === null || $digits === '') {
            return null;
        }

        if (str_starts_with($digits, '00')) {
            $digits = substr($digits, 2);
        }

        if (str_starts_with($digits, '0') && strlen($digits) === 10) {
            $digits = '971'.substr($digits, 1);
        }

        if (strlen($digits) === 9 && str_starts_with($digits, '5')) {
            $digits = '971'.$digits;
        }

        return '+'.$digits;
    }

    public static function matches(string $stored, string $search): bool
    {
        $a = self::normalize($stored);
        $b = self::normalize($search);

        if (! $a || ! $b) {
            return false;
        }

        if ($a === $b) {
            return true;
        }

        return str_ends_with($a, ltrim($b, '+')) || str_ends_with($b, ltrim($a, '+'));
    }
}
