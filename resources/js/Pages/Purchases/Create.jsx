import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import { formatCurrency } from '@/utils/currency';
import { Head, useForm } from '@inertiajs/react';
import { useMemo } from 'react';

export default function Create({ suppliers, products }) {
    const { data, setData, post, processing, errors } = useForm({
        supplier_id: '',
        purchase_date: new Date().toISOString().slice(0, 10),
        items: [{ product_id: '', quantity: 1, unit_cost: '' }],
    });

    function addRow() {
        setData('items', [...data.items, { product_id: '', quantity: 1, unit_cost: '' }]);
    }

    function removeRow(index) {
        setData('items', data.items.filter((_, i) => i !== index));
    }

    function updateRow(index, field, value) {
        const items = [...data.items];
        items[index][field] = value;

        // Auto-fill cost price when a product is selected
        if (field === 'product_id') {
            const product = products.find((p) => p.id === Number(value));
            if (product) items[index].unit_cost = product.cost_price;
        }

        setData('items', items);
    }

    const total = useMemo(() => {
        return data.items.reduce((sum, item) => {
            return sum + (Number(item.quantity) || 0) * (Number(item.unit_cost) || 0);
        }, 0);
    }, [data.items]);

    function submit(e) {
        e.preventDefault();
        post(route('purchases.store'));
    }

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">New Purchase</h2>}
        >
            <Head title="New Purchase" />

            <div className="py-8">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={submit} className="space-y-6">

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Supplier</label>
                                    <select
                                        value={data.supplier_id}
                                        onChange={(e) => setData('supplier_id', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    >
                                        <option value="">Select a supplier</option>
                                        {suppliers.map((s) => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>
                                    <InputError message={errors.supplier_id} className="mt-1" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Purchase Date</label>
                                    <input
                                        type="date"
                                        value={data.purchase_date}
                                        onChange={(e) => setData('purchase_date', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                    <InputError message={errors.purchase_date} className="mt-1" />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-medium text-gray-700">Items</label>
                                    <button type="button" onClick={addRow} className="text-sm text-blue-600">
                                        + Add item
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    {data.items.map((item, index) => (
                                        <div key={index} className="flex gap-2 items-start">
                                            <select
                                                value={item.product_id}
                                                onChange={(e) => updateRow(index, 'product_id', e.target.value)}
                                                className="flex-1 rounded-md border-gray-300 shadow-sm text-sm"
                                            >
                                                <option value="">Select product</option>
                                                {products.map((p) => (
                                                    <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                                                ))}
                                            </select>
                                            <input
                                                type="number" min="1"
                                                value={item.quantity}
                                                onChange={(e) => updateRow(index, 'quantity', e.target.value)}
                                                className="w-24 rounded-md border-gray-300 shadow-sm text-sm"
                                                placeholder="Qty"
                                            />
                                            <input
                                                type="number" step="0.01" min="0"
                                                value={item.unit_cost}
                                                onChange={(e) => updateRow(index, 'unit_cost', e.target.value)}
                                                className="w-28 rounded-md border-gray-300 shadow-sm text-sm"
                                                placeholder="Unit cost"
                                            />
                                            <div className="w-28 text-sm pt-2 text-gray-600">
                                                {formatCurrency((Number(item.quantity) || 0) * (Number(item.unit_cost) || 0))}
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
                                    ))}
                                </div>
                                <InputError message={errors.items} className="mt-2" />
                            </div>

                            <div className="flex justify-end text-lg font-semibold border-t pt-4">
                                Total: {formatCurrency(total)}
                            </div>

                            <div className="flex justify-end gap-3">
                                <a href={route('purchases.index')} className="px-4 py-2 text-gray-600">Cancel</a>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-gray-800 text-white rounded-md disabled:opacity-50"
                                >
                                    {processing ? 'Saving...' : 'Save Purchase'}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}