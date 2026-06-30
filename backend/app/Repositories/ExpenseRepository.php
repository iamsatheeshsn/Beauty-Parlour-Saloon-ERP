<?php

namespace App\Repositories;

use App\Models\Expense;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class ExpenseRepository
{
    /** @var array<int, string> */
    protected array $relations = ['category', 'branch', 'paymentMethod', 'createdBy'];

    public function paginate(int $companyId, int $perPage = 15, array $filters = []): LengthAwarePaginator
    {
        return $this->query($companyId, $filters)->orderByDesc('expense_date')->orderByDesc('id')->paginate($perPage);
    }

    public function findById(int $id, int $companyId): ?Expense
    {
        return Expense::query()->with($this->relations)->where('company_id', $companyId)->find($id);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Expense
    {
        return Expense::query()->create($data)->fresh($this->relations);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(Expense $expense, array $data): Expense
    {
        $expense->update($data);

        return $expense->fresh($this->relations);
    }

    public function delete(Expense $expense): bool
    {
        return (bool) $expense->delete();
    }

    public function nextCode(int $companyId): string
    {
        $year = now()->format('Y');
        $prefix = "EXP{$year}-";
        $latest = Expense::query()
            ->where('company_id', $companyId)
            ->where('code', 'like', $prefix.'%')
            ->orderByRaw('CAST(SUBSTRING(code, '.(strlen($prefix) + 1).') AS UNSIGNED) DESC')
            ->value('code');

        $number = $latest ? ((int) substr($latest, strlen($prefix))) + 1 : 1;

        return $prefix.str_pad((string) $number, 5, '0', STR_PAD_LEFT);
    }

    public function sumForPeriod(int $companyId, ?string $from = null, ?string $to = null, ?int $branchId = null): float
    {
        return (float) $this->query($companyId, [
            'date_from' => $from,
            'date_to' => $to,
            'branch_id' => $branchId,
        ])->sum('total_amount');
    }

    public function countForPeriod(int $companyId, ?string $from = null, ?string $to = null, ?int $branchId = null): int
    {
        return $this->query($companyId, [
            'date_from' => $from,
            'date_to' => $to,
            'branch_id' => $branchId,
        ])->count();
    }

    public function byCategory(int $companyId, ?string $from = null, ?string $to = null, ?int $branchId = null): Collection
    {
        return Expense::query()
            ->select('expense_category_id', DB::raw('SUM(total_amount) as total'), DB::raw('COUNT(*) as count'))
            ->with('category')
            ->where('company_id', $companyId)
            ->when($branchId, fn (Builder $q) => $q->where('branch_id', $branchId))
            ->when($from, fn (Builder $q) => $q->whereDate('expense_date', '>=', $from))
            ->when($to, fn (Builder $q) => $q->whereDate('expense_date', '<=', $to))
            ->groupBy('expense_category_id')
            ->orderByDesc('total')
            ->get();
    }

    /**
     * @return array{labels: array<int, string>, data: array<int, float>}
     */
    public function monthlyTotals(int $companyId, int $months = 6, ?int $branchId = null): array
    {
        $labels = [];
        $data = [];

        for ($i = $months - 1; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $labels[] = $date->format('M Y');
            $data[] = $this->sumForPeriod(
                $companyId,
                $date->copy()->startOfMonth()->toDateString(),
                $date->copy()->endOfMonth()->toDateString(),
                $branchId
            );
        }

        return ['labels' => $labels, 'data' => $data];
    }

    protected function query(int $companyId, array $filters): Builder
    {
        return Expense::query()
            ->with($this->relations)
            ->where('company_id', $companyId)
            ->when(! empty($filters['expense_category_id']), fn (Builder $q) => $q->where('expense_category_id', $filters['expense_category_id']))
            ->when(! empty($filters['branch_id']), fn (Builder $q) => $q->where('branch_id', $filters['branch_id']))
            ->when(! empty($filters['payment_method_id']), fn (Builder $q) => $q->where('payment_method_id', $filters['payment_method_id']))
            ->when(! empty($filters['date_from']), fn (Builder $q) => $q->whereDate('expense_date', '>=', $filters['date_from']))
            ->when(! empty($filters['date_to']), fn (Builder $q) => $q->whereDate('expense_date', '<=', $filters['date_to']))
            ->when(! empty($filters['search']), function (Builder $q) use ($filters): void {
                $search = $filters['search'];
                $q->where(function (Builder $inner) use ($search): void {
                    $inner->where('code', 'like', "%{$search}%")
                        ->orWhere('vendor_name', 'like', "%{$search}%")
                        ->orWhere('reference', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            });
    }
}
