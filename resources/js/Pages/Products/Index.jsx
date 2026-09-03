import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { formatCurrency } from '@/utils/currency';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ products, categories, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    function handleSearch(e) {
        e.preventDefault();
        router.get(route('products.index'), { search, category_id: filters.category_id }, {
            preserveState: true,
            replace: true,
        });
    }

    function handleCategoryChange(e) {
        router.get(route('products.index'), { search, category_id: e.target.value }, {
            preserveState: true,
            replace: true,
        });
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-ink dark:text-paper">Products</h2>
                    <Link href={route('products.create')} className="px-4 py-2 bg-ledger text-paper rounded-md text-sm">
                        + New Product
                    </Link>
                </div>
            }
        >
            <Head title="Products" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white dark:bg-ink/60 dark:border dark:border-white/10 shadow-sm sm:rounded-lg p-6">

                        <div className="flex flex-col sm:flex-row gap-3 mb-6">
                            <form onSubmit={handleSearch} className="flex gap-2 flex-1">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by name or SKU..."
                                    className="rounded-md border-gray-300 dark:border-white/10 dark:bg-ink dark:text-paper shadow-sm flex-1"
                                />
                                <button type="submit" className="px-4 py-2 bg-ledger text-paper rounded-md">
                                    Search
                                </button>
                            </form>

                            <select
                                value={filters.category_id || ''}
                                onChange={handleCategoryChange}
                                className="rounded-md border-gray-300 dark:border-white/10 dark:bg-ink dark:text-paper shadow-sm"
                            >
                                <option value="">All Categories</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <table className="min-w-full divide-y divide-gray-200 dark:divide-white/10">
                            <thead>
                                <tr className="text-left text-xs font-medium text-gray-500 dark:text-paper/50 uppercase">
                                    <th className="px-4 py-2">Name</th>
                                    <th className="px-4 py-2">SKU</th>
                                    <th className="px-4 py-2">Category</th>
                                    <th className="px-4 py-2">Cost</th>
                                    <th className="px-4 py-2">Sale Price</th>
                                    <th className="px-4 py-2">Stock</th>
                                    <th className="px-4 py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-white/10">
                                {products.data.map((product) => (
                                    <tr key={product.id} className="text-sm text-ink dark:text-paper/90">
                                        <td className="px-4 py-2 font-medium">{product.name}</td>
                                        <td className="px-4 py-2">
                                            <span className="font-mono text-xs border border-dashed border-ink/30 dark:border-paper/30 rounded px-1.5 py-0.5 text-ink/60 dark:text-paper/60">
                                                {product.sku}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2">{product.category?.name}</td>
                                        <td className="px-4 py-2 font-mono">{formatCurrency(product.cost_price)}</td>
                                        <td className="px-4 py-2 font-mono">{formatCurrency(product.sale_price)}</td>
                                        <td className="px-4 py-2">
                                            <span className={
                                                product.stock_quantity <= product.reorder_level
                                                    ? 'text-brick font-semibold'
                                                    : 'text-ink dark:text-paper/90'
                                            }>
                                                {product.stock_quantity}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2">
                                            <button
                                                onClick={() => {
                                                    if (confirm(`Delete "${product.name}"?`)) {
                                                        router.delete(route('products.destroy', product.id));
                                                    }
                                                }}
                                                className="text-brick text-sm"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="flex gap-2 mt-6">
                            {products.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url || '#'}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3 py-1 rounded text-sm ${
                                        link.active ? 'bg-ledger text-paper' : 'bg-ink/5 text-ink dark:bg-white/5 dark:text-paper/80'
                                    } ${!link.url ? 'opacity-40 pointer-events-none' : ''}`}
                                />
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}