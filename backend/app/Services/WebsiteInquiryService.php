<?php

namespace App\Services;

use App\Enums\ActivityActionEnum;
use App\Exceptions\ApiException;
use App\Models\WebsiteInquiry;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class WebsiteInquiryService
{
    public function resolveCompanyId(Request $request): ?int
    {
        return $request->user()?->company_id;
    }

    public function paginate(Request $request): LengthAwarePaginator
    {
        $companyId = $this->resolveCompanyId($request);

        return WebsiteInquiry::query()
            ->where('company_id', $companyId)
            ->when($request->filled('type'), fn ($q) => $q->where('type', $request->string('type')))
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->string('status')))
            ->when($request->filled('search'), function ($q) use ($request): void {
                $term = '%'.$request->string('search').'%';
                $q->where(function ($inner) use ($term): void {
                    $inner->where('name', 'like', $term)
                        ->orWhere('email', 'like', $term)
                        ->orWhere('phone', 'like', $term)
                        ->orWhere('subject', 'like', $term)
                        ->orWhere('product_name', 'like', $term)
                        ->orWhere('code', 'like', $term);
                });
            })
            ->orderByDesc('created_at')
            ->paginate((int) $request->input('per_page', 15));
    }

    public function findOrFail(int $id, ?int $companyId): WebsiteInquiry
    {
        $inquiry = WebsiteInquiry::query()
            ->where('company_id', $companyId)
            ->find($id);

        if (! $inquiry) {
            throw new ApiException('Inquiry not found', 404);
        }

        return $inquiry;
    }

    /**
     * @return array<string, mixed>
     */
    public function publicStoreRules(): array
    {
        return [
            'type' => ['required', 'string', 'in:product,general,other'],
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'email' => ['nullable', 'email', 'max:255'],
            'subject' => ['nullable', 'string', 'max:255'],
            'product_name' => ['nullable', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array{reference: string, type: string}
     */
    public function createFromPublic(array $data, int $companyId): array
    {
        if (empty($data['phone']) && empty($data['email'])) {
            throw new ApiException('Phone or email is required', 422);
        }

        if ($data['type'] === 'product' && empty($data['product_name']) && empty($data['subject'])) {
            throw new ApiException('Product name or subject is required for product inquiries', 422);
        }

        $subject = $data['subject'] ?? match ($data['type']) {
            'product' => 'Product Inquiry',
            'general' => 'General Inquiry',
            default => 'Other Inquiry',
        };

        $inquiry = WebsiteInquiry::query()->create([
            'company_id' => $companyId,
            'code' => $this->nextCode($companyId),
            'type' => $data['type'],
            'status' => 'new',
            'name' => $data['name'],
            'phone' => $data['phone'] ?? null,
            'email' => $data['email'] ?? null,
            'subject' => $subject,
            'product_name' => $data['product_name'] ?? null,
            'message' => $data['message'],
        ]);

        return [
            'reference' => $inquiry->code,
            'type' => $inquiry->type,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function updateStatusRules(): array
    {
        return [
            'status' => ['required', 'string', 'in:new,read,responded,archived'],
        ];
    }

    public function updateStatus(int $id, string $status, ?int $companyId, Request $request): WebsiteInquiry
    {
        $inquiry = $this->findOrFail($id, $companyId);

        $updates = ['status' => $status];

        if ($status === 'read' && ! $inquiry->read_at) {
            $updates['read_at'] = now();
        }

        if ($status === 'responded') {
            $updates['responded_at'] = now();
            if (! $inquiry->read_at) {
                $updates['read_at'] = now();
            }
        }

        $inquiry->update($updates);

        app(ActivityLogService::class)->log(
            action: ActivityActionEnum::Update,
            userId: $request->user()?->id,
            subject: $inquiry,
            description: "Updated inquiry status: {$inquiry->code} → {$status}",
            properties: ['resource' => 'WebsiteInquiry', 'id' => $inquiry->id],
            request: $request
        );

        return $inquiry->fresh();
    }

    public function delete(int $id, ?int $companyId, Request $request): void
    {
        $inquiry = $this->findOrFail($id, $companyId);

        app(ActivityLogService::class)->log(
            action: ActivityActionEnum::Delete,
            userId: $request->user()?->id,
            subject: $inquiry,
            description: "Deleted inquiry: {$inquiry->code}",
            properties: ['resource' => 'WebsiteInquiry', 'id' => $inquiry->id],
            request: $request
        );

        $inquiry->delete();
    }

    public function countNew(?int $companyId): int
    {
        if (! $companyId) {
            return 0;
        }

        return WebsiteInquiry::query()
            ->where('company_id', $companyId)
            ->where('status', 'new')
            ->count();
    }

    private function nextCode(int $companyId): string
    {
        $latest = WebsiteInquiry::query()
            ->where('company_id', $companyId)
            ->orderByDesc('id')
            ->value('code');

        $number = 1;

        if ($latest && preg_match('/(\d+)$/', $latest, $matches)) {
            $number = (int) $matches[1] + 1;
        }

        return 'INQ'.str_pad((string) $number, 4, '0', STR_PAD_LEFT);
    }
}
