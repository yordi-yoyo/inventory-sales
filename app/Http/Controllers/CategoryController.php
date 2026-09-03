<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('Categories/Index', [
            'categories' => Category::withCount('products')
                ->when($request->search, fn ($q, $search) => $q->where('name', 'like', "%{$search}%"))
                ->latest()
                ->paginate(10)
                ->withQueryString(),
            'filters' => $request->only('search'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
        ]);

        Category::create($validated);

        return redirect()->route('categories.index')->with('success', 'Category created.');
    }

    public function update(Request $request, Category $category)
    {
        $this->authorize('update', $category);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id,
        ]);

        $category->update($validated);

        return redirect()->route('categories.index')->with('success', 'Category updated.');
    }

    public function destroy(Category $category)
    {
        $this->authorize('delete', $category);

        if ($category->products()->exists()) {
            return back()->with('error', 'Cannot delete a category that still has products.');
        }

        $category->delete();

        return redirect()->route('categories.index')->with('success', 'Category deleted.');
    }
}