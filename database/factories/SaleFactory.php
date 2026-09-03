<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class SaleFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory(),
            'sale_date' => fake()->dateTimeBetween('-2 months', 'now'),
            'status' => 'completed',
        ];
    }
}