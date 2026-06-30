<?php

namespace App\Services;

use App\Enums\ActivityActionEnum;
use App\Enums\CommissionRateTypeEnum;
use App\Enums\LeaveStatusEnum;
use App\Enums\LeaveTypeEnum;
use App\Enums\PayslipStatusEnum;
use App\Enums\SaleStatusEnum;
use App\Exceptions\ApiException;
use App\Models\Payslip;
use App\Models\PayslipItem;
use App\Models\SaleItem;
use App\Models\StaffCommissionRule;
use App\Models\StaffLeaveRequest;
use App\Models\User;
use App\Repositories\PayslipRepository;
use App\Repositories\StaffCommissionRepository;
use App\Repositories\StaffLeaveRepository;
use App\Repositories\StaffRepository;
use App\Repositories\StaffSalaryRepository;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class PayrollService
{
    private const DAILY_DIVISOR = 30;

    public function __construct(
        private readonly PayslipRepository $payslipRepository,
        private readonly StaffSalaryRepository $salaryRepository,
        private readonly StaffCommissionRepository $commissionRepository,
        private readonly StaffLeaveRepository $leaveRepository,
        private readonly StaffRepository $staffRepository,
        private readonly StaffService $staffService,
        private readonly ActivityLogService $activityLogService
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

        return $this->payslipRepository->paginate(
            $companyId,
            (int) $request->input('per_page', 15),
            $request->only(['search', 'user_id', 'status', 'period_start', 'period_end'])
        );
    }

    public function findOrFail(int $id, ?int $companyId): Payslip
    {
        if (! $companyId) {
            throw new ApiException('Company context required', 422);
        }

        $payslip = $this->payslipRepository->findById($id, $companyId);
        if (! $payslip) {
            throw new ApiException('Payslip not found', 404);
        }

        return $payslip;
    }

    public function previewRules(): array
    {
        return [
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'period_start' => ['required', 'date'],
            'period_end' => ['required', 'date', 'after_or_equal:period_start'],
        ];
    }

    public function generateRules(): array
    {
        return [
            'user_id' => ['nullable', 'integer', 'exists:users,id'],
            'period_start' => ['required', 'date'],
            'period_end' => ['required', 'date', 'after_or_equal:period_start'],
            'notes' => ['nullable', 'string'],
            'other_deductions' => ['nullable', 'numeric', 'min:0'],
            'other_additions' => ['nullable', 'numeric', 'min:0'],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function staffOverview(?int $companyId, string $periodStart, string $periodEnd): array
    {
        if (! $companyId) {
            return [];
        }

        $staff = $this->staffRepository->listAll($companyId);
        $existingPayslips = $this->payslipRepository->forPeriod($companyId, $periodStart, $periodEnd)
            ->keyBy('user_id');

        return $staff->map(function (User $user) use ($companyId, $periodStart, $periodEnd, $existingPayslips) {
            $salary = $this->salaryRepository->currentForUser($user->id, $companyId);
            $payslip = $existingPayslips->get($user->id);

            return [
                'user_id' => $user->id,
                'name' => $user->name,
                'employee_code' => $user->employee_code,
                'branch' => $user->branch ? ['id' => $user->branch->id, 'name' => $user->branch->name] : null,
                'current_salary' => $salary ? [
                    'base_salary' => $salary->base_salary,
                    'total_salary' => $salary->totalSalary(),
                    'currency' => $salary->currency,
                ] : null,
                'payslip' => $payslip ? [
                    'id' => $payslip->id,
                    'code' => $payslip->code,
                    'status' => $payslip->status,
                    'net_pay' => $payslip->net_pay,
                ] : null,
            ];
        })->values()->all();
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function preview(array $data, ?int $companyId): array
    {
        if (! $companyId) {
            throw new ApiException('Company context required', 422);
        }

        $this->staffService->findOrFail((int) $data['user_id'], $companyId);

        return $this->calculate((int) $data['user_id'], $companyId, $data['period_start'], $data['period_end'], $data);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function generate(array $data, ?int $companyId, Request $request): Payslip|Collection
    {
        if (! $companyId) {
            throw new ApiException('Company context required', 422);
        }

        if (! empty($data['user_id'])) {
            return $this->generateForUser(
                (int) $data['user_id'],
                $companyId,
                $data['period_start'],
                $data['period_end'],
                $data,
                $request
            );
        }

        $staff = $this->staffRepository->listAll($companyId);
        $generated = collect();

        foreach ($staff as $user) {
            if (! $this->salaryRepository->currentForUser($user->id, $companyId)) {
                continue;
            }

            if ($this->payslipRepository->existsForPeriod($companyId, $user->id, $data['period_start'], $data['period_end'])) {
                continue;
            }

            try {
                $generated->push($this->generateForUser(
                    $user->id,
                    $companyId,
                    $data['period_start'],
                    $data['period_end'],
                    $data,
                    $request
                ));
            } catch (ApiException) {
                continue;
            }
        }

        return $generated;
    }

    /**
     * @param  array<string, mixed>  $options
     */
    public function generateForUser(int $userId, int $companyId, string $periodStart, string $periodEnd, array $options, Request $request): Payslip
    {
        $this->staffService->findOrFail($userId, $companyId);

        if ($this->payslipRepository->existsForPeriod($companyId, $userId, $periodStart, $periodEnd)) {
            throw new ApiException('Payslip already exists for this staff member and period', 422);
        }

        $calc = $this->calculate($userId, $companyId, $periodStart, $periodEnd, $options);
        $user = User::query()->find($userId);
        $periodYm = Carbon::parse($periodStart)->format('Ym');

        return DB::transaction(function () use ($calc, $companyId, $userId, $user, $periodStart, $periodEnd, $periodYm, $options, $request) {
            $otherDeductions = (float) ($options['other_deductions'] ?? 0);
            $otherAdditions = (float) ($options['other_additions'] ?? 0);
            $netPay = $calc['gross_salary'] + $calc['commission_amount'] + $otherAdditions
                - $calc['leave_deduction'] - $otherDeductions;

            $payslip = $this->payslipRepository->create([
                'company_id' => $companyId,
                'branch_id' => $user?->branch_id,
                'user_id' => $userId,
                'generated_by' => $request->user()?->id,
                'code' => $this->payslipRepository->nextCode($companyId, $periodYm),
                'period_start' => $periodStart,
                'period_end' => $periodEnd,
                'base_salary' => $calc['base_salary'],
                'housing_allowance' => $calc['housing_allowance'],
                'transport_allowance' => $calc['transport_allowance'],
                'other_allowance' => $calc['other_allowance'],
                'gross_salary' => $calc['gross_salary'],
                'commission_amount' => $calc['commission_amount'],
                'leave_days' => $calc['leave_days'],
                'leave_deduction' => $calc['leave_deduction'],
                'other_deductions' => $otherDeductions,
                'other_additions' => $otherAdditions,
                'net_pay' => round(max(0, $netPay), 2),
                'currency' => $calc['currency'],
                'status' => PayslipStatusEnum::Draft->value,
                'notes' => $options['notes'] ?? null,
                'calculation_snapshot' => $calc['snapshot'],
            ]);

            foreach ($calc['items'] as $index => $item) {
                PayslipItem::query()->create([
                    'payslip_id' => $payslip->id,
                    ...$item,
                    'sort_order' => $index + 1,
                ]);
            }

            if ($otherDeductions > 0) {
                PayslipItem::query()->create([
                    'payslip_id' => $payslip->id,
                    'type' => 'other_deduction',
                    'description' => 'Other deductions',
                    'amount' => $otherDeductions,
                    'is_deduction' => true,
                    'sort_order' => count($calc['items']) + 1,
                ]);
            }

            if ($otherAdditions > 0) {
                PayslipItem::query()->create([
                    'payslip_id' => $payslip->id,
                    'type' => 'other_addition',
                    'description' => 'Other additions',
                    'amount' => $otherAdditions,
                    'is_deduction' => false,
                    'sort_order' => count($calc['items']) + 2,
                ]);
            }

            $payslip = $payslip->fresh(['user', 'branch', 'items']);
            $this->log($request, ActivityActionEnum::Create, $payslip);

            return $payslip;
        });
    }

    public function approve(int $id, ?int $companyId, Request $request): Payslip
    {
        $payslip = $this->findOrFail($id, $companyId);

        if ($payslip->status !== PayslipStatusEnum::Draft->value) {
            throw new ApiException('Only draft payslips can be approved', 422);
        }

        $updated = $this->payslipRepository->update($payslip, [
            'status' => PayslipStatusEnum::Approved->value,
            'approved_by' => $request->user()?->id,
            'approved_at' => now(),
        ]);

        $this->log($request, ActivityActionEnum::Update, $updated);

        return $updated;
    }

    public function markPaid(int $id, ?int $companyId, Request $request): Payslip
    {
        $payslip = $this->findOrFail($id, $companyId);

        if (! in_array($payslip->status, [PayslipStatusEnum::Draft->value, PayslipStatusEnum::Approved->value], true)) {
            throw new ApiException('Payslip cannot be marked as paid', 422);
        }

        $updated = $this->payslipRepository->update($payslip, [
            'status' => PayslipStatusEnum::Paid->value,
            'paid_at' => now(),
            'approved_by' => $payslip->approved_by ?? $request->user()?->id,
            'approved_at' => $payslip->approved_at ?? now(),
        ]);

        $this->log($request, ActivityActionEnum::Update, $updated);

        return $updated;
    }

    public function delete(int $id, ?int $companyId, Request $request): void
    {
        $payslip = $this->findOrFail($id, $companyId);

        if ($payslip->status !== PayslipStatusEnum::Draft->value) {
            throw new ApiException('Only draft payslips can be deleted', 422);
        }

        $this->log($request, ActivityActionEnum::Delete, $payslip);
        $this->payslipRepository->delete($payslip);
    }

    public function stats(?int $companyId, ?string $periodStart = null, ?string $periodEnd = null): array
    {
        if (! $companyId) {
            return ['total' => 0, 'draft' => 0, 'approved' => 0, 'paid' => 0, 'total_net_pay' => 0];
        }

        return $this->payslipRepository->stats($companyId, $periodStart, $periodEnd);
    }

    /**
     * @param  array<string, mixed>  $options
     * @return array<string, mixed>
     */
    protected function calculate(int $userId, int $companyId, string $periodStart, string $periodEnd, array $options = []): array
    {
        $salary = $this->salaryRepository->currentForUser($userId, $companyId);
        if (! $salary) {
            throw new ApiException('No active salary record for this staff member', 422);
        }

        $baseSalary = (float) $salary->base_salary;
        $housing = (float) $salary->housing_allowance;
        $transport = (float) $salary->transport_allowance;
        $otherAllowance = (float) $salary->other_allowance;
        $grossSalary = $salary->totalSalary();

        $commission = $this->calculateCommission($userId, $companyId, $periodStart, $periodEnd);
        $leave = $this->calculateLeaveDeduction($userId, $companyId, $periodStart, $periodEnd, $grossSalary);

        $items = [
            ['type' => 'base_salary', 'description' => 'Base salary', 'amount' => $baseSalary, 'is_deduction' => false],
            ['type' => 'housing_allowance', 'description' => 'Housing allowance', 'amount' => $housing, 'is_deduction' => false],
            ['type' => 'transport_allowance', 'description' => 'Transport allowance', 'amount' => $transport, 'is_deduction' => false],
            ['type' => 'other_allowance', 'description' => 'Other allowance', 'amount' => $otherAllowance, 'is_deduction' => false],
        ];

        foreach ($commission['lines'] as $line) {
            $items[] = [
                'type' => 'commission',
                'description' => $line['description'],
                'amount' => $line['amount'],
                'is_deduction' => false,
                'reference_type' => 'SaleItem',
                'reference_id' => $line['sale_item_id'] ?? null,
            ];
        }

        if ($leave['amount'] > 0) {
            $items[] = [
                'type' => 'leave_deduction',
                'description' => "Unpaid leave deduction ({$leave['days']} days)",
                'amount' => $leave['amount'],
                'is_deduction' => true,
            ];
        }

        $otherDeductions = (float) ($options['other_deductions'] ?? 0);
        $otherAdditions = (float) ($options['other_additions'] ?? 0);

        $netPay = $grossSalary + $commission['total'] + $otherAdditions - $leave['amount'] - $otherDeductions;

        return [
            'user_id' => $userId,
            'base_salary' => $baseSalary,
            'housing_allowance' => $housing,
            'transport_allowance' => $transport,
            'other_allowance' => $otherAllowance,
            'gross_salary' => $grossSalary,
            'commission_amount' => $commission['total'],
            'leave_days' => $leave['days'],
            'leave_deduction' => $leave['amount'],
            'currency' => $salary->currency ?? 'AED',
            'net_pay' => round(max(0, $netPay), 2),
            'items' => array_filter($items, fn ($i) => (float) $i['amount'] > 0),
            'snapshot' => [
                'commission' => $commission,
                'leave' => $leave,
            ],
        ];
    }

    /**
     * @return array{total: float, lines: array<int, array<string, mixed>>}
     */
    protected function calculateCommission(int $userId, int $companyId, string $periodStart, string $periodEnd): array
    {
        $rules = $this->commissionRepository->listForUser($userId, $companyId)
            ->filter(fn (StaffCommissionRule $r) => $r->is_active);

        $saleItems = SaleItem::query()
            ->with(['service.category', 'sale'])
            ->where('staff_id', $userId)
            ->whereHas('sale', function ($q) use ($companyId, $periodStart, $periodEnd) {
                $q->where('company_id', $companyId)
                    ->where('status', SaleStatusEnum::Paid->value)
                    ->whereDate('paid_at', '>=', $periodStart)
                    ->whereDate('paid_at', '<=', $periodEnd);
            })
            ->get();

        $lines = [];
        $total = 0;

        foreach ($saleItems as $item) {
            $lineTotal = (float) $item->line_subtotal;
            if ($lineTotal <= 0) {
                continue;
            }

            $categoryId = $item->service?->service_category_id;
            $rule = $this->matchCommissionRule($rules, $categoryId);
            $amount = 0;
            $description = $item->description ?? 'Commission';

            if ($rule) {
                $amount = $this->applyCommissionRate($rule->rate_type, (float) $rule->rate_value, $lineTotal, (int) $item->quantity);
                $description = "Commission: {$rule->name} — {$item->description}";
            } elseif ($item->service && $item->service->commission_rate) {
                $amount = $this->applyCommissionRate(
                    $item->service->commission_type ?? CommissionRateTypeEnum::Percentage->value,
                    (float) $item->service->commission_rate,
                    $lineTotal,
                    (int) $item->quantity
                );
                $description = "Service commission — {$item->description}";
            }

            if ($amount <= 0) {
                continue;
            }

            $amount = round($amount, 2);
            $total += $amount;
            $lines[] = [
                'sale_item_id' => $item->id,
                'description' => $description,
                'amount' => $amount,
                'sale_code' => $item->sale?->code,
            ];
        }

        return ['total' => round($total, 2), 'lines' => $lines];
    }

    /**
     * @return array{days: int, amount: float, leaves: array<int, array<string, mixed>>}
     */
    protected function calculateLeaveDeduction(int $userId, int $companyId, string $periodStart, string $periodEnd, float $grossSalary): array
    {
        $periodStartCarbon = Carbon::parse($periodStart);
        $periodEndCarbon = Carbon::parse($periodEnd);
        $dailyRate = $grossSalary / self::DAILY_DIVISOR;

        $leaves = StaffLeaveRequest::query()
            ->where('company_id', $companyId)
            ->where('user_id', $userId)
            ->where('status', LeaveStatusEnum::Approved->value)
            ->whereIn('leave_type', [LeaveTypeEnum::Unpaid->value])
            ->where('start_date', '<=', $periodEnd)
            ->where('end_date', '>=', $periodStart)
            ->get();

        $totalDays = 0;
        $leaveDetails = [];

        foreach ($leaves as $leave) {
            $overlapStart = Carbon::parse($leave->start_date)->max($periodStartCarbon);
            $overlapEnd = Carbon::parse($leave->end_date)->min($periodEndCarbon);
            $days = $overlapStart->diffInDays($overlapEnd) + 1;

            if ($days <= 0) {
                continue;
            }

            $totalDays += $days;
            $leaveDetails[] = [
                'id' => $leave->id,
                'leave_type' => $leave->leave_type,
                'days' => $days,
                'start_date' => $overlapStart->toDateString(),
                'end_date' => $overlapEnd->toDateString(),
            ];
        }

        return [
            'days' => $totalDays,
            'amount' => round($totalDays * $dailyRate, 2),
            'daily_rate' => round($dailyRate, 2),
            'leaves' => $leaveDetails,
        ];
    }

    /**
     * @param  Collection<int, StaffCommissionRule>  $rules
     */
    protected function matchCommissionRule(Collection $rules, ?int $categoryId): ?StaffCommissionRule
    {
        if ($categoryId) {
            $specific = $rules->first(fn (StaffCommissionRule $r) => $r->service_category_id === $categoryId);
            if ($specific) {
                return $specific;
            }
        }

        return $rules->first(fn (StaffCommissionRule $r) => $r->service_category_id === null);
    }

    protected function applyCommissionRate(string|CommissionRateTypeEnum $rateType, float $rateValue, float $lineSubtotal, int $quantity): float
    {
        $type = $rateType instanceof CommissionRateTypeEnum ? $rateType->value : $rateType;

        if ($type === CommissionRateTypeEnum::Fixed->value) {
            return $rateValue * max(1, $quantity);
        }

        return $lineSubtotal * ($rateValue / 100);
    }

    protected function log(Request $request, ActivityActionEnum $action, Payslip $payslip): void
    {
        $this->activityLogService->log(
            action: $action,
            userId: $request->user()?->id,
            subject: $payslip->user,
            description: "{$action->label()} payslip {$payslip->code}",
            properties: ['resource' => 'Payslip', 'id' => $payslip->id, 'code' => $payslip->code],
            request: $request
        );
    }
}
