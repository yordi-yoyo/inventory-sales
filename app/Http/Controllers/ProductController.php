<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $products = Product::with('category')
            ->when($request->search, fn ($q, $search) =>
                $q->where('name', 'like', "%{$search}%")->orWhere('sku', 'like', "%{$search}%"))
            ->when($request->category_id, fn ($q, $id) => $q->where('category_id', $id))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Products/Index', [
            'products' => $products,
            'categories' => Category::orderBy('name')->get(['id', 'name']),
            'filters' => $request->only(['search', 'category_id']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Products/Create', [
            'categories' => Category::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(\App\Http\Requests\StoreProductRequest $request)
    {
        Product::create($request->validated());

        return redirect()->route('products.index')->with('success', 'Product created successfully.');
    }

    public function destroy(Product $product)
    {
        $this->authorize('delete', $product);

        if ($product->purchaseItems()->exists() || $product->saleItems()->exists()) {
            return back()->with('error', 'Cannot delete a product with existing purchase or sale history.');
        }

        $product->delete();

        return redirect()->route('products.index')->with('success', 'Product deleted.');
    }
}