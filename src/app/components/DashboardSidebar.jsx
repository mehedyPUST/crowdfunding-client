'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Home, Search, Heart, CreditCard, History, PlusCircle, FileText, Wallet, Users, Flag, ClipboardList, ArrowLeftRight, User, X, Sparkles, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import Tooltip from './Tooltip';

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
        <aside className={`fixed top-0 left-0 z-50 h-full w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-out lg:translate-x-0 lg:static lg:z-auto overflow-y-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700 lg:hidden">
                <Link href="/" className="flex items-center gap-2.5" onClick={onClose}>
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-gray-800 dark:text-white">Crowd<span className="text-amber-600 dark:text-amber-400">Fund</span></span>
                </Link>
                <button onClick={onClose} className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <nav className="p-3 space-y-0.5">
                <p className="px-3 py-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Main Menu</p>
                {items.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/dashboard/profile' && item.href !== '/dashboard/supporter' && item.href !== '/dashboard/creator' && item.href !== '/dashboard/admin' && pathname.startsWith(item.href));
                    return (
                        <Tooltip key={item.href} content={item.label} position="right">
                            <Link href={item.href} onClick={onClose} className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 text-amber-700 dark:text-amber-400 shadow-sm border border-amber-200/60 dark:border-amber-700/30' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-transparent'}`}>
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all group-hover:scale-105 ${isActive ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'}`}>
                                    <item.icon className="w-4 h-4" />
                                </div>
                                {item.label}
                                {isActive && <motion.div layoutId="activeIndicator" className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400" />}
                            </Link>
                        </Tooltip>
                    );
                })}
            </nav>

            <div className="p-3 mt-4">
                <div className="border-t border-gray-100 dark:border-gray-700 pt-3">
                    <Link href="/" onClick={onClose} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 dark:text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50/60 dark:hover:bg-emerald-900/20 transition-all">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                            <ExternalLink className="w-4 h-4" />
                        </div>
                        Back to Website
                    </Link>
                </div>
            </div>
        </aside>
    );
}