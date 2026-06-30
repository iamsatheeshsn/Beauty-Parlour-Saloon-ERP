<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class StaffSalary extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'company_id',
        'user_id',
        'base_salary',
        'housing_allowance',
        'transport_allowance',
        'other_allowance',
        'currency',
        'effective_from',
        'effective_to',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'base_salary' => 'decimal:2',
            'housing_allowance' => 'decimal:2',
            'transport_allowance' => 'decimal:2',
            'other_allowance' => 'decimal:2',
            'effective_from' => 'date',
            'effective_to' => 'date',
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

    public function totalSalary(): float
    {
        return (float) $this->base_salary
            + (float) $this->housing_allowance
            + (float) $this->transport_allowance
            + (float) $this->other_allowance;
    }
}
