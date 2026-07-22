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
        approved: 'bg-emerald-100 text-emerald-700',
        pending: 'bg-amber-100 text-amber-700',
        rejected: 'bg-rose-100 text-rose-700',
    }[status] || 'bg-gray-100 text-gray-700');

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
                <Skeleton width={240} height={32} className="mb-6" />
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
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
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <History className="w-6 h-6 text-amber-500" />
                    Payment History
                </h1>
            </motion.div>

            {withdrawals.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm"
                >
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gray-100 mb-6">
                        <Wallet className="w-10 h-10 text-gray-400" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">No Withdrawals Yet</h2>
                    <p className="text-gray-500">Request a withdrawal when you have enough credits!</p>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
                >
                    <table className="w-full text-sm">
                        <thead className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left px-4 py-3.5 font-semibold text-gray-600">Date</th>
                                <th className="text-left px-4 py-3.5 font-semibold text-gray-600">Credits</th>
                                <th className="text-left px-4 py-3.5 font-semibold text-gray-600">Amount</th>
                                <th className="text-left px-4 py-3.5 font-semibold text-gray-600">Method</th>
                                <th className="text-left px-4 py-3.5 font-semibold text-gray-600">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {withdrawals.map((w, i) => (
                                <motion.tr
                                    key={i}
                                    variants={rowVariants}
                                    initial="hidden"
                                    animate="visible"
                                    custom={i}
                                    className="hover:bg-gray-50/50 transition-colors"
                                >
                                    <td className="px-4 py-3 text-xs text-gray-600">{new Date(w.requestDate).toLocaleDateString()}</td>
                                    <td className="px-4 py-3 text-gray-700">{w.withdrawalCredits} 🪙</td>
                                    <td className="px-4 py-3 text-emerald-600 font-semibold">${w.withdrawalAmount}</td>
                                    <td className="px-4 py-3 text-gray-600">{w.paymentSystem}</td>
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