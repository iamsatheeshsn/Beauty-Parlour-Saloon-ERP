<?php

namespace App\Services;

use App\Enums\ActivityActionEnum;
use App\Exceptions\ApiException;
use App\Models\Customer;
use App\Models\CustomerNote;
use App\Repositories\CustomerNoteRepository;
use Illuminate\Http\Request;

class CustomerNoteService
{
    public function __construct(
        private readonly CustomerNoteRepository $noteRepository,
        private readonly CustomerService $customerService,
        private readonly ActivityLogService $activityLogService
    ) {
    }

    public function list(int $customerId, ?int $companyId): array
    {
        $this->customerService->findOrFail($customerId, $companyId);

        return $this->noteRepository->listForCustomer($customerId, $companyId ?? 0)->all();
    }

    public function storeRules(): array
    {
        return [
            'note' => ['required', 'string', 'max:5000'],
            'is_pinned' => ['sometimes', 'boolean'],
        ];
    }

    public function updateRules(): array
    {
        return [
            'note' => ['sometimes', 'string', 'max:5000'],
            'is_pinned' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(int $customerId, array $data, ?int $companyId, Request $request): CustomerNote
    {
        $this->customerService->findOrFail($customerId, $companyId);

        $note = $this->noteRepository->create([
            ...$data,
            'company_id' => $companyId,
            'customer_id' => $customerId,
            'user_id' => $request->user()?->id,
        ]);

        $this->log($request, ActivityActionEnum::Create, $note);

        return $note;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(int $id, array $data, ?int $companyId, Request $request): CustomerNote
    {
        $note = $this->findOrFail($id, $companyId);
        $updated = $this->noteRepository->update($note, $data);
        $this->log($request, ActivityActionEnum::Update, $updated);

        return $updated;
    }

    public function delete(int $id, ?int $companyId, Request $request): void
    {
        $note = $this->findOrFail($id, $companyId);
        $this->log($request, ActivityActionEnum::Delete, $note);
        $this->noteRepository->delete($note);
    }

    public function findOrFail(int $id, ?int $companyId): CustomerNote
    {
        $note = $this->noteRepository->findById($id, $companyId ?? 0);

        if (! $note) {
            throw new ApiException('Note not found', 404);
        }

        return $note;
    }

    protected function log(Request $request, ActivityActionEnum $action, CustomerNote $note): void
    {
        $this->activityLogService->log(
            action: $action,
            userId: $request->user()?->id,
            subject: $note->customer,
            description: "{$action->label()} note for customer #{$note->customer_id}",
            properties: ['resource' => 'CustomerNote', 'id' => $note->id, 'customer_id' => $note->customer_id],
            request: $request
        );
    }
}
