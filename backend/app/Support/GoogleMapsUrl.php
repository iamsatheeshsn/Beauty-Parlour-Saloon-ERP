<?php

namespace App\Support;

class GoogleMapsUrl
{
    public static function toEmbedUrl(?string $input): ?string
    {
        $input = trim((string) $input);

        if ($input === '') {
            return null;
        }

        if (str_contains($input, 'google.com/maps/embed')
            || (str_contains($input, 'google.com/maps') && str_contains($input, 'output=embed'))) {
            return $input;
        }

        if (preg_match('/[?&]q=([^&]+)/', $input, $matches)) {
            return self::embedFromQuery(urldecode($matches[1]));
        }

        if (preg_match('#@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)#', $input, $matches)) {
            return 'https://maps.google.com/maps?q='.$matches[1].','.$matches[2].'&z=15&ie=UTF8&iwloc=&output=embed';
        }

        if (preg_match('#/place/([^/@?]+)#', $input, $matches)) {
            $place = str_replace(['+', '%2C'], [' ', ','], urldecode($matches[1]));

            return self::embedFromQuery($place);
        }

        if (preg_match('#/maps/search/([^/@?]+)#', $input, $matches)) {
            $place = str_replace(['+', '%2C'], [' ', ','], urldecode($matches[1]));

            return self::embedFromQuery($place);
        }

        return self::embedFromQuery($input);
    }

    private static function embedFromQuery(string $query): string
    {
        return 'https://maps.google.com/maps?q='.urlencode($query).'&t=&z=14&ie=UTF8&iwloc=&output=embed';
    }
}
