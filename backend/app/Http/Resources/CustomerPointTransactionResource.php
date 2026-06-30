<?php

namespace App\Http\Resources;

use App\Enums\PointTransactionTypeEnum;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerPointTransactionResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $type = PointTransactionTypeEnum::tryFrom($this->type);

        return [
            'id' => $this->id,
            'customer_id' => $this->customer_id,
            'customer_package_id' => $this->customer_package_id,
            'appointment_id' => $this->appointment_id,
            'service_id' => $this->service_id,
            'type' => $this->type,
            'type_label' => $type?->label() ?? $this->type,
            'points' => $this->points,
            'balance_after' => $this->balance_after,
            'reference' => $this->reference,
            'description' => $this->description,
            'customer' => $this->whenLoaded('customer', fn () => [
                'id' => $this->customer?->id,
                'name' => $this->customer?->name,
                'phone' => $this->customer?->phone,
            ]),
            'customer_package' => $this->whenLoaded('customerPackage', fn () => [
                'id' => $this->customerPackage?->id,
                'code' => $this->customerPackage?->code,
            ]),
            'service' => $this->whenLoaded('service', fn () => [
                'id' => $this->service?->id,
                'name' => $this->service?->name,
            ]),
            'created_by' => $this->whenLoaded('createdBy', fn () => [
                'id' => $this->createdBy?->id,
                'name' => $this->createdBy?->name,
            ]),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
