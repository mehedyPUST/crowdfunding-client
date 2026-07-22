'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { Check, Wallet, ArrowLeftRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import TableRowSkeleton from '@/app/components/TableRowSkeleton';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function WithdrawalRequestsPage() {
    const { api } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            const res = await api.get('/admin/withdrawals/pending');
            setRequests(res.data);
        } catch { toast.error('Failed to load'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchRequests(); }, []);

    const handleApprove = async (id) => {
        try {
            await api.patch(`/admin/withdrawals/${id}/approve`);
            toast.success('Payment marked as sent');
            fetchRequests();
        } catch { toast.error('Failed'); }
    };

    if (loading) {
        return (
            <div>
                <Skeleton width={280} height={32} className="mb-6" baseColor="#e5e7eb" highlightColor="#f3f4f6" />
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <TableRowSkeleton cols={6} rows={4} />
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
        <div>
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-6"
            >
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    <ArrowLeftRight className="w-6 h-6 text-amber-500" />
                    Withdrawal Requests
                </h1>
            </motion.div>

            {requests.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 text-center shadow-sm"
                >
                    <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 mb-6">
                        <Wallet className="w-12 h-12 text-emerald-400 dark:text-emerald-500" />
                        <div className="absolute inset-0 bg-emerald-300/10 dark:bg-emerald-500/5 rounded-3xl blur-xl" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">All Clear!</h2>
                    <p className="text-gray-500 dark:text-gray-400">No pending withdrawal requests.</p>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm"
                >
                    <table className="w-full text-sm">
                        <thead className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
                            <tr>
                                <th className="text-left px-4 py-3.5 text-gray-600 dark:text-gray-400 font-semibold">Creator</th>
                                <th className="text-left px-4 py-3.5 text-gray-600 dark:text-gray-400 font-semibold">Credits</th>
                                <th className="text-left px-4 py-3.5 text-gray-600 dark:text-gray-400 font-semibold">Amount</th>
                                <th className="text-left px-4 py-3.5 text-gray-600 dark:text-gray-400 font-semibold hidden sm:table-cell">Method</th>
                                <th className="text-left px-4 py-3.5 text-gray-600 dark:text-gray-400 font-semibold hidden md:table-cell">Account</th>
                                <th className="text-left px-4 py-3.5 text-gray-600 dark:text-gray-400 font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {requests.map((r, i) => (
                                <motion.tr
                                    key={r._id}
                                    variants={rowVariants}
                                    initial="hidden"
                                    animate="visible"
                                    custom={i}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                                >
                                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">{r.creatorName}</td>
                                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{r.withdrawalCredits} 🪙</td>
                                    <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400 font-semibold">${r.withdrawalAmount}</td>
                                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 hidden sm:table-cell">{r.paymentSystem}</td>
                                    <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 hidden md:table-cell font-mono">{r.accountNumber}</td>
                                    <td className="px-4 py-3">
                                        <motion.button
                                            onClick={() => handleApprove(r._id)}
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            className="bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-600 dark:to-teal-600 text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:from-emerald-600 hover:to-teal-600 dark:hover:from-emerald-500 dark:hover:to-teal-500 shadow-sm shadow-emerald-200 dark:shadow-emerald-900/30 flex items-center gap-1.5 transition-all"
                                        >
                                            <Check className="w-3.5 h-3.5" /> Payment Sent
                                        </motion.button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </motion.div>
            )}
        </div>
    );
}