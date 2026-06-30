<?php

namespace App\Http\Resources;

use App\Support\WebsiteImageSettings;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SettingResource extends JsonResource
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
            'branch' => $this->whenLoaded('branch', fn () => new BranchResource($this->branch)),
            'group' => $this->group,
            'key' => $this->key,
            'value' => $this->value,
            'value_url' => WebsiteImageSettings::isImageKey($this->key) && $this->value
                ? WebsiteImageSettings::resolveUrl($this->value)
                : null,
            'casted_value' => $this->casted_value,
            'type' => $this->type?->value,
            'description' => $this->description,
            'is_public' => $this->is_public,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
