<?php

if (! function_exists('format_currency')) {
    function format_currency(float|int|string $amount, ?string $currency = null): string
    {
        $currency = $currency ?? config('salon.currency', 'AED');
        $symbol = config('salon.currency_symbol', 'د.إ');

        return $symbol.' '.number_format((float) $amount, 2).' '.$currency;
    }
}

if (! function_exists('calculate_vat')) {
    function calculate_vat(float|int|string $amount, ?float $rate = null): float
    {
        $rate = $rate ?? (float) config('salon.vat_rate', 5);

        return round((float) $amount * ($rate / 100), 2);
    }
}
