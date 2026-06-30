<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Testimonial;
use Illuminate\Database\Seeder;

class TestimonialSeeder extends Seeder
{
    public function run(): void
    {
        $company = Company::query()->where('code', 'LUXE001')->first();

        if (! $company) {
            return;
        }

        $testimonials = [
            [
                'quote' => 'The most luxurious salon experience in Dubai. My balayage turned out exactly as I imagined — flawless.',
                'name' => 'Amira K.',
                'role' => 'Regular Client',
                'sort_order' => 1,
            ],
            [
                'quote' => 'Impeccable service from booking to checkout. The team remembers every detail. Absolutely worth it.',
                'name' => 'Jessica M.',
                'role' => 'Bridal Client',
                'sort_order' => 2,
            ],
            [
                'quote' => 'Their keratin treatment transformed my hair. Professional, warm, and the space feels like a boutique spa.',
                'name' => 'Fatima A.',
                'role' => 'VIP Member',
                'sort_order' => 3,
            ],
        ];

        foreach ($testimonials as $testimonial) {
            Testimonial::query()->updateOrCreate(
                [
                    'company_id' => $company->id,
                    'name' => $testimonial['name'],
                ],
                array_merge($testimonial, [
                    'company_id' => $company->id,
                    'is_active' => true,
                ])
            );
        }
    }
}
