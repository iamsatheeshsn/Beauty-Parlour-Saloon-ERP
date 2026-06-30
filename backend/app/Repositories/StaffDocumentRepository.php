<?php

namespace App\Repositories;

use App\Models\StaffDocument;
use Illuminate\Database\Eloquent\Collection;

class StaffDocumentRepository
{
    public function listForUser(int $userId, int $companyId): Collection
    {
        return StaffDocument::query()
            ->where('company_id', $companyId)
            ->where('user_id', $userId)
            ->orderByDesc('expiry_date')
            ->get();
    }

    public function findById(int $id, int $companyId): ?StaffDocument
    {
        return StaffDocument::query()
            ->where('company_id', $companyId)
            ->find($id);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): StaffDocument
    {
        return StaffDocument::query()->create($data);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(StaffDocument $document, array $data): StaffDocument
    {
        $document->update($data);

        return $document->fresh();
    }

    public function delete(StaffDocument $document): bool
    {
        return (bool) $document->delete();
    }

    public function expiringSoon(int $companyId, int $days = 30): Collection
    {
        return StaffDocument::query()
            ->with('user')
            ->where('company_id', $companyId)
            ->whereNotNull('expiry_date')
            ->whereBetween('expiry_date', [now(), now()->addDays($days)])
            ->orderBy('expiry_date')
            ->get();
    }
}
