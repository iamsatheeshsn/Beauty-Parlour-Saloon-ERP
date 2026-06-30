<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\SalonService;
use App\Models\ServiceCategory;
use Illuminate\Database\Seeder;

class SalonServiceSeeder extends Seeder
{
    public function run(): void
    {
        $company = Company::query()->where('code', 'LUXE001')->firstOrFail();

        $categories = ServiceCategory::query()
            ->where('company_id', $company->id)
            ->whereNull('parent_id')
            ->get()
            ->keyBy('code');

        $catalog = [
            ['code' => 'SRV0001', 'category' => 'HAIR', 'name' => "Women's Haircut & Blow-dry", 'duration' => 60, 'price' => 180, 'commission' => 15],
            ['code' => 'SRV0002', 'category' => 'HAIR', 'name' => 'Balayage / Highlights', 'duration' => 180, 'price' => 650, 'commission' => 20],
            ['code' => 'SRV0003', 'category' => 'HAIR', 'name' => 'Keratin Treatment', 'duration' => 150, 'price' => 850, 'commission' => 18],
            ['code' => 'SRV0004', 'category' => 'NAILS', 'name' => 'Classic Manicure', 'duration' => 45, 'price' => 95, 'commission' => 12],
            ['code' => 'SRV0005', 'category' => 'NAILS', 'name' => 'Gel Manicure & Pedicure', 'duration' => 90, 'price' => 280, 'commission' => 15],
            ['code' => 'SRV0006', 'category' => 'SKIN', 'name' => 'Hydrating Facial', 'duration' => 60, 'price' => 350, 'commission' => 15],
            ['code' => 'SRV0007', 'category' => 'SKIN', 'name' => 'Gold Facial', 'duration' => 75, 'price' => 420, 'commission' => 18],
            ['code' => 'SRV0008', 'category' => 'SPA', 'name' => 'Swedish Massage 60 min', 'duration' => 60, 'price' => 320, 'commission' => 12],
            ['code' => 'SRV0009', 'category' => 'SPA', 'name' => 'Hot Stone Massage', 'duration' => 75, 'price' => 380, 'commission' => 12],
            ['code' => 'SRV0010', 'category' => 'MAKEUP', 'name' => 'Evening Glam Makeup', 'duration' => 90, 'price' => 450, 'commission' => 20],
            ['code' => 'SRV0011', 'category' => 'MAKEUP', 'name' => 'Bridal Makeup Trial', 'duration' => 120, 'price' => 600, 'commission' => 20],
            ['code' => 'SRV0012', 'category' => 'WAX', 'name' => 'Full Leg Wax', 'duration' => 45, 'price' => 120, 'commission' => 10],
            ['code' => 'SRV0013', 'category' => 'WAX', 'name' => 'Eyebrow Threading', 'duration' => 15, 'price' => 45, 'commission' => 10],
            ['code' => 'SRV0014', 'category' => 'PACKAGES', 'name' => 'Full Day Spa Package', 'duration' => 300, 'price' => 1200, 'commission' => 15, 'vat_inclusive' => true],
            ['code' => 'SRV0015', 'category' => 'HAIR', 'name' => 'Men\'s Haircut', 'duration' => 30, 'price' => 80, 'commission' => 12, 'is_active' => false],
        ];

        foreach ($catalog as $index => $item) {
            $category = $categories->get($item['category']);

            SalonService::query()->updateOrCreate(
                ['company_id' => $company->id, 'code' => $item['code']],
                [
                    'company_id' => $company->id,
                    'service_category_id' => $category?->id,
                    'name' => $item['name'],
                    'description' => null,
                    'duration_minutes' => $item['duration'],
                    'price' => $item['price'],
                    'vat_rate' => 5,
                    'vat_inclusive' => $item['vat_inclusive'] ?? false,
                    'commission_rate' => $item['commission'],
                    'commission_type' => 'percentage',
                    'is_active' => $item['is_active'] ?? true,
                    'sort_order' => $index + 1,
                ]
            );
        }
    }
}
