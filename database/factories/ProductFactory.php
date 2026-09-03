<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    public function definition(): array
    {
        $cost = fake()->randomFloat(2, 5, 200);

        $names = [
            'Ethiopian Coffee Beans 1kg',
            'Teff Flour 5kg',
            'Berbere Spice Mix',
            'Shiro Powder',
            'Mitmita Spice',
            'Injera Pack (10pcs)',
            'Honey Wine (Tej) 750ml',
            'Niger Seed Oil 1L',
            'Chickpea Flour 2kg',
            'Roasted Barley (Kolo) 500g',
            'Dabo Bread',
            'Ayib (Cottage Cheese) 250g',
            'Kitfo Spice Mix',
            'Awaze Sauce',
            'Ethiopian Butter (Kibe) 500g',
            'Green Coffee Beans 1kg',
            'Sugarcane 1 Bundle',
            'Sesame Seeds 1kg',
            'Lentils (Misir) 1kg',
            'Split Peas (Kik) 1kg',
        ];

        return [
            'category_id' => \App\Models\Category::factory(),
            'name' => fake()->randomElement($names),
            'sku' => strtoupper(fake()->unique()->bothify('???-####')),
            'cost_price' => $cost,
            'sale_price' => round($cost * fake()->randomFloat(2, 1.2, 1.8), 2),
            'stock_quantity' => fake()->numberBetween(0, 200),
            'reorder_level' => fake()->numberBetween(5, 20),
        ];
    }
}