'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MyCampaignsPage() {
    const { api } = useAuth();
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editModal, setEditModal] = useState(null);

    const fetchCampaigns = async () => {
        try {
            const res = await api.get('/campaigns/my');
            setCampaigns(res.data);
        } catch {
            toast.error('Failed to load campaigns');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm('Delete this campaign? All approved contributors will be refunded.')) return;
        try {
            await api.delete(`/campaigns/${id}`);
            toast.success('Campaign deleted & contributors refunded');
            fetchCampaigns();
        } catch {
            toast.error('Delete failed');
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/campaigns/${editModal._id}`, {
                title: editModal.title,
                story: editModal.story,
                rewardInfo: editModal.rewardInfo,
            });
            toast.success('Campaign updated');
            setEditModal(null);
            fetchCampaigns();
        } catch {
            toast.error('Update failed');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-6">My Campaigns</h1>

            {campaigns.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                    <p>No campaigns yet. Create your first campaign!</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-4 py-3 font-medium text-slate-600">Title</th>
                                <th className="text-left px-4 py-3 font-medium text-slate-600 hidden sm:table-cell">Category</th>
                                <th className="text-left px-4 py-3 font-medium text-slate-600">Goal</th>
                                <th className="text-left px-4 py-3 font-medium text-slate-600 hidden md:table-cell">Raised</th>
                                <th className="text-left px-4 py-3 font-medium text-slate-600">Status</th>
                                <th className="text-left px-4 py-3 font-medium text-slate-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {campaigns.map((camp) => (
                                <tr key={camp._id} className="hover:bg-slate-50">
                                    <td className="px-4 py-3 font-medium text-slate-800 truncate max-w-[150px]">{camp.title}</td>
                                    <td className="px-4 py-3 text-slate-500 hidden sm:table-cell">{camp.category}</td>
                                    <td className="px-4 py-3">{camp.fundingGoal}</td>
                                    <td className="px-4 py-3 hidden md:table-cell">{camp.raisedAmount || 0}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${camp.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                camp.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                            }`}>
                                            {camp.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <button onClick={() => setEditModal(camp)} className="text-accent-600 hover:text-accent-700">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(camp._id)} className="text-red-500 hover:text-red-600">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Edit Modal */}
            {editModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <h2 className="text-lg font-bold text-slate-800 mb-4">Edit Campaign</h2>
                        <form onSubmit={handleUpdate} className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                                <input type="text" value={editModal.title} onChange={(e) => setEditModal({ ...editModal, title: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Story</label>
                                <textarea rows={3} value={editModal.story} onChange={(e) => setEditModal({ ...editModal, story: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Reward Info</label>
                                <input type="text" value={editModal.rewardInfo} onChange={(e) => setEditModal({ ...editModal, rewardInfo: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-500" />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setEditModal(null)} className="flex-1 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
                                <button type="submit" className="flex-1 py-2 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}