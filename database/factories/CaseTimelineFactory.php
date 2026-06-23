<?php

namespace Database\Factories;

use App\Models\CaseTimeline;
use App\Models\ServiceCase;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CaseTimeline>
 */
class CaseTimelineFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'service_case_id' => ServiceCase::factory(),
            'event' => 'case_created',
            'description' => fake()->sentence(),
            'old_values' => null,
            'new_values' => [],
            'created_by' => User::factory(),
        ];
    }
}
