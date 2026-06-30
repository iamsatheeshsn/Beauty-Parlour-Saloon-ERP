<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CompanyResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'name' => $this->name,
            'trade_name' => $this->trade_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'website' => $this->website,
            'address' => $this->address,
            'postal_code' => $this->postal_code,
            'country_id' => $this->country_id,
            'emirate_id' => $this->emirate_id,
            'city_id' => $this->city_id,
            'country' => $this->whenLoaded('countryRelation', fn () => new CountryResource($this->countryRelation)),
            'emirate' => $this->whenLoaded('emirate', fn () => new EmirateResource($this->emirate)),
            'city' => $this->whenLoaded('cityRelation', fn () => new CityResource($this->cityRelation)),
            'trn_number' => $this->trn_number,
            'logo' => $this->logo,
            'timezone' => $this->timezone,
            'currency' => $this->currency,
            'vat_rate' => $this->vat_rate,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
