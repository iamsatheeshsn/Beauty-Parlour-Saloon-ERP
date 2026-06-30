<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BranchProductStockResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $reorderLevel = $this->reorder_level_override ?? $this->product?->reorder_level ?? 0;

        return [
            'id' => $this->id,
            'branch_id' => $this->branch_id,
            'product_id' => $this->product_id,
            'quantity_on_hand' => $this->quantity_on_hand,
            'reorder_level' => $reorderLevel,
            'reorder_level_override' => $this->reorder_level_override,
            'is_low_stock' => $reorderLevel > 0 && (float) $this->quantity_on_hand <= (float) $reorderLevel,
            'product' => $this->whenLoaded('product', fn () => new ProductResource($this->product)),
            'branch' => $this->whenLoaded('branch', fn () => [
                'id' => $this->branch?->id,
                'name' => $this->branch?->name,
            ]),
        ];
    }
}
