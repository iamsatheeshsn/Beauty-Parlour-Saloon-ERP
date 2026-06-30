<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class StaffCommissionRule extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'company_id',
        'user_id',
        'service_category_id',
        'name',
        'rate_type',
        'rate_value',
        'min_sale_amount',
        'is_active',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'rate_value' => 'decimal:2',
            'min_sale_amount' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function serviceCategory(): BelongsTo
    {
        return $this->belongsTo(ServiceCategory::class);
    }
}
