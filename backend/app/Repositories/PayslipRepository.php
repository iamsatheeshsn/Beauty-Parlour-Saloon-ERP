<?php

namespace App\Repositories;

use App\Models\Payslip;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

class PayslipRepository
{
    /** @var array<int, string> */
    protected array $relations = ['user', 'branch', 'generatedBy', 'approvedByUser', 'items'];

    public function paginate(int $companyId, int $perPage = 15, array $filters = []): LengthAwarePaginator
    {
        return $this->query($companyId, $filters)->orderByDesc('period_start')->orderByDesc('id')->paginate($perPage);
    }

    public function findById(int $id, int $companyId): ?Payslip
    {
        return Payslip::query()->with($this->relations)->where('company_id', $companyId)->find($id);
    }

    public function existsForPeriod(int $companyId, int $userId, string $periodStart, string $periodEnd): bool
    {
        return Payslip::query()
            ->where('company_id', $companyId)
            ->where('user_id', $userId)
            ->where('period_start', $periodStart)
            ->where('period_end', $periodEnd)
            ->exists();
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Payslip
    {
        return Payslip::query()->create($data)->fresh($this->relations);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(Payslip $payslip, array $data): Payslip
    {
        $payslip->update($data);

        return $payslip->fresh($this->relations);
    }

    public function delete(Payslip $payslip): bool
    {
        return (bool) $payslip->delete();
    }

    public function nextCode(int $companyId, string $periodYm): string
    {
        $prefix = 'PAY'.$periodYm.'-';
        $latest = Payslip::query()
            ->where('company_id', $companyId)
            ->where('code', 'like', $prefix.'%')
            ->orderByRaw('CAST(SUBSTRING(code, '.(strlen($prefix) + 1).') AS UNSIGNED) DESC')
            ->value('code');

        $number = $latest ? ((int) substr($latest, strlen($prefix))) + 1 : 1;

        return $prefix.str_pad((string) $number, 4, '0', STR_PAD_LEFT);
    }

    public function stats(int $companyId, ?string $periodStart = null, ?string $periodEnd = null): array
    {
        $query = Payslip::query()->where('company_id', $companyId);

        if ($periodStart && $periodEnd) {
            $query->where('period_start', $periodStart)->where('period_end', $periodEnd);
        }

        return [
            'total' => (clone $query)->count(),
            'draft' => (clone $query)->where('status', 'draft')->count(),
            'approved' => (clone $query)->where('status', 'approved')->count(),
            'paid' => (clone $query)->where('status', 'paid')->count(),
            'total_net_pay' => (float) (clone $query)->sum('net_pay'),
        ];
    }

    public function forPeriod(int $companyId, string $periodStart, string $periodEnd): Collection
    {
        return Payslip::query()
            ->with(['user'])
            ->where('company_id', $companyId)
            ->where('period_start', $periodStart)
            ->where('period_end', $periodEnd)
            ->get();
    }

    protected function query(int $companyId, array $filters): Builder
    {
        return Payslip::query()
            ->with($this->relations)
            ->where('company_id', $companyId)
            ->when(! empty($filters['user_id']), fn (Builder $q) => $q->where('user_id', $filters['user_id']))
            ->when(! empty($filters['status']), fn (Builder $q) => $q->where('status', $filters['status']))
            ->when(! empty($filters['period_start']), fn (Builder $q) => $q->where('period_start', $filters['period_start']))
            ->when(! empty($filters['period_end']), fn (Builder $q) => $q->where('period_end', $filters['period_end']))
            ->when(! empty($filters['search']), function (Builder $q) use ($filters): void {
                $search = $filters['search'];
                $q->where(function (Builder $inner) use ($search): void {
                    $inner->where('code', 'like', "%{$search}%")
                        ->orWhereHas('user', fn (Builder $u) => $u->where('name', 'like', "%{$search}%"));
                });
            });
    }
}
