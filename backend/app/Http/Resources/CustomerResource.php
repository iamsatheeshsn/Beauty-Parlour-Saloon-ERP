<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class CustomerResource extends JsonResource
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
            'code' => $this->code,
            'name' => $this->name,
            'phone' => $this->phone,
            'email' => $this->email,
            'gender' => $this->gender,
            'date_of_birth' => $this->date_of_birth?->format('Y-m-d'),
            'address' => $this->address,
            'emirate_id' => $this->emirate_id,
            'city_id' => $this->city_id,
            'photo' => $this->photo ? Storage::disk('public')->url($this->photo) : null,
            'summary' => $this->summary,
            'total_visits' => $this->total_visits,
            'total_spent' => $this->total_spent,
            'last_visit_at' => $this->last_visit_at?->toIso8601String(),
            'is_active' => $this->is_active,
            'branch' => $this->whenLoaded('branch', fn () => new BranchResource($this->branch)),
            'emirate' => $this->whenLoaded('emirate', fn () => new EmirateResource($this->emirate)),
            'city' => $this->whenLoaded('city', fn () => new CityResource($this->city)),
            'notes' => CustomerNoteResource::collection($this->whenLoaded('notes')),
            'visits' => CustomerVisitResource::collection($this->whenLoaded('visits')),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
