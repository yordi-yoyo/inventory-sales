<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSaleRequest;
use App\Models\Product;
use App\Models\Sale;
use App\Models\StockMovement;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class SaleController extends Controller
{
    public function index()
    {
        return Sale::with('user')->latest()->paginate(15);
    }

    public function store(StoreSaleRequest $request)
    {
        $sale = DB::transaction(function () use ($request) {
            $sale = Sale::create([
                'user_id' => $request->user()->id,
                'sale_date' => $request->sale_date,
                'status' => 'completed',
                'total_amount' => 0,
            ]);

            $total = 0;

            foreach ($request->items as $item) {
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

            return $sale;
        });

        return response()->json($sale->load('items.product'), 201);
    }

    public function show(Sale $sale)
    {
        return $sale->load(['user', 'items.product']);
    }
}
