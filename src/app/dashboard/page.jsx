'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function DashboardHome() {
    const { user, api } = useAuth();
    const [stats, setStats] = useState(null);

    useEffect(() => {
        if (!user) return;

        if (user.role === 'creator') {
            api.get('/campaigns/my').then((res) => {
                const campaigns = res.data;
                setStats({
                    total: campaigns.length,
                    active: campaigns.filter((c) => new Date(c.deadline) > new Date() && c.status === 'approved').length,
                    raised: campaigns.reduce((sum, c) => sum + (c.raisedAmount || 0), 0),
                });
            }).catch(() => { });
        }

        if (user.role === 'supporter') {
            api.get('/contributions/my?page=1&limit=100').then((res) => {
                const contribs = res.data.contributions;
                setStats({
                    total: contribs.length,
                    pending: contribs.filter((c) => c.status === 'pending').length,
                    contributed: contribs.filter((c) => c.status === 'approved').reduce((sum, c) => sum + c.amount, 0),
                });
            }).catch(() => { });
        }

        if (user.role === 'admin') {
            Promise.all([
                api.get('/users?role=supporter'),
                api.get('/users?role=creator'),
                api.get('/users'),
            ]).then(([supRes, creRes, allRes]) => {
                const allUsers = allRes.data;
                setStats({
                    supporters: supRes.data.length,
                    creators: creRes.data.length,
                    totalCredits: allUsers.reduce((sum, u) => sum + (u.credits || 0), 0),
                });
            }).catch(() => { });
        }
    }, [user]);

    return (
        <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-6">Welcome, {user?.name}!</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
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
            </div>

            {stats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {user?.role === 'creator' && (
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

                    {user?.role === 'supporter' && (
                        <>
                            <div className="bg-white rounded-xl border border-slate-200 p-5">
                                <p className="text-sm text-slate-500 mb-1">Total Contributions</p>
                                <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
                            </div>
                            <div className="bg-white rounded-xl border border-slate-200 p-5">
                                <p className="text-sm text-slate-500 mb-1">Pending</p>
                                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                            </div>
                            <div className="bg-white rounded-xl border border-slate-200 p-5">
                                <p className="text-sm text-slate-500 mb-1">Total Contributed</p>
                                <p className="text-2xl font-bold text-brand-600">{stats.contributed} Credits</p>
                            </div>
                        </>
                    )}

                    {user?.role === 'admin' && (
                        <>
                            <div className="bg-white rounded-xl border border-slate-200 p-5">
                                <p className="text-sm text-slate-500 mb-1">Supporters</p>
                                <p className="text-2xl font-bold text-slate-800">{stats.supporters}</p>
                            </div>
                            <div className="bg-white rounded-xl border border-slate-200 p-5">
                                <p className="text-sm text-slate-500 mb-1">Creators</p>
                                <p className="text-2xl font-bold text-slate-800">{stats.creators}</p>
                            </div>
                            <div className="bg-white rounded-xl border border-slate-200 p-5">
                                <p className="text-sm text-slate-500 mb-1">Total Credits</p>
                                <p className="text-2xl font-bold text-brand-600">{stats.totalCredits}</p>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}