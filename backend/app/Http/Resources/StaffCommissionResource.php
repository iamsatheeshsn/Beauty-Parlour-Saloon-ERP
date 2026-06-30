<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StaffCommissionResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'service_category_id' => $this->service_category_id,
            'name' => $this->name,
            'rate_type' => $this->rate_type,
            'rate_value' => $this->rate_value,
            'min_sale_amount' => $this->min_sale_amount,
            'is_active' => $this->is_active,
            'notes' => $this->notes,
            'service_category' => $this->whenLoaded('serviceCategory', fn () => [
                'id' => $this->serviceCategory?->id,
                'name' => $this->serviceCategory?->name,
            ]),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
