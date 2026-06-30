<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\HomepageSlide;
use Illuminate\Database\Seeder;

class HomepageSlideSeeder extends Seeder
{
    public function run(): void
    {
        $company = Company::query()->where('code', 'LUXE001')->first();

        if (! $company) {
            return;
        }

        $slides = [
            [
                'eyebrow' => 'Premium Beauty Experience',
                'title' => 'Reveal Your Natural Radiance',
                'subtitle' => 'Expert hair, skin, and wellness treatments in the heart of Dubai Marina — where luxury meets artistry.',
                'cta_text' => 'Book Appointment',
                'cta_link' => '/contact',
                'secondary_cta_text' => 'Explore Services',
                'secondary_cta_link' => '/our-services',
                'image' => 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1600&q=80',
                'sort_order' => 1,
            ],
            [
                'eyebrow' => 'Hair & Colour Studio',
                'title' => 'Crafted Cuts & Signature Colour',
                'subtitle' => 'From balayage to keratin smoothing — our stylists create looks tailored to you.',
                'cta_text' => 'View Services',
                'cta_link' => '/our-services',
                'secondary_cta_text' => 'Book Appointment',
                'secondary_cta_link' => '/contact',
                'image' => 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1600&q=80',
                'sort_order' => 2,
            ],
        ];

        foreach ($slides as $slide) {
            HomepageSlide::query()->updateOrCreate(
                [
                    'company_id' => $company->id,
                    'title' => $slide['title'],
                ],
                array_merge($slide, [
                    'company_id' => $company->id,
                    'is_active' => true,
                ])
            );
        }
    }
}
