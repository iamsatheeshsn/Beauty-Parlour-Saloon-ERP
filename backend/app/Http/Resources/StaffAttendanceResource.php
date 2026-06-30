<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StaffAttendanceResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'branch_id' => $this->branch_id,
            'attendance_date' => $this->attendance_date?->format('Y-m-d'),
            'check_in' => $this->check_in,
            'check_out' => $this->check_out,
            'status' => $this->status,
            'notes' => $this->notes,
            'branch' => $this->whenLoaded('branch', fn () => [
                'id' => $this->branch?->id,
                'name' => $this->branch?->name,
            ]),
            'recorded_by' => $this->whenLoaded('recordedBy', fn () => [
                'id' => $this->recordedBy?->id,
                'name' => $this->recordedBy?->name,
            ]),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
