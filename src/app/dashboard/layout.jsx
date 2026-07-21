'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import DashboardSidebar from '../components/DashboardSidebar';
import { Menu } from 'lucide-react';

export default function DashboardLayout({ children }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
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