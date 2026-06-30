<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerPackageResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'company_id' => $this->company_id,
            'customer_id' => $this->customer_id,
            'service_package_id' => $this->service_package_id,
            'branch_id' => $this->branch_id,
            'code' => $this->code,
            'purchase_amount' => $this->purchase_amount,
            'points_allocated' => $this->points_allocated,
            'points_remaining' => $this->points_remaining,
            'points_consumed' => $this->points_consumed,
            'status' => $this->status,
            'purchased_at' => $this->purchased_at?->toIso8601String(),
            'expires_at' => $this->expires_at?->toIso8601String(),
            'notes' => $this->notes,
            'customer' => $this->whenLoaded('customer', fn () => [
                'id' => $this->customer?->id,
                'name' => $this->customer?->name,
                'phone' => $this->customer?->phone,
                'code' => $this->customer?->code,
            ]),
            'service_package' => $this->whenLoaded('servicePackage', fn () => [
                'id' => $this->servicePackage?->id,
                'code' => $this->servicePackage?->code,
                'name' => $this->servicePackage?->name,
                'points_included' => $this->servicePackage?->points_included,
            ]),
            'branch' => $this->whenLoaded('branch', fn () => [
                'id' => $this->branch?->id,
                'name' => $this->branch?->name,
            ]),
            'sold_by' => $this->whenLoaded('soldBy', fn () => [
                'id' => $this->soldBy?->id,
                'name' => $this->soldBy?->name,
            ]),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
