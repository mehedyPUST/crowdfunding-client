'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import DashboardSidebar from '../components/DashboardSidebar';
import { useAuth } from '../context/AuthContext';

const roleAccess = {
    supporter: [
        '/dashboard',
        '/dashboard/supporter/explore',
        '/dashboard/supporter/my-contributions',
        '/dashboard/supporter/purchase-credit',
        '/dashboard/supporter/payment-history',
    ],
    creator: [
        '/dashboard',
        '/dashboard/creator/add-campaign',
        '/dashboard/creator/my-campaigns',
        '/dashboard/creator/withdrawals',
        '/dashboard/creator/payment-history',
    ],
    admin: [
        '/dashboard',
        '/dashboard/admin/manage-users',
        '/dashboard/admin/manage-campaigns',
        '/dashboard/admin/withdrawal-requests',
        '/dashboard/admin/reports',
    ],
};

export default function DashboardLayout({ children }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // ALL hooks here, before any return
    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (pathname === '/dashboard' && user) {
            if (user.role === 'supporter') router.push('/dashboard/supporter/explore');
            else if (user.role === 'creator') router.push('/dashboard/creator/my-campaigns');
            else if (user.role === 'admin') router.push('/dashboard/admin/manage-users');
        }
    }, [pathname, user, router]);

    // Now conditional returns
    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
            </div>
        );
    }

    const allowedRoutes = user ? (roleAccess[user.role] || []) : [];
    const hasAccess = allowedRoutes.some(route => pathname === route || pathname.startsWith(route + '/'));

    if (!hasAccess && pathname !== '/dashboard') {
        return (
            <div className="min-h-screen flex bg-slate-50">
                <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <div className="flex-1 flex flex-col min-w-0">
                    <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3 lg:pl-6">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-600">
                            <Menu className="w-5 h-5" />
                        </button>
                        <span className="text-sm text-slate-500">Dashboard</span>
                    </div>
                    <div className="flex-1 flex items-center justify-center p-6">
                        <div className="text-center max-w-md">
                            <ShieldAlert className="w-16 h-16 text-red-400 mx-auto mb-4" />
                            <h1 className="text-2xl font-bold text-slate-800 mb-2">Access Denied</h1>
                            <p className="text-slate-500 mb-6">
                                You do not have permission to access this page as a <span className="capitalize font-medium">{user?.role}</span>.
                            </p>
                            <Link href="/dashboard" className="bg-brand-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-700 transition">
                                Go to Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-slate-50">
            <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex-1 flex flex-col min-w-0">
                <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3 lg:pl-6">
                    <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-600">
                        <Menu className="w-5 h-5" />
                    </button>
                    <span className="text-sm text-slate-500">
                        Dashboard / <span className="capitalize">{user?.role}</span>
                    </span>
                </div>
                <div className="p-4 lg:p-6 flex-1 overflow-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}