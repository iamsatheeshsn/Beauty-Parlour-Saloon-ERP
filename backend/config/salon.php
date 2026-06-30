<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Salon Business Configuration
    |--------------------------------------------------------------------------
    */

    'timezone' => env('SALON_TIMEZONE', 'Asia/Dubai'),

    'currency' => env('SALON_CURRENCY', 'AED'),

    'currency_symbol' => env('SALON_CURRENCY_SYMBOL', 'د.إ'),

    'vat_rate' => (float) env('SALON_VAT_RATE', 0),

    'vat_enabled' => (bool) env('SALON_VAT_ENABLED', false),

    'country' => env('SALON_COUNTRY', 'UAE'),

    'city' => env('SALON_CITY', 'Dubai'),

];
