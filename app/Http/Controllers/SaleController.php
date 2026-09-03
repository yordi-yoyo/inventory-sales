<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Sale;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class SaleController extends Controller
{
    public function index()
    {
        return Inertia::render('Sales/Index', [
            'sales' => Sale::with('user')->latest()->paginate(10),
        ]);
    }

    public function create()
    {
        return Inertia::render('Sales/Create', [
            'products' => Product::orderBy('name')->get(['id', 'name', 'sku', 'sale_price', 'stock_quantity']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'sale_date' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        DB::transaction(function () use ($validated, $request) {
            $sale = Sale::create([
                'user_id' => $request->user()->id,
                'sale_date' => $validated['sale_date'],
                'status' => 'completed',
                'total_amount' => 0,
            ]);

            $total = 0;

            foreach ($validated['items'] as $item) {
                $product = Product::lockForUpdate()->findOrFail($item['product_id']);

                if ($product->stock_quantity < $item['quantity']) {
                    throw ValidationException::withMessages([
                        'items' => "Not enough stock for {$product->name}. Available: {$product->stock_quantity}.",
                    ]);
                }

                $sale->items()->create([
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $product->sale_price,
                ]);

                $product->decrement('stock_quantity', $item['quantity']);

                StockMovement::create([
                    'product_id' => $product->id,
                    'type' => 'out',
                    'quantity' => $item['quantity'],
                    'reference_type' => Sale::class,
                    'reference_id' => $sale->id,
                ]);

                $total += $item['quantity'] * $product->sale_price;
            }

            $sale->update(['total_amount' => $total]);
        });

        return redirect()->route('sales.index')->with('success', 'Sale recorded successfully.');
    }

    public function edit(Sale $sale)
    {
        return Inertia::render('Sales/Edit', [
            'sale' => $sale->load('items'),
            'products' => Product::orderBy('name')->get(['id', 'name', 'sku', 'sale_price', 'stock_quantity']),
        ]);
    }

    public function update(Request $request, Sale $sale)
    {
        $validated = $request->validate([
            'sale_date' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        DB::transaction(function () use ($validated, $sale) {
            foreach ($sale->items as $oldItem) {
                Product::lockForUpdate()->find($oldItem->product_id)
                    ?->increment('stock_quantity', $oldItem->quantity);
            }

            StockMovement::where('reference_type', Sale::class)
                ->where('reference_id', $sale->id)
                ->delete();

            $sale->items()->delete();

            $total = 0;

            foreach ($validated['items'] as $item) {
                $product = Product::lockForUpdate()->findOrFail($item['product_id']);

                if ($product->stock_quantity < $item['quantity']) {
                    throw ValidationException::withMessages([
                        'items' => "Not enough stock for {$product->name}. Available: {$product->stock_quantity}.",
                    ]);
                }

                $sale->items()->create([
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $product->sale_price,
                ]);

                $product->decrement('stock_quantity', $item['quantity']);

                StockMovement::create([
                    'product_id' => $product->id,
                    'type' => 'out',
                    'quantity' => $item['quantity'],
                    'reference_type' => Sale::class,
                    'reference_id' => $sale->id,
                ]);

                $total += $item['quantity'] * $product->sale_price;
            }

            $sale->update([
                'sale_date' => $validated['sale_date'],
                'total_amount' => $total,
            ]);
        });

        return redirect()->route('sales.index')->with('success', 'Sale updated.');
    }
}