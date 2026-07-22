'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Heart, CreditCard, User, PlusCircle, FileText, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const supporterLinks = [
    { href: '/dashboard/supporter', icon: Home, label: 'Home' },
    { href: '/dashboard/supporter/explore', icon: Search, label: 'Explore' },
    { href: '/dashboard/supporter/my-contributions', icon: Heart, label: 'Contrib' },
    { href: '/dashboard/supporter/purchase-credit', icon: CreditCard, label: 'Credits' },
    { href: '/dashboard/profile', icon: User, label: 'Profile' },
];

const creatorLinks = [
    { href: '/dashboard/creator', icon: Home, label: 'Home' },
    { href: '/dashboard/creator/add-campaign', icon: PlusCircle, label: 'Create' },
    { href: '/dashboard/creator/my-campaigns', icon: FileText, label: 'Campaign' },
    { href: '/dashboard/creator/withdrawals', icon: CreditCard, label: 'Withdraw' },
    { href: '/dashboard/profile', icon: User, label: 'Profile' },
];

const adminLinks = [
    { href: '/dashboard/admin', icon: Home, label: 'Home' },
    { href: '/dashboard/admin/manage-users', icon: Users, label: 'Users' },
    { href: '/dashboard/admin/manage-campaigns', icon: FileText, label: 'Campaign' },
    { href: '/dashboard/profile', icon: User, label: 'Profile' },
];

export default function MobileBottomNav() {
    const { user } = useAuth();
    const pathname = usePathname();

    const links = user?.role === 'creator' ? creatorLinks
        : user?.role === 'admin' ? adminLinks
            : supporterLinks;

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 safe-area-bottom">
            <div className="flex items-center justify-around h-16 px-2">
                {links.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex flex-col items-center justify-center gap-0.5 min-w-[60px] py-1 rounded-xl transition-colors ${isActive
                                    ? 'text-amber-600 dark:text-amber-400'
                                    : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                                }`}
                        >
                            <link.icon className="w-5 h-5" />
                            <span className="text-[10px] font-medium">{link.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}