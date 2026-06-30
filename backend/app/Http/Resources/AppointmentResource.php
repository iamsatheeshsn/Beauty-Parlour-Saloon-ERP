<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AppointmentResource extends JsonResource
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
            'staff_id' => $this->staff_id,
            'code' => $this->code,
            'type' => $this->type,
            'status' => $this->status,
            'scheduled_at' => $this->scheduled_at?->toIso8601String(),
            'ends_at' => $this->ends_at?->toIso8601String(),
            'duration_minutes' => $this->duration_minutes,
            'total_amount' => $this->total_amount,
            'notes' => $this->notes,
            'cancellation_reason' => $this->cancellation_reason,
            'checked_in_at' => $this->checked_in_at?->toIso8601String(),
            'completed_at' => $this->completed_at?->toIso8601String(),
            'customer' => $this->whenLoaded('customer', fn () => [
                'id' => $this->customer?->id,
                'name' => $this->customer?->name,
                'phone' => $this->customer?->phone,
                'code' => $this->customer?->code,
            ]),
            'staff' => $this->whenLoaded('staff', fn () => [
                'id' => $this->staff?->id,
                'name' => $this->staff?->name,
            ]),
            'branch' => $this->whenLoaded('branch', fn () => [
                'id' => $this->branch?->id,
                'name' => $this->branch?->name,
            ]),
            'booked_by' => $this->whenLoaded('bookedBy', fn () => [
                'id' => $this->bookedBy?->id,
                'name' => $this->bookedBy?->name,
            ]),
            'items' => AppointmentItemResource::collection($this->whenLoaded('items')),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
