<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StockPurchaseItemResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'stock_purchase_id' => $this->stock_purchase_id,
            'product_id' => $this->product_id,
            'quantity_ordered' => $this->quantity_ordered,
            'quantity_received' => $this->quantity_received,
            'unit_cost' => $this->unit_cost,
            'vat_rate' => $this->vat_rate,
            'line_subtotal' => $this->line_subtotal,
            'line_vat' => $this->line_vat,
            'line_total' => $this->line_total,
            'batch_number' => $this->batch_number,
            'expiry_date' => $this->expiry_date,
            'sort_order' => $this->sort_order,
            'product' => $this->whenLoaded('product', fn () => new ProductResource($this->product)),
            'remaining' => max(0, (float) $this->quantity_ordered - (float) $this->quantity_received),
        ];
    }
}
