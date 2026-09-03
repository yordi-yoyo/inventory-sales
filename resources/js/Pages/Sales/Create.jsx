import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import { formatCurrency } from '@/utils/currency';
import { Head, useForm } from '@inertiajs/react';
import { useMemo } from 'react';

export default function Create({ products }) {
    const { data, setData, post, processing, errors } = useForm({
        sale_date: new Date().toISOString().slice(0, 10),
        items: [{ product_id: '', quantity: 1 }],
    });

    function addRow() {
        setData('items', [...data.items, { product_id: '', quantity: 1 }]);
    }

    function removeRow(index) {
        setData('items', data.items.filter((_, i) => i !== index));
    }

    function updateRow(index, field, value) {
        const items = [...data.items];
        items[index][field] = value;
        setData('items', items);
    }

    function productFor(id) {
        return products.find((p) => p.id === Number(id));
    }

    const total = useMemo(() => {
        return data.items.reduce((sum, item) => {
            const product = productFor(item.product_id);
            const price = product ? Number(product.sale_price) : 0;
            return sum + (Number(item.quantity) || 0) * price;
        }, 0);
    }, [data.items, products]);

    function submit(e) {
        e.preventDefault();
        post(route('sales.store'));
    }

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">New Sale</h2>}
        >
            <Head title="New Sale" />

            <div className="py-8">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={submit} className="space-y-6">

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Sale Date</label>
                                <input
                                    type="date"
                                    value={data.sale_date}
                                    onChange={(e) => setData('sale_date', e.target.value)}
                                    className="mt-1 block w-64 rounded-md border-gray-300 shadow-sm"
                                />
                                <InputError message={errors.sale_date} className="mt-1" />
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-medium text-gray-700">Items</label>
                                    <button type="button" onClick={addRow} className="text-sm text-blue-600">
                                        + Add item
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    {data.items.map((item, index) => {
                                        const product = productFor(item.product_id);
                                        const overStock = product && Number(item.quantity) > product.stock_quantity;

                                        return (
                                            <div key={index}>
                                                <div className="flex gap-2 items-start">
                                                    <select
                                                        value={item.product_id}
                                                        onChange={(e) => updateRow(index, 'product_id', e.target.value)}
                                                        className="flex-1 rounded-md border-gray-300 shadow-sm text-sm"
                                                    >
                                                        <option value="">Select product</option>
                                                        {products.map((p) => (
                                                            <option key={p.id} value={p.id}>
                                                                {p.name} ({p.sku}) — {p.stock_quantity} in stock
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <input
                                                        type="number" min="1"
                                                        value={item.quantity}
                                                        onChange={(e) => updateRow(index, 'quantity', e.target.value)}
                                                        className={`w-24 rounded-md shadow-sm text-sm ${
                                                            overStock ? 'border-red-400' : 'border-gray-300'
                                                        }`}
                                                        placeholder="Qty"
                                                    />
                                                    <div className="w-28 text-sm pt-2 text-gray-600">
                                                        {product ? formatCurrency(product.sale_price * (Number(item.quantity) || 0)) : '—'}
                                                    </div>
                                                    {data.items.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeRow(index)}
                                                            className="text-red-500 text-sm pt-2"
                                                        >
                                                            Remove
                                                        </button>
                                                    )}
                                                </div>
                                                {overStock && (
                                                    <p className="text-xs text-red-600 mt-1">
                                                        Only {product.stock_quantity} in stock — this will be rejected.
                                                    </p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                                <InputError message={errors.items} className="mt-2" />
                            </div>

                            <div className="flex justify-end text-lg font-semibold border-t pt-4">
                                Total: {formatCurrency(total)}
                            </div>

                            <div className="flex justify-end gap-3">
                                <a href={route('sales.index')} className="px-4 py-2 text-gray-600">Cancel</a>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-gray-800 text-white rounded-md disabled:opacity-50"
                                >
                                    {processing ? 'Saving...' : 'Save Sale'}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}