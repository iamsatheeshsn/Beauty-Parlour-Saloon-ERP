<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockPurchaseItem extends Model
{
    protected $fillable = [
        'stock_purchase_id',
        'product_id',
        'quantity_ordered',
        'quantity_received',
        'unit_cost',
        'vat_rate',
        'line_subtotal',
        'line_vat',
        'line_total',
        'expiry_date',
        'batch_number',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'quantity_ordered' => 'decimal:3',
            'quantity_received' => 'decimal:3',
            'unit_cost' => 'decimal:2',
            'vat_rate' => 'decimal:2',
            'line_subtotal' => 'decimal:2',
            'line_vat' => 'decimal:2',
            'line_total' => 'decimal:2',
            'expiry_date' => 'date',
            'sort_order' => 'integer',
        ];
    }

    public function purchase(): BelongsTo
    {
        return $this->belongsTo(StockPurchase::class, 'stock_purchase_id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
