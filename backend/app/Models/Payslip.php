<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Payslip extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'company_id',
        'branch_id',
        'user_id',
        'generated_by',
        'approved_by',
        'code',
        'period_start',
        'period_end',
        'base_salary',
        'housing_allowance',
        'transport_allowance',
        'other_allowance',
        'gross_salary',
        'commission_amount',
        'leave_days',
        'leave_deduction',
        'other_deductions',
        'other_additions',
        'net_pay',
        'currency',
        'status',
        'approved_at',
        'paid_at',
        'notes',
        'calculation_snapshot',
    ];

    protected function casts(): array
    {
        return [
            'base_salary' => 'decimal:2',
            'housing_allowance' => 'decimal:2',
            'transport_allowance' => 'decimal:2',
            'other_allowance' => 'decimal:2',
            'gross_salary' => 'decimal:2',
            'commission_amount' => 'decimal:2',
            'leave_days' => 'integer',
            'leave_deduction' => 'decimal:2',
            'other_deductions' => 'decimal:2',
            'other_additions' => 'decimal:2',
            'net_pay' => 'decimal:2',
            'period_start' => 'date',
            'period_end' => 'date',
            'approved_at' => 'datetime',
            'paid_at' => 'datetime',
            'calculation_snapshot' => 'array',
        ];
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function generatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'generated_by');
    }

    public function approvedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function items(): HasMany
    {
        return $this->hasMany(PayslipItem::class)->orderBy('sort_order');
    }
}
