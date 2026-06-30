<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class CustomerPackage extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'company_id',
        'customer_id',
        'service_package_id',
        'branch_id',
        'sold_by',
        'sale_id',
        'code',
        'purchase_amount',
        'points_allocated',
        'points_remaining',
        'points_consumed',
        'status',
        'purchased_at',
        'expires_at',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'purchase_amount' => 'decimal:2',
            'points_allocated' => 'integer',
            'points_remaining' => 'integer',
            'points_consumed' => 'integer',
            'purchased_at' => 'datetime',
            'expires_at' => 'datetime',
        ];
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function servicePackage(): BelongsTo
    {
        return $this->belongsTo(ServicePackage::class);
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function soldBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sold_by');
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(CustomerPointTransaction::class);
    }
}
