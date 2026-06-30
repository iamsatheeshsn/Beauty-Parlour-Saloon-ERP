<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Company;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\Supplier;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $company = Company::query()->where('code', 'LUXE001')->firstOrFail();

        $hairCat = ProductCategory::query()->where('company_id', $company->id)->where('code', 'HAIR_PROD')->first();
        $skinCat = ProductCategory::query()->where('company_id', $company->id)->where('code', 'SKIN_PROD')->first();
        $nailCat = ProductCategory::query()->where('company_id', $company->id)->where('code', 'NAIL_PROD')->first();
        $spaCat = ProductCategory::query()->where('company_id', $company->id)->where('code', 'SPA_PROD')->first();
        $retailCat = ProductCategory::query()->where('company_id', $company->id)->where('code', 'RETAIL')->first();
        $consumableCat = ProductCategory::query()->where('company_id', $company->id)->where('code', 'CONSUMABLE')->first();

        $loreal = Brand::query()->where('company_id', $company->id)->where('code', 'LOREAL')->first();
        $wella = Brand::query()->where('company_id', $company->id)->where('code', 'WELLA')->first();
        $olaplex = Brand::query()->where('company_id', $company->id)->where('code', 'OLAPLEX')->first();
        $dermalog = Brand::query()->where('company_id', $company->id)->where('code', 'DERMALOG')->first();
        $opi = Brand::query()->where('company_id', $company->id)->where('code', 'OPI')->first();
        $generic = Brand::query()->where('company_id', $company->id)->where('code', 'GENERIC')->first();

        $supplier = Supplier::query()->where('company_id', $company->id)->where('code', 'SUP0001')->first();

        $products = [
            [
                'code' => 'PRD0001',
                'name' => 'Professional Shampoo 1L',
                'description' => 'Salon-strength cleansing shampoo for colour-treated and damaged hair. Sulfate-free formula with keratin proteins.',
                'product_category_id' => $hairCat?->id,
                'brand_id' => $loreal?->id,
                'unit' => 'bottle',
                'cost_price' => 45.00,
                'retail_price' => 85.00,
                'reorder_level' => 5,
                'is_consumable' => true,
                'is_sellable' => true,
            ],
            [
                'code' => 'PRD0002',
                'name' => 'Hair Color Tube 60ml',
                'product_category_id' => $hairCat?->id,
                'brand_id' => $loreal?->id,
                'unit' => 'tube',
                'cost_price' => 18.00,
                'retail_price' => 0,
                'reorder_level' => 20,
                'is_consumable' => true,
                'is_sellable' => false,
            ],
            [
                'code' => 'PRD0003',
                'name' => 'Olaplex No.3 100ml',
                'description' => 'At-home bond-building treatment that reduces breakage and strengthens hair between salon visits.',
                'product_category_id' => $hairCat?->id,
                'brand_id' => $olaplex?->id,
                'unit' => 'bottle',
                'cost_price' => 95.00,
                'retail_price' => 165.00,
                'reorder_level' => 3,
                'is_consumable' => true,
                'is_sellable' => true,
            ],
            [
                'code' => 'PRD0004',
                'name' => 'Facial Cleanser 200ml',
                'description' => 'Gentle daily cleanser that removes impurities without stripping natural moisture. Ideal for all skin types.',
                'product_category_id' => $skinCat?->id,
                'brand_id' => $dermalog?->id,
                'unit' => 'bottle',
                'cost_price' => 55.00,
                'retail_price' => 110.00,
                'reorder_level' => 4,
                'is_consumable' => true,
                'is_sellable' => true,
            ],
            [
                'code' => 'PRD0005',
                'name' => 'Nail Polish 15ml',
                'description' => 'Long-wear, chip-resistant nail lacquer in salon-favourite shades. High-gloss finish with smooth application.',
                'product_category_id' => $nailCat?->id,
                'brand_id' => $opi?->id,
                'unit' => 'bottle',
                'cost_price' => 12.00,
                'retail_price' => 35.00,
                'reorder_level' => 10,
                'is_consumable' => true,
                'is_sellable' => true,
            ],
            [
                'code' => 'PRD0006',
                'name' => 'Disposable Towels (Pack 50)',
                'product_category_id' => $consumableCat?->id,
                'brand_id' => $generic?->id,
                'unit' => 'pack',
                'cost_price' => 25.00,
                'retail_price' => 0,
                'reorder_level' => 8,
                'is_consumable' => true,
                'is_sellable' => false,
            ],
            [
                'code' => 'PRD0007',
                'name' => 'Cotton Pads (Box 200)',
                'product_category_id' => $consumableCat?->id,
                'brand_id' => $generic?->id,
                'unit' => 'box',
                'cost_price' => 15.00,
                'retail_price' => 0,
                'reorder_level' => 5,
                'is_consumable' => true,
                'is_sellable' => false,
            ],
            [
                'code' => 'PRD0008',
                'name' => 'Keratin Leave-In Serum 100ml',
                'description' => 'Lightweight leave-in serum that tames frizz, adds shine, and protects against heat styling up to 230°C.',
                'product_category_id' => $hairCat?->id,
                'brand_id' => $wella?->id,
                'unit' => 'bottle',
                'cost_price' => 38.00,
                'retail_price' => 72.00,
                'reorder_level' => 4,
                'is_consumable' => true,
                'is_sellable' => true,
            ],
            [
                'code' => 'PRD0009',
                'name' => 'Aromatherapy Body Oil 250ml',
                'description' => 'Nourishing blend of essential oils for massage and daily hydration. Absorbs quickly without greasy residue.',
                'product_category_id' => $spaCat?->id,
                'brand_id' => $generic?->id,
                'unit' => 'bottle',
                'cost_price' => 42.00,
                'retail_price' => 95.00,
                'reorder_level' => 3,
                'is_consumable' => true,
                'is_sellable' => true,
            ],
            [
                'code' => 'PRD0010',
                'name' => 'Luxury Lip Gloss 8ml',
                'description' => 'High-shine lip gloss with vitamin E and jojoba oil. Non-sticky formula in universally flattering nude rose.',
                'product_category_id' => $retailCat?->id,
                'brand_id' => $opi?->id,
                'unit' => 'tube',
                'cost_price' => 18.00,
                'retail_price' => 45.00,
                'reorder_level' => 6,
                'is_consumable' => true,
                'is_sellable' => true,
            ],
        ];

        foreach ($products as $index => $product) {
            Product::query()->updateOrCreate(
                ['company_id' => $company->id, 'code' => $product['code']],
                array_merge($product, [
                    'company_id' => $company->id,
                    'default_supplier_id' => $supplier?->id,
                    'vat_rate' => 5,
                    'vat_inclusive' => false,
                    'track_inventory' => true,
                    'is_active' => true,
                    'sort_order' => $index + 1,
                ])
            );
        }
    }
}
