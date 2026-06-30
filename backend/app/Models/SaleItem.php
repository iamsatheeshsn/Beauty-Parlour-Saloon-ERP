<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SaleItem extends Model
{
    protected $fillable = [
        'sale_id',
        'line_type',
        'salon_service_id',
        'service_package_id',
        'appointment_item_id',
        'staff_id',
        'customer_package_id',
        'description',
        'quantity',
        'unit_price',
        'vat_rate',
        'vat_inclusive',
        'line_subtotal',
        'line_vat',
        'line_total',
        'points_redeemed',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
            'unit_price' => 'decimal:2',
            'vat_rate' => 'decimal:2',
            'vat_inclusive' => 'boolean',
            'line_subtotal' => 'decimal:2',
            'line_vat' => 'decimal:2',
            'line_total' => 'decimal:2',
            'points_redeemed' => 'integer',
            'sort_order' => 'integer',
        ];
    }

    public function sale(): BelongsTo
    {
        return $this->belongsTo(Sale::class);
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(SalonService::class, 'salon_service_id');
    }

    public function servicePackage(): BelongsTo
    {
        return $this->belongsTo(ServicePackage::class);
    }

    public function staff(): BelongsTo
    {
        return $this->belongsTo(User::class, 'staff_id');
    }
}
