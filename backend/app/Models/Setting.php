<?php

namespace App\Models;

use App\Enums\SettingTypeEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Setting extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'company_id',
        'branch_id',
        'group',
        'key',
        'value',
        'type',
        'description',
        'is_public',
    ];

    protected function casts(): array
    {
        return [
            'type' => SettingTypeEnum::class,
            'is_public' => 'boolean',
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

    public function getCastedValueAttribute(): mixed
    {
        return match ($this->type) {
            SettingTypeEnum::Boolean => filter_var($this->value, FILTER_VALIDATE_BOOLEAN),
            SettingTypeEnum::Integer => (int) $this->value,
            SettingTypeEnum::Json => json_decode($this->value ?? '[]', true),
            default => $this->value,
        };
    }
}
