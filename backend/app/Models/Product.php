<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'company_id',
        'product_category_id',
        'brand_id',
        'default_supplier_id',
        'code',
        'barcode',
        'name',
        'description',
        'image',
        'unit',
        'cost_price',
        'retail_price',
        'vat_rate',
        'vat_inclusive',
        'track_inventory',
        'is_sellable',
        'is_consumable',
        'reorder_level',
        'reorder_quantity',
        'sort_order',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'cost_price' => 'decimal:2',
            'retail_price' => 'decimal:2',
            'vat_rate' => 'decimal:2',
            'vat_inclusive' => 'boolean',
            'track_inventory' => 'boolean',
            'is_sellable' => 'boolean',
            'is_consumable' => 'boolean',
            'reorder_level' => 'decimal:3',
            'reorder_quantity' => 'decimal:3',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(ProductCategory::class, 'product_category_id');
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function defaultSupplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class, 'default_supplier_id');
    }

    public function branchStock(): HasMany
    {
        return $this->hasMany(BranchProductStock::class);
    }
}
