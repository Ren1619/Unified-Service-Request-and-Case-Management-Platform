<?php

namespace Database\Factories;

use App\Enums\CasePriority;
use App\Models\SlaConfiguration;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SlaConfiguration>
 */
class SlaConfigurationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'priority' => CasePriority::Medium,
            'days' => CasePriority::Medium->defaultSlaDays(),
            'is_active' => true,
        ];
    }
}
