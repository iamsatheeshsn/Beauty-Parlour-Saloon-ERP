<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ExpenseResource extends JsonResource
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
            'expense_category_id' => $this->expense_category_id,
            'payment_method_id' => $this->payment_method_id,
            'code' => $this->code,
            'vendor_name' => $this->vendor_name,
            'reference' => $this->reference,
            'description' => $this->description,
            'amount' => $this->amount,
            'vat_rate' => $this->vat_rate,
            'vat_amount' => $this->vat_amount,
            'total_amount' => $this->total_amount,
            'vat_inclusive' => $this->vat_inclusive,
            'expense_date' => $this->expense_date?->toDateString(),
            'receipt_url' => $this->receipt_path ? Storage::disk('public')->url($this->receipt_path) : null,
            'receipt_original_name' => $this->receipt_original_name,
            'has_receipt' => (bool) $this->receipt_path,
            'notes' => $this->notes,
            'category' => $this->whenLoaded('category', fn () => [
                'id' => $this->category?->id,
                'name' => $this->category?->name,
                'code' => $this->category?->code,
            ]),
            'branch' => $this->whenLoaded('branch', fn () => [
                'id' => $this->branch?->id,
                'name' => $this->branch?->name,
                'code' => $this->branch?->code,
            ]),
            'payment_method' => $this->whenLoaded('paymentMethod', fn () => [
                'id' => $this->paymentMethod?->id,
                'name' => $this->paymentMethod?->name,
                'code' => $this->paymentMethod?->code,
            ]),
            'created_by' => $this->whenLoaded('createdBy', fn () => [
                'id' => $this->createdBy?->id,
                'name' => $this->createdBy?->name,
            ]),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
