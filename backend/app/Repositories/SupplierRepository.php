<?php

namespace App\Repositories;

use App\Models\Supplier;

class SupplierRepository extends BaseMasterRepository
{
    protected function modelClass(): string
    {
        return Supplier::class;
    }

    protected function searchableColumns(): array
    {
        return ['name', 'code', 'contact_person', 'email', 'phone'];
    }

    protected function companyScoped(): bool
    {
        return true;
    }

    protected function defaultOrder(): array
    {
        return ['name' => 'asc'];
    }

    public function nextCode(int $companyId): string
    {
        $latest = Supplier::query()
            ->where('company_id', $companyId)
            ->where('code', 'like', 'SUP%')
            ->orderByRaw('CAST(SUBSTRING(code, 4) AS UNSIGNED) DESC')
            ->value('code');

        $number = $latest ? ((int) substr($latest, 3)) + 1 : 1;

        return 'SUP'.str_pad((string) $number, 4, '0', STR_PAD_LEFT);
    }
}
