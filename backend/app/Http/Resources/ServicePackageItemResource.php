<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServicePackageItemResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'service_package_id' => $this->service_package_id,
            'service_id' => $this->service_id,
            'points_cost' => $this->points_cost,
            'quantity_included' => $this->quantity_included,
            'sort_order' => $this->sort_order,
            'service' => $this->whenLoaded('service', fn () => [
                'id' => $this->service?->id,
                'code' => $this->service?->code,
                'name' => $this->service?->name,
                'duration_minutes' => $this->service?->duration_minutes,
                'total_price' => $this->service?->totalPrice(),
            ]),
        ];
    }
}
