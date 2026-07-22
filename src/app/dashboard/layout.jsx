'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu, LogOut, Sparkles } from 'lucide-react';
import DashboardSidebar from '../components/DashboardSidebar';
import NotificationBell from '../components/NotificationBell';
import DarkModeToggle from '../components/DarkModeToggle';
import MobileBottomNav from '../components/MobileBottomNav';
import AccessDenied from '../components/AccessDenied';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const roleAccess = {
    supporter: ['/dashboard/profile', '/dashboard', '/dashboard/supporter/explore', '/dashboard/supporter/my-contributions', '/dashboard/supporter/purchase-credit', '/dashboard/supporter/payment-history'],
    creator: ['/dashboard/profile', '/dashboard', '/dashboard/creator/add-campaign', '/dashboard/creator/my-campaigns', '/dashboard/creator/withdrawals', '/dashboard/creator/payment-history'],
    admin: ['/dashboard/profile', '/dashboard', '/dashboard/admin/manage-users', '/dashboard/admin/manage-campaigns', '/dashboard/admin/withdrawal-requests', '/dashboard/admin/reports'],
};

function DashboardShell({ user, logout, sidebarOpen, setSidebarOpen, mainContent }) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen flex flex-col lg:grid lg:grid-cols-[260px_1fr] lg:grid-rows-[64px_1fr] bg-gradient-to-br from-gray-50 via-white to-amber-50/20 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
                <button onClick={() => setSidebarOpen(true)} className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl">
                    <Menu className="w-5 h-5" />
                </button>
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-gray-800 dark:text-white">Crowd<span className="text-amber-600 dark:text-amber-400">Fund</span></span>
                </Link>
                <div className="flex items-center gap-2">
                    <DarkModeToggle />
                    <NotificationBell />
                </div>
            </header>

            <div className="hidden lg:flex items-center justify-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-r border-gray-200 dark:border-gray-700 sticky top-0 left-0 z-30">
                <Link href="/" className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                        <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xl font-bold text-gray-800 dark:text-white">Crowd<span className="text-amber-600 dark:text-amber-400">Fund</span></span>
                </Link>
            </div>

            <div className="hidden lg:flex items-center justify-between bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20 px-6">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 capitalize">{user.role} Dashboard</span>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-full px-3 py-1.5">
                        <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">🪙 {user.credits || 0}</span>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center text-white font-bold text-xs">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex items-center gap-1 border-l border-gray-200 dark:border-gray-700 pl-3">
                        <DarkModeToggle />
                        <NotificationBell />
                        <button onClick={logout} className="p-2 text-gray-400 dark:text-gray-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg" title="Logout">
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="hidden lg:block sticky left-0 top-[64px] h-[calc(100vh-64px)] overflow-y-auto bg-white/60 dark:bg-gray-800/60 border-r border-gray-200 dark:border-gray-700">
                <DashboardSidebar />
            </div>

            {sidebarOpen && (
                <div className="lg:hidden fixed inset-0 z-50">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
                    <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                </div>
            )}

            <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">
                <AnimatePresence mode="wait">
                    <motion.div key={pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="p-4 lg:p-8">
                        {mainContent}
                    </motion.div>
                </AnimatePresence>
            </main>

            <MobileBottomNav />
        </div>
    );
}

export default function DashboardLayout({ children }) {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => { if (!loading && !user) router.push('/login'); }, [user, loading, router]);
    useEffect(() => {
        if (pathname === '/dashboard' && user) {
            if (user.role === 'supporter') router.push('/dashboard/supporter/explore');
            else if (user.role === 'creator') router.push('/dashboard/creator/my-campaigns');
            else if (user.role === 'admin') router.push('/dashboard/admin/manage-users');
        }
    }, [pathname, user, router]);

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center gap-4">
                    <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                        <Sparkles className="w-6 h-6 text-white" />
                    </motion.div>
                    <div className="w-6 h-6 rounded-full border-2 border-amber-200 border-t-amber-500 animate-spin" />
                </div>
            </div>
        );
    }

    const allowedRoutes = roleAccess[user.role] || [];
    const hasAccess = allowedRoutes.some(route => pathname === route || pathname.startsWith(route + '/'));

    return (
        <DashboardShell user={user} logout={logout} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}
            mainContent={(!hasAccess && pathname !== '/dashboard') ? <AccessDenied role={user?.role} /> : children}
        />
    );
}