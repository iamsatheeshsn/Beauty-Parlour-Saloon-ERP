<?php

namespace App\Repositories;

use App\Models\CustomerNote;
use Illuminate\Database\Eloquent\Collection;

class CustomerNoteRepository
{
    public function listForCustomer(int $customerId, int $companyId): Collection
    {
        return CustomerNote::query()
            ->with('user')
            ->where('company_id', $companyId)
            ->where('customer_id', $customerId)
            ->orderByDesc('is_pinned')
            ->latest()
            ->get();
    }

    public function findById(int $id, int $companyId): ?CustomerNote
    {
        return CustomerNote::query()
            ->with('user')
            ->where('company_id', $companyId)
            ->find($id);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): CustomerNote
    {
        return CustomerNote::query()->create($data)->fresh('user');
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(CustomerNote $note, array $data): CustomerNote
    {
        $note->update($data);

        return $note->fresh('user');
    }

    public function delete(CustomerNote $note): bool
    {
        return (bool) $note->delete();
    }
}
