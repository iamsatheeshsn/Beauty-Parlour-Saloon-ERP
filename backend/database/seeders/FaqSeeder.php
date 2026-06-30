<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Faq;
use Illuminate\Database\Seeder;

class FaqSeeder extends Seeder
{
    public function run(): void
    {
        $company = Company::query()->where('code', 'LUXE001')->first();

        if (! $company) {
            return;
        }

        $faqs = [
            [
                'question' => 'Do I need to book in advance?',
                'answer' => 'We recommend booking online or via WhatsApp. Walk-ins are welcome based on availability.',
                'sort_order' => 1,
            ],
            [
                'question' => 'What is your cancellation policy?',
                'answer' => 'Please cancel or reschedule at least 4 hours before your appointment to avoid a fee.',
                'sort_order' => 2,
            ],
            [
                'question' => 'Do you offer bridal packages?',
                'answer' => 'Yes — we provide bridal trials, event styling, and full day-of packages. Contact us for a custom quote.',
                'sort_order' => 3,
            ],
            [
                'question' => 'Is VAT included in prices?',
                'answer' => 'All listed prices are in AED. VAT is applied at checkout where applicable per UAE regulations.',
                'sort_order' => 4,
            ],
        ];

        foreach ($faqs as $faq) {
            Faq::query()->updateOrCreate(
                [
                    'company_id' => $company->id,
                    'question' => $faq['question'],
                ],
                array_merge($faq, [
                    'company_id' => $company->id,
                    'is_active' => true,
                ])
            );
        }
    }
}
