<?php

namespace Database\Factories;

use App\Enums\CaseChannel;
use App\Enums\CasePriority;
use App\Enums\CaseStatus;
use App\Models\ComplaintType;
use App\Models\Region;
use App\Models\ServiceCase;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ServiceCase>
 */
class ServiceCaseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'case_number' => fake()->unique()->numerify('2026-NCR-######'),
            'title' => fake()->sentence(4),
            'description' => fake()->paragraph(),
            'complaint_type_id' => ComplaintType::factory(),
            'channel' => CaseChannel::SelfService,
            'priority' => CasePriority::Medium,
            'status' => CaseStatus::New,
            'region_id' => Region::factory(),
            'submitted_by' => User::factory(),
            'assigned_to' => null,
            'created_by_agent' => null,
            'escalation_level' => 0,
            'due_date' => now()->addDays(CasePriority::Medium->defaultSlaDays()),
            'closed_at' => null,
            'resolution_notes' => null,
        ];
    }
}
