'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, Rocket, Coins, CreditCard, UserCheck, FileText } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardHome() {
    const { user, api } = useAuth();
    const [stats, setStats] = useState(null);

    useEffect(() => {
        Promise.all([
            api.get('/auth/users?role=supporter'),
            api.get('/auth/users?role=creator'),
            api.get('/auth/users'),
        ]).then(([supRes, creRes, allRes]) => {
            const allUsers = allRes.data;
            setStats({
                supporters: supRes.data.length,
                creators: creRes.data.length,
                totalCredits: allUsers.reduce((sum, u) => sum + (u.credits || 0), 0),
                totalUsers: allUsers.length,
            });
        }).catch(() => { });
    }, []);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
                <p className="text-slate-500 text-sm mt-1">Welcome back, {user?.name}! Manage the platform from here.</p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/dashboard/admin/manage-users" className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-brand-300 transition group">
                    <UserCheck className="w-8 h-8 text-brand-600 mb-2 group-hover:scale-110 transition" />
                    <p className="font-semibold text-slate-800">Manage Users</p>
                    <p className="text-xs text-slate-500 mt-1">View, edit roles, remove users</p>
                </Link>
                <Link href="/dashboard/admin/manage-campaigns" className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-accent-300 transition group">
                    <FileText className="w-8 h-8 text-accent-600 mb-2 group-hover:scale-110 transition" />
                    <p className="font-semibold text-slate-800">Manage Campaigns</p>
                    <p className="text-xs text-slate-500 mt-1">Approve, reject, delete campaigns</p>
                </Link>
                <Link href="/dashboard/admin/withdrawal-requests" className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-brand-300 transition group">
                    <Coins className="w-8 h-8 text-brand-600 mb-2 group-hover:scale-110 transition" />
                    <p className="font-semibold text-slate-800">Withdrawal Requests</p>
                    <p className="text-xs text-slate-500 mt-1">Process creator payouts</p>
                </Link>
                <Link href="/dashboard/admin/reports" className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-accent-300 transition group">
                    <Rocket className="w-8 h-8 text-accent-600 mb-2 group-hover:scale-110 transition" />
                    <p className="font-semibold text-slate-800">Reports</p>
                    <p className="text-xs text-slate-500 mt-1">View reported campaigns</p>
                </Link>
            </div>

            {/* Stats */}
            {stats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-brand-50 to-white rounded-xl border border-brand-100 p-5">
                        <Users className="w-5 h-5 text-brand-600 mb-2" />
                        <p className="text-sm text-brand-600 font-medium mb-1">Total Supporters</p>
                        <p className="text-3xl font-bold text-slate-800">{stats.supporters}</p>
                    </div>
                    <div className="bg-gradient-to-br from-accent-50 to-white rounded-xl border border-accent-100 p-5">
                        <Users className="w-5 h-5 text-accent-600 mb-2" />
                        <p className="text-sm text-accent-600 font-medium mb-1">Total Creators</p>
                        <p className="text-3xl font-bold text-slate-800">{stats.creators}</p>
                    </div>
                    <div className="bg-gradient-to-br from-brand-50 to-white rounded-xl border border-brand-100 p-5">
                        <Coins className="w-5 h-5 text-brand-600 mb-2" />
                        <p className="text-sm text-brand-600 font-medium mb-1">Total Credits in System</p>
                        <p className="text-3xl font-bold text-brand-600">{stats.totalCredits}</p>
                    </div>
                    <div className="bg-gradient-to-br from-accent-50 to-white rounded-xl border border-accent-100 p-5">
                        <CreditCard className="w-5 h-5 text-accent-600 mb-2" />
                        <p className="text-sm text-accent-600 font-medium mb-1">Total Users</p>
                        <p className="text-3xl font-bold text-slate-800">{stats.totalUsers}</p>
                    </div>
                </div>
            )}
        </div>
    );
}