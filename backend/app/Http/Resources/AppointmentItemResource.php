<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AppointmentItemResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'salon_service_id' => $this->salon_service_id,
            'service_name' => $this->service_name,
            'duration_minutes' => $this->duration_minutes,
            'price' => $this->price,
            'staff_id' => $this->staff_id,
            'staff' => $this->whenLoaded('staff', fn () => [
                'id' => $this->staff?->id,
                'name' => $this->staff?->name,
            ]),
            'service' => $this->whenLoaded('service', fn () => [
                'id' => $this->service?->id,
                'name' => $this->service?->name,
                'code' => $this->service?->code,
            ]),
        ];
    }
}
