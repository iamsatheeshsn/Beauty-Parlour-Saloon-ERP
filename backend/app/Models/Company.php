<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Company extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'code',
        'name',
        'trade_name',
        'email',
        'phone',
        'website',
        'address',
        'postal_code',
        'country_id',
        'emirate_id',
        'city_id',
        'city',
        'country',
        'trn_number',
        'logo',
        'timezone',
        'currency',
        'vat_rate',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'vat_rate' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    public function countryRelation(): BelongsTo
    {
        return $this->belongsTo(Country::class, 'country_id');
    }

    public function emirate(): BelongsTo
    {
        return $this->belongsTo(Emirate::class);
    }

    public function cityRelation(): BelongsTo
    {
        return $this->belongsTo(City::class, 'city_id');
    }

    public function branches(): HasMany
    {
        return $this->hasMany(Branch::class);
    }

    public function departments(): HasMany
    {
        return $this->hasMany(Department::class);
    }

    public function staffDesignations(): HasMany
    {
        return $this->hasMany(StaffDesignation::class);
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function settings(): HasMany
    {
        return $this->hasMany(Setting::class);
    }
}
