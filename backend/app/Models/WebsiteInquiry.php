<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WebsiteInquiry extends Model
{
    protected $fillable = [
        'company_id',
        'code',
        'type',
        'status',
        'name',
        'phone',
        'email',
        'subject',
        'product_name',
        'message',
        'read_at',
        'responded_at',
    ];

    protected function casts(): array
    {
        return [
            'read_at' => 'datetime',
            'responded_at' => 'datetime',
        ];
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }
}
