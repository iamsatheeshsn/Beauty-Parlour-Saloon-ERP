<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SaleResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'company_id' => $this->company_id,
            'branch_id' => $this->branch_id,
            'customer_id' => $this->customer_id,
            'appointment_id' => $this->appointment_id,
            'code' => $this->code,
            'type' => $this->type,
            'status' => $this->status,
            'discount_type' => $this->discount_type,
            'discount_value' => $this->discount_value,
            'subtotal' => $this->subtotal,
            'discount_amount' => $this->discount_amount,
            'vat_amount' => $this->vat_amount,
            'total_amount' => $this->total_amount,
            'amount_paid' => $this->amount_paid,
            'currency' => $this->currency,
            'vat_rate_snapshot' => $this->vat_rate_snapshot,
            'trn_snapshot' => $this->trn_snapshot,
            'points_redeemed' => $this->points_redeemed,
            'notes' => $this->notes,
            'paid_at' => $this->paid_at?->toIso8601String(),
            'customer' => $this->whenLoaded('customer', fn () => [
                'id' => $this->customer?->id,
                'name' => $this->customer?->name,
                'phone' => $this->customer?->phone,
                'code' => $this->customer?->code,
            ]),
            'branch' => $this->whenLoaded('branch', fn () => [
                'id' => $this->branch?->id,
                'name' => $this->branch?->name,
                'address' => $this->branch?->address,
            ]),
            'sold_by' => $this->whenLoaded('soldBy', fn () => [
                'id' => $this->soldBy?->id,
                'name' => $this->soldBy?->name,
            ]),
            'items' => SaleItemResource::collection($this->whenLoaded('items')),
            'payments' => SalePaymentResource::collection($this->whenLoaded('payments')),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
