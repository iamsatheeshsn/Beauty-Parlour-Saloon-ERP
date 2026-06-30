<?php

namespace App\Services;

use App\Enums\ActivityActionEnum;
use App\Exceptions\ApiException;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class TestimonialService
{
    public function resolveCompanyId(Request $request): ?int
    {
        return $request->user()?->company_id;
    }

    public function paginate(Request $request): LengthAwarePaginator
    {
        $companyId = $this->resolveCompanyId($request);

        return Testimonial::query()
            ->where('company_id', $companyId)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->paginate((int) $request->input('per_page', 15));
    }

    public function listActive(int $companyId): Collection
    {
        return Testimonial::query()
            ->where('company_id', $companyId)
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();
    }

    public function findOrFail(int $id, ?int $companyId): Testimonial
    {
        $testimonial = Testimonial::query()
            ->where('company_id', $companyId)
            ->find($id);

        if (! $testimonial) {
            throw new ApiException('Testimonial not found', 404);
        }

        return $testimonial;
    }

    /**
     * @return array<string, mixed>
     */
    public function storeRules(): array
    {
        return [
            'quote' => ['required', 'string', 'max:2000'],
            'name' => ['required', 'string', 'max:255'],
            'role' => ['nullable', 'string', 'max:255'],
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
            'quote' => ['sometimes', 'string', 'max:2000'],
            'name' => ['sometimes', 'string', 'max:255'],
            'role' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data, int $companyId, Request $request): Testimonial
    {
        $testimonial = Testimonial::query()->create([
            ...$data,
            'company_id' => $companyId,
            'sort_order' => $data['sort_order'] ?? $this->nextSortOrder($companyId),
            'is_active' => $data['is_active'] ?? true,
        ]);

        $this->logActivity(ActivityActionEnum::Create, $testimonial, $request);

        return $testimonial;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(int $id, array $data, int $companyId, Request $request): Testimonial
    {
        $testimonial = $this->findOrFail($id, $companyId);
        $testimonial->update($data);
        $this->logActivity(ActivityActionEnum::Update, $testimonial, $request);

        return $testimonial->fresh();
    }

    public function delete(int $id, int $companyId, Request $request): void
    {
        $testimonial = $this->findOrFail($id, $companyId);
        $this->logActivity(ActivityActionEnum::Delete, $testimonial, $request);
        $testimonial->delete();
    }

    private function nextSortOrder(int $companyId): int
    {
        $max = Testimonial::query()
            ->where('company_id', $companyId)
            ->max('sort_order');

        return (int) $max + 1;
    }

    private function logActivity(
        ActivityActionEnum $action,
        Testimonial $testimonial,
        Request $request,
    ): void {
        app(ActivityLogService::class)->log(
            action: $action,
            userId: $request->user()?->id,
            subject: $testimonial,
            description: "Testimonial: {$testimonial->name}",
            properties: ['resource' => 'Testimonial', 'id' => $testimonial->id],
            request: $request
        );
    }
}
