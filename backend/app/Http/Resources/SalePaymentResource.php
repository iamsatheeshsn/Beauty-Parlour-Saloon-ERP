<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SalePaymentResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'payment_method_id' => $this->payment_method_id,
            'amount' => $this->amount,
            'reference' => $this->reference,
            'status' => $this->status,
            'paid_at' => $this->paid_at?->toIso8601String(),
            'payment_method' => $this->whenLoaded('paymentMethod', fn () => [
                'id' => $this->paymentMethod?->id,
                'name' => $this->paymentMethod?->name,
                'code' => $this->paymentMethod?->code,
            ]),
        ];
    }
}
