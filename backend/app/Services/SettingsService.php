<?php

namespace App\Services;

use App\Interfaces\CompanyRepositoryInterface;
use App\Interfaces\SettingRepositoryInterface;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use App\Support\WebsiteImageSettings;

class SettingsService
{
    public function __construct(
        private readonly SettingRepositoryInterface $settingRepository,
        private readonly CompanyRepositoryInterface $companyRepository
    ) {
    }

    public function getPublicSettings(?int $companyId = null, ?int $branchId = null): Collection
    {
        return $this->settingRepository->getPublicSettings($companyId, $branchId);
    }

    /**
     * @return array<string, mixed>
     */
    public function getAppSettings(Request $request): array
    {
        $user = $request->user();
        $companyId = $user?->company_id;
        $branchId = $user?->branch_id;

        $settings = $this->getPublicSettings($companyId, $branchId);

        $map = [];
        foreach ($settings as $setting) {
            $map[$setting->key] = $setting->casted_value;
        }

        $company = $companyId
            ? $this->companyRepository->findById($companyId)
            : $this->companyRepository->getDefault();

        return array_merge($this->defaults(), $this->companyOverrides($company), $this->resolvePublicSettings($map));
    }

    /**
     * @param  array<string, mixed>  $map
     * @return array<string, mixed>
     */
    private function resolvePublicSettings(array $map): array
    {
        foreach (WebsiteImageSettings::IMAGE_KEYS as $key) {
            if (! empty($map[$key]) && is_string($map[$key])) {
                $map[$key] = WebsiteImageSettings::resolveUrl($map[$key]);
            } else {
                $map[$key] = null;
            }
        }

        return $map;
    }

    public function getCompany(): ?Company
    {
        return $this->companyRepository->getDefault();
    }

    /**
     * @return array<string, mixed>
     */
    public function getPublicWebsiteSettings(?Company $company = null): array
    {
        $company ??= $this->companyRepository->getDefault();
        $companyId = $company?->id;

        $settings = $this->getPublicSettings($companyId, null);

        $map = [];
        foreach ($settings as $setting) {
            $map[$setting->key] = $setting->casted_value;
        }

        return array_merge($this->defaults(), $this->companyOverrides($company), $this->resolvePublicSettings($map));
    }

    /**
     * @return array<string, mixed>
     */
    private function defaults(): array
    {
        return [
            'app_name' => 'Beauty Salon ERP',
            'timezone' => 'Asia/Dubai',
            'currency' => 'AED',
            'currency_symbol' => 'د.إ',
            'vat_rate' => 0,
            'vat_enabled' => false,
            'primary_color' => '#7A2E3E',
            'secondary_color' => '#C9A46C',
            'app_logo' => null,
            'app_favicon' => null,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function companyOverrides(?Company $company): array
    {
        if (! $company) {
            return [];
        }

        return [
            'company_name' => $company->name,
        ];
    }
}
