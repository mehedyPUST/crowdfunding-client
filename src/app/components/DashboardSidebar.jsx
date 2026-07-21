'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import {
    Home, Search, Heart, CreditCard, History,
    PlusCircle, FileText, Wallet, Users,
    Flag, ClipboardList, ArrowLeftRight, X
} from 'lucide-react';

const menuItems = {
    supporter: [
        { href: '/dashboard', icon: Home, label: 'Home' },
        { href: '/dashboard/supporter/explore', icon: Search, label: 'Explore Campaigns' },
        { href: '/dashboard/supporter/my-contributions', icon: Heart, label: 'My Contributions' },
        { href: '/dashboard/supporter/purchase-credit', icon: CreditCard, label: 'Purchase Credit' },
        { href: '/dashboard/supporter/payment-history', icon: History, label: 'Payment History' },
    ],
    creator: [
        { href: '/dashboard', icon: Home, label: 'Home' },
        { href: '/dashboard/creator/add-campaign', icon: PlusCircle, label: 'Add New Campaign' },
        { href: '/dashboard/creator/my-campaigns', icon: FileText, label: 'My Campaigns' },
        { href: '/dashboard/creator/withdrawals', icon: Wallet, label: 'Withdrawals' },
        { href: '/dashboard/creator/payment-history', icon: History, label: 'Payment History' },
    ],
    admin: [
        { href: '/dashboard', icon: Home, label: 'Home' },
        { href: '/dashboard/admin/manage-users', icon: Users, label: 'Manage Users' },
        { href: '/dashboard/admin/manage-campaigns', icon: ClipboardList, label: 'Manage Campaigns' },
        { href: '/dashboard/admin/withdrawal-requests', icon: ArrowLeftRight, label: 'Withdrawal Requests' },
        { href: '/dashboard/admin/reports', icon: Flag, label: 'Reports' },
    ],
};

export default function DashboardSidebar({ isOpen, onClose }) {
    const { user } = useAuth();
    const pathname = usePathname();
    const items = menuItems[user?.role] || [];

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
            )}

            <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="flex items-center justify-between p-5 border-b border-slate-200">
                    <Link href="/" className="text-lg font-bold text-slate-800">CrowdFund</Link>
                    <button onClick={onClose} className="lg:hidden text-slate-500">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="px-5 py-4 border-b border-slate-200">
                    <p className="text-sm font-medium text-slate-800 truncate">{user?.name}</p>
                    <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
                    <p className="text-xs text-brand-600 font-medium mt-1">🪙 {user?.credits || 0} Credits</p>
                </div>

                <nav className="p-3 space-y-1">
                    {items.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${isActive
                                        ? 'bg-brand-50 text-brand-700'
                                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                                    }`}
                            >
                                <item.icon className="w-4 h-4" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}