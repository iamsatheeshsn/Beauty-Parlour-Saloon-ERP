<?php

namespace Database\Seeders;

use App\Enums\SettingTypeEnum;
use App\Models\Company;
use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        $company = Company::query()->where('code', 'LUXE001')->firstOrFail();

        $settings = [
            [
                'group' => 'general',
                'key' => 'app_name',
                'value' => 'Beauty Salon ERP',
                'type' => SettingTypeEnum::String->value,
                'description' => 'Application display name',
                'is_public' => true,
            ],
            [
                'group' => 'general',
                'key' => 'app_logo',
                'value' => '',
                'type' => SettingTypeEnum::String->value,
                'description' => 'Application logo shown in the sidebar and login screen',
                'is_public' => true,
            ],
            [
                'group' => 'general',
                'key' => 'app_favicon',
                'value' => '',
                'type' => SettingTypeEnum::String->value,
                'description' => 'Browser tab favicon (PNG, ICO, or SVG recommended)',
                'is_public' => true,
            ],
            [
                'group' => 'regional',
                'key' => 'timezone',
                'value' => 'Asia/Dubai',
                'type' => SettingTypeEnum::String->value,
                'description' => 'Default timezone',
                'is_public' => true,
            ],
            [
                'group' => 'regional',
                'key' => 'currency',
                'value' => 'AED',
                'type' => SettingTypeEnum::String->value,
                'description' => 'Default currency',
                'is_public' => true,
            ],
            [
                'group' => 'regional',
                'key' => 'currency_symbol',
                'value' => 'د.إ',
                'type' => SettingTypeEnum::String->value,
                'description' => 'Currency symbol',
                'is_public' => true,
            ],
            [
                'group' => 'tax',
                'key' => 'vat_rate',
                'value' => '0',
                'type' => SettingTypeEnum::Integer->value,
                'description' => 'Default VAT rate (optional; per-item rates take precedence)',
                'is_public' => true,
            ],
            [
                'group' => 'tax',
                'key' => 'vat_enabled',
                'value' => '0',
                'type' => SettingTypeEnum::Boolean->value,
                'description' => 'Legacy flag — VAT is applied per item when item VAT rate is set',
                'is_public' => true,
            ],
            [
                'group' => 'appearance',
                'key' => 'primary_color',
                'value' => '#7A2E3E',
                'type' => SettingTypeEnum::String->value,
                'description' => 'Primary brand color',
                'is_public' => true,
            ],
            [
                'group' => 'appearance',
                'key' => 'secondary_color',
                'value' => '#C9A46C',
                'type' => SettingTypeEnum::String->value,
                'description' => 'Secondary brand color',
                'is_public' => true,
            ],
            [
                'group' => 'website',
                'key' => 'salon_interior_image',
                'value' => '',
                'type' => SettingTypeEnum::String->value,
                'description' => 'Salon interior image on the public website home page',
                'is_public' => true,
            ],
            [
                'group' => 'website',
                'key' => 'public_website_name',
                'value' => 'Luxe Beauty Lounge',
                'type' => SettingTypeEnum::String->value,
                'description' => 'Salon name shown on the public marketing website',
                'is_public' => true,
            ],
            [
                'group' => 'website',
                'key' => 'homepage_team_ids',
                'value' => '[]',
                'type' => SettingTypeEnum::Json->value,
                'description' => 'Up to 4 staff IDs shown in the homepage Meet the Artists section',
                'is_public' => true,
            ],
            [
                'group' => 'website',
                'key' => 'business_hours',
                'value' => 'Sun – Thu: 10:00 – 21:00 · Fri – Sat: 10:00 – 22:00',
                'type' => SettingTypeEnum::String->value,
                'description' => 'Opening hours shown on the public website',
                'is_public' => true,
            ],
            [
                'group' => 'website',
                'key' => 'public_phone',
                'value' => '+971 4 123 4567',
                'type' => SettingTypeEnum::String->value,
                'description' => 'Phone number on the public website contact page',
                'is_public' => true,
            ],
            [
                'group' => 'website',
                'key' => 'public_whatsapp',
                'value' => '971501234567',
                'type' => SettingTypeEnum::String->value,
                'description' => 'WhatsApp number for the public website footer (digits only or full wa.me link)',
                'is_public' => true,
            ],
            [
                'group' => 'website',
                'key' => 'public_email',
                'value' => 'info@luxebeauty.ae',
                'type' => SettingTypeEnum::String->value,
                'description' => 'Email address on the public website contact page',
                'is_public' => true,
            ],
            [
                'group' => 'website',
                'key' => 'public_address',
                'value' => 'Marina Walk, Dubai Marina, UAE',
                'type' => SettingTypeEnum::String->value,
                'description' => 'Street address on the public website contact page',
                'is_public' => true,
            ],
            [
                'group' => 'website',
                'key' => 'map_url',
                'value' => 'https://www.google.com/maps/place/Dubai+Marina',
                'type' => SettingTypeEnum::String->value,
                'description' => 'Google Maps link — open Google Maps, tap Share, and paste the link here',
                'is_public' => true,
            ],
            [
                'group' => 'website',
                'key' => 'banner_home',
                'value' => 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1600&q=80',
                'type' => SettingTypeEnum::String->value,
                'description' => 'Homepage hero carousel background',
                'is_public' => true,
            ],
            [
                'group' => 'website',
                'key' => 'banner_about',
                'value' => 'https://images.unsplash.com/photo-1633681926022-84c23e8cb124?auto=format&fit=crop&w=1600&q=80',
                'type' => SettingTypeEnum::String->value,
                'description' => 'About page header banner',
                'is_public' => true,
            ],
            [
                'group' => 'website',
                'key' => 'banner_services',
                'value' => 'https://images.unsplash.com/photo-1521590832167-7bcbfda6381b?auto=format&fit=crop&w=1600&q=80',
                'type' => SettingTypeEnum::String->value,
                'description' => 'Services page header banner',
                'is_public' => true,
            ],
            [
                'group' => 'website',
                'key' => 'banner_shop',
                'value' => 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1600&q=80',
                'type' => SettingTypeEnum::String->value,
                'description' => 'Shop page header banner',
                'is_public' => true,
            ],
            [
                'group' => 'website',
                'key' => 'banner_blog',
                'value' => 'https://images.unsplash.com/photo-1519415510929-860fa69134ef?auto=format&fit=crop&w=1600&q=80',
                'type' => SettingTypeEnum::String->value,
                'description' => 'Blog page header banner',
                'is_public' => true,
            ],
            [
                'group' => 'website',
                'key' => 'banner_team',
                'value' => 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1600&q=80',
                'type' => SettingTypeEnum::String->value,
                'description' => 'Team page header banner',
                'is_public' => true,
            ],
            [
                'group' => 'website',
                'key' => 'banner_contact',
                'value' => 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=1600&q=80',
                'type' => SettingTypeEnum::String->value,
                'description' => 'Contact page header banner',
                'is_public' => true,
            ],
        ];

        foreach ($settings as $setting) {
            Setting::query()->updateOrCreate(
                [
                    'company_id' => $company->id,
                    'branch_id' => null,
                    'key' => $setting['key'],
                ],
                array_merge($setting, ['company_id' => $company->id, 'branch_id' => null])
            );
        }
    }
}
