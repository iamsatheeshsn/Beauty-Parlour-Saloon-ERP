<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class SalonService extends Model
{
    use SoftDeletes;

    protected $table = 'services';

    protected $fillable = [
        'company_id',
        'service_category_id',
        'code',
        'name',
        'description',
        'image',
        'duration_minutes',
        'price',
        'vat_rate',
        'vat_inclusive',
        'commission_rate',
        'commission_type',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'duration_minutes' => 'integer',
            'price' => 'decimal:2',
            'vat_rate' => 'decimal:2',
            'vat_inclusive' => 'boolean',
            'commission_rate' => 'decimal:2',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(ServiceCategory::class, 'service_category_id');
    }

    public function vatAmount(): float
    {
        $price = (float) $this->price;
        $rate = (float) $this->vat_rate / 100;

        if ($this->vat_inclusive) {
            return round($price - ($price / (1 + $rate)), 2);
        }

        return round($price * $rate, 2);
    }

    public function totalPrice(): float
    {
        $price = (float) $this->price;

        return $this->vat_inclusive ? $price : round($price + $this->vatAmount(), 2);
    }
}
