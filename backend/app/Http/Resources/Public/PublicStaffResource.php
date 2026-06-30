<?php

namespace App\Http\Resources\Public;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class PublicStaffResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'avatar' => $this->resolveAvatarUrl($this->avatar),
            'designation' => $this->whenLoaded('staffDesignation', fn () => $this->staffDesignation?->name),
            'department' => $this->whenLoaded('department', fn () => $this->department?->name),
        ];
    }

    private function resolveAvatarUrl(?string $avatar): ?string
    {
        if (! $avatar) {
            return null;
        }

        if (str_starts_with($avatar, 'http://') || str_starts_with($avatar, 'https://')) {
            return $avatar;
        }

        return Storage::disk('public')->url($avatar);
    }
}
