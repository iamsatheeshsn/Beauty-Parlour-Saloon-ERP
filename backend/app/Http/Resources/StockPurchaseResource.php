<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StockPurchaseResource extends JsonResource
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
            'supplier_id' => $this->supplier_id,
            'code' => $this->code,
            'status' => $this->status,
            'reference' => $this->reference,
            'subtotal' => $this->subtotal,
            'vat_amount' => $this->vat_amount,
            'total_amount' => $this->total_amount,
            'notes' => $this->notes,
            'ordered_at' => $this->ordered_at?->toIso8601String(),
            'received_at' => $this->received_at?->toIso8601String(),
            'supplier' => $this->whenLoaded('supplier', fn () => new SupplierResource($this->supplier)),
            'branch' => $this->whenLoaded('branch', fn () => [
                'id' => $this->branch?->id,
                'name' => $this->branch?->name,
                'code' => $this->branch?->code,
            ]),
            'created_by' => $this->whenLoaded('createdBy', fn () => [
                'id' => $this->createdBy?->id,
                'name' => $this->createdBy?->name,
            ]),
            'received_by' => $this->whenLoaded('receivedBy', fn () => [
                'id' => $this->receivedBy?->id,
                'name' => $this->receivedBy?->name,
            ]),
            'items' => StockPurchaseItemResource::collection($this->whenLoaded('items')),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
