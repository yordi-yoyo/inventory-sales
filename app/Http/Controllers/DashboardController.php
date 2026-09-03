<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Purchase;
use App\Models\Sale;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $totalStockValue = Product::sum(DB::raw('stock_quantity * cost_price'));
        $totalProducts = Product::count();
        $lowStockProducts = Product::whereColumn('stock_quantity', '<=', 'reorder_level')
            ->orderBy('stock_quantity')
            ->get(['id', 'name', 'sku', 'stock_quantity', 'reorder_level']);

        $recentSales = Sale::with('user')->latest()->take(5)->get();
        $recentPurchases = Purchase::with(['supplier', 'user'])->latest()->take(5)->get();

        $salesChart = Sale::selectRaw('DATE(sale_date) as date, SUM(total_amount) as total')
            ->where('sale_date', '>=', now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => [
                'totalStockValue' => $totalStockValue,
                'totalProducts' => $totalProducts,
                'lowStockCount' => $lowStockProducts->count(),
                'totalSalesThisMonth' => Sale::whereMonth('sale_date', now()->month)->sum('total_amount'),
            ],
            'lowStockProducts' => $lowStockProducts,
            'recentSales' => $recentSales,
            'recentPurchases' => $recentPurchases,
            'salesChart' => $salesChart,
        ]);
    }
}