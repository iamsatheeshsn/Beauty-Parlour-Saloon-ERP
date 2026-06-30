<?php

namespace App\Services;

use App\Enums\ActivityActionEnum;
use App\Enums\StaffDocumentTypeEnum;
use App\Exceptions\ApiException;
use App\Models\StaffDocument;
use App\Repositories\StaffDocumentRepository;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class StaffDocumentService
{
    public function __construct(
        private readonly StaffDocumentRepository $repository,
        private readonly StaffService $staffService,
        private readonly ActivityLogService $activityLogService
    ) {
    }

    public function list(int $userId, ?int $companyId): array
    {
        $this->staffService->findOrFail($userId, $companyId);

        return $this->repository->listForUser($userId, $companyId ?? 0)->all();
    }

    public function storeRules(): array
    {
        return [
            'document_type' => ['required', Rule::enum(StaffDocumentTypeEnum::class)],
            'title' => ['required', 'string', 'max:255'],
            'document_number' => ['nullable', 'string', 'max:100'],
            'issue_date' => ['nullable', 'date'],
            'expiry_date' => ['nullable', 'date', 'after_or_equal:issue_date'],
            'notes' => ['nullable', 'string'],
            'file' => ['nullable', 'file', 'max:5120'],
        ];
    }

    public function updateRules(): array
    {
        return [
            'document_type' => ['sometimes', Rule::enum(StaffDocumentTypeEnum::class)],
            'title' => ['sometimes', 'string', 'max:255'],
            'document_number' => ['nullable', 'string', 'max:100'],
            'issue_date' => ['nullable', 'date'],
            'expiry_date' => ['nullable', 'date'],
            'notes' => ['nullable', 'string'],
            'file' => ['nullable', 'file', 'max:5120'],
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(int $userId, array $data, ?int $companyId, Request $request): StaffDocument
    {
        $this->staffService->findOrFail($userId, $companyId);
        $file = $data['file'] ?? null;
        unset($data['file']);

        if ($file instanceof UploadedFile) {
            $data['file_path'] = $file->store("staff/{$userId}/documents", 'public');
        }

        $document = $this->repository->create([
            ...$data,
            'company_id' => $companyId,
            'user_id' => $userId,
        ]);

        $this->log($request, ActivityActionEnum::Create, $document);

        return $document;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(int $id, array $data, ?int $companyId, Request $request): StaffDocument
    {
        $document = $this->findOrFail($id, $companyId);
        $file = $data['file'] ?? null;
        unset($data['file']);

        if ($file instanceof UploadedFile) {
            if ($document->file_path) {
                Storage::disk('public')->delete($document->file_path);
            }
            $data['file_path'] = $file->store("staff/{$document->user_id}/documents", 'public');
        }

        $updated = $this->repository->update($document, $data);
        $this->log($request, ActivityActionEnum::Update, $updated);

        return $updated;
    }

    public function delete(int $id, ?int $companyId, Request $request): void
    {
        $document = $this->findOrFail($id, $companyId);

        if ($document->file_path) {
            Storage::disk('public')->delete($document->file_path);
        }

        $this->log($request, ActivityActionEnum::Delete, $document);
        $this->repository->delete($document);
    }

    public function findOrFail(int $id, ?int $companyId): StaffDocument
    {
        $document = $this->repository->findById($id, $companyId ?? 0);

        if (! $document) {
            throw new ApiException('Document not found', 404);
        }

        return $document;
    }

    protected function log(Request $request, ActivityActionEnum $action, StaffDocument $document): void
    {
        $this->activityLogService->log(
            action: $action,
            userId: $request->user()?->id,
            subject: $document->user,
            description: "{$action->label()} document for staff #{$document->user_id}",
            properties: ['resource' => 'StaffDocument', 'id' => $document->id],
            request: $request
        );
    }
}
