<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        return Product::with('category')
            ->when($request->search, fn ($q, $search) =>
                $q->where('name', 'like', "%{$search}%")->orWhere('sku', 'like', "%{$search}%"))
            ->when($request->category_id, fn ($q, $id) => $q->where('category_id', $id))
            ->when($request->low_stock, fn ($q) => $q->whereColumn('stock_quantity', '<=', 'reorder_level'))
            ->latest()
            ->paginate(15);
    }

    public function store(StoreProductRequest $request)
    {
        return response()->json(Product::create($request->validated()), 201);
    }

    public function show(Product $product)
    {
        return $product->load('category');
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        $this->authorize('update', $product);

        $product->update($request->validated());
        return response()->json($product);
    }

    public function destroy(Product $product)
    {
        $this->authorize('delete', $product);

        $product->delete();
        return response()->json(null, 204);
    }
}