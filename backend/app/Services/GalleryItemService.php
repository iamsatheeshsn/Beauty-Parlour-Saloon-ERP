<?php

namespace App\Services;

use App\Enums\ActivityActionEnum;
use App\Exceptions\ApiException;
use App\Models\GalleryItem;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;

class GalleryItemService
{
    public function resolveCompanyId(Request $request): ?int
    {
        return $request->user()?->company_id;
    }

    public function paginate(Request $request): LengthAwarePaginator
    {
        $companyId = $this->resolveCompanyId($request);

        return GalleryItem::query()
            ->where('company_id', $companyId)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->paginate((int) $request->input('per_page', 15));
    }

    public function listActive(int $companyId): Collection
    {
        return GalleryItem::query()
            ->where('company_id', $companyId)
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();
    }

    public function findOrFail(int $id, ?int $companyId): GalleryItem
    {
        $item = GalleryItem::query()
            ->where('company_id', $companyId)
            ->find($id);

        if (! $item) {
            throw new ApiException('Gallery item not found', 404);
        }

        return $item;
    }

    /**
     * @return array<string, mixed>
     */
    public function storeRules(): array
    {
        return [
            'title' => ['nullable', 'string', 'max:255'],
            'alt_text' => ['nullable', 'string', 'max:255'],
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
            'title' => ['nullable', 'string', 'max:255'],
            'alt_text' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data, int $companyId, Request $request): GalleryItem
    {
        $item = GalleryItem::query()->create([
            ...$data,
            'company_id' => $companyId,
            'image' => $data['image'] ?? '',
            'sort_order' => $data['sort_order'] ?? $this->nextSortOrder($companyId),
            'is_active' => $data['is_active'] ?? true,
        ]);

        $this->logActivity(ActivityActionEnum::Create, $item, $request);

        return $item;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(int $id, array $data, int $companyId, Request $request): GalleryItem
    {
        $item = $this->findOrFail($id, $companyId);
        $item->update($data);
        $this->logActivity(ActivityActionEnum::Update, $item, $request);

        return $item->fresh();
    }

    public function delete(int $id, int $companyId, Request $request): void
    {
        $item = $this->findOrFail($id, $companyId);

        if ($item->image && ! str_starts_with($item->image, 'http')) {
            Storage::disk('public')->delete($item->image);
        }

        $this->logActivity(ActivityActionEnum::Delete, $item, $request);
        $item->delete();
    }

    public function uploadImage(int $id, int $companyId, UploadedFile $file, Request $request): GalleryItem
    {
        $item = $this->findOrFail($id, $companyId);

        if ($item->image && ! str_starts_with($item->image, 'http')) {
            Storage::disk('public')->delete($item->image);
        }

        $path = $file->store("gallery-items/{$item->id}", 'public');
        $item->update(['image' => $path]);

        $this->logActivity(ActivityActionEnum::Update, $item, $request, 'Updated gallery image');

        return $item->fresh();
    }

    public function deleteImage(int $id, int $companyId, Request $request): GalleryItem
    {
        $item = $this->findOrFail($id, $companyId);

        if ($item->image && ! str_starts_with($item->image, 'http')) {
            Storage::disk('public')->delete($item->image);
        }

        $item->update(['image' => '']);

        return $item->fresh();
    }

    private function nextSortOrder(int $companyId): int
    {
        $max = GalleryItem::query()
            ->where('company_id', $companyId)
            ->max('sort_order');

        return (int) $max + 1;
    }

    private function logActivity(
        ActivityActionEnum $action,
        GalleryItem $item,
        Request $request,
        ?string $description = null
    ): void {
        app(ActivityLogService::class)->log(
            action: $action,
            userId: $request->user()?->id,
            subject: $item,
            description: $description ?? 'Gallery item: '.($item->title ?: "#{$item->id}"),
            properties: ['resource' => 'GalleryItem', 'id' => $item->id],
            request: $request
        );
    }
}
