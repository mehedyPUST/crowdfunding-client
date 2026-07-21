'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Check, X, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DashboardHome() {
    const { user, api } = useAuth();
    const [stats, setStats] = useState(null);
    const [contributions, setContributions] = useState([]);
    const [viewModal, setViewModal] = useState(null);

    useEffect(() => {
        if (!user) return;

        if (user.role === 'creator') {
            Promise.all([
                api.get('/campaigns/my'),
                api.get('/contributions/pending'),
            ]).then(([campRes, contribRes]) => {
                const campaigns = campRes.data;
                setStats({
                    total: campaigns.length,
                    active: campaigns.filter((c) => new Date(c.deadline) > new Date() && c.status === 'approved').length,
                    raised: campaigns.reduce((sum, c) => sum + (c.raisedAmount || 0), 0),
                });
                setContributions(contribRes.data);
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
                api.get('/auth/users?role=supporter'),
                api.get('/auth/users?role=creator'),
                api.get('/auth/users'),
            ]).then(([supRes, creRes, allRes]) => {
                const allUsers = allRes.data;
                setStats({
                    supporters: supRes.data.length,
                    creators: creRes.data.length,
                    totalCredits: allUsers.reduce((sum, u) => sum + (u.credits || 0), 0),
                    totalPayments: allUsers.length,
                });
            }).catch(() => { });
        }
    }, [user]);

    const handleApprove = async (id) => {
        try {
            await api.patch(`/contributions/${id}/approve`);
            toast.success('Contribution approved');
            setContributions(contributions.filter((c) => c._id !== id));
        } catch {
            toast.error('Failed to approve');
        }
    };

    const handleReject = async (id) => {
        try {
            await api.patch(`/contributions/${id}/reject`);
            toast.success('Contribution rejected & refunded');
            setContributions(contributions.filter((c) => c._id !== id));
        } catch {
            toast.error('Failed to reject');
        }
    };

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-slate-800">Welcome, {user?.name}!</h1>

            {/* Basic Info Cards */}
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

            {/* Role Stats */}
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
                                <p className="text-sm text-slate-500 mb-1">Total Supporters</p>
                                <p className="text-2xl font-bold text-slate-800">{stats.supporters}</p>
                            </div>
                            <div className="bg-white rounded-xl border border-slate-200 p-5">
                                <p className="text-sm text-slate-500 mb-1">Total Creators</p>
                                <p className="text-2xl font-bold text-slate-800">{stats.creators}</p>
                            </div>
                            <div className="bg-white rounded-xl border border-slate-200 p-5">
                                <p className="text-sm text-slate-500 mb-1">Total Credits in System</p>
                                <p className="text-2xl font-bold text-brand-600">{stats.totalCredits}</p>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Creator: Contributions to Review */}
            {user?.role === 'creator' && contributions.length > 0 && (
                <div>
                    <h2 className="font-semibold text-slate-700 mb-3">Contributions to Review</h2>
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="text-left px-4 py-3 font-medium text-slate-600">Supporter</th>
                                    <th className="text-left px-4 py-3 font-medium text-slate-600">Campaign</th>
                                    <th className="text-left px-4 py-3 font-medium text-slate-600">Amount</th>
                                    <th className="text-left px-4 py-3 font-medium text-slate-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {contributions.map((c) => (
                                    <tr key={c._id} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 font-medium">{c.contributorName}</td>
                                        <td className="px-4 py-3 truncate max-w-[120px]">{c.campaignTitle}</td>
                                        <td className="px-4 py-3">{c.amount} Credits</td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <button onClick={() => setViewModal(c)} className="text-slate-500 hover:text-slate-700">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleApprove(c._id)} className="text-green-600 hover:text-green-700">
                                                    <Check className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleReject(c._id)} className="text-red-500 hover:text-red-600">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* View Modal */}
            {viewModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setViewModal(null)}>
                    <div className="bg-white rounded-xl max-w-sm w-full p-6" onClick={(e) => e.stopPropagation()}>
                        <h3 className="font-bold text-slate-800 mb-3">Contribution Details</h3>
                        <div className="space-y-2 text-sm">
                            <p><span className="text-slate-500">Supporter:</span> {viewModal.contributorName}</p>
                            <p><span className="text-slate-500">Campaign:</span> {viewModal.campaignTitle}</p>
                            <p><span className="text-slate-500">Amount:</span> {viewModal.amount} Credits</p>
                            <p><span className="text-slate-500">Date:</span> {new Date(viewModal.date).toLocaleDateString()}</p>
                        </div>
                        <button onClick={() => setViewModal(null)} className="mt-4 w-full py-2 border border-slate-300 rounded-lg text-sm font-medium">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}