<?php

namespace Database\Seeders;

use App\Models\Country;
use App\Models\Emirate;
use Illuminate\Database\Seeder;

class EmiratesSeeder extends Seeder
{
    public function run(): void
    {
        $country = Country::query()->where('iso_code', 'AE')->firstOrFail();

        $emirates = [
            ['name' => 'Abu Dhabi', 'code' => 'AUH', 'sort_order' => 1],
            ['name' => 'Dubai', 'code' => 'DXB', 'sort_order' => 2],
            ['name' => 'Sharjah', 'code' => 'SHJ', 'sort_order' => 3],
            ['name' => 'Ajman', 'code' => 'AJM', 'sort_order' => 4],
            ['name' => 'Umm Al Quwain', 'code' => 'UAQ', 'sort_order' => 5],
            ['name' => 'Ras Al Khaimah', 'code' => 'RAK', 'sort_order' => 6],
            ['name' => 'Fujairah', 'code' => 'FUJ', 'sort_order' => 7],
        ];

        foreach ($emirates as $emirate) {
            Emirate::query()->updateOrCreate(
                ['country_id' => $country->id, 'code' => $emirate['code']],
                array_merge($emirate, ['country_id' => $country->id, 'is_active' => true])
            );
        }
    }
}
