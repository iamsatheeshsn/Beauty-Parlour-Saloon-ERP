<?php

namespace Database\Seeders;

use App\Enums\RoleEnum;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RolesSeeder extends Seeder
{
    public function run(): void
    {
        foreach (RoleEnum::cases() as $role) {
            Role::query()->firstOrCreate(
                ['name' => $role->value, 'guard_name' => 'web'],
                ['name' => $role->value, 'guard_name' => 'web']
            );
        }
    }
}
