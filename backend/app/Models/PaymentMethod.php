<?php

namespace App\Models;

use App\Enums\PaymentMethodTypeEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class PaymentMethod extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'company_id',
        'name',
        'code',
        'type',
        'description',
        'requires_reference',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'type' => PaymentMethodTypeEnum::class,
            'requires_reference' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }
}
