<?php

namespace App\Services;

use App\Exceptions\ApiException;
use App\Repositories\ReportRepository;
use Illuminate\Http\Request;

class ReportService
{
    public function __construct(
        private readonly ReportRepository $repository
    ) {
    }

    public function resolveCompanyId(Request $request): ?int
    {
        return $request->user()?->company_id;
    }

    public function filterRules(): array
    {
        return [
            'date_from' => ['nullable', 'date'],
            'date_to' => ['nullable', 'date', 'after_or_equal:date_from'],
            'branch_id' => ['nullable', 'integer', 'exists:branches,id'],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    protected function filters(Request $request): array
    {
        $data = $request->validate($this->filterRules());

        return [
            'from' => $data['date_from'] ?? now()->startOfMonth()->toDateString(),
            'to' => $data['date_to'] ?? now()->toDateString(),
            'branch_id' => isset($data['branch_id']) ? (int) $data['branch_id'] : null,
        ];
    }

    protected function companyId(Request $request): int
    {
        $companyId = $this->resolveCompanyId($request);
        if (! $companyId) {
            throw new ApiException('Company context required', 422);
        }

        return $companyId;
    }

    /**
     * @return array<string, mixed>
     */
    public function summary(Request $request): array
    {
        $companyId = $this->companyId($request);
        $f = $this->filters($request);

        $sales = $this->repository->salesSummary($companyId, $f['from'], $f['to'], $f['branch_id']);
        $customers = $this->repository->customersSummary($companyId, $f['from'], $f['to']);
        $financial = $this->repository->financialSummary($companyId, $f['from'], $f['to'], $f['branch_id']);
        $inventory = $this->repository->inventorySummary($companyId, $f['from'], $f['to'], $f['branch_id']);
        $vat = $this->repository->vatSummary($companyId, $f['from'], $f['to'], $f['branch_id']);

        return [
            'period' => ['from' => $f['from'], 'to' => $f['to']],
            'sales' => $sales,
            'customers' => $customers,
            'financial' => $financial,
            'inventory' => $inventory,
            'vat' => $vat,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function sales(Request $request): array
    {
        $companyId = $this->companyId($request);
        $f = $this->filters($request);

        return [
            'period' => ['from' => $f['from'], 'to' => $f['to']],
            'summary' => $this->repository->salesSummary($companyId, $f['from'], $f['to'], $f['branch_id']),
            'by_day' => $this->repository->salesByDay($companyId, $f['from'], $f['to'], $f['branch_id']),
            'by_payment_method' => $this->repository->salesByPaymentMethod($companyId, $f['from'], $f['to'], $f['branch_id'])->values()->all(),
            'by_branch' => $this->repository->salesByBranch($companyId, $f['from'], $f['to'])->values()->all(),
            'top_services' => $this->repository->topServices($companyId, $f['from'], $f['to'])->values()->all(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function customers(Request $request): array
    {
        $companyId = $this->companyId($request);
        $f = $this->filters($request);

        return [
            'period' => ['from' => $f['from'], 'to' => $f['to']],
            'summary' => $this->repository->customersSummary($companyId, $f['from'], $f['to']),
            'new_by_day' => $this->repository->newCustomersByDay($companyId, $f['from'], $f['to']),
            'top_customers' => $this->repository->topCustomers($companyId, $f['from'], $f['to'])->values()->all(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function staff(Request $request): array
    {
        $companyId = $this->companyId($request);
        $f = $this->filters($request);

        return [
            'period' => ['from' => $f['from'], 'to' => $f['to']],
            'summary' => $this->repository->staffSummary($companyId, $f['from'], $f['to']),
            'revenue_by_staff' => $this->repository->revenueByStaff($companyId, $f['from'], $f['to'])->values()->all(),
            'appointments_by_staff' => $this->repository->appointmentsByStaff($companyId, $f['from'], $f['to'])->values()->all(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function inventory(Request $request): array
    {
        $companyId = $this->companyId($request);
        $f = $this->filters($request);

        return [
            'period' => ['from' => $f['from'], 'to' => $f['to']],
            'summary' => $this->repository->inventorySummary($companyId, $f['from'], $f['to'], $f['branch_id']),
            'movements_by_type' => $this->repository->stockMovementsByType($companyId, $f['from'], $f['to'], $f['branch_id'])->values()->all(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function financial(Request $request): array
    {
        $companyId = $this->companyId($request);
        $f = $this->filters($request);

        return [
            'period' => ['from' => $f['from'], 'to' => $f['to']],
            'summary' => $this->repository->financialSummary($companyId, $f['from'], $f['to'], $f['branch_id']),
            'monthly' => $this->repository->financialMonthly($companyId),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function vat(Request $request): array
    {
        $companyId = $this->companyId($request);
        $f = $this->filters($request);

        return [
            'period' => ['from' => $f['from'], 'to' => $f['to']],
            'summary' => $this->repository->vatSummary($companyId, $f['from'], $f['to'], $f['branch_id']),
            'monthly' => $this->repository->vatMonthly($companyId),
            'sales_by_rate' => $this->repository->salesVatByRate($companyId, $f['from'], $f['to'])->values()->all(),
        ];
    }
}
