<?php

namespace App\Services;

use App\Enums\ActivityActionEnum;
use App\Exceptions\ApiException;
use App\Models\HomepageSlide;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;

class HomepageSlideService
{
    public function resolveCompanyId(Request $request): ?int
    {
        return $request->user()?->company_id;
    }

    public function paginate(Request $request): LengthAwarePaginator
    {
        $companyId = $this->resolveCompanyId($request);

        return HomepageSlide::query()
            ->where('company_id', $companyId)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->paginate((int) $request->input('per_page', 15));
    }

    public function listActive(int $companyId): Collection
    {
        return HomepageSlide::query()
            ->where('company_id', $companyId)
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();
    }

    public function findOrFail(int $id, ?int $companyId): HomepageSlide
    {
        $slide = HomepageSlide::query()
            ->where('company_id', $companyId)
            ->find($id);

        if (! $slide) {
            throw new ApiException('Homepage slide not found', 404);
        }

        return $slide;
    }

    /**
     * @return array<string, mixed>
     */
    public function storeRules(): array
    {
        return [
            'eyebrow' => ['nullable', 'string', 'max:255'],
            'title' => ['required', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:2000'],
            'cta_text' => ['nullable', 'string', 'max:100'],
            'cta_link' => ['nullable', 'string', 'max:255'],
            'secondary_cta_text' => ['nullable', 'string', 'max:100'],
            'secondary_cta_link' => ['nullable', 'string', 'max:255'],
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
            'eyebrow' => ['nullable', 'string', 'max:255'],
            'title' => ['sometimes', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:2000'],
            'cta_text' => ['nullable', 'string', 'max:100'],
            'cta_link' => ['nullable', 'string', 'max:255'],
            'secondary_cta_text' => ['nullable', 'string', 'max:100'],
            'secondary_cta_link' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data, int $companyId, Request $request): HomepageSlide
    {
        $slide = HomepageSlide::query()->create([
            ...$data,
            'company_id' => $companyId,
            'sort_order' => $data['sort_order'] ?? $this->nextSortOrder($companyId),
            'is_active' => $data['is_active'] ?? true,
        ]);

        $this->logActivity(ActivityActionEnum::Create, $slide, $request);

        return $slide;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(int $id, array $data, int $companyId, Request $request): HomepageSlide
    {
        $slide = $this->findOrFail($id, $companyId);
        $slide->update($data);
        $this->logActivity(ActivityActionEnum::Update, $slide, $request);

        return $slide->fresh();
    }

    public function delete(int $id, int $companyId, Request $request): void
    {
        $slide = $this->findOrFail($id, $companyId);

        if ($slide->image && ! str_starts_with($slide->image, 'http')) {
            Storage::disk('public')->delete($slide->image);
        }

        $this->logActivity(ActivityActionEnum::Delete, $slide, $request);
        $slide->delete();
    }

    public function uploadImage(int $id, int $companyId, UploadedFile $file, Request $request): HomepageSlide
    {
        $slide = $this->findOrFail($id, $companyId);

        if ($slide->image && ! str_starts_with($slide->image, 'http')) {
            Storage::disk('public')->delete($slide->image);
        }

        $path = $file->store("homepage-slides/{$slide->id}", 'public');
        $slide->update(['image' => $path]);

        $this->logActivity(ActivityActionEnum::Update, $slide, $request, 'Updated homepage slide image');

        return $slide->fresh();
    }

    public function deleteImage(int $id, int $companyId, Request $request): HomepageSlide
    {
        $slide = $this->findOrFail($id, $companyId);

        if ($slide->image && ! str_starts_with($slide->image, 'http')) {
            Storage::disk('public')->delete($slide->image);
        }

        $slide->update(['image' => null]);

        return $slide->fresh();
    }

    private function nextSortOrder(int $companyId): int
    {
        $max = HomepageSlide::query()
            ->where('company_id', $companyId)
            ->max('sort_order');

        return (int) $max + 1;
    }

    private function logActivity(
        ActivityActionEnum $action,
        HomepageSlide $slide,
        Request $request,
        ?string $description = null
    ): void {
        app(ActivityLogService::class)->log(
            action: $action,
            userId: $request->user()?->id,
            subject: $slide,
            description: $description ?? "Homepage slide: {$slide->title}",
            properties: ['resource' => 'HomepageSlide', 'id' => $slide->id],
            request: $request
        );
    }
}
