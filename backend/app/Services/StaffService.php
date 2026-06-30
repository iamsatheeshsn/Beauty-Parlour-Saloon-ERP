<?php

namespace App\Services;

use App\Enums\EmploymentTypeEnum;
use App\Enums\GenderEnum;
use App\Exceptions\ApiException;
use App\Models\User;
use App\Repositories\StaffAttendanceRepository;
use App\Repositories\StaffCommissionRepository;
use App\Repositories\StaffDocumentRepository;
use App\Repositories\StaffLeaveRepository;
use App\Repositories\StaffRepository;
use App\Repositories\StaffSalaryRepository;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;

class StaffService
{
    public function __construct(
        private readonly StaffRepository $staffRepository,
        private readonly UserService $userService,
        private readonly StaffAttendanceRepository $attendanceRepository,
        private readonly StaffLeaveRepository $leaveRepository,
        private readonly StaffDocumentRepository $documentRepository,
        private readonly StaffSalaryRepository $salaryRepository,
        private readonly StaffCommissionRepository $commissionRepository,
    ) {
    }

    public function resolveCompanyId(Request $request): ?int
    {
        return $request->user()?->company_id;
    }

    public function paginate(Request $request): LengthAwarePaginator
    {
        $companyId = $this->resolveCompanyId($request);

        if (! $companyId) {
            throw new ApiException('Company context required', 422);
        }

        return $this->staffRepository->paginate(
            $companyId,
            (int) $request->input('per_page', 15),
            $request->input('search'),
            $request->input('branch_id') ? (int) $request->input('branch_id') : null,
            $request->input('role')
        );
    }

    public function findOrFail(int $id, ?int $companyId): User
    {
        if (! $companyId) {
            throw new ApiException('Company context required', 422);
        }

        $user = $this->staffRepository->findById($id, $companyId);

        if (! $user) {
            throw new ApiException('Staff member not found', 404);
        }

        return $user;
    }

    public function findWithDetails(int $id, ?int $companyId): User
    {
        if (! $companyId) {
            throw new ApiException('Company context required', 422);
        }

        $user = $this->staffRepository->findWithDetails($id, $companyId);

        if (! $user) {
            throw new ApiException('Staff member not found', 404);
        }

        return $user;
    }

    public function storeRules(?int $companyId): array
    {
        return array_merge($this->userService->storeRules($companyId), $this->profileRules());
    }

    public function updateRules(int $id, ?int $companyId): array
    {
        return array_merge($this->userService->updateRules($id, $companyId), $this->profileRules(true));
    }

    /**
     * @return array<string, mixed>
     */
    protected function profileRules(bool $sometimes = false): array
    {
        $prefix = $sometimes ? 'sometimes|' : '';

        return [
            'date_of_birth' => [$sometimes ? 'sometimes' : 'nullable', 'date', 'before:today'],
            'gender' => ['nullable', \Illuminate\Validation\Rule::enum(GenderEnum::class)],
            'nationality' => ['nullable', 'string', 'max:100'],
            'joining_date' => ['nullable', 'date'],
            'employment_type' => ['nullable', \Illuminate\Validation\Rule::enum(EmploymentTypeEnum::class)],
            'emirates_id' => ['nullable', 'string', 'max:30'],
            'visa_number' => ['nullable', 'string', 'max:50'],
            'visa_expiry' => ['nullable', 'date'],
            'address' => ['nullable', 'string'],
            'emergency_contact_name' => ['nullable', 'string', 'max:255'],
            'emergency_contact_phone' => ['nullable', 'string', 'max:30'],
            'staff_notes' => ['nullable', 'string'],
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data, ?int $companyId, Request $request): User
    {
        return $this->userService->create($data, $companyId, $request);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(int $id, array $data, ?int $companyId, Request $request): User
    {
        return $this->userService->update($id, $data, $companyId, $request);
    }

    public function delete(int $id, ?int $companyId, Request $request): void
    {
        $this->userService->delete($id, $companyId, $request);
    }

    public function countActive(?int $companyId): int
    {
        if (! $companyId) {
            return 0;
        }

        return $this->staffRepository->countActive($companyId);
    }

    /**
     * @return array<string, mixed>
     */
    public function companyDashboard(?int $companyId): array
    {
        if (! $companyId) {
            return [];
        }

        $month = now()->format('Y-m');

        return [
            'active_staff' => $this->staffRepository->countActive($companyId),
            'pending_leave' => $this->leaveRepository->pendingForCompany($companyId)->count(),
            'expiring_documents' => $this->documentRepository->expiringSoon($companyId)->count(),
            'attendance_today' => \App\Models\StaffAttendance::query()
                ->where('company_id', $companyId)
                ->whereDate('attendance_date', today())
                ->where('status', 'present')
                ->count(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function memberDashboard(int $userId, ?int $companyId): array
    {
        $user = $this->findOrFail($userId, $companyId);
        $month = now()->format('Y-m');
        $currentSalary = $this->salaryRepository->currentForUser($userId, $companyId ?? 0);

        return [
            'staff' => $user,
            'attendance_summary' => $this->attendanceRepository->monthSummary($userId, $companyId ?? 0, $month),
            'current_salary' => $currentSalary,
            'commission_rules' => $this->commissionRepository->listForUser($userId, $companyId ?? 0)->where('is_active', true)->count(),
            'pending_leave' => $user->staffLeaveRequests()->where('status', 'pending')->count(),
            'approved_leave_days' => $user->staffLeaveRequests()
                ->where('status', 'approved')
                ->whereYear('start_date', now()->year)
                ->sum('days'),
            'recent_attendance' => $this->attendanceRepository->listForUser($userId, $companyId ?? 0)->take(5),
            'expiring_documents' => $user->staffDocuments()
                ->whereNotNull('expiry_date')
                ->whereBetween('expiry_date', [now(), now()->addDays(30)])
                ->count(),
        ];
    }

    public function uploadAvatar(int $id, ?int $companyId, UploadedFile $file, Request $request): User
    {
        $user = $this->findOrFail($id, $companyId);

        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
        }

        $path = $file->store("staff/{$user->id}", 'public');
        $user->update(['avatar' => $path]);

        return $user->fresh(['roles', 'branch', 'department', 'staffDesignation']);
    }

    public function deleteAvatar(int $id, ?int $companyId, Request $request): User
    {
        $user = $this->findOrFail($id, $companyId);

        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
            $user->update(['avatar' => null]);
        }

        return $user->fresh(['roles', 'branch', 'department', 'staffDesignation']);
    }
}
