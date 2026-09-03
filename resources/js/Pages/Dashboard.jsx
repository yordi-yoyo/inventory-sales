import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { formatCurrency } from '@/utils/currency';
import { Head, Link } from '@inertiajs/react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function Dashboard({ stats, lowStockProducts, recentSales, recentPurchases, salesChart }) {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-ink dark:text-paper">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">

                    {/* Stat cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-ink/60 dark:border dark:border-white/10 rounded-lg shadow-sm p-5">
                            <p className="text-sm text-ink/50 dark:text-paper/50">Total Inventory Value</p>
                            <p className="text-2xl font-semibold mt-1 text-ink dark:text-paper font-mono">{formatCurrency(stats.totalStockValue)}</p>
                        </div>
                        <div className="bg-white dark:bg-ink/60 dark:border dark:border-white/10 rounded-lg shadow-sm p-5">
                            <p className="text-sm text-ink/50 dark:text-paper/50">Total Products</p>
                            <p className="text-2xl font-semibold mt-1 text-ink dark:text-paper font-mono">{stats.totalProducts}</p>
                        </div>
                        <div className="bg-white dark:bg-ink/60 dark:border dark:border-white/10 rounded-lg shadow-sm p-5">
                            <p className="text-sm text-ink/50 dark:text-paper/50">Low Stock Alerts</p>
                            <p className={`text-2xl font-semibold mt-1 font-mono ${stats.lowStockCount > 0 ? 'text-brick' : 'text-ink dark:text-paper'}`}>
                                {stats.lowStockCount}
                            </p>
                        </div>
                    </div>

                    {/* Sales chart */}
                    <div className="bg-white dark:bg-ink/60 dark:border dark:border-white/10 rounded-lg shadow-sm p-5">
                        <p className="text-sm font-medium text-ink/70 dark:text-paper/70 mb-4">Sales — Last 7 Days</p>
                        <div className="text-ink dark:text-paper/70">
                            <ResponsiveContainer width="100%" height={220}>
                                <LineChart data={salesChart}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                                    <XAxis dataKey="sale_date" tick={{ fontSize: 12, fill: 'currentColor' }} stroke="currentColor" />
                                    <YAxis tick={{ fontSize: 12, fill: 'currentColor' }} stroke="currentColor" />
                                    <Tooltip formatter={(value) => formatCurrency(value)} />
                                    <Line type="monotone" dataKey="total" stroke="#B98A2E" strokeWidth={2} dot={{ r: 3 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* Low stock table */}
                        <div className="bg-white dark:bg-ink/60 dark:border dark:border-white/10 rounded-lg shadow-sm p-5">
                            <p className="text-sm font-medium text-ink/70 dark:text-paper/70 mb-3">Low Stock Products</p>
                            {lowStockProducts.length === 0 ? (
                                <p className="text-sm text-ink/40 dark:text-paper/40">All products are sufficiently stocked.</p>
                            ) : (
                                <table className="min-w-full text-sm">
                                    <tbody className="divide-y divide-gray-100 dark:divide-white/10">
                                        {lowStockProducts.map((p) => (
                                            <tr key={p.id}>
                                                <td className="py-2 text-ink dark:text-paper">{p.name}</td>
                                                <td className="py-2 text-ink/40 dark:text-paper/40">{p.sku}</td>
                                                <td className="py-2 text-right text-brick font-semibold font-mono">
                                                    {p.stock_quantity} / {p.reorder_level}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* Recent activity */}
                        <div className="bg-white dark:bg-ink/60 dark:border dark:border-white/10 rounded-lg shadow-sm p-5">
                            <p className="text-sm font-medium text-ink/70 dark:text-paper/70 mb-3">Recent Activity</p>
                            <div className="space-y-2 text-sm">
                                {recentSales.map((s) => (
                                    <div key={`sale-${s.id}`} className="flex justify-between text-ink dark:text-paper">
                                        <span className="text-ink/60 dark:text-paper/60">Sale by {s.user?.name} — {s.sale_date}</span>
                                        <span className="font-medium font-mono">{formatCurrency(s.total_amount)}</span>
                                    </div>
                                ))}
                                {recentPurchases.map((p) => (
                                    <div key={`purchase-${p.id}`} className="flex justify-between text-ink dark:text-paper">
                                        <span className="text-ink/60 dark:text-paper/60">Purchase from {p.supplier?.name}</span>
                                        <span className="font-medium font-mono">{formatCurrency(p.total_amount)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}