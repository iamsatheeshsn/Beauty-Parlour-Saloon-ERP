<?php

namespace App\Services;

use App\Enums\SettingTypeEnum;
use App\Exceptions\ApiException;
use App\Models\Setting;
use App\Repositories\SettingMasterRepository;
use App\Support\WebsiteImageSettings;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class SettingMasterService extends MasterDataService
{
    /** @var array<int, string> */
    private const BRANDING_FILE_RULES = ['required', 'file', 'mimes:jpeg,jpg,png,gif,webp,svg,ico', 'max:5120'];

    public function __construct(SettingMasterRepository $repository)
    {
        parent::__construct($repository);
    }

    protected function companyScoped(): bool
    {
        return true;
    }

    protected function buildFilters(Request $request): array
    {
        $filters = parent::buildFilters($request);

        if ($request->has('branch_id')) {
            $filters['branch_id'] = $request->input('branch_id');
        }

        return $filters;
    }

    public function storeRules(?int $companyId = null): array
    {
        return [
            'branch_id' => ['nullable', 'integer', 'exists:branches,id'],
            'group' => ['required', 'string', 'max:50'],
            'key' => [
                'required', 'string', 'max:100',
                Rule::unique('settings')->where(function ($q) use ($companyId) {
                    $q->where('company_id', $companyId)->where('branch_id', request('branch_id'));
                }),
            ],
            'value' => ['nullable', 'string'],
            'type' => ['required', Rule::enum(SettingTypeEnum::class)],
            'description' => ['nullable', 'string'],
            'is_public' => ['sometimes', 'boolean'],
        ];
    }

    public function updateRules(int $id, ?int $companyId = null): array
    {
        return [
            'branch_id' => ['nullable', 'integer', 'exists:branches,id'],
            'group' => ['sometimes', 'string', 'max:50'],
            'key' => ['sometimes', 'string', 'max:100'],
            'value' => ['nullable', 'string'],
            'type' => ['sometimes', Rule::enum(SettingTypeEnum::class)],
            'description' => ['nullable', 'string'],
            'is_public' => ['sometimes', 'boolean'],
        ];
    }

    public function uploadAppLogo(Request $request): Setting
    {
        return $this->uploadBrandingFile(
            $request,
            field: 'logo',
            key: 'app_logo',
            description: 'Application logo shown in the sidebar and login screen'
        );
    }

    public function deleteAppLogo(Request $request): Setting
    {
        return $this->deleteBrandingFile($request, 'app_logo');
    }

    public function uploadAppFavicon(Request $request): Setting
    {
        return $this->uploadBrandingFile(
            $request,
            field: 'favicon',
            key: 'app_favicon',
            description: 'Browser tab favicon (PNG, ICO, or SVG recommended)'
        );
    }

    public function deleteAppFavicon(Request $request): Setting
    {
        return $this->deleteBrandingFile($request, 'app_favicon');
    }

    public function uploadSalonInteriorImage(Request $request): Setting
    {
        return $this->uploadBrandingFile(
            $request,
            field: 'image',
            key: 'salon_interior_image',
            description: 'Salon interior image shown on the public website',
            group: 'website'
        );
    }

    public function deleteSalonInteriorImage(Request $request): Setting
    {
        return $this->deleteBrandingFile($request, 'salon_interior_image');
    }

    public function uploadPageBanner(Request $request, string $key): Setting
    {
        if (! WebsiteImageSettings::isPageBannerKey($key)) {
            throw new ApiException('Invalid page banner key', 422);
        }

        return $this->uploadBrandingFile(
            $request,
            field: 'image',
            key: $key,
            description: WebsiteImageSettings::PAGE_BANNER_DESCRIPTIONS[$key],
            group: 'website'
        );
    }

    public function deletePageBanner(Request $request, string $key): Setting
    {
        if (! WebsiteImageSettings::isPageBannerKey($key)) {
            throw new ApiException('Invalid page banner key', 422);
        }

        return $this->deleteBrandingFile($request, $key);
    }

    private function uploadBrandingFile(Request $request, string $field, string $key, string $description, string $group = 'general'): Setting
    {
        $request->validate([
            $field => self::BRANDING_FILE_RULES,
        ]);

        $companyId = $request->user()?->company_id;
        if (! $companyId) {
            throw new ApiException('Company not found', 422);
        }

        /** @var UploadedFile $file */
        $file = $request->file($field);

        $setting = Setting::query()->firstOrCreate(
            [
                'company_id' => $companyId,
                'branch_id' => null,
                'key' => $key,
            ],
            [
                'group' => $group,
                'value' => '',
                'type' => SettingTypeEnum::String,
                'description' => $description,
                'is_public' => true,
            ]
        );

        if ($setting->value) {
            Storage::disk('public')->delete($setting->value);
        }

        $path = $file->store("settings/{$key}/{$companyId}", 'public');
        $setting->update(['value' => $path]);

        return $setting->fresh();
    }

    private function deleteBrandingFile(Request $request, string $key): Setting
    {
        $companyId = $request->user()?->company_id;
        if (! $companyId) {
            throw new ApiException('Company not found', 422);
        }

        $setting = Setting::query()
            ->where('company_id', $companyId)
            ->whereNull('branch_id')
            ->where('key', $key)
            ->first();

        if (! $setting) {
            throw new ApiException('Setting not found', 404);
        }

        if ($setting->value) {
            Storage::disk('public')->delete($setting->value);
        }

        $setting->update(['value' => '']);

        return $setting->fresh();
    }
}
