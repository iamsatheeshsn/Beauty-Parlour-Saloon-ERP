<?php

namespace App\Services;

use App\Enums\ActivityActionEnum;
use App\Exceptions\ApiException;
use App\Models\BlogPost;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class BlogPostService
{
    public function resolveCompanyId(Request $request): ?int
    {
        return $request->user()?->company_id;
    }

    public function paginate(Request $request): LengthAwarePaginator
    {
        $companyId = $this->resolveCompanyId($request);

        return BlogPost::query()
            ->where('company_id', $companyId)
            ->orderByDesc('published_at')
            ->orderBy('sort_order')
            ->orderByDesc('id')
            ->paginate((int) $request->input('per_page', 15));
    }

    public function listPublished(int $companyId): Collection
    {
        return BlogPost::query()
            ->where('company_id', $companyId)
            ->where('is_published', true)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->orderByDesc('published_at')
            ->get();
    }

    public function findOrFail(int $id, ?int $companyId): BlogPost
    {
        $post = BlogPost::query()
            ->where('company_id', $companyId)
            ->find($id);

        if (! $post) {
            throw new ApiException('Blog post not found', 404);
        }

        return $post;
    }

    /**
     * @return array<string, mixed>
     */
    public function storeRules(?int $companyId = null): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('blog_posts', 'slug')],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'content' => ['required', 'string'],
            'author_name' => ['nullable', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:100'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'max:50'],
            'is_published' => ['sometimes', 'boolean'],
            'published_at' => ['nullable', 'date'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function updateRules(int $id): array
    {
        return [
            'title' => ['sometimes', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('blog_posts', 'slug')->ignore($id)],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'content' => ['sometimes', 'string'],
            'author_name' => ['nullable', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:100'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'max:50'],
            'is_published' => ['sometimes', 'boolean'],
            'published_at' => ['nullable', 'date'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data, int $companyId, Request $request): BlogPost
    {
        $slug = ! empty($data['slug'])
            ? Str::slug($data['slug'])
            : $this->uniqueSlug($data['title']);

        $isPublished = $data['is_published'] ?? false;
        $publishedAt = $data['published_at'] ?? null;

        if ($isPublished && ! $publishedAt) {
            $publishedAt = now();
        }

        $post = BlogPost::query()->create([
            'company_id' => $companyId,
            'slug' => $slug,
            'title' => $data['title'],
            'excerpt' => $data['excerpt'] ?? null,
            'content' => $data['content'],
            'author_name' => $data['author_name'] ?? null,
            'category' => $data['category'] ?? null,
            'tags' => $data['tags'] ?? [],
            'is_published' => $isPublished,
            'published_at' => $publishedAt,
            'sort_order' => $data['sort_order'] ?? $this->nextSortOrder($companyId),
        ]);

        $this->logActivity(ActivityActionEnum::Create, $post, $request);

        return $post;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(int $id, array $data, int $companyId, Request $request): BlogPost
    {
        $post = $this->findOrFail($id, $companyId);

        if (isset($data['slug']) && $data['slug'] !== '') {
            $data['slug'] = Str::slug($data['slug']);
        } elseif (isset($data['title']) && empty($data['slug'])) {
            unset($data['slug']);
        }

        if (array_key_exists('is_published', $data) && $data['is_published'] && empty($data['published_at']) && ! $post->published_at) {
            $data['published_at'] = now();
        }

        $post->update($data);
        $this->logActivity(ActivityActionEnum::Update, $post, $request);

        return $post->fresh();
    }

    public function delete(int $id, int $companyId, Request $request): void
    {
        $post = $this->findOrFail($id, $companyId);

        if ($post->featured_image && ! str_starts_with($post->featured_image, 'http')) {
            Storage::disk('public')->delete($post->featured_image);
        }

        $this->logActivity(ActivityActionEnum::Delete, $post, $request);
        $post->delete();
    }

    public function uploadFeaturedImage(int $id, int $companyId, UploadedFile $file, Request $request): BlogPost
    {
        $post = $this->findOrFail($id, $companyId);

        if ($post->featured_image && ! str_starts_with($post->featured_image, 'http')) {
            Storage::disk('public')->delete($post->featured_image);
        }

        $path = $file->store("blog-posts/{$post->id}", 'public');
        $post->update(['featured_image' => $path]);

        $this->logActivity(ActivityActionEnum::Update, $post, $request, 'Updated blog post featured image');

        return $post->fresh();
    }

    public function deleteFeaturedImage(int $id, int $companyId, Request $request): BlogPost
    {
        $post = $this->findOrFail($id, $companyId);

        if ($post->featured_image && ! str_starts_with($post->featured_image, 'http')) {
            Storage::disk('public')->delete($post->featured_image);
        }

        $post->update(['featured_image' => null]);

        return $post->fresh();
    }

    private function uniqueSlug(string $title, ?int $exceptId = null): string
    {
        $base = Str::slug($title) ?: 'post';
        $slug = $base;
        $i = 1;

        while (BlogPost::query()
            ->where('slug', $slug)
            ->when($exceptId, fn ($q) => $q->where('id', '!=', $exceptId))
            ->exists()) {
            $slug = "{$base}-{$i}";
            $i++;
        }

        return $slug;
    }

    private function nextSortOrder(int $companyId): int
    {
        $max = BlogPost::query()
            ->where('company_id', $companyId)
            ->max('sort_order');

        return (int) $max + 1;
    }

    private function logActivity(
        ActivityActionEnum $action,
        BlogPost $post,
        Request $request,
        ?string $description = null
    ): void {
        app(ActivityLogService::class)->log(
            action: $action,
            userId: $request->user()?->id,
            subject: $post,
            description: $description ?? "Blog post: {$post->title}",
            properties: ['resource' => 'BlogPost', 'id' => $post->id],
            request: $request
        );
    }
}
