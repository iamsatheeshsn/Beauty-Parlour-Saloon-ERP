<?php

namespace Database\Seeders;

use App\Models\City;
use App\Models\Country;
use App\Models\Emirate;
use Illuminate\Database\Seeder;

class CitySeeder extends Seeder
{
    public function run(): void
    {
        $country = Country::query()->where('iso_code', 'AE')->firstOrFail();

        $citiesByEmirate = [
            'DXB' => ['Dubai Marina', 'Jumeirah', 'Downtown Dubai', 'Deira', 'Business Bay', 'Al Barsha', 'JLT'],
            'AUH' => ['Abu Dhabi City', 'Khalifa City', 'Al Reem Island', 'Yas Island'],
            'SHJ' => ['Sharjah City', 'Al Nahda', 'Muwaileh'],
            'AJM' => ['Ajman City', 'Al Nuaimiya'],
            'UAQ' => ['Umm Al Quwain City'],
            'RAK' => ['Ras Al Khaimah City', 'Al Hamra'],
            'FUJ' => ['Fujairah City', 'Dibba'],
        ];

        foreach ($citiesByEmirate as $emirateCode => $cities) {
            $emirate = Emirate::query()
                ->where('country_id', $country->id)
                ->where('code', $emirateCode)
                ->first();

            if (! $emirate) {
                continue;
            }

            foreach ($cities as $index => $cityName) {
                City::query()->updateOrCreate(
                    ['emirate_id' => $emirate->id, 'name' => $cityName],
                    [
                        'country_id' => $country->id,
                        'is_active' => true,
                        'sort_order' => $index + 1,
                    ]
                );
            }
        }
    }
}
