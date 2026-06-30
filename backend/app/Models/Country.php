<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Country extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'iso_code',
        'iso3_code',
        'phone_code',
        'currency_code',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function emirates(): HasMany
    {
        return $this->hasMany(Emirate::class);
    }

    public function cities(): HasMany
    {
        return $this->hasMany(City::class);
    }
}
