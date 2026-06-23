<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (UserRole::cases() as $role) {
            Role::query()->updateOrCreate(
                ['code' => $role->value],
                [
                    'name' => $role->label(),
                    'description' => "System role for {$role->label()} users.",
                    'is_system' => true,
                ],
            );
        }
    }
}
