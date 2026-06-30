<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class SalonServiceResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'company_id' => $this->company_id,
            'service_category_id' => $this->service_category_id,
            'code' => $this->code,
            'name' => $this->name,
            'description' => $this->description,
            'image' => $this->image,
            'image_url' => $this->resolveImageUrl($this->image),
            'duration_minutes' => $this->duration_minutes,
            'price' => $this->price,
            'vat_rate' => $this->vat_rate,
            'vat_inclusive' => $this->vat_inclusive,
            'vat_amount' => $this->vatAmount(),
            'total_price' => $this->totalPrice(),
            'commission_rate' => $this->commission_rate,
            'commission_type' => $this->commission_type,
            'is_active' => $this->is_active,
            'sort_order' => $this->sort_order,
            'category' => $this->whenLoaded('category', fn () => [
                'id' => $this->category?->id,
                'name' => $this->category?->name,
                'code' => $this->category?->code,
                'color' => $this->category?->color,
            ]),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }

    private function resolveImageUrl(?string $image): ?string
    {
        if (! $image) {
            return null;
        }

        if (str_starts_with($image, 'http://') || str_starts_with($image, 'https://')) {
            return $image;
        }

        return Storage::disk('public')->url($image);
    }
}
