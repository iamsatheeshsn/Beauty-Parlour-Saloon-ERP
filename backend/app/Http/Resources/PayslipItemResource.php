<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PayslipItemResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            'description' => $this->description,
            'amount' => $this->amount,
            'is_deduction' => $this->is_deduction,
            'reference_type' => $this->reference_type,
            'reference_id' => $this->reference_id,
            'sort_order' => $this->sort_order,
        ];
    }
}
