<?php

namespace Database\Seeders;

use App\Models\Region;
use Illuminate\Database\Seeder;

class RegionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $regions = [
            ['code' => 'NCR', 'name' => 'National Capital Region'],
            ['code' => 'CAR', 'name' => 'Cordillera Administrative Region'],
            ['code' => 'R1', 'name' => 'Ilocos Region'],
            ['code' => 'R2', 'name' => 'Cagayan Valley'],
            ['code' => 'R3', 'name' => 'Central Luzon'],
            ['code' => 'R4A', 'name' => 'CALABARZON'],
            ['code' => 'R4B', 'name' => 'MIMAROPA'],
            ['code' => 'R5', 'name' => 'Bicol Region'],
            ['code' => 'R6', 'name' => 'Western Visayas'],
            ['code' => 'R7', 'name' => 'Central Visayas'],
            ['code' => 'R8', 'name' => 'Eastern Visayas'],
            ['code' => 'R9', 'name' => 'Zamboanga Peninsula'],
            ['code' => 'R10', 'name' => 'Northern Mindanao'],
            ['code' => 'R11', 'name' => 'Davao Region'],
            ['code' => 'R12', 'name' => 'SOCCSKSARGEN'],
            ['code' => 'R13', 'name' => 'Caraga'],
            ['code' => 'BARMM', 'name' => 'Bangsamoro Autonomous Region in Muslim Mindanao'],
        ];

        foreach ($regions as $region) {
            Region::query()->updateOrCreate(
                ['code' => $region['code']],
                [
                    'name' => $region['name'],
                    'description' => "{$region['name']} service office.",
                    'is_active' => true,
                ],
            );
        }
    }
}
