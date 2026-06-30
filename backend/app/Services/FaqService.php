<?php

namespace App\Services;

use App\Enums\ActivityActionEnum;
use App\Exceptions\ApiException;
use App\Models\Faq;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class FaqService
{
    public function resolveCompanyId(Request $request): ?int
    {
        return $request->user()?->company_id;
    }

    public function paginate(Request $request): LengthAwarePaginator
    {
        $companyId = $this->resolveCompanyId($request);

        return Faq::query()
            ->where('company_id', $companyId)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->paginate((int) $request->input('per_page', 15));
    }

    public function listActive(int $companyId): Collection
    {
        return Faq::query()
            ->where('company_id', $companyId)
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();
    }

    public function findOrFail(int $id, ?int $companyId): Faq
    {
        $faq = Faq::query()
            ->where('company_id', $companyId)
            ->find($id);

        if (! $faq) {
            throw new ApiException('FAQ not found', 404);
        }

        return $faq;
    }

    /**
     * @return array<string, mixed>
     */
    public function storeRules(): array
    {
        return [
            'question' => ['required', 'string', 'max:500'],
            'answer' => ['required', 'string', 'max:5000'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function updateRules(): array
    {
        return [
            'question' => ['sometimes', 'string', 'max:500'],
            'answer' => ['sometimes', 'string', 'max:5000'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data, int $companyId, Request $request): Faq
    {
        $faq = Faq::query()->create([
            ...$data,
            'company_id' => $companyId,
            'sort_order' => $data['sort_order'] ?? $this->nextSortOrder($companyId),
            'is_active' => $data['is_active'] ?? true,
        ]);

        $this->logActivity(ActivityActionEnum::Create, $faq, $request);

        return $faq;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(int $id, array $data, int $companyId, Request $request): Faq
    {
        $faq = $this->findOrFail($id, $companyId);
        $faq->update($data);
        $this->logActivity(ActivityActionEnum::Update, $faq, $request);

        return $faq->fresh();
    }

    public function delete(int $id, int $companyId, Request $request): void
    {
        $faq = $this->findOrFail($id, $companyId);
        $this->logActivity(ActivityActionEnum::Delete, $faq, $request);
        $faq->delete();
    }

    private function nextSortOrder(int $companyId): int
    {
        $max = Faq::query()
            ->where('company_id', $companyId)
            ->max('sort_order');

        return (int) $max + 1;
    }

    private function logActivity(
        ActivityActionEnum $action,
        Faq $faq,
        Request $request,
    ): void {
        app(ActivityLogService::class)->log(
            action: $action,
            userId: $request->user()?->id,
            subject: $faq,
            description: "FAQ: {$faq->question}",
            properties: ['resource' => 'Faq', 'id' => $faq->id],
            request: $request
        );
    }
}
