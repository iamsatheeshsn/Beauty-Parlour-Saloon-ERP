<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\GalleryItem;
use Illuminate\Database\Seeder;

class GalleryItemSeeder extends Seeder
{
    public function run(): void
    {
        $company = Company::query()->where('code', 'LUXE001')->first();

        if (! $company) {
            return;
        }

        $images = [
            'https://images.unsplash.com/photo-1633681926022-84c23e8cb124?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1562322560-ab82cd713997?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1519415510929-860fa69134ef?auto=format&fit=crop&w=600&q=80',
        ];

        foreach ($images as $index => $image) {
            GalleryItem::query()->updateOrCreate(
                [
                    'company_id' => $company->id,
                    'image' => $image,
                ],
                [
                    'title' => 'Gallery '.($index + 1),
                    'alt_text' => 'Gallery '.($index + 1),
                    'sort_order' => $index + 1,
                    'is_active' => true,
                ]
            );
        }
    }
}
