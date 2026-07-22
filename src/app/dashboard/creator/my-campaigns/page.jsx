'use client';

import { useState, useEffect } from 'react';
import { Edit, Trash2, FileText, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/app/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import TableRowSkeleton from '@/app/components/TableRowSkeleton';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

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

    const statusBadgeColors = {
        approved: 'bg-emerald-100 text-emerald-700',
        pending: 'bg-amber-100 text-amber-700',
        rejected: 'bg-rose-100 text-rose-700',
    };

    if (loading) {
        return (
            <div>
                <Skeleton width={220} height={32} className="mb-6" />
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <TableRowSkeleton cols={6} rows={5} />
                </div>
            </div>
        );
    }

    const rowVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: (i) => ({
            opacity: 1,
            x: 0,
            transition: { delay: i * 0.05, duration: 0.3 }
        }),
    };

    const inputClasses = "w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 transition-all";

    return (
        <div>
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-6"
            >
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-amber-500" />
                    My Campaigns
                </h1>
            </motion.div>

            {campaigns.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm"
                >
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-amber-50 mb-6">
                        <FileText className="w-10 h-10 text-amber-300" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">No Campaigns Yet</h2>
                    <p className="text-gray-500">Create your first campaign and start raising funds!</p>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
                >
                    <table className="w-full text-sm">
                        <thead className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left px-4 py-3.5 font-semibold text-gray-600">Title</th>
                                <th className="text-left px-4 py-3.5 font-semibold text-gray-600 hidden sm:table-cell">Category</th>
                                <th className="text-left px-4 py-3.5 font-semibold text-gray-600">Goal</th>
                                <th className="text-left px-4 py-3.5 font-semibold text-gray-600 hidden md:table-cell">Raised</th>
                                <th className="text-left px-4 py-3.5 font-semibold text-gray-600">Status</th>
                                <th className="text-left px-4 py-3.5 font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {campaigns.map((camp, i) => (
                                <motion.tr
                                    key={camp._id}
                                    variants={rowVariants}
                                    initial="hidden"
                                    animate="visible"
                                    custom={i}
                                    className="hover:bg-gray-50/50 transition-colors"
                                >
                                    <td className="px-4 py-3 font-medium text-gray-800 truncate max-w-[150px]">{camp.title}</td>
                                    <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{camp.category}</td>
                                    <td className="px-4 py-3 text-gray-700">{camp.fundingGoal} 🪙</td>
                                    <td className="px-4 py-3 hidden md:table-cell">
                                        <span className="text-emerald-600 font-medium">{camp.raisedAmount || 0} 🪙</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusBadgeColors[camp.status] || 'bg-gray-100 text-gray-700'}`}>
                                            {camp.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-1">
                                            <motion.button
                                                onClick={() => setEditModal(camp)}
                                                whileHover={{ scale: 1.15 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </motion.button>
                                            <motion.button
                                                onClick={() => handleDelete(camp._id)}
                                                whileHover={{ scale: 1.15 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </motion.button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </motion.div>
            )}

            <AnimatePresence>
                {editModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setEditModal(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-gray-800">Edit Campaign</h2>
                                <button
                                    onClick={() => setEditModal(null)}
                                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <form onSubmit={handleUpdate} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title</label>
                                    <input
                                        type="text"
                                        value={editModal.title}
                                        onChange={(e) => setEditModal({ ...editModal, title: e.target.value })}
                                        className={inputClasses}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Story</label>
                                    <textarea
                                        rows={4}
                                        value={editModal.story}
                                        onChange={(e) => setEditModal({ ...editModal, story: e.target.value })}
                                        className={`${inputClasses} resize-none`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Reward Info</label>
                                    <input
                                        type="text"
                                        value={editModal.rewardInfo}
                                        onChange={(e) => setEditModal({ ...editModal, rewardInfo: e.target.value })}
                                        className={inputClasses}
                                    />
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setEditModal(null)}
                                        className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <motion.button
                                        type="submit"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-sm font-semibold shadow-md shadow-amber-200 hover:shadow-lg hover:shadow-amber-200/60 transition-all"
                                    >
                                        Save Changes
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}