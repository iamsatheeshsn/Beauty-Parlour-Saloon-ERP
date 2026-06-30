<?php

namespace App\Services;

use App\Enums\ActivityActionEnum;
use App\Exceptions\ApiException;
use App\Models\Expense;
use App\Repositories\ExpenseRepository;
use App\Support\VatCalculator;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;

class ExpenseService
{
    public function __construct(
        private readonly ExpenseRepository $repository,
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

        return $this->repository->paginate(
            $companyId,
            (int) $request->input('per_page', 15),
            $request->only(['search', 'expense_category_id', 'branch_id', 'payment_method_id', 'date_from', 'date_to'])
        );
    }

    public function findOrFail(int $id, ?int $companyId): Expense
    {
        if (! $companyId) {
            throw new ApiException('Company context required', 422);
        }

        $expense = $this->repository->findById($id, $companyId);
        if (! $expense) {
            throw new ApiException('Expense not found', 404);
        }

        return $expense;
    }

    public function storeRules(): array
    {
        return [
            'expense_category_id' => ['required', 'integer', 'exists:expense_categories,id'],
            'branch_id' => ['nullable', 'integer', 'exists:branches,id'],
            'payment_method_id' => ['nullable', 'integer', 'exists:payment_methods,id'],
            'vendor_name' => ['nullable', 'string', 'max:255'],
            'reference' => ['nullable', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'vat_rate' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'vat_inclusive' => ['sometimes', 'boolean'],
            'expense_date' => ['required', 'date'],
            'notes' => ['nullable', 'string'],
            'receipt' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
        ];
    }

    public function updateRules(): array
    {
        return [
            'expense_category_id' => ['sometimes', 'integer', 'exists:expense_categories,id'],
            'branch_id' => ['nullable', 'integer', 'exists:branches,id'],
            'payment_method_id' => ['nullable', 'integer', 'exists:payment_methods,id'],
            'vendor_name' => ['nullable', 'string', 'max:255'],
            'reference' => ['nullable', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
            'amount' => ['sometimes', 'numeric', 'min:0.01'],
            'vat_rate' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'vat_inclusive' => ['sometimes', 'boolean'],
            'expense_date' => ['sometimes', 'date'],
            'notes' => ['nullable', 'string'],
            'receipt' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
        ];
    }

    public function receiptRules(): array
    {
        return [
            'receipt' => ['required', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data, ?int $companyId, Request $request): Expense
    {
        if (! $companyId) {
            throw new ApiException('Company context required', 422);
        }

        $receipt = $data['receipt'] ?? null;
        unset($data['receipt']);

        $totals = $this->calculateTotals($data);

        $expense = $this->repository->create([
            ...$data,
            ...$totals,
            'company_id' => $companyId,
            'branch_id' => $data['branch_id'] ?? $request->user()?->branch_id,
            'created_by' => $request->user()?->id,
            'code' => $this->repository->nextCode($companyId),
        ]);

        if ($receipt instanceof UploadedFile) {
            $expense = $this->storeReceipt($expense, $receipt);
        }

        $this->log($request, ActivityActionEnum::Create, $expense);

        return $expense;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(int $id, array $data, ?int $companyId, Request $request): Expense
    {
        $expense = $this->findOrFail($id, $companyId);
        $receipt = $data['receipt'] ?? null;
        unset($data['receipt']);

        if (isset($data['amount']) || isset($data['vat_rate']) || isset($data['vat_inclusive'])) {
            $merged = array_merge($expense->only(['amount', 'vat_rate', 'vat_inclusive']), $data);
            $data = array_merge($data, $this->calculateTotals($merged));
        }

        $updated = $this->repository->update($expense, $data);

        if ($receipt instanceof UploadedFile) {
            $updated = $this->storeReceipt($updated, $receipt);
        }

        $this->log($request, ActivityActionEnum::Update, $updated);

        return $updated;
    }

    public function uploadReceipt(int $id, UploadedFile $file, ?int $companyId, Request $request): Expense
    {
        $expense = $this->findOrFail($id, $companyId);
        $updated = $this->storeReceipt($expense, $file);
        $this->log($request, ActivityActionEnum::Update, $updated);

        return $updated;
    }

    public function deleteReceipt(int $id, ?int $companyId, Request $request): Expense
    {
        $expense = $this->findOrFail($id, $companyId);

        if ($expense->receipt_path) {
            Storage::disk('public')->delete($expense->receipt_path);
        }

        $updated = $this->repository->update($expense, [
            'receipt_path' => null,
            'receipt_original_name' => null,
        ]);

        $this->log($request, ActivityActionEnum::Update, $updated);

        return $updated;
    }

    public function delete(int $id, ?int $companyId, Request $request): void
    {
        $expense = $this->findOrFail($id, $companyId);

        if ($expense->receipt_path) {
            Storage::disk('public')->delete($expense->receipt_path);
        }

        $this->log($request, ActivityActionEnum::Delete, $expense);
        $this->repository->delete($expense);
    }

    public function stats(?int $companyId, ?int $branchId = null): array
    {
        if (! $companyId) {
            return [
                'today_total' => 0,
                'month_total' => 0,
                'year_total' => 0,
                'month_count' => 0,
            ];
        }

        $today = now()->toDateString();
        $monthStart = now()->startOfMonth()->toDateString();
        $monthEnd = now()->endOfMonth()->toDateString();
        $yearStart = now()->startOfYear()->toDateString();
        $yearEnd = now()->endOfYear()->toDateString();

        return [
            'today_total' => $this->repository->sumForPeriod($companyId, $today, $today, $branchId),
            'month_total' => $this->repository->sumForPeriod($companyId, $monthStart, $monthEnd, $branchId),
            'year_total' => $this->repository->sumForPeriod($companyId, $yearStart, $yearEnd, $branchId),
            'month_count' => $this->repository->countForPeriod($companyId, $monthStart, $monthEnd, $branchId),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function report(Request $request): array
    {
        $companyId = $this->resolveCompanyId($request);
        if (! $companyId) {
            throw new ApiException('Company context required', 422);
        }

        $from = $request->input('date_from', now()->startOfMonth()->toDateString());
        $to = $request->input('date_to', now()->endOfMonth()->toDateString());
        $branchId = $request->input('branch_id') ? (int) $request->input('branch_id') : null;

        $byCategory = $this->repository->byCategory($companyId, $from, $to, $branchId);

        return [
            'date_from' => $from,
            'date_to' => $to,
            'total' => $this->repository->sumForPeriod($companyId, $from, $to, $branchId),
            'count' => $this->repository->countForPeriod($companyId, $from, $to, $branchId),
            'by_category' => $byCategory->map(fn ($row) => [
                'category_id' => $row->expense_category_id,
                'category_name' => $row->category?->name,
                'category_code' => $row->category?->code,
                'total' => (float) $row->total,
                'count' => (int) $row->count,
            ])->values()->all(),
            'monthly' => $this->repository->monthlyTotals($companyId, 6, $branchId),
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array{amount: float, vat_rate: float, vat_amount: float, total_amount: float, vat_inclusive: bool}
     */
    protected function calculateTotals(array $data): array
    {
        $amount = (float) ($data['amount'] ?? 0);
        $vatRate = (float) ($data['vat_rate'] ?? 0);
        $vatInclusive = (bool) ($data['vat_inclusive'] ?? false);

        $totals = VatCalculator::lineTotals($amount, $vatRate, $vatInclusive, 1, $vatRate > 0);

        return [
            'amount' => $amount,
            'vat_rate' => $vatRate,
            'vat_amount' => $totals['line_vat'],
            'total_amount' => $totals['line_total'],
            'vat_inclusive' => $vatInclusive,
        ];
    }

    protected function storeReceipt(Expense $expense, UploadedFile $file): Expense
    {
        if ($expense->receipt_path) {
            Storage::disk('public')->delete($expense->receipt_path);
        }

        $path = $file->store("expenses/{$expense->company_id}", 'public');

        return $this->repository->update($expense, [
            'receipt_path' => $path,
            'receipt_original_name' => $file->getClientOriginalName(),
        ]);
    }

    protected function log(Request $request, ActivityActionEnum $action, Expense $expense): void
    {
        $this->activityLogService->log(
            action: $action,
            userId: $request->user()?->id,
            subject: $expense,
            description: "{$action->label()} expense {$expense->code}",
            properties: ['resource' => 'Expense', 'id' => $expense->id, 'code' => $expense->code],
            request: $request
        );
    }
}
