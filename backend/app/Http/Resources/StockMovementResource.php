<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StockMovementResource extends JsonResource
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
            'product_id' => $this->product_id,
            'stock_purchase_id' => $this->stock_purchase_id,
            'type' => $this->type,
            'quantity' => $this->quantity,
            'balance_after' => $this->balance_after,
            'unit_cost' => $this->unit_cost,
            'reference' => $this->reference,
            'description' => $this->description,
            'product' => $this->whenLoaded('product', fn () => new ProductResource($this->product)),
            'branch' => $this->whenLoaded('branch', fn () => [
                'id' => $this->branch?->id,
                'name' => $this->branch?->name,
            ]),
            'created_by' => $this->whenLoaded('createdBy', fn () => [
                'id' => $this->createdBy?->id,
                'name' => $this->createdBy?->name,
            ]),
            'purchase' => $this->whenLoaded('purchase', fn () => [
                'id' => $this->purchase?->id,
                'code' => $this->purchase?->code,
            ]),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
