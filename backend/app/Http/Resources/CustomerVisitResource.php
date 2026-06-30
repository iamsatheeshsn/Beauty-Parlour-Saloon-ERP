<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerVisitResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'customer_id' => $this->customer_id,
            'branch_id' => $this->branch_id,
            'staff_id' => $this->staff_id,
            'visited_at' => $this->visited_at?->toIso8601String(),
            'purpose' => $this->purpose,
            'services_summary' => $this->services_summary,
            'amount_spent' => $this->amount_spent,
            'notes' => $this->notes,
            'branch' => $this->whenLoaded('branch', fn () => [
                'id' => $this->branch?->id,
                'name' => $this->branch?->name,
            ]),
            'staff' => $this->whenLoaded('staff', fn () => [
                'id' => $this->staff?->id,
                'name' => $this->staff?->name,
            ]),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
