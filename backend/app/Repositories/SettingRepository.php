<?php

namespace App\Repositories;

use App\Enums\SettingTypeEnum;
use App\Interfaces\SettingRepositoryInterface;
use App\Models\Setting;
use Illuminate\Support\Collection;

class SettingRepository implements SettingRepositoryInterface
{
    public function getByKey(string $key, ?int $companyId = null, ?int $branchId = null): ?Setting
    {
        return Setting::query()
            ->when($companyId, fn ($q) => $q->where('company_id', $companyId))
            ->when($branchId, fn ($q) => $q->where('branch_id', $branchId))
            ->where('key', $key)
            ->first();
    }

    public function getByGroup(string $group): Collection
    {
        return Setting::query()->where('group', $group)->get();
    }

    public function getPublicSettings(?int $companyId = null, ?int $branchId = null): Collection
    {
        if (! $companyId) {
            return Setting::query()->where('is_public', true)->get();
        }

        $companySettings = Setting::query()
            ->where('company_id', $companyId)
            ->whereNull('branch_id')
            ->where('is_public', true)
            ->get()
            ->keyBy('key');

        if ($branchId) {
            $branchSettings = Setting::query()
                ->where('company_id', $companyId)
                ->where('branch_id', $branchId)
                ->where('is_public', true)
                ->get();

            foreach ($branchSettings as $setting) {
                $companySettings->put($setting->key, $setting);
            }
        }

        return $companySettings->values();
    }

    public function set(string $key, mixed $value, string $group = 'general', ?int $companyId = null, ?int $branchId = null): Setting
    {
        $type = match (true) {
            is_bool($value) => SettingTypeEnum::Boolean->value,
            is_int($value) => SettingTypeEnum::Integer->value,
            is_array($value) => SettingTypeEnum::Json->value,
            default => SettingTypeEnum::String->value,
        };

        $storedValue = is_array($value) ? json_encode($value) : (string) $value;

        return Setting::query()->updateOrCreate(
            [
                'company_id' => $companyId,
                'branch_id' => $branchId,
                'key' => $key,
            ],
            [
                'group' => $group,
                'value' => $storedValue,
                'type' => $type,
            ]
        );
    }
}
