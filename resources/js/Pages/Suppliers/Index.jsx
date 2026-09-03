import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ suppliers, filters }) {
    const [editingId, setEditingId] = useState(null);
    const [search, setSearch] = useState(filters.search || '');

    const createForm = useForm({ name: '', phone: '', email: '' });
    const editForm = useForm({ name: '', phone: '', email: '' });

    function submitCreate(e) {
        e.preventDefault();
        createForm.post(route('suppliers.store'), {
            onSuccess: () => createForm.reset(),
        });
    }

    function startEdit(supplier) {
        setEditingId(supplier.id);
        editForm.setData({
            name: supplier.name,
            phone: supplier.phone || '',
            email: supplier.email || '',
        });
    }

    function submitEdit(e, supplierId) {
        e.preventDefault();
        editForm.put(route('suppliers.update', supplierId), {
            onSuccess: () => setEditingId(null),
        });
    }

    function destroy(supplierId) {
        if (confirm('Delete this supplier?')) {
            router.delete(route('suppliers.destroy', supplierId));
        }
    }

    function handleSearch(e) {
        e.preventDefault();
        router.get(route('suppliers.index'), { search }, { preserveState: true, replace: true });
    }

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-ink dark:text-paper">Suppliers</h2>}
        >
            <Head title="Suppliers" />

            <div className="py-8">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8 space-y-6">

                    {/* Create form */}
                    <div className="bg-white dark:bg-ink/60 dark:border dark:border-white/10 rounded-lg shadow-sm p-5">
                        <form onSubmit={submitCreate} className="grid grid-cols-3 gap-3 items-start">
                            <div>
                                <input
                                    type="text"
                                    value={createForm.data.name}
                                    onChange={(e) => createForm.setData('name', e.target.value)}
                                    placeholder="Supplier name"
                                    className="w-full rounded-md border-gray-300 dark:border-white/10 dark:bg-ink dark:text-paper shadow-sm text-sm"
                                />
                                <InputError message={createForm.errors.name} className="mt-1" />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    value={createForm.data.phone}
                                    onChange={(e) => createForm.setData('phone', e.target.value)}
                                    placeholder="Phone (optional)"
                                    className="w-full rounded-md border-gray-300 dark:border-white/10 dark:bg-ink dark:text-paper shadow-sm text-sm"
                                />
                                <InputError message={createForm.errors.phone} className="mt-1" />
                            </div>
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={createForm.data.email}
                                        onChange={(e) => createForm.setData('email', e.target.value)}
                                        placeholder="Email (optional)"
                                        className="w-full rounded-md border-gray-300 dark:border-white/10 dark:bg-ink dark:text-paper shadow-sm text-sm"
                                    />
                                    <InputError message={createForm.errors.email} className="mt-1" />
                                </div>
                                <button
                                    type="submit"
                                    disabled={createForm.processing}
                                    className="px-4 py-2 bg-ledger text-paper rounded-md text-sm disabled:opacity-50"
                                >
                                    Add
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Search */}
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search suppliers..."
                            className="flex-1 rounded-md border-gray-300 dark:border-white/10 dark:bg-ink dark:text-paper shadow-sm"
                        />
                        <button type="submit" className="px-4 py-2 bg-ink/5 dark:bg-white/10 text-ink dark:text-paper rounded-md text-sm">
                            Search
                        </button>
                    </form>

                    {/* List */}
                    <div className="bg-white dark:bg-ink/60 dark:border dark:border-white/10 rounded-lg shadow-sm divide-y divide-gray-100 dark:divide-white/10">
                        {suppliers.data.map((supplier) => (
                            <div key={supplier.id} className="p-4">
                                {editingId === supplier.id ? (
                                    <form onSubmit={(e) => submitEdit(e, supplier.id)} className="grid grid-cols-3 gap-3 items-start">
                                        <div>
                                            <input
                                                type="text"
                                                value={editForm.data.name}
                                                onChange={(e) => editForm.setData('name', e.target.value)}
                                                className="w-full rounded-md border-gray-300 dark:border-white/10 dark:bg-ink dark:text-paper shadow-sm text-sm"
                                                autoFocus
                                            />
                                            <InputError message={editForm.errors.name} className="mt-1" />
                                        </div>
                                        <div>
                                            <input
                                                type="text"
                                                value={editForm.data.phone}
                                                onChange={(e) => editForm.setData('phone', e.target.value)}
                                                className="w-full rounded-md border-gray-300 dark:border-white/10 dark:bg-ink dark:text-paper shadow-sm text-sm"
                                            />
                                            <InputError message={editForm.errors.phone} className="mt-1" />
                                        </div>
                                        <div className="flex gap-2 items-start">
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    value={editForm.data.email}
                                                    onChange={(e) => editForm.setData('email', e.target.value)}
                                                    className="w-full rounded-md border-gray-300 dark:border-white/10 dark:bg-ink dark:text-paper shadow-sm text-sm"
                                                />
                                                <InputError message={editForm.errors.email} className="mt-1" />
                                            </div>
                                            <button type="submit" className="text-sm text-moss pt-2">Save</button>
                                            <button type="button" onClick={() => setEditingId(null)} className="text-sm text-ink/50 dark:text-paper/50 pt-2">
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <span className="font-medium text-ink dark:text-paper">{supplier.name}</span>
                                            <span className="text-ink/40 dark:text-paper/40 text-sm ml-3">{supplier.phone}</span>
                                            <span className="text-ink/40 dark:text-paper/40 text-sm ml-3">{supplier.email}</span>
                                            <span className="text-ink/40 dark:text-paper/40 text-sm ml-3">
                                                ({supplier.purchases_count} purchases)
                                            </span>
                                        </div>
                                        <div className="flex gap-3 text-sm">
                                            <button onClick={() => startEdit(supplier)} className="text-ledger dark:text-brass">Edit</button>
                                            <button onClick={() => destroy(supplier.id)} className="text-brick">Delete</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        {suppliers.data.length === 0 && (
                            <p className="p-4 text-sm text-ink/40 dark:text-paper/40">No suppliers found.</p>
                        )}
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}