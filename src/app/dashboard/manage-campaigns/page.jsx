'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Trash2, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageCampaignsPage() {
    const { api } = useAuth();
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [allRes, pendingRes] = await Promise.all([
                api.get('/campaigns'),
                api.get('/admin/campaigns/pending'),
            ]);
            setCampaigns({ all: allRes.data, pending: pendingRes.data });
        } catch {
            toast.error('Failed to load');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleApprove = async (id) => {
        try {
            await api.patch(`/admin/campaigns/${id}/approve`);
            toast.success('Campaign approved');
            fetchData();
        } catch { toast.error('Failed'); }
    };

    const handleReject = async (id) => {
        try {
            await api.patch(`/admin/campaigns/${id}/reject`);
            toast.success('Campaign rejected');
            fetchData();
        } catch { toast.error('Failed'); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this campaign?')) return;
        try {
            await api.delete(`/admin/campaigns/${id}`);
            toast.success('Campaign deleted');
            fetchData();
        } catch { toast.error('Failed'); }
    };

    if (loading) {
        return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div></div>;
    }

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-slate-800">Manage Campaigns</h1>

            {/* Pending Approvals */}
            <div>
                <h2 className="font-semibold text-slate-700 mb-3">Pending Approvals</h2>
                {campaigns.pending.length === 0 ? (
                    <p className="text-slate-500 text-sm">No pending campaigns.</p>
                ) : (
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="text-left px-4 py-3">Title</th>
                                    <th className="text-left px-4 py-3 hidden sm:table-cell">Creator</th>
                                    <th className="text-left px-4 py-3">Goal</th>
                                    <th className="text-left px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {campaigns.pending.map((c) => (
                                    <tr key={c._id}>
                                        <td className="px-4 py-3 font-medium truncate max-w-[150px]">{c.title}</td>
                                        <td className="px-4 py-3 hidden sm:table-cell">{c.creatorName}</td>
                                        <td className="px-4 py-3">{c.fundingGoal}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <button onClick={() => handleApprove(c._id)} className="text-green-600 hover:text-green-700"><Check className="w-4 h-4" /></button>
                                                <button onClick={() => handleReject(c._id)} className="text-red-500 hover:text-red-600"><X className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* All Campaigns */}
            <div>
                <h2 className="font-semibold text-slate-700 mb-3">All Campaigns</h2>
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="text-left px-4 py-3">Title</th>
                                <th className="text-left px-4 py-3 hidden sm:table-cell">Status</th>
                                <th className="text-left px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {campaigns.all.map((c) => (
                                <tr key={c._id}>
                                    <td className="px-4 py-3 font-medium truncate max-w-[200px]">{c.title}</td>
                                    <td className="px-4 py-3 hidden sm:table-cell">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                c.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                            }`}>{c.status}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button onClick={() => handleDelete(c._id)} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}