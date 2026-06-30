<?php

namespace App\Repositories;

use App\Models\Customer;
use App\Support\PhoneNumber;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class CustomerRepository extends BaseMasterRepository
{
    protected function modelClass(): string
    {
        return Customer::class;
    }

    protected function searchableColumns(): array
    {
        return ['name', 'phone', 'email', 'code'];
    }

    protected function defaultRelations(): array
    {
        return ['branch', 'emirate', 'city'];
    }

    protected function companyScoped(): bool
    {
        return true;
    }

    protected function defaultOrder(): array
    {
        return ['last_visit_at' => 'desc', 'name' => 'asc'];
    }

    protected function applyFilters(Builder $query, array $filters): void
    {
        parent::applyFilters($query, $filters);

        if (! empty($filters['branch_id'])) {
            $query->where('branch_id', $filters['branch_id']);
        }

        if (! empty($filters['phone'])) {
            $normalized = PhoneNumber::normalize($filters['phone']);
            if ($normalized) {
                $query->where(function (Builder $q) use ($normalized, $filters): void {
                    $q->where('phone', $normalized)
                        ->orWhere('phone', 'like', '%'.preg_replace('/\D+/', '', $filters['phone']).'%');
                });
            }
        }
    }

    public function findByPhone(int $companyId, string $phone): ?Model
    {
        $normalized = PhoneNumber::normalize($phone);

        if (! $normalized) {
            return null;
        }

        $candidates = Customer::query()
            ->with($this->defaultRelations())
            ->where('company_id', $companyId)
            ->where(function (Builder $q) use ($normalized): void {
                $q->where('phone', $normalized)
                    ->orWhere('phone', 'like', '%'.ltrim($normalized, '+').'%');
            })
            ->get();

        return $candidates->first(fn (Customer $customer) => PhoneNumber::matches($customer->phone, $phone));
    }

    public function nextCode(int $companyId): string
    {
        $latest = Customer::query()
            ->where('company_id', $companyId)
            ->where('code', 'like', 'CUST%')
            ->orderByRaw('CAST(SUBSTRING(code, 5) AS UNSIGNED) DESC')
            ->value('code');

        $number = $latest ? ((int) substr($latest, 4)) + 1 : 1;

        return 'CUST'.str_pad((string) $number, 4, '0', STR_PAD_LEFT);
    }
}
