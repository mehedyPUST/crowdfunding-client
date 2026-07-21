'use client';

import { useAuth } from '../context/AuthContext';

export default function DashboardHome() {
    const { user } = useAuth();

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
            </div>
        </div>
    );
}