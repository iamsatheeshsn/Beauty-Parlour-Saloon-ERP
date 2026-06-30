<?php

namespace Database\Seeders;

use App\Models\Country;
use Illuminate\Database\Seeder;

class CountrySeeder extends Seeder
{
    public function run(): void
    {
        Country::query()->updateOrCreate(
            ['iso_code' => 'AE'],
            [
                'name' => 'United Arab Emirates',
                'iso3_code' => 'ARE',
                'phone_code' => '+971',
                'currency_code' => 'AED',
                'is_active' => true,
                'sort_order' => 1,
            ]
        );
    }
}
