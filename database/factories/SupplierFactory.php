<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class SupplierFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->randomElement([
                'Merkato Trading PLC', 'Addis Wholesale Suppliers',
                'Bole Import Export', 'Sheba General Trading',
                'Lucy Distributors', 'Kaldis Coffee Suppliers',
                'Habesha Merchandise PLC',
            ]),
            'phone' => fake()->numerify('+2519########'),
            'email' => fake()->companyEmail(),
        ];
    }
}