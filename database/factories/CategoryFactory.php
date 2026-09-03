<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class CategoryFactory extends Factory
{
    public function definition(): array
    {
        $names = [
            'Beverages',
            'Teff & Grains',
            'Spices',
            'Coffee',
            'Dairy Products',
            'Household Items',
            'Bakery',
        ];

        return [
            'name' => fake()->randomElement($names),
        ];
    }
}