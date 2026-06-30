<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ProductResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'company_id' => $this->company_id,
            'product_category_id' => $this->product_category_id,
            'brand_id' => $this->brand_id,
            'default_supplier_id' => $this->default_supplier_id,
            'code' => $this->code,
            'barcode' => $this->barcode,
            'name' => $this->name,
            'description' => $this->description,
            'image' => $this->image,
            'image_url' => $this->resolveImageUrl($this->image),
            'unit' => $this->unit,
            'cost_price' => $this->cost_price,
            'retail_price' => $this->retail_price,
            'vat_rate' => $this->vat_rate,
            'vat_inclusive' => $this->vat_inclusive,
            'track_inventory' => $this->track_inventory,
            'is_sellable' => $this->is_sellable,
            'is_consumable' => $this->is_consumable,
            'reorder_level' => $this->reorder_level,
            'reorder_quantity' => $this->reorder_quantity,
            'is_active' => $this->is_active,
            'sort_order' => $this->sort_order,
            'category' => $this->whenLoaded('category', fn () => [
                'id' => $this->category?->id,
                'name' => $this->category?->name,
                'code' => $this->category?->code,
            ]),
            'brand' => $this->whenLoaded('brand', fn () => [
                'id' => $this->brand?->id,
                'name' => $this->brand?->name,
                'code' => $this->brand?->code,
            ]),
            'default_supplier' => $this->whenLoaded('defaultSupplier', fn () => [
                'id' => $this->defaultSupplier?->id,
                'name' => $this->defaultSupplier?->name,
                'code' => $this->defaultSupplier?->code,
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
