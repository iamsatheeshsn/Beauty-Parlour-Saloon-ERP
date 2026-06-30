<?php

namespace App\Http\Resources\Public;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PublicBlogPostResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $includeContent = $request->route()?->parameter('slug') !== null;

        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'excerpt' => $this->excerpt,
            'content' => $this->when($includeContent, $this->content),
            'featured_image' => $this->featuredImageUrl(),
            'author_name' => $this->author_name,
            'category' => $this->category,
            'tags' => $this->tags ?? [],
            'published_at' => $this->published_at?->toIso8601String(),
            'reading_time' => max(1, (int) ceil(str_word_count(strip_tags($this->content)) / 200)),
        ];
    }

    private function featuredImageUrl(): ?string
    {
        if (! $this->featured_image) {
            return null;
        }

        if (Str::startsWith($this->featured_image, ['http://', 'https://'])) {
            return $this->featured_image;
        }

        return Storage::disk('public')->url($this->featured_image);
    }
}
