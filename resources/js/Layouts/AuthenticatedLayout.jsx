import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import ThemeToggle from '@/Components/ThemeToggle';
import { Link, usePage } from '@inertiajs/react';

import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingNavDropdown, setShowingNavDropdown] = useState(false);

    return (
        <div className="min-h-screen bg-paper font-sans text-ink dark:bg-ink dark:text-paper">
            <nav className="border-b border-ink/10 bg-white dark:border-white/10 dark:bg-ink">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center gap-2">
                                <Link href="/" className="flex items-center gap-2">
                    
                                </Link>
                            </div>

                            <div className="hidden space-x-1 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                                    Dashboard
                                </NavLink>
                                <NavLink href={route('products.index')} active={route().current('products.index')}>
                                    Products
                                </NavLink>
                                <NavLink href={route('categories.index')} active={route().current('categories.*')}>
                                    Categories
                                </NavLink>
                                <NavLink href={route('suppliers.index')} active={route().current('suppliers.*')}>
                                    Suppliers
                                </NavLink>
                                <NavLink href={route('purchases.index')} active={route().current('purchases.*')}>
                                    Purchases
                                </NavLink>
                                <NavLink href={route('sales.index')} active={route().current('sales.*')}>
                                    Sales
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center gap-1">
                            <ThemeToggle />
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center gap-2 rounded-md border border-transparent px-3 py-2 text-sm font-medium text-ink/70 transition hover:text-ink dark:text-paper/70 dark:hover:text-paper"
                                            >
                                                {user.name}
                                                <span className={`rounded-full px-2 py-0.5 text-xs font-mono ${
                                                    user.role === 'admin'
                                                        ? 'bg-brass/20 text-brass'
                                                        : 'bg-ink/10 text-ink/60 dark:bg-white/10 dark:text-paper/60'
                                                }`}>
                                                    {user.role}
                                                </span>
                                                <svg className="-me-0.5 ms-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center gap-1 sm:hidden">
                            <ThemeToggle />
                            <button
                                onClick={() => setShowingNavDropdown((prev) => !prev)}
                                className="inline-flex items-center justify-center rounded-md p-2 text-ink/50 transition hover:bg-ink/5 hover:text-ink/70 dark:text-paper/50 dark:hover:bg-white/5 dark:hover:text-paper/70"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={(showingNavDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>Dashboard</ResponsiveNavLink>
                        <ResponsiveNavLink href={route('products.index')} active={route().current('products.index')}>Products</ResponsiveNavLink>
                        <ResponsiveNavLink href={route('categories.index')} active={route().current('categories.*')}>Categories</ResponsiveNavLink>
                        <ResponsiveNavLink href={route('suppliers.index')} active={route().current('suppliers.*')}>Suppliers</ResponsiveNavLink>
                        <ResponsiveNavLink href={route('purchases.index')} active={route().current('purchases.*')}>Purchases</ResponsiveNavLink>
                        <ResponsiveNavLink href={route('sales.index')} active={route().current('sales.*')}>Sales</ResponsiveNavLink>
                    </div>

                    <div className="border-t border-ink/10 pb-1 pt-4 dark:border-white/10">
                        <div className="px-4">
                            <div className="text-base font-medium text-ink dark:text-paper">{user.name}</div>
                            <div className="text-sm font-medium text-ink/50 dark:text-paper/50">{user.email}</div>
                        </div>
                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>Profile</ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route('logout')} as="button">Log Out</ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white border-b border-ink/10 dark:bg-ink dark:border-white/10">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}