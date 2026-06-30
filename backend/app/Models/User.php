<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, HasRoles, Notifiable, SoftDeletes;

    protected $fillable = [
        'company_id',
        'branch_id',
        'department_id',
        'staff_designation_id',
        'employee_code',
        'name',
        'email',
        'phone',
        'date_of_birth',
        'gender',
        'nationality',
        'joining_date',
        'employment_type',
        'emirates_id',
        'visa_number',
        'visa_expiry',
        'address',
        'emergency_contact_name',
        'emergency_contact_phone',
        'staff_notes',
        'avatar',
        'password',
        'is_active',
        'last_login_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
            'date_of_birth' => 'date',
            'joining_date' => 'date',
            'visa_expiry' => 'date',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function staffDesignation(): BelongsTo
    {
        return $this->belongsTo(StaffDesignation::class);
    }

    public function activityLogs(): HasMany
    {
        return $this->hasMany(ActivityLog::class);
    }

    public function staffDocuments(): HasMany
    {
        return $this->hasMany(StaffDocument::class);
    }

    public function staffSalaries(): HasMany
    {
        return $this->hasMany(StaffSalary::class);
    }

    public function staffAttendance(): HasMany
    {
        return $this->hasMany(StaffAttendance::class);
    }

    public function staffLeaveRequests(): HasMany
    {
        return $this->hasMany(StaffLeaveRequest::class);
    }

    public function staffCommissionRules(): HasMany
    {
        return $this->hasMany(StaffCommissionRule::class);
    }

    public function currentSalary(): ?StaffSalary
    {
        return $this->staffSalaries()
            ->where('effective_from', '<=', now())
            ->where(function ($q) {
                $q->whereNull('effective_to')->orWhere('effective_to', '>=', now());
            })
            ->orderByDesc('effective_from')
            ->first();
    }
}
