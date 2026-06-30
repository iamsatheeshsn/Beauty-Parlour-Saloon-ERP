<?php

namespace Database\Seeders;

use App\Enums\StockMovementTypeEnum;
use App\Models\Branch;
use App\Models\BranchProductStock;
use App\Models\Company;
use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Database\Seeder;

class InventorySeeder extends Seeder
{
    public function run(): void
    {
        $company = Company::query()->where('code', 'LUXE001')->firstOrFail();
        $branch = Branch::query()->where('company_id', $company->id)->where('code', 'HQ')->first();

        if (! $branch) {
            return;
        }

        $stockLevels = [
            'PRD0001' => 12,
            'PRD0002' => 18,
            'PRD0003' => 2,
            'PRD0004' => 6,
            'PRD0005' => 24,
            'PRD0006' => 4,
            'PRD0007' => 3,
        ];

        foreach ($stockLevels as $code => $qty) {
            $product = Product::query()
                ->where('company_id', $company->id)
                ->where('code', $code)
                ->first();

            if (! $product) {
                continue;
            }

            BranchProductStock::query()->updateOrCreate(
                ['branch_id' => $branch->id, 'product_id' => $product->id],
                [
                    'company_id' => $company->id,
                    'quantity_on_hand' => $qty,
                ]
            );

            StockMovement::query()->updateOrCreate(
                [
                    'company_id' => $company->id,
                    'branch_id' => $branch->id,
                    'product_id' => $product->id,
                    'type' => StockMovementTypeEnum::Adjustment->value,
                    'reference' => 'OPENING',
                ],
                [
                    'quantity' => $qty,
                    'balance_after' => $qty,
                    'unit_cost' => $product->cost_price,
                    'description' => 'Opening stock balance',
                ]
            );
        }
    }
}
