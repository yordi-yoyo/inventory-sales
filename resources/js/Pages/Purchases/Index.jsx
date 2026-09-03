import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { formatCurrency } from '@/utils/currency';
import { Head, Link } from '@inertiajs/react';

export default function Index({ purchases }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-ink dark:text-paper">Purchases</h2>
                    <Link href={route('purchases.create')} className="px-4 py-2 bg-ledger text-paper rounded-md text-sm">
                        + New Purchase
                    </Link>
                </div>
            }
        >
            <Head title="Purchases" />

            <div className="py-8">
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-ink/60 dark:border dark:border-white/10 shadow-sm sm:rounded-lg p-6">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-white/10">
                            <thead>
                                <tr className="text-left text-xs font-medium text-gray-500 dark:text-paper/50 uppercase">
                                    <th className="px-4 py-2">Date</th>
                                    <th className="px-4 py-2">Supplier</th>
                                    <th className="px-4 py-2">Recorded By</th>
                                    <th className="px-4 py-2">Total</th>
                                    <th className="px-4 py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-white/10">
                                {purchases.data.map((p) => (
                                    <tr key={p.id} className="text-sm text-ink dark:text-paper/90">
                                        <td className="px-4 py-2">{p.purchase_date}</td>
                                        <td className="px-4 py-2">{p.supplier?.name}</td>
                                        <td className="px-4 py-2">{p.user?.name}</td>
                                        <td className="px-4 py-2 font-mono">{formatCurrency(p.total_amount)}</td>
                                        <td className="px-4 py-2">
                                            <Link href={route('purchases.edit', p.id)} className="text-ledger dark:text-brass text-sm">
                                                Edit
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}