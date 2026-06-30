<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class UserResource extends JsonResource
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
            'department_id' => $this->department_id,
            'staff_designation_id' => $this->staff_designation_id,
            'employee_code' => $this->employee_code,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'date_of_birth' => $this->date_of_birth?->format('Y-m-d'),
            'gender' => $this->gender,
            'nationality' => $this->nationality,
            'joining_date' => $this->joining_date?->format('Y-m-d'),
            'employment_type' => $this->employment_type,
            'emirates_id' => $this->emirates_id,
            'visa_number' => $this->visa_number,
            'visa_expiry' => $this->visa_expiry?->format('Y-m-d'),
            'address' => $this->address,
            'emergency_contact_name' => $this->emergency_contact_name,
            'emergency_contact_phone' => $this->emergency_contact_phone,
            'staff_notes' => $this->staff_notes,
            'avatar' => $this->resolveAvatarUrl($this->avatar),
            'is_active' => $this->is_active,
            'last_login_at' => $this->last_login_at?->toIso8601String(),
            'roles' => $this->whenLoaded('roles', fn () => $this->roles->pluck('name')),
            'role' => $this->whenLoaded('roles', fn () => $this->roles->first()?->name),
            'permissions' => $this->whenLoaded('permissions', fn () => $this->getAllPermissions()->pluck('name')),
            'branch' => $this->whenLoaded('branch', fn () => [
                'id' => $this->branch?->id,
                'name' => $this->branch?->name,
            ]),
            'department' => $this->whenLoaded('department', fn () => [
                'id' => $this->department?->id,
                'name' => $this->department?->name,
            ]),
            'staff_designation' => $this->whenLoaded('staffDesignation', fn () => [
                'id' => $this->staffDesignation?->id,
                'name' => $this->staffDesignation?->name,
            ]),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
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
