<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StaffSalaryResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'base_salary' => $this->base_salary,
            'housing_allowance' => $this->housing_allowance,
            'transport_allowance' => $this->transport_allowance,
            'other_allowance' => $this->other_allowance,
            'total_salary' => $this->totalSalary(),
            'currency' => $this->currency,
            'effective_from' => $this->effective_from?->format('Y-m-d'),
            'effective_to' => $this->effective_to?->format('Y-m-d'),
            'notes' => $this->notes,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
