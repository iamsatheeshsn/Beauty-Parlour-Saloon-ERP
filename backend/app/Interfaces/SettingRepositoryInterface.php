<?php

namespace App\Interfaces;

use App\Models\Setting;
use Illuminate\Support\Collection;

interface SettingRepositoryInterface
{
    public function getByKey(string $key, ?int $companyId = null, ?int $branchId = null): ?Setting;

    public function getByGroup(string $group): Collection;

    public function getPublicSettings(?int $companyId = null, ?int $branchId = null): Collection;

    public function set(string $key, mixed $value, string $group = 'general', ?int $companyId = null, ?int $branchId = null): Setting;
}
