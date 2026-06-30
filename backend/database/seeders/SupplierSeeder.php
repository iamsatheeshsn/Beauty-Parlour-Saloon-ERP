<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Supplier;
use Illuminate\Database\Seeder;

class SupplierSeeder extends Seeder
{
    public function run(): void
    {
        $company = Company::query()->where('code', 'LUXE001')->firstOrFail();

        $suppliers = [
            [
                'code' => 'SUP0001',
                'name' => 'Beauty Supply UAE',
                'contact_person' => 'Ahmed Hassan',
                'email' => 'orders@beautysupply.ae',
                'phone' => '+971 4 123 4567',
                'payment_terms' => 'Net 30',
            ],
            [
                'code' => 'SUP0002',
                'name' => 'Professional Hair Distributors',
                'contact_person' => 'Sarah Khan',
                'email' => 'sales@phd.ae',
                'phone' => '+971 4 234 5678',
                'payment_terms' => 'Net 15',
            ],
            [
                'code' => 'SUP0003',
                'name' => 'Spa Essentials Trading',
                'contact_person' => 'Maria Lopez',
                'email' => 'info@spaessentials.ae',
                'phone' => '+971 4 345 6789',
                'payment_terms' => 'COD',
            ],
        ];

        foreach ($suppliers as $supplier) {
            Supplier::query()->updateOrCreate(
                ['company_id' => $company->id, 'code' => $supplier['code']],
                array_merge($supplier, ['company_id' => $company->id, 'is_active' => true])
            );
        }
    }
}
