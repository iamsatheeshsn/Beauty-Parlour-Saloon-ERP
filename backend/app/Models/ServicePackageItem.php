<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ServicePackageItem extends Model
{
    protected $fillable = [
        'service_package_id',
        'service_id',
        'points_cost',
        'quantity_included',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'points_cost' => 'integer',
            'quantity_included' => 'integer',
            'sort_order' => 'integer',
        ];
    }

    public function package(): BelongsTo
    {
        return $this->belongsTo(ServicePackage::class, 'service_package_id');
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(SalonService::class, 'service_id');
    }
}
