<?php

namespace Database\Seeders;

use App\Enums\CustomerPackageStatusEnum;
use App\Enums\PointTransactionTypeEnum;
use App\Models\Company;
use App\Models\Customer;
use App\Models\CustomerPackage;
use App\Models\CustomerPointTransaction;
use App\Models\SalonService;
use App\Models\ServicePackage;
use App\Models\ServicePackageItem;
use App\Models\User;
use Illuminate\Database\Seeder;

class ServicePackageSeeder extends Seeder
{
    public function run(): void
    {
        $company = Company::query()->where('code', 'LUXE001')->firstOrFail();
        $receptionist = User::query()->where('email', 'reception@luxebeauty.ae')->first();
        $branchId = $receptionist?->branch_id;

        $services = SalonService::query()
            ->where('company_id', $company->id)
            ->where('is_active', true)
            ->get()
            ->keyBy('code');

        ServicePackage::query()->where('company_id', $company->id)->each(function (ServicePackage $pkg) {
            $pkg->items()->delete();
            CustomerPackage::query()->where('service_package_id', $pkg->id)->each(function (CustomerPackage $cp) {
                CustomerPointTransaction::query()->where('customer_package_id', $cp->id)->delete();
                $cp->forceDelete();
            });
            $pkg->forceDelete();
        });

        $definitions = [
            [
                'code' => 'PKG0001',
                'name' => 'Glow Essentials — 10 Sessions',
                'description' => '10-session facial & skincare package with flexible point redemption.',
                'price' => 1500,
                'points_included' => 100,
                'validity_days' => 180,
                'items' => [
                    ['service' => 'SRV0004', 'points' => 12],
                    ['service' => 'SRV0005', 'points' => 15],
                    ['service' => 'SRV0003', 'points' => 10],
                ],
            ],
            [
                'code' => 'PKG0002',
                'name' => 'Hair Care Bundle',
                'description' => 'Wash, cut & blow-dry sessions redeemable with points.',
                'price' => 800,
                'points_included' => 60,
                'validity_days' => 90,
                'items' => [
                    ['service' => 'SRV0001', 'points' => 15],
                    ['service' => 'SRV0002', 'points' => 20],
                ],
            ],
            [
                'code' => 'PKG0003',
                'name' => 'Bridal Prep Package',
                'description' => 'Premium bridal services with extended validity.',
                'price' => 3500,
                'points_included' => 250,
                'validity_days' => 365,
                'items' => [
                    ['service' => 'SRV0009', 'points' => 80],
                    ['service' => 'SRV0010', 'points' => 60],
                    ['service' => 'SRV0008', 'points' => 40],
                ],
            ],
            [
                'code' => 'PKG0004',
                'name' => 'Quick Refresh — 5 Visits',
                'description' => 'Short validity package for express services.',
                'price' => 450,
                'points_included' => 30,
                'validity_days' => 60,
                'items' => [
                    ['service' => 'SRV0007', 'points' => 8],
                    ['service' => 'SRV0011', 'points' => 6],
                ],
            ],
        ];

        $packages = [];

        foreach ($definitions as $i => $def) {
            $package = ServicePackage::query()->create([
                'company_id' => $company->id,
                'code' => $def['code'],
                'name' => $def['name'],
                'description' => $def['description'],
                'price' => $def['price'],
                'points_included' => $def['points_included'],
                'validity_days' => $def['validity_days'],
                'vat_rate' => 5,
                'vat_inclusive' => false,
                'is_active' => true,
                'sort_order' => $i + 1,
            ]);

            foreach ($def['items'] as $j => $item) {
                $service = $services->get($item['service']);
                if (! $service) {
                    continue;
                }
                ServicePackageItem::query()->create([
                    'service_package_id' => $package->id,
                    'service_id' => $service->id,
                    'points_cost' => $item['points'],
                    'sort_order' => $j + 1,
                ]);
            }

            $packages[$def['code']] = $package;
        }

        $customers = Customer::query()->where('company_id', $company->id)->limit(3)->get();
        if ($customers->isEmpty()) {
            return;
        }

        $glow = $packages['PKG0001'] ?? null;
        $hair = $packages['PKG0002'] ?? null;

        if ($glow && $customers->get(0)) {
            $this->seedPurchase($company->id, $customers[0], $glow, $receptionist?->id, $branchId, 'CPKG0001', 72, 28);
        }

        if ($hair && $customers->get(1)) {
            $this->seedPurchase($company->id, $customers[1], $hair, $receptionist?->id, $branchId, 'CPKG0002', 60, 0);
        }
    }

    protected function seedPurchase(
        int $companyId,
        Customer $customer,
        ServicePackage $package,
        ?int $soldBy,
        ?int $branchId,
        string $code,
        int $remaining,
        int $consumed
    ): void {
        $allocated = $package->points_included;
        $purchasedAt = now()->subDays(14);

        $customerPackage = CustomerPackage::query()->create([
            'company_id' => $companyId,
            'customer_id' => $customer->id,
            'service_package_id' => $package->id,
            'branch_id' => $branchId,
            'sold_by' => $soldBy,
            'code' => $code,
            'purchase_amount' => $package->totalPrice(),
            'points_allocated' => $allocated,
            'points_remaining' => $remaining,
            'points_consumed' => $consumed,
            'status' => $remaining > 0 ? CustomerPackageStatusEnum::Active->value : CustomerPackageStatusEnum::Exhausted->value,
            'purchased_at' => $purchasedAt,
            'expires_at' => $package->validity_days ? $purchasedAt->copy()->addDays($package->validity_days) : null,
        ]);

        CustomerPointTransaction::query()->create([
            'company_id' => $companyId,
            'customer_id' => $customer->id,
            'customer_package_id' => $customerPackage->id,
            'created_by' => $soldBy,
            'type' => PointTransactionTypeEnum::Purchase->value,
            'points' => $allocated,
            'balance_after' => $allocated,
            'reference' => $code,
            'description' => "Purchased {$package->name}",
            'created_at' => $purchasedAt,
            'updated_at' => $purchasedAt,
        ]);

        if ($consumed > 0) {
            CustomerPointTransaction::query()->create([
                'company_id' => $companyId,
                'customer_id' => $customer->id,
                'customer_package_id' => $customerPackage->id,
                'created_by' => $soldBy,
                'type' => PointTransactionTypeEnum::Consumption->value,
                'points' => -$consumed,
                'balance_after' => $remaining,
                'reference' => $code,
                'description' => "Consumed {$consumed} points",
                'created_at' => $purchasedAt->copy()->addDays(3),
                'updated_at' => $purchasedAt->copy()->addDays(3),
            ]);
        }
    }
}
