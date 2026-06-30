<?php

namespace App\Repositories;

use App\Enums\SaleStatusEnum;
use App\Models\Sale;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;

class SaleRepository
{
    /** @var array<int, string> */
    protected array $relations = [
        'customer',
        'branch',
        'soldBy',
        'appointment',
        'items.service',
        'items.servicePackage',
        'items.staff',
        'payments.paymentMethod',
    ];

    public function paginate(int $companyId, int $perPage = 15, array $filters = []): LengthAwarePaginator
    {
        return $this->query($companyId, $filters)
            ->orderByDesc('created_at')
            ->paginate($perPage);
    }

    public function findById(int $id, int $companyId): ?Sale
    {
        return Sale::query()
            ->with($this->relations)
            ->where('company_id', $companyId)
            ->find($id);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Sale
    {
        return Sale::query()->create($data)->fresh($this->relations);
    }

    public function nextCode(int $companyId): string
    {
        $year = now()->format('Y');
        $prefix = "INV{$year}-";

        $latest = Sale::query()
            ->where('company_id', $companyId)
            ->where('code', 'like', $prefix.'%')
            ->orderByRaw('CAST(SUBSTRING(code, '.(strlen($prefix) + 1).') AS UNSIGNED) DESC')
            ->value('code');

        $number = $latest ? ((int) substr($latest, strlen($prefix))) + 1 : 1;

        return $prefix.str_pad((string) $number, 5, '0', STR_PAD_LEFT);
    }

    public function totalRevenue(int $companyId): float
    {
        return (float) Sale::query()
            ->where('company_id', $companyId)
            ->where('status', SaleStatusEnum::Paid->value)
            ->sum('total_amount');
    }

    public function todayRevenue(int $companyId): float
    {
        return (float) Sale::query()
            ->where('company_id', $companyId)
            ->where('status', SaleStatusEnum::Paid->value)
            ->whereDate('paid_at', today())
            ->sum('total_amount');
    }

    public function weeklyRevenue(int $companyId): array
    {
        $labels = [];
        $data = [];

        for ($i = 6; $i >= 0; $i--) {
            $date = today()->subDays($i);
            $labels[] = $date->format('D');
            $data[] = (float) Sale::query()
                ->where('company_id', $companyId)
                ->where('status', SaleStatusEnum::Paid->value)
                ->whereDate('paid_at', $date)
                ->sum('total_amount');
        }

        return ['labels' => $labels, 'data' => $data];
    }

    protected function query(int $companyId, array $filters): Builder
    {
        return Sale::query()
            ->with($this->relations)
            ->where('company_id', $companyId)
            ->when(! empty($filters['search']), function (Builder $q) use ($filters): void {
                $search = $filters['search'];
                $q->where(function (Builder $inner) use ($search): void {
                    $inner->where('code', 'like', "%{$search}%")
                        ->orWhereHas('customer', fn (Builder $c) => $c->where('name', 'like', "%{$search}%")->orWhere('phone', 'like', "%{$search}%"));
                });
            })
            ->when(! empty($filters['status']), fn (Builder $q) => $q->where('status', $filters['status']))
            ->when(! empty($filters['customer_id']), fn (Builder $q) => $q->where('customer_id', $filters['customer_id']))
            ->when(! empty($filters['from']), fn (Builder $q) => $q->where('created_at', '>=', Carbon::parse($filters['from'])->startOfDay()))
            ->when(! empty($filters['to']), fn (Builder $q) => $q->where('created_at', '<=', Carbon::parse($filters['to'])->endOfDay()));
    }
}
