<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PayslipItem extends Model
{
    protected $fillable = [
        'payslip_id',
        'type',
        'description',
        'amount',
        'is_deduction',
        'reference_type',
        'reference_id',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'is_deduction' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function payslip(): BelongsTo
    {
        return $this->belongsTo(Payslip::class);
    }
}
