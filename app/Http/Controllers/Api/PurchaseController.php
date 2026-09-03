<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePurchaseRequest;
use App\Models\Product;
use App\Models\Purchase;
use App\Models\StockMovement;
use Illuminate\Support\Facades\DB;

class PurchaseController extends Controller
{
    public function index()
    {
        return Purchase::with(['supplier', 'user'])->latest()->paginate(15);
    }

    public function store(StorePurchaseRequest $request)
    {
        $purchase = DB::transaction(function () use ($request) {
            $purchase = Purchase::create([
                'supplier_id' => $request->supplier_id,
                'user_id' => $request->user()->id,
                'purchase_date' => $request->purchase_date,
                'status' => 'completed',
                'total_amount' => 0,
            ]);

            $total = 0;

            foreach ($request->items as $item) {
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

            return $purchase;
        });

        return response()->json($purchase->load('items.product'), 201);
    }

    public function show(Purchase $purchase)
    {
        return $purchase->load(['supplier', 'user', 'items.product']);
    }
}