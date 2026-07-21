'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import {
    Home, Search, Heart, CreditCard, History,
    PlusCircle, FileText, Wallet, Users,
    Flag, ClipboardList, ArrowLeftRight, User, X, Sparkles, ExternalLink
} from 'lucide-react';

const menuItems = {
    supporter: [
        { href: '/dashboard/supporter', icon: Home, label: 'Dashboard Home' },
        { href: '/dashboard/supporter/explore', icon: Search, label: 'Explore' },
        { href: '/dashboard/supporter/my-contributions', icon: Heart, label: 'My Contributions' },
        { href: '/dashboard/supporter/purchase-credit', icon: CreditCard, label: 'Buy Credits' },
        { href: '/dashboard/supporter/payment-history', icon: History, label: 'Payments' },
        { href: '/dashboard/profile', icon: User, label: 'Profile Settings' },
    ],
    creator: [
        { href: '/dashboard/creator', icon: Home, label: 'Dashboard Home' },
        { href: '/dashboard/creator/add-campaign', icon: PlusCircle, label: 'New Campaign' },
        { href: '/dashboard/creator/my-campaigns', icon: FileText, label: 'My Campaigns' },
        { href: '/dashboard/creator/withdrawals', icon: Wallet, label: 'Withdrawals' },
        { href: '/dashboard/creator/payment-history', icon: History, label: 'Payments' },
        { href: '/dashboard/profile', icon: User, label: 'Profile Settings' },
    ],
    admin: [
        { href: '/dashboard/admin', icon: Home, label: 'Dashboard Home' },
        { href: '/dashboard/admin/manage-users', icon: Users, label: 'Users' },
        { href: '/dashboard/admin/manage-campaigns', icon: ClipboardList, label: 'Campaigns' },
        { href: '/dashboard/admin/withdrawal-requests', icon: ArrowLeftRight, label: 'Withdrawals' },
        { href: '/dashboard/admin/reports', icon: Flag, label: 'Reports' },
        { href: '/dashboard/profile', icon: User, label: 'Profile Settings' },
    ],
};

export default function DashboardSidebar({ isOpen, onClose }) {
    const { user } = useAuth();
    const pathname = usePathname();
    const items = menuItems[user?.role] || [];

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-200" onClick={onClose} />
            )}

            <aside className={`fixed top-0 left-0 z-50 h-full w-72 lg:w-full bg-white/90 backdrop-blur-xl border-r border-slate-200/60 transform transition-transform duration-300 ease-out lg:translate-x-0 lg:static lg:z-auto overflow-y-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>

                {/* Header (Mobile) */}
                <div className="flex items-center justify-between p-5 border-b border-slate-100 lg:hidden">
                    <Link href="/" className="flex items-center gap-2" onClick={onClose}>
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-slate-800">CrowdFund</span>
                    </Link>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-3 space-y-0.5">
                    <p className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Main Menu
                    </p>
                    {items.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href !== '/dashboard/profile' &&
                                item.href !== '/dashboard/supporter' &&
                                item.href !== '/dashboard/creator' &&
                                item.href !== '/dashboard/admin' &&
                                pathname.startsWith(item.href));

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose}
                                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                        ? 'bg-gradient-to-r from-brand-50 to-brand-100/50 text-brand-700 shadow-sm border border-brand-100/50'
                                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 border border-transparent'
                                    }`}
                            >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all group-hover:scale-105 ${isActive
                                        ? 'bg-brand-100 text-brand-600'
                                        : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-500'
                                    }`}>
                                    <item.icon className="w-4 h-4" />
                                </div>
                                {item.label}
                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-500" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Actions */}
                <div className="p-3 mt-4">
                    <div className="border-t border-slate-100 pt-3 space-y-0.5">
                        <Link
                            href="/"
                            onClick={onClose}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all"
                        >
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                                <ExternalLink className="w-4 h-4" />
                            </div>
                            Back to Website
                        </Link>
                    </div>
                </div>
            </aside>
        </>
    );
}