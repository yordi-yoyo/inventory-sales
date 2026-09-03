<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class PurchaseFactory extends Factory
{
    public function definition(): array
    {
        return [
            'supplier_id' => \App\Models\Supplier::factory(),
            'user_id' => \App\Models\User::factory(),
            'purchase_date' => fake()->dateTimeBetween('-2 months', 'now'),
            'status' => 'completed',
        ];
    }
}