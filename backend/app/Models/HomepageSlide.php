<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HomepageSlide extends Model
{
    protected $fillable = [
        'company_id',
        'eyebrow',
        'title',
        'subtitle',
        'cta_text',
        'cta_link',
        'secondary_cta_text',
        'secondary_cta_link',
        'image',
        'sort_order',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }
}
