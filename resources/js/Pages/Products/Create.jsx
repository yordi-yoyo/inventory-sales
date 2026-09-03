import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import { Head, useForm } from '@inertiajs/react';

export default function Create({ categories }) {
    const { data, setData, post, processing, errors } = useForm({
        category_id: '',
        name: '',
        sku: '',
        cost_price: '',
        sale_price: '',
        stock_quantity: 0,
        reorder_level: 5,
    });

    function submit(e) {
        e.preventDefault();
        post(route('products.store'));
    }

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">New Product</h2>}
        >
            <Head title="New Product" />

            <div className="py-8">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={submit} className="space-y-4">

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                <select
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                <InputError message={errors.category_id} className="mt-1" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                />
                                <InputError message={errors.name} className="mt-1" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">SKU</label>
                                <input
                                    type="text"
                                    value={data.sku}
                                    onChange={(e) => setData('sku', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                />
                                <InputError message={errors.sku} className="mt-1" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Cost Price (Br)</label>
                                    <input
                                        type="number" step="0.01"
                                        value={data.cost_price}
                                        onChange={(e) => setData('cost_price', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                    <InputError message={errors.cost_price} className="mt-1" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Sale Price (Br)</label>
                                    <input
                                        type="number" step="0.01"
                                        value={data.sale_price}
                                        onChange={(e) => setData('sale_price', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                    <InputError message={errors.sale_price} className="mt-1" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Initial Stock</label>
                                    <input
                                        type="number"
                                        value={data.stock_quantity}
                                        onChange={(e) => setData('stock_quantity', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                    <InputError message={errors.stock_quantity} className="mt-1" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Reorder Level</label>
                                    <input
                                        type="number"
                                        value={data.reorder_level}
                                        onChange={(e) => setData('reorder_level', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                    <InputError message={errors.reorder_level} className="mt-1" />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <a href={route('products.index')} className="px-4 py-2 text-gray-600">Cancel</a>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-gray-800 text-white rounded-md disabled:opacity-50"
                                >
                                    {processing ? 'Saving...' : 'Save Product'}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}