'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Check, X, Eye, PlusCircle, FileText, Wallet } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function CreatorDashboardHome() {
    const { user, api } = useAuth();
    const [stats, setStats] = useState(null);
    const [contributions, setContributions] = useState([]);
    const [viewModal, setViewModal] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [campRes, contribRes] = await Promise.all([
                api.get('/campaigns/my'),
                api.get('/contributions/pending'),
            ]);
            const campaigns = campRes.data;
            setStats({
                total: campaigns.length,
                active: campaigns.filter((c) => new Date(c.deadline) > new Date() && c.status === 'approved').length,
                raised: campaigns.reduce((sum, c) => sum + (c.raisedAmount || 0), 0),
            });
            setContributions(contribRes.data);
        } catch {
            // silent
        }
    };

    const handleApprove = async (id) => {
        try {
            await api.patch(`/contributions/${id}/approve`);
            toast.success('Contribution approved!');
            fetchData();
        } catch {
            toast.error('Failed to approve');
        }
    };

    const handleReject = async (id) => {
        try {
            await api.patch(`/contributions/${id}/reject`);
            toast.success('Contribution rejected & refunded');
            fetchData();
        } catch {
            toast.error('Failed to reject');
        }
    };

    return (
        <div className="space-y-8">
            {/* Welcome */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Creator Dashboard</h1>
                <p className="text-slate-500 text-sm mt-1">Welcome back, {user?.name}! Manage your campaigns and contributions.</p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link
                    href="/dashboard/creator/add-campaign"
                    className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-brand-300 transition group"
                >
                    <PlusCircle className="w-8 h-8 text-brand-600 mb-2 group-hover:scale-110 transition" />
                    <p className="font-semibold text-slate-800">Add New Campaign</p>
                    <p className="text-xs text-slate-500 mt-1">Launch a new funding campaign</p>
                </Link>
                <Link
                    href="/dashboard/creator/my-campaigns"
                    className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-brand-300 transition group"
                >
                    <FileText className="w-8 h-8 text-accent-600 mb-2 group-hover:scale-110 transition" />
                    <p className="font-semibold text-slate-800">My Campaigns</p>
                    <p className="text-xs text-slate-500 mt-1">View and manage your campaigns</p>
                </Link>
                <Link
                    href="/dashboard/creator/withdrawals"
                    className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-brand-300 transition group"
                >
                    <Wallet className="w-8 h-8 text-brand-600 mb-2 group-hover:scale-110 transition" />
                    <p className="font-semibold text-slate-800">Withdraw Funds</p>
                    <p className="text-xs text-slate-500 mt-1">Request payout of raised credits</p>
                </Link>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-brand-50 to-white rounded-xl border border-brand-100 p-5">
                        <p className="text-sm text-brand-600 font-medium mb-1">Total Campaigns</p>
                        <p className="text-3xl font-bold text-slate-800">{stats.total}</p>
                    </div>
                    <div className="bg-gradient-to-br from-accent-50 to-white rounded-xl border border-accent-100 p-5">
                        <p className="text-sm text-accent-600 font-medium mb-1">Active Campaigns</p>
                        <p className="text-3xl font-bold text-slate-800">{stats.active}</p>
                    </div>
                    <div className="bg-gradient-to-br from-brand-50 to-white rounded-xl border border-brand-100 p-5">
                        <p className="text-sm text-brand-600 font-medium mb-1">Total Raised</p>
                        <p className="text-3xl font-bold text-brand-600">{stats.raised} Credits</p>
                    </div>
                </div>
            )}

            {/* Pending Contributions */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="font-semibold text-slate-700">
                        Contributions to Review
                        {contributions.length > 0 && (
                            <span className="ml-2 bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full">{contributions.length} pending</span>
                        )}
                    </h2>
                </div>

                {contributions.length === 0 ? (
                    <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
                        <Check className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500 font-medium">All caught up!</p>
                        <p className="text-slate-400 text-sm mt-1">No pending contributions to review.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="text-left px-4 py-3 font-medium text-slate-600">Supporter</th>
                                    <th className="text-left px-4 py-3 font-medium text-slate-600 hidden sm:table-cell">Campaign</th>
                                    <th className="text-left px-4 py-3 font-medium text-slate-600">Amount</th>
                                    <th className="text-left px-4 py-3 font-medium text-slate-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {contributions.map((c) => (
                                    <tr key={c._id} className="hover:bg-slate-50">
                                        <td className="px-4 py-3">
                                            <p className="font-medium text-slate-800">{c.contributorName}</p>
                                            <p className="text-xs text-slate-400">{c.contributorEmail}</p>
                                        </td>
                                        <td className="px-4 py-3 text-slate-500 hidden sm:table-cell truncate max-w-[150px]">{c.campaignTitle}</td>
                                        <td className="px-4 py-3">
                                            <span className="text-brand-600 font-semibold">{c.amount}</span>
                                            <span className="text-xs text-slate-400 ml-1">Credits</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setViewModal(c)}
                                                    className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleApprove(c._id)}
                                                    className="p-1.5 rounded-lg border border-green-200 text-green-600 hover:bg-green-50"
                                                    title="Approve"
                                                >
                                                    <Check className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleReject(c._id)}
                                                    className="p-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50"
                                                    title="Reject"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* View Detail Modal */}
            {viewModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setViewModal(null)}>
                    <div className="bg-white rounded-xl max-w-sm w-full p-6" onClick={(e) => e.stopPropagation()}>
                        <h3 className="font-bold text-slate-800 mb-4">Contribution Details</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Supporter</span>
                                <span className="font-medium text-slate-800">{viewModal.contributorName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Email</span>
                                <span className="text-slate-600 text-xs">{viewModal.contributorEmail}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Campaign</span>
                                <span className="font-medium text-slate-800">{viewModal.campaignTitle}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Amount</span>
                                <span className="font-bold text-brand-600">{viewModal.amount} Credits</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Date</span>
                                <span className="text-slate-600">{new Date(viewModal.date).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <button
                            onClick={() => setViewModal(null)}
                            className="mt-5 w-full py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}