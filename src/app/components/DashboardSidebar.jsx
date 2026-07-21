'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import {
    Home, Search, Heart, CreditCard, History,
    PlusCircle, FileText, Wallet, Users,
    Flag, ClipboardList, ArrowLeftRight, X,
    User
} from 'lucide-react';

const menuItems = {
    supporter: [

        { href: '/dashboard/supporter', icon: Home, label: 'Home' },
        { href: '/dashboard/supporter/explore', icon: Search, label: 'Explore Campaigns' },
        { href: '/dashboard/supporter/my-contributions', icon: Heart, label: 'My Contributions' },
        { href: '/dashboard/supporter/purchase-credit', icon: CreditCard, label: 'Purchase Credit' },
        { href: '/dashboard/supporter/payment-history', icon: History, label: 'Payment History' },
        { href: '/dashboard/profile', icon: User, label: 'My Profile' },
    ],
    creator: [

        { href: '/dashboard/creator', icon: Home, label: 'Home' },
        { href: '/dashboard/creator/add-campaign', icon: PlusCircle, label: 'Add New Campaign' },
        { href: '/dashboard/creator/my-campaigns', icon: FileText, label: 'My Campaigns' },
        { href: '/dashboard/creator/withdrawals', icon: Wallet, label: 'Withdrawals' },
        { href: '/dashboard/creator/payment-history', icon: History, label: 'Payment History' },
        { href: '/dashboard/profile', icon: User, label: 'My Profile' },
    ],
    admin: [

        { href: '/dashboard/admin', icon: Home, label: 'Home' },
        { href: '/dashboard/admin/manage-users', icon: Users, label: 'Manage Users' },
        { href: '/dashboard/admin/manage-campaigns', icon: ClipboardList, label: 'Manage Campaigns' },
        { href: '/dashboard/admin/withdrawal-requests', icon: ArrowLeftRight, label: 'Withdrawal Requests' },
        { href: '/dashboard/admin/reports', icon: Flag, label: 'Reports' },
        { href: '/dashboard/profile', icon: User, label: 'My Profile' },
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
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-accent-500 flex items-center justify-center text-white font-bold text-sm">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-800 truncate max-w-[140px]">{user?.name}</p>
                            <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
                        </div>
                    </div>
                    <div className="mt-3 bg-brand-50 rounded-lg px-3 py-2 flex items-center justify-between">
                        <span className="text-xs text-brand-700 font-medium">Available Credits</span>
                        <span className="text-sm font-bold text-brand-600">🪙 {user?.credits || 0}</span>
                    </div>
                </div>

                <nav className="p-3 space-y-1">
                    <p className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">Menu</p>
                    {items.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/dashboard/profile' && item.href !== '/dashboard/supporter' && item.href !== '/dashboard/creator' && item.href !== '/dashboard/admin' && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                                    ? 'bg-brand-50 text-brand-700 shadow-sm'
                                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                                    }`}
                            >
                                <item.icon className={`w-4 h-4 ${isActive ? 'text-brand-600' : ''}`} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 bg-white">
                    <Link href="/" className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-600 transition">
                        <Home className="w-3 h-3" /> Back to Homepage
                    </Link>
                </div>
            </aside>
        </>
    );
}