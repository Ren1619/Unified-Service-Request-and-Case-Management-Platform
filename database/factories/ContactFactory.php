<?php

namespace Database\Factories;

use App\Models\Contact;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Contact>
 */
class ContactFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'mobile_number' => fake()->optional()->phoneNumber(),
            'phone_number' => fake()->optional()->phoneNumber(),
            'email' => fake()->optional()->safeEmail(),
            'organization' => fake()->optional()->company(),
            'position' => fake()->optional()->jobTitle(),
            'notes' => fake()->optional()->sentence(),
            'is_active' => true,
        ];
    }
}
