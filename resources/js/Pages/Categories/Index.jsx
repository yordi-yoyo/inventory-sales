import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ categories, filters }) {
    const [editingId, setEditingId] = useState(null);
    const [search, setSearch] = useState(filters.search || '');

    const createForm = useForm({ name: '' });
    const editForm = useForm({ name: '' });

    function submitCreate(e) {
        e.preventDefault();
        createForm.post(route('categories.store'), {
            onSuccess: () => createForm.reset(),
        });
    }

    function startEdit(category) {
        setEditingId(category.id);
        editForm.setData('name', category.name);
    }

    function submitEdit(e, categoryId) {
        e.preventDefault();
        editForm.put(route('categories.update', categoryId), {
            onSuccess: () => setEditingId(null),
        });
    }

    function destroy(categoryId) {
        if (confirm('Delete this category?')) {
            router.delete(route('categories.destroy', categoryId));
        }
    }

    function handleSearch(e) {
        e.preventDefault();
        router.get(route('categories.index'), { search }, { preserveState: true, replace: true });
    }

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-ink dark:text-paper">Categories</h2>}
        >
            <Head title="Categories" />

            <div className="py-8">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8 space-y-6">

                    {/* Create form */}
                    <div className="bg-white dark:bg-ink/60 dark:border dark:border-white/10 rounded-lg shadow-sm p-5">
                        <form onSubmit={submitCreate} className="flex gap-2 items-start">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={createForm.data.name}
                                    onChange={(e) => createForm.setData('name', e.target.value)}
                                    placeholder="New category name"
                                    className="w-full rounded-md border-gray-300 dark:border-white/10 dark:bg-ink dark:text-paper shadow-sm"
                                />
                                <InputError message={createForm.errors.name} className="mt-1" />
                            </div>
                            <button
                                type="submit"
                                disabled={createForm.processing}
                                className="px-4 py-2 bg-ledger text-paper rounded-md text-sm disabled:opacity-50"
                            >
                                Add
                            </button>
                        </form>
                    </div>

                    {/* Search */}
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search categories..."
                            className="flex-1 rounded-md border-gray-300 dark:border-white/10 dark:bg-ink dark:text-paper shadow-sm"
                        />
                        <button type="submit" className="px-4 py-2 bg-ink/5 dark:bg-white/10 text-ink dark:text-paper rounded-md text-sm">
                            Search
                        </button>
                    </form>

                    {/* List */}
                    <div className="bg-white dark:bg-ink/60 dark:border dark:border-white/10 rounded-lg shadow-sm divide-y divide-gray-100 dark:divide-white/10">
                        {categories.data.map((category) => (
                            <div key={category.id} className="p-4 flex justify-between items-center">
                                {editingId === category.id ? (
                                    <form onSubmit={(e) => submitEdit(e, category.id)} className="flex gap-2 flex-1 items-start">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={editForm.data.name}
                                                onChange={(e) => editForm.setData('name', e.target.value)}
                                                className="w-full rounded-md border-gray-300 dark:border-white/10 dark:bg-ink dark:text-paper shadow-sm text-sm"
                                                autoFocus
                                            />
                                            <InputError message={editForm.errors.name} className="mt-1" />
                                        </div>
                                        <button type="submit" className="text-sm text-moss">Save</button>
                                        <button type="button" onClick={() => setEditingId(null)} className="text-sm text-ink/50 dark:text-paper/50">
                                            Cancel
                                        </button>
                                    </form>
                                ) : (
                                    <>
                                        <div>
                                            <span className="font-medium text-ink dark:text-paper">{category.name}</span>
                                            <span className="text-ink/40 dark:text-paper/40 text-sm ml-2">
                                                ({category.products_count} products)
                                            </span>
                                        </div>
                                        <div className="flex gap-3 text-sm">
                                            <button onClick={() => startEdit(category)} className="text-ledger dark:text-brass">Edit</button>
                                            <button onClick={() => destroy(category.id)} className="text-brick">Delete</button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                        {categories.data.length === 0 && (
                            <p className="p-4 text-sm text-ink/40 dark:text-paper/40">No categories found.</p>
                        )}
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}