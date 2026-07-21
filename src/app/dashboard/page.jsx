'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function DashboardHome() {
    const { user, api } = useAuth();
    const [stats, setStats] = useState(null);

    useEffect(() => {
        if (user?.role === 'creator') {
            api.get('/campaigns/my').then((res) => {
                const campaigns = res.data;
                setStats({
                    total: campaigns.length,
                    active: campaigns.filter((c) => new Date(c.deadline) > new Date() && c.status === 'approved').length,
                    raised: campaigns.reduce((sum, c) => sum + (c.raisedAmount || 0), 0),
                });
            }).catch(() => { });
        }
    }, [user]);

    return (
        <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-6">
                Welcome, {user?.name}!
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <p className="text-sm text-slate-500 mb-1">Role</p>
                    <p className="text-xl font-bold text-slate-800 capitalize">{user?.role}</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <p className="text-sm text-slate-500 mb-1">Available Credits</p>
                    <p className="text-xl font-bold text-brand-600">🪙 {user?.credits || 0}</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <p className="text-sm text-slate-500 mb-1">Email</p>
                    <p className="text-lg font-medium text-slate-800 truncate">{user?.email}</p>
                </div>

                {stats && (
                    <>
                        <div className="bg-white rounded-xl border border-slate-200 p-5">
                            <p className="text-sm text-slate-500 mb-1">Total Campaigns</p>
                            <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
                        </div>
                        <div className="bg-white rounded-xl border border-slate-200 p-5">
                            <p className="text-sm text-slate-500 mb-1">Active Campaigns</p>
                            <p className="text-2xl font-bold text-brand-600">{stats.active}</p>
                        </div>
                        <div className="bg-white rounded-xl border border-slate-200 p-5">
                            <p className="text-sm text-slate-500 mb-1">Total Raised</p>
                            <p className="text-2xl font-bold text-brand-600">{stats.raised} Credits</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}