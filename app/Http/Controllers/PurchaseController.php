<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Purchase;
use App\Models\StockMovement;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PurchaseController extends Controller
{
    public function index()
    {
        return Inertia::render('Purchases/Index', [
            'purchases' => Purchase::with(['supplier', 'user'])->latest()->paginate(10),
        ]);
    }

    public function create()
    {
        return Inertia::render('Purchases/Create', [
            'suppliers' => Supplier::orderBy('name')->get(['id', 'name']),
            'products' => Product::orderBy('name')->get(['id', 'name', 'sku', 'cost_price']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'purchase_date' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_cost' => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($validated, $request) {
            $purchase = Purchase::create([
                'supplier_id' => $validated['supplier_id'],
                'user_id' => $request->user()->id,
                'purchase_date' => $validated['purchase_date'],
                'status' => 'completed',
                'total_amount' => 0,
            ]);

            $total = 0;

            foreach ($validated['items'] as $item) {
                $product = Product::findOrFail($item['product_id']);

                $purchase->items()->create([
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'unit_cost' => $item['unit_cost'],
                ]);

                $product->increment('stock_quantity', $item['quantity']);

                StockMovement::create([
                    'product_id' => $product->id,
                    'type' => 'in',
                    'quantity' => $item['quantity'],
                    'reference_type' => Purchase::class,
                    'reference_id' => $purchase->id,
                ]);

                $total += $item['quantity'] * $item['unit_cost'];
            }

            $purchase->update(['total_amount' => $total]);
        });

        return redirect()->route('purchases.index')->with('success', 'Purchase recorded successfully.');
    }

    public function edit(Purchase $purchase)
    {
        return Inertia::render('Purchases/Edit', [
            'purchase' => $purchase->load('items'),
            'suppliers' => Supplier::orderBy('name')->get(['id', 'name']),
            'products' => Product::orderBy('name')->get(['id', 'name', 'sku', 'cost_price']),
        ]);
    }

    public function update(Request $request, Purchase $purchase)
    {
        $validated = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'purchase_date' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_cost' => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($validated, $purchase) {
            foreach ($purchase->items as $oldItem) {
                Product::lockForUpdate()->find($oldItem->product_id)
                    ?->decrement('stock_quantity', $oldItem->quantity);
            }

            StockMovement::where('reference_type', Purchase::class)
                ->where('reference_id', $purchase->id)
                ->delete();

            $purchase->items()->delete();

            $total = 0;

            foreach ($validated['items'] as $item) {
                $product = Product::lockForUpdate()->findOrFail($item['product_id']);

                $purchase->items()->create([
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'unit_cost' => $item['unit_cost'],
                ]);

                $product->increment('stock_quantity', $item['quantity']);

                StockMovement::create([
                    'product_id' => $product->id,
                    'type' => 'in',
                    'quantity' => $item['quantity'],
                    'reference_type' => Purchase::class,
                    'reference_id' => $purchase->id,
                ]);

                $total += $item['quantity'] * $item['unit_cost'];
            }

            $purchase->update([
                'supplier_id' => $validated['supplier_id'],
                'purchase_date' => $validated['purchase_date'],
                'total_amount' => $total,
            ]);
        });

        return redirect()->route('purchases.index')->with('success', 'Purchase updated.');
    }
}