<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BranchResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'company_id' => $this->company_id,
            'name' => $this->name,
            'code' => $this->code,
            'email' => $this->email,
            'phone' => $this->phone,
            'address' => $this->address,
            'country_id' => $this->country_id,
            'emirate_id' => $this->emirate_id,
            'city_id' => $this->city_id,
            'country' => $this->whenLoaded('country', fn () => new CountryResource($this->country)),
            'emirate' => $this->whenLoaded('emirate', fn () => new EmirateResource($this->emirate)),
            'city' => $this->whenLoaded('city', fn () => new CityResource($this->city)),
            'postal_code' => $this->postal_code,
            'is_head_office' => $this->is_head_office,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
