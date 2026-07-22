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
        approved: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
        pending: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
        rejected: 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400',
    };

    if (loading) {
        return (
            <div>
                <Skeleton width={220} height={32} className="mb-6" baseColor="#e5e7eb" highlightColor="#f3f4f6" />
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
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

    const inputClasses = "w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-300 dark:focus:ring-amber-600 focus:border-amber-400 dark:focus:border-amber-500 transition-all bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200";

    return (
        <div>
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-6"
            >
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-amber-500" />
                    My Campaigns
                </h1>
            </motion.div>

            {campaigns.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 text-center shadow-sm"
                >
                    <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 mb-6">
                        <FileText className="w-12 h-12 text-amber-300 dark:text-amber-500" />
                        <div className="absolute inset-0 bg-amber-300/10 dark:bg-amber-500/5 rounded-3xl blur-xl" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">No Campaigns Yet</h2>
                    <p className="text-gray-500 dark:text-gray-400">Create your first campaign and start raising funds!</p>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm"
                >
                    <table className="w-full text-sm">
                        <thead className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <th className="text-left px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400">Title</th>
                                <th className="text-left px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400 hidden sm:table-cell">Category</th>
                                <th className="text-left px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400">Goal</th>
                                <th className="text-left px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400 hidden md:table-cell">Raised</th>
                                <th className="text-left px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400">Status</th>
                                <th className="text-left px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {campaigns.map((camp, i) => (
                                <motion.tr
                                    key={camp._id}
                                    variants={rowVariants}
                                    initial="hidden"
                                    animate="visible"
                                    custom={i}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                                >
                                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200 truncate max-w-[150px]">{camp.title}</td>
                                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 hidden sm:table-cell">{camp.category}</td>
                                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{camp.fundingGoal} 🪙</td>
                                    <td className="px-4 py-3 hidden md:table-cell">
                                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">{camp.raisedAmount || 0} 🪙</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusBadgeColors[camp.status] || 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                                            {camp.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-1">
                                            <motion.button
                                                onClick={() => setEditModal(camp)}
                                                whileHover={{ scale: 1.15 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="p-2 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </motion.button>
                                            <motion.button
                                                onClick={() => handleDelete(camp._id)}
                                                whileHover={{ scale: 1.15 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
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
                        className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setEditModal(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-700"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Edit Campaign</h2>
                                <button
                                    onClick={() => setEditModal(null)}
                                    className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <form onSubmit={handleUpdate} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Title</label>
                                    <input type="text" value={editModal.title} onChange={(e) => setEditModal({ ...editModal, title: e.target.value })} className={inputClasses} />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Story</label>
                                    <textarea rows={4} value={editModal.story} onChange={(e) => setEditModal({ ...editModal, story: e.target.value })} className={`${inputClasses} resize-none`} />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Reward Info</label>
                                    <input type="text" value={editModal.rewardInfo} onChange={(e) => setEditModal({ ...editModal, rewardInfo: e.target.value })} className={inputClasses} />
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={() => setEditModal(null)} className="flex-1 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cancel</button>
                                    <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-amber-200 dark:shadow-amber-900/30 hover:shadow-lg hover:shadow-amber-200/60 dark:hover:shadow-amber-900/40 transition-all">Save Changes</motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}