<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PayslipResource extends JsonResource
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
            'user_id' => $this->user_id,
            'code' => $this->code,
            'period_start' => $this->period_start?->toDateString(),
            'period_end' => $this->period_end?->toDateString(),
            'base_salary' => $this->base_salary,
            'housing_allowance' => $this->housing_allowance,
            'transport_allowance' => $this->transport_allowance,
            'other_allowance' => $this->other_allowance,
            'gross_salary' => $this->gross_salary,
            'commission_amount' => $this->commission_amount,
            'leave_days' => $this->leave_days,
            'leave_deduction' => $this->leave_deduction,
            'other_deductions' => $this->other_deductions,
            'other_additions' => $this->other_additions,
            'net_pay' => $this->net_pay,
            'currency' => $this->currency,
            'status' => $this->status,
            'approved_at' => $this->approved_at?->toIso8601String(),
            'paid_at' => $this->paid_at?->toIso8601String(),
            'notes' => $this->notes,
            'calculation_snapshot' => $this->calculation_snapshot,
            'user' => $this->whenLoaded('user', fn () => [
                'id' => $this->user?->id,
                'name' => $this->user?->name,
                'employee_code' => $this->user?->employee_code,
                'email' => $this->user?->email,
            ]),
            'branch' => $this->whenLoaded('branch', fn () => [
                'id' => $this->branch?->id,
                'name' => $this->branch?->name,
            ]),
            'generated_by' => $this->whenLoaded('generatedBy', fn () => [
                'id' => $this->generatedBy?->id,
                'name' => $this->generatedBy?->name,
            ]),
            'approved_by' => $this->whenLoaded('approvedByUser', fn () => [
                'id' => $this->approvedByUser?->id,
                'name' => $this->approvedByUser?->name,
            ]),
            'items' => PayslipItemResource::collection($this->whenLoaded('items')),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
