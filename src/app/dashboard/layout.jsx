'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu, LogOut, Sparkles } from 'lucide-react';
import DashboardSidebar from '../components/DashboardSidebar';
import NotificationBell from '../components/NotificationBell';
import AccessDenied from '../components/AccessDenied';
import { useAuth } from '../context/AuthContext';

const roleAccess = {
    supporter: [
        '/dashboard/profile',
        '/dashboard',
        '/dashboard/supporter/explore',
        '/dashboard/supporter/my-contributions',
        '/dashboard/supporter/purchase-credit',
        '/dashboard/supporter/payment-history',
    ],
    creator: [
        '/dashboard/profile',
        '/dashboard',
        '/dashboard/creator/add-campaign',
        '/dashboard/creator/my-campaigns',
        '/dashboard/creator/withdrawals',
        '/dashboard/creator/payment-history',
    ],
    admin: [
        '/dashboard/profile',
        '/dashboard',
        '/dashboard/admin/manage-users',
        '/dashboard/admin/manage-campaigns',
        '/dashboard/admin/withdrawal-requests',
        '/dashboard/admin/reports',
    ],
};

function DashboardShell({ user, logout, sidebarOpen, setSidebarOpen, mainContent }) {
    return (
        <div className="min-h-screen flex flex-col lg:grid lg:grid-cols-[260px_1fr] lg:grid-rows-[64px_1fr] bg-gradient-to-br from-slate-50 via-white to-brand-50/30">

            {/* ========== MOBILE HEADER ========== */}
            <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-30">
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                    <Menu className="w-5 h-5" />
                </button>

                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-slate-800 tracking-tight">CrowdFund</span>
                </Link>

                <div className="flex items-center gap-2">
                    <div className="bg-brand-50 border border-brand-100 rounded-full px-2.5 py-1 flex items-center gap-1">
                        <span className="text-xs">🪙</span>
                        <span className="text-xs font-semibold text-brand-700">{user.credits || 0}</span>
                    </div>
                    <NotificationBell />
                </div>
            </header>

            {/* ========== GRID 1: LOGO (DESKTOP) ========== */}
            <div className="hidden lg:flex items-center justify-center bg-white/60 backdrop-blur-xl border-b border-r border-slate-200/60 sticky top-0 left-0 z-30">
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-lg shadow-brand-500/25 group-hover:shadow-brand-500/40 transition-shadow">
                        <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-brand-700 to-accent-700 bg-clip-text text-transparent tracking-tight">
                        CrowdFund
                    </span>
                </Link>
            </div>

            {/* ========== GRID 2: TOP BAR (DESKTOP) ========== */}
            <div className="hidden lg:flex items-center justify-between bg-white/60 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-20 px-6">
                <span className="text-sm font-medium text-slate-500 capitalize">
                    {user.role} Dashboard
                </span>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-gradient-to-r from-brand-50 to-brand-100/50 border border-brand-100 rounded-full pl-3 pr-4 py-2 shadow-sm">
                        <span className="text-sm">🪙</span>
                        <span className="text-sm font-bold text-brand-700">{user.credits || 0}</span>
                        <span className="text-xs text-brand-500 font-medium">Credits</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-accent-400 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <span className="text-sm font-medium text-slate-700 hidden xl:block">{user.name}</span>
                    </div>

                    <div className="flex items-center gap-1 border-l border-slate-200 pl-3">
                        <NotificationBell />
                        <button
                            onClick={logout}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            title="Logout"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* ========== GRID 3: SIDEBAR ========== */}
            <div className="hidden lg:block sticky left-0 top-[64px] h-[calc(100vh-64px)] overflow-y-auto bg-white/40 backdrop-blur-sm border-r border-slate-200/60">
                <DashboardSidebar />
            </div>

            {sidebarOpen && (
                <div className="lg:hidden fixed inset-0 z-50 animate-in fade-in duration-200">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
                    <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                </div>
            )}

            {/* ========== GRID 4: MAIN CONTENT ========== */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-4 lg:p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {mainContent}
                </div>
            </main>
        </div>
    );
}

export default function DashboardLayout({ children }) {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (!loading && !user) router.push('/login');
    }, [user, loading, router]);

    useEffect(() => {
        if (pathname === '/dashboard' && user) {
            if (user.role === 'supporter') router.push('/dashboard/supporter/explore');
            else if (user.role === 'creator') router.push('/dashboard/creator/my-campaigns');
            else if (user.role === 'admin') router.push('/dashboard/admin/manage-users');
        }
    }, [pathname, user, router]);

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center animate-pulse">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-brand-600 border-t-transparent" />
                </div>
            </div>
        );
    }

    const allowedRoutes = roleAccess[user.role] || [];
    const hasAccess = allowedRoutes.some(route => pathname === route || pathname.startsWith(route + '/'));

    if (!hasAccess && pathname !== '/dashboard') {
        return (
            <DashboardShell
                user={user}
                logout={logout}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                mainContent={<AccessDenied role={user?.role} />}
            />
        );
    }

    return (
        <DashboardShell
            user={user}
            logout={logout}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            mainContent={children}
        />
    );
}