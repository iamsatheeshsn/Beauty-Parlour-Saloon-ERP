<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class ServicePackage extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'company_id',
        'code',
        'name',
        'description',
        'price',
        'points_included',
        'validity_days',
        'vat_rate',
        'vat_inclusive',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'points_included' => 'integer',
            'validity_days' => 'integer',
            'vat_rate' => 'decimal:2',
            'vat_inclusive' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(ServicePackageItem::class)->orderBy('sort_order');
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
