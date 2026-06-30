<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Product;
use App\Models\SalonService;
use App\Models\ServiceCategory;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Database\Seeder;

class WebsiteAssetsSeeder extends Seeder
{
    /** @var array<string, string> */
    private array $categoryImages = [
        'HAIR' => 'https://images.unsplash.com/photo-1521590832167-7bcbfda6381b?auto=format&fit=crop&w=800&q=80',
        'NAILS' => 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80',
        'SKIN' => 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
        'SPA' => 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
        'MAKEUP' => 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=800&q=80',
        'WAX' => 'https://images.unsplash.com/photo-1519415510929-860fa69134ef?auto=format&fit=crop&w=800&q=80',
        'PACKAGES' => 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=800&q=80',
    ];

    /** @var array<string, string> */
    private array $productImages = [
        'PRD0001' => 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
        'PRD0003' => 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
        'PRD0004' => 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
        'PRD0005' => 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80',
        'PRD0008' => 'https://images.unsplash.com/photo-1535585200897-03d85c8925d8?auto=format&fit=crop&w=800&q=80',
        'PRD0009' => 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
        'PRD0010' => 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=800&q=80',
    ];

    /** @var array<string, string> */
    private array $staffAvatars = [
        'reception@luxebeauty.ae' => 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
        'staff@luxebeauty.ae' => 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=600&q=80',
        'layla.mansour@luxebeauty.ae' => 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=600&q=80',
        'sarah.almazrouei@luxebeauty.ae' => 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=600&q=80',
        'priya.sharma@luxebeauty.ae' => 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
        'elena.volkov@luxebeauty.ae' => 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80',
        'maria.santos@luxebeauty.ae' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
        'amira.khalid@luxebeauty.ae' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
        'james.okonkwo@luxebeauty.ae' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
        'sofia.laurent@luxebeauty.ae' => 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=600&q=80',
        'admin@luxebeauty.ae' => 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=600&q=80',
        'owner@luxebeauty.ae' => 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80',
    ];

    public function run(): void
    {
        $company = Company::query()->where('code', 'LUXE001')->first();

        if (! $company) {
            return;
        }

        $this->seedServiceImages($company->id);
        $this->seedProductImages($company->id);
        $this->seedStaffAvatars();
        $this->seedContactSettings($company);
    }

    private function seedServiceImages(int $companyId): void
    {
        $categories = ServiceCategory::query()
            ->where('company_id', $companyId)
            ->get()
            ->keyBy('id');

        SalonService::query()
            ->where('company_id', $companyId)
            ->where(function ($q): void {
                $q->whereNull('image')->orWhere('image', '');
            })
            ->each(function (SalonService $service) use ($categories): void {
                $code = $categories->get($service->service_category_id)?->code;
                $image = $this->categoryImages[$code ?? ''] ?? 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80';
                $service->update(['image' => $image]);
            });
    }

    private function seedProductImages(int $companyId): void
    {
        Product::query()
            ->where('company_id', $companyId)
            ->where(function ($q): void {
                $q->whereNull('image')->orWhere('image', '');
            })
            ->each(function (Product $product): void {
                $image = $this->productImages[$product->code] ?? null;

                if ($image) {
                    $product->update(['image' => $image]);
                }
            });
    }

    private function seedStaffAvatars(): void
    {
        foreach ($this->staffAvatars as $email => $avatarUrl) {
            User::query()
                ->where('email', $email)
                ->where(function ($q): void {
                    $q->whereNull('avatar')->orWhere('avatar', '');
                })
                ->update(['avatar' => $avatarUrl]);
        }
    }

    private function seedContactSettings(Company $company): void
    {
        $defaults = [
            'public_phone' => $company->phone ?? '+971 4 123 4567',
            'public_whatsapp' => '971501234567',
            'public_email' => $company->email ?? 'info@luxebeauty.ae',
            'public_address' => $company->address ?? 'Marina Walk, Dubai Marina, UAE',
            'map_url' => 'https://www.google.com/maps/place/Dubai+Marina',
        ];

        foreach ($defaults as $key => $value) {
            $existing = Setting::query()
                ->where('company_id', $company->id)
                ->whereNull('branch_id')
                ->where('key', $key)
                ->value('value');

            if ($existing !== null && $existing !== '') {
                continue;
            }

            Setting::query()->updateOrCreate(
                ['company_id' => $company->id, 'branch_id' => null, 'key' => $key],
                [
                    'group' => 'website',
                    'value' => $value,
                    'type' => 'string',
                    'description' => match ($key) {
                        'public_phone' => 'Phone number on the public website contact page',
                        'public_whatsapp' => 'WhatsApp number for the public website footer',
                        'public_email' => 'Email address on the public website contact page',
                        'public_address' => 'Street address on the public website contact page',
                        'map_url' => 'Google Maps link (copy from Google Maps → Share)',
                        default => null,
                    },
                    'is_public' => true,
                ]
            );
        }
    }
}
