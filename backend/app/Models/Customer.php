<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Customer extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'company_id',
        'branch_id',
        'code',
        'name',
        'phone',
        'email',
        'gender',
        'date_of_birth',
        'address',
        'emirate_id',
        'city_id',
        'photo',
        'summary',
        'total_visits',
        'total_spent',
        'last_visit_at',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
            'total_spent' => 'decimal:2',
            'total_visits' => 'integer',
            'last_visit_at' => 'datetime',
            'is_active' => 'boolean',
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

    public function emirate(): BelongsTo
    {
        return $this->belongsTo(Emirate::class);
    }

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    public function notes(): HasMany
    {
        return $this->hasMany(CustomerNote::class)->latest();
    }

    public function visits(): HasMany
    {
        return $this->hasMany(CustomerVisit::class)->latest('visited_at');
    }
}
