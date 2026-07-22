'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { Trash2, Check, X, Clock, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import TableRowSkeleton from '@/app/components/TableRowSkeleton';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

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
        return (
            <div className="space-y-8">
                <Skeleton width={280} height={32} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
                <div>
                    <Skeleton width={180} height={24} className="mb-3" baseColor="#e5e7eb" highlightColor="#f3f4f6" />
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <TableRowSkeleton cols={4} rows={3} />
                    </div>
                </div>
                <div>
                    <Skeleton width={140} height={24} className="mb-3" baseColor="#e5e7eb" highlightColor="#f3f4f6" />
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <TableRowSkeleton cols={3} rows={5} />
                    </div>
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

    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    <ShieldAlert className="w-6 h-6 text-amber-500" />
                    Manage Campaigns
                </h1>
            </motion.div>

            {/* Pending Approvals */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
            >
                <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-5 h-5 text-amber-500" />
                    <h2 className="font-semibold text-gray-700 dark:text-gray-300">Pending Approvals</h2>
                    {campaigns.pending.length > 0 && (
                        <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                            {campaigns.pending.length}
                        </span>
                    )}
                </div>

                {campaigns.pending.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
                        <p className="text-gray-400 dark:text-gray-500 text-sm">No pending campaigns.</p>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
                        <table className="w-full text-sm">
                            <thead className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
                                <tr>
                                    <th className="text-left px-4 py-3.5 text-gray-600 dark:text-gray-400 font-semibold">Title</th>
                                    <th className="text-left px-4 py-3.5 hidden sm:table-cell text-gray-600 dark:text-gray-400 font-semibold">Creator</th>
                                    <th className="text-left px-4 py-3.5 text-gray-600 dark:text-gray-400 font-semibold">Goal</th>
                                    <th className="text-left px-4 py-3.5 text-gray-600 dark:text-gray-400 font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {campaigns.pending.map((c, i) => (
                                    <motion.tr
                                        key={c._id}
                                        variants={rowVariants}
                                        initial="hidden"
                                        animate="visible"
                                        custom={i}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                                    >
                                        <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200 truncate max-w-[150px]">{c.title}</td>
                                        <td className="px-4 py-3 hidden sm:table-cell text-gray-600 dark:text-gray-400">{c.creatorName}</td>
                                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300 font-medium">{c.fundingGoal} 🪙</td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-1">
                                                <motion.button
                                                    onClick={() => handleApprove(c._id)}
                                                    whileHover={{ scale: 1.15 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    className="p-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
                                                    title="Approve"
                                                >
                                                    <Check className="w-4 h-4" />
                                                </motion.button>
                                                <motion.button
                                                    onClick={() => handleReject(c._id)}
                                                    whileHover={{ scale: 1.15 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                                                    title="Reject"
                                                >
                                                    <X className="w-4 h-4" />
                                                </motion.button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </motion.div>

            {/* All Campaigns */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
            >
                <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">All Campaigns</h2>
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th className="text-left px-4 py-3.5 text-gray-600 dark:text-gray-400 font-semibold">Title</th>
                                <th className="text-left px-4 py-3.5 hidden sm:table-cell text-gray-600 dark:text-gray-400 font-semibold">Status</th>
                                <th className="text-left px-4 py-3.5 text-gray-600 dark:text-gray-400 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {campaigns.all.map((c, i) => (
                                <motion.tr
                                    key={c._id}
                                    variants={rowVariants}
                                    initial="hidden"
                                    animate="visible"
                                    custom={i}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                                >
                                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200 truncate max-w-[200px]">{c.title}</td>
                                    <td className="px-4 py-3 hidden sm:table-cell">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${c.status === 'approved'
                                                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                                                : c.status === 'pending'
                                                    ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                                                    : 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400'
                                            }`}>
                                            {c.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <motion.button
                                            onClick={() => handleDelete(c._id)}
                                            whileHover={{ scale: 1.15 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </motion.button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}