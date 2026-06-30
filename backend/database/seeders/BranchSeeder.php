<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\City;
use App\Models\Company;
use App\Models\Country;
use App\Models\Emirate;
use Illuminate\Database\Seeder;

class BranchSeeder extends Seeder
{
    public function run(): void
    {
        $company = Company::query()->where('code', 'LUXE001')->firstOrFail();
        $country = Country::query()->where('iso_code', 'AE')->firstOrFail();
        $dubai = Emirate::query()->where('code', 'DXB')->where('country_id', $country->id)->firstOrFail();
        $dubaiMarina = City::query()->where('emirate_id', $dubai->id)->where('name', 'Dubai Marina')->first();
        $jumeirah = City::query()->where('emirate_id', $dubai->id)->where('name', 'Jumeirah')->first();

        $branches = [
            [
                'code' => 'HQ',
                'name' => 'Dubai Marina — Head Office',
                'email' => 'marina@luxebeauty.ae',
                'phone' => '+971 4 123 4567',
                'address' => 'Marina Walk, Dubai Marina',
                'city_id' => $dubaiMarina?->id,
                'is_head_office' => true,
            ],
            [
                'code' => 'JUM',
                'name' => 'Jumeirah Branch',
                'email' => 'jumeirah@luxebeauty.ae',
                'phone' => '+971 4 234 5678',
                'address' => 'Jumeirah Beach Road',
                'city_id' => $jumeirah?->id,
                'is_head_office' => false,
            ],
        ];

        foreach ($branches as $branch) {
            Branch::query()->updateOrCreate(
                ['company_id' => $company->id, 'code' => $branch['code']],
                array_merge($branch, [
                    'company_id' => $company->id,
                    'country_id' => $country->id,
                    'emirate_id' => $dubai->id,
                    'is_active' => true,
                ])
            );
        }
    }
}
