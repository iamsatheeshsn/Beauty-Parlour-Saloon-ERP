<?php

namespace Database\Seeders;

use App\Models\City;
use App\Models\Company;
use App\Models\Country;
use App\Models\Emirate;
use Illuminate\Database\Seeder;

class CompanySeeder extends Seeder
{
    public function run(): void
    {
        $country = Country::query()->where('iso_code', 'AE')->firstOrFail();
        $dubai = Emirate::query()->where('code', 'DXB')->where('country_id', $country->id)->firstOrFail();
        $dubaiMarina = City::query()
            ->where('emirate_id', $dubai->id)
            ->where('name', 'Dubai Marina')
            ->first();

        Company::query()->updateOrCreate(
            ['code' => 'LUXE001'],
            [
                'name' => 'Luxe Beauty Lounge Dubai',
                'trade_name' => 'Luxe Beauty Lounge',
                'email' => 'info@luxebeauty.ae',
                'phone' => '+971 4 123 4567',
                'website' => 'https://luxebeauty.ae',
                'address' => 'Sheikh Zayed Road, Dubai Marina',
                'postal_code' => '00000',
                'country_id' => $country->id,
                'emirate_id' => $dubai->id,
                'city_id' => $dubaiMarina?->id,
                'city' => 'Dubai',
                'country' => 'UAE',
                'trn_number' => '100123456700003',
                'timezone' => 'Asia/Dubai',
                'currency' => 'AED',
                'vat_rate' => 5.00,
                'is_active' => true,
            ]
        );
    }
}
