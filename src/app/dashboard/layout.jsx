'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu, LogOut } from 'lucide-react';
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

// ✅ Moved outside of component
function DashboardShell({ user, logout, sidebarOpen, setSidebarOpen, mainContent }) {
    return (
        <div className="min-h-screen flex flex-col lg:grid lg:grid-cols-[240px_1fr] lg:grid-rows-[60px_1fr]">

            {/* Mobile Header */}
            <header className="lg:hidden flex items-center justify-between p-4 border-b bg-white sticky top-0 z-30">
                <button onClick={() => setSidebarOpen(true)} className="text-slate-600">
                    <Menu className="w-5 h-5" />
                </button>
                <Link href="/" className="font-bold text-slate-800">CrowdFund</Link>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-brand-600 font-medium">🪙 {user.credits || 0}</span>
                    <NotificationBell />
                </div>
            </header>

            {/* Grid 1: Logo (Desktop) */}
            <div className="hidden lg:flex items-center justify-center bg-white border-b border-r border-slate-200 sticky top-0 left-0 z-30">
                <Link href="/" className="text-xl font-bold text-slate-800">CrowdFund</Link>
            </div>

            {/* Grid 2: Top Bar (Desktop) */}
            <div className="hidden lg:flex items-center justify-between bg-white border-b border-slate-200 sticky top-0 z-20 px-6">
                <span className="text-sm text-slate-500 capitalize">Dashboard / {user.role}</span>
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-brand-600">🪙 {user.credits || 0}</span>
                    <NotificationBell />
                    <button onClick={logout} className="flex items-center gap-1 text-sm text-slate-600 hover:text-red-500">
                        <LogOut className="w-4 h-4" /> Logout
                    </button>
                </div>
            </div>

            {/* Grid 3: Sidebar */}
            <div className="hidden lg:block sticky left-0 top-[60px] h-[calc(100vh-60px)] overflow-y-auto bg-white border-r border-slate-200">
                <DashboardSidebar />
            </div>

            {sidebarOpen && (
                <div className="lg:hidden fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
                    <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                </div>
            )}

            {/* Grid 4: Main Content */}
            <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-slate-50">
                {mainContent}
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
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
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