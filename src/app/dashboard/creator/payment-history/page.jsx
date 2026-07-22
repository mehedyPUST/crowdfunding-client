'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { History, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';
import TableRowSkeleton from '@/app/components/TableRowSkeleton';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function PaymentHistoryPage() {
    const { api, user } = useAuth();
    const [withdrawals, setWithdrawals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/withdrawals/my');
                setWithdrawals(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const statusBadge = (status) => ({
        approved: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
        pending: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
        rejected: 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400',
    }[status] || 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300');

    const rowVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: (i) => ({
            opacity: 1,
            x: 0,
            transition: { delay: i * 0.05, duration: 0.3 }
        }),
    };

    if (loading) {
        return (
            <div>
                <Skeleton width={240} height={32} className="mb-6" baseColor="#e5e7eb" highlightColor="#f3f4f6" />
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <TableRowSkeleton cols={5} rows={4} />
                </div>
            </div>
        );
    }

    return (
        <div>
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-6"
            >
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    <History className="w-6 h-6 text-amber-500" />
                    Payment History
                </h1>
            </motion.div>

            {withdrawals.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 text-center shadow-sm"
                >
                    <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 mb-6">
                        <Wallet className="w-12 h-12 text-emerald-400 dark:text-emerald-500" />
                        <div className="absolute inset-0 bg-emerald-300/10 dark:bg-emerald-500/5 rounded-3xl blur-xl" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">No Withdrawals Yet</h2>
                    <p className="text-gray-500 dark:text-gray-400">Request a withdrawal when you have enough credits!</p>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm"
                >
                    <table className="w-full text-sm">
                        <thead className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <th className="text-left px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400">Date</th>
                                <th className="text-left px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400">Credits</th>
                                <th className="text-left px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400">Amount</th>
                                <th className="text-left px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400">Method</th>
                                <th className="text-left px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {withdrawals.map((w, i) => (
                                <motion.tr
                                    key={i}
                                    variants={rowVariants}
                                    initial="hidden"
                                    animate="visible"
                                    custom={i}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                                >
                                    <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">{new Date(w.requestDate).toLocaleDateString()}</td>
                                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{w.withdrawalCredits} 🪙</td>
                                    <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400 font-semibold">${w.withdrawalAmount}</td>
                                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{w.paymentSystem}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusBadge(w.status)}`}>
                                            {w.status}
                                        </span>
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