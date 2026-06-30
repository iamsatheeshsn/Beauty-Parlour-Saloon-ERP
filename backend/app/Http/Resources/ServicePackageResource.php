<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServicePackageResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'company_id' => $this->company_id,
            'code' => $this->code,
            'name' => $this->name,
            'description' => $this->description,
            'price' => $this->price,
            'points_included' => $this->points_included,
            'validity_days' => $this->validity_days,
            'vat_rate' => $this->vat_rate,
            'vat_inclusive' => $this->vat_inclusive,
            'vat_amount' => $this->vatAmount(),
            'total_price' => $this->totalPrice(),
            'is_active' => $this->is_active,
            'sort_order' => $this->sort_order,
            'items' => ServicePackageItemResource::collection($this->whenLoaded('items')),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
