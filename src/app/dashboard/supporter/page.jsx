'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Search, Heart, CreditCard, History, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function SupporterDashboardHome() {
    const { user, api } = useAuth();
    const [stats, setStats] = useState(null);

    useEffect(() => {
        api.get('/contributions/my?page=1&limit=100').then((res) => {
            const contribs = res.data.contributions;
            setStats({
                total: contribs.length,
                pending: contribs.filter((c) => c.status === 'pending').length,
                contributed: contribs.filter((c) => c.status === 'approved').reduce((sum, c) => sum + c.amount, 0),
                approved: contribs.filter((c) => c.status === 'approved').length,
            });
        }).catch(() => { });
    }, []);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Supporter Dashboard</h1>
                <p className="text-slate-500 text-sm mt-1">Welcome back, {user?.name}! Discover and support amazing campaigns.</p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/dashboard/supporter/explore" className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-brand-300 transition group">
                    <Search className="w-8 h-8 text-brand-600 mb-2 group-hover:scale-110 transition" />
                    <p className="font-semibold text-slate-800">Explore Campaigns</p>
                    <p className="text-xs text-slate-500 mt-1">Discover projects to support</p>
                </Link>
                <Link href="/dashboard/supporter/my-contributions" className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-accent-300 transition group">
                    <Heart className="w-8 h-8 text-accent-600 mb-2 group-hover:scale-110 transition" />
                    <p className="font-semibold text-slate-800">My Contributions</p>
                    <p className="text-xs text-slate-500 mt-1">Track your supported campaigns</p>
                </Link>
                <Link href="/dashboard/supporter/purchase-credit" className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-brand-300 transition group">
                    <CreditCard className="w-8 h-8 text-brand-600 mb-2 group-hover:scale-110 transition" />
                    <p className="font-semibold text-slate-800">Purchase Credits</p>
                    <p className="text-xs text-slate-500 mt-1">Buy credits to contribute</p>
                </Link>
                <Link href="/dashboard/supporter/payment-history" className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-accent-300 transition group">
                    <History className="w-8 h-8 text-accent-600 mb-2 group-hover:scale-110 transition" />
                    <p className="font-semibold text-slate-800">Payment History</p>
                    <p className="text-xs text-slate-500 mt-1">View your credit purchases</p>
                </Link>
            </div>

            {/* Stats */}
            {stats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-brand-50 to-white rounded-xl border border-brand-100 p-5">
                        <Heart className="w-5 h-5 text-brand-600 mb-2" />
                        <p className="text-sm text-brand-600 font-medium mb-1">Total Contributions</p>
                        <p className="text-3xl font-bold text-slate-800">{stats.total}</p>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-50 to-white rounded-xl border border-yellow-100 p-5">
                        <TrendingUp className="w-5 h-5 text-yellow-600 mb-2" />
                        <p className="text-sm text-yellow-600 font-medium mb-1">Pending</p>
                        <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                    </div>
                    <div className="bg-gradient-to-br from-brand-50 to-white rounded-xl border border-brand-100 p-5">
                        <CreditCard className="w-5 h-5 text-brand-600 mb-2" />
                        <p className="text-sm text-brand-600 font-medium mb-1">Total Contributed</p>
                        <p className="text-3xl font-bold text-brand-600">{stats.contributed} Credits</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-white rounded-xl border border-green-100 p-5">
                        <Heart className="w-5 h-5 text-green-600 mb-2" />
                        <p className="text-sm text-green-600 font-medium mb-1">Approved</p>
                        <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
                    </div>
                </div>
            )}

            {/* Recent Contributions Preview */}
            {stats && stats.total > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="font-semibold text-slate-700">Your Impact</h2>
                        <Link href="/dashboard/supporter/my-contributions" className="text-sm text-brand-600 hover:underline">View All</Link>
                    </div>
                    <div className="text-center py-4">
                        <p className="text-4xl font-bold text-brand-600 mb-1">{stats.contributed}</p>
                        <p className="text-slate-500 text-sm">Total Credits Contributed</p>
                    </div>
                </div>
            )}
        </div>
    );
}