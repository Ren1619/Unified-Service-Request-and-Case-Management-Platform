<?php

namespace Database\Seeders;

use App\Enums\CasePriority;
use App\Models\SlaConfiguration;
use Illuminate\Database\Seeder;

class SlaConfigurationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (CasePriority::cases() as $priority) {
            SlaConfiguration::query()->updateOrCreate(
                ['priority' => $priority],
                [
                    'days' => $priority->defaultSlaDays(),
                    'is_active' => true,
                ],
            );
        }
    }
}
