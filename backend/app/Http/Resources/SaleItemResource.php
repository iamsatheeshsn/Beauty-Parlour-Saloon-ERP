<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SaleItemResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'line_type' => $this->line_type,
            'salon_service_id' => $this->salon_service_id,
            'service_package_id' => $this->service_package_id,
            'staff_id' => $this->staff_id,
            'customer_package_id' => $this->customer_package_id,
            'description' => $this->description,
            'quantity' => $this->quantity,
            'unit_price' => $this->unit_price,
            'vat_rate' => $this->vat_rate,
            'vat_inclusive' => $this->vat_inclusive,
            'line_subtotal' => $this->line_subtotal,
            'line_vat' => $this->line_vat,
            'line_total' => $this->line_total,
            'points_redeemed' => $this->points_redeemed,
            'service' => $this->whenLoaded('service', fn () => [
                'id' => $this->service?->id,
                'name' => $this->service?->name,
                'code' => $this->service?->code,
            ]),
            'service_package' => $this->whenLoaded('servicePackage', fn () => [
                'id' => $this->servicePackage?->id,
                'name' => $this->servicePackage?->name,
            ]),
            'staff' => $this->whenLoaded('staff', fn () => [
                'id' => $this->staff?->id,
                'name' => $this->staff?->name,
            ]),
        ];
    }
}
