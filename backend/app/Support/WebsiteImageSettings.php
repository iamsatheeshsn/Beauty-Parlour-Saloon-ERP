<?php

namespace App\Support;

class WebsiteImageSettings
{
    /** @var list<string> */
    public const IMAGE_KEYS = [
        'app_logo',
        'app_favicon',
        'salon_interior_image',
        'banner_home',
        'banner_about',
        'banner_services',
        'banner_shop',
        'banner_blog',
        'banner_team',
        'banner_contact',
    ];

    /** @var list<string> */
    public const PAGE_BANNER_KEYS = [
        'banner_home',
        'banner_about',
        'banner_services',
        'banner_shop',
        'banner_blog',
        'banner_team',
        'banner_contact',
    ];

    /** @var array<string, string> */
    public const PAGE_BANNER_DESCRIPTIONS = [
        'banner_home' => 'Homepage hero carousel background',
        'banner_about' => 'About page header banner',
        'banner_services' => 'Services page header banner',
        'banner_shop' => 'Shop page header banner',
        'banner_blog' => 'Blog page header banner',
        'banner_team' => 'Team page header banner',
        'banner_contact' => 'Contact page header banner',
    ];

    public static function resolveUrl(?string $value): ?string
    {
        if ($value === null || $value === '') {
            return null;
        }

        if (str_starts_with($value, 'http://') || str_starts_with($value, 'https://')) {
            return $value;
        }

        return \Illuminate\Support\Facades\Storage::disk('public')->url($value);
    }

    public static function isImageKey(string $key): bool
    {
        return in_array($key, self::IMAGE_KEYS, true);
    }

    public static function isPageBannerKey(string $key): bool
    {
        return in_array($key, self::PAGE_BANNER_KEYS, true);
    }
}
