'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { Check, Wallet, ArrowLeftRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

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
            <div className="flex items-center justify-center py-16">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-10 h-10 rounded-full border-2 border-amber-200 border-t-amber-500"
                />
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
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-6"
            >
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <ArrowLeftRight className="w-6 h-6 text-amber-500" />
                    Withdrawal Requests
                </h1>
            </motion.div>

            {requests.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm"
                >
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-emerald-50 mb-6">
                        <Wallet className="w-10 h-10 text-emerald-400" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">All Clear!</h2>
                    <p className="text-gray-500">No pending withdrawal requests.</p>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
                >
                    <table className="w-full text-sm">
                        <thead className="bg-gradient-to-r from-amber-50 to-orange-50">
                            <tr>
                                <th className="text-left px-4 py-3.5 text-gray-600 font-semibold">Creator</th>
                                <th className="text-left px-4 py-3.5 text-gray-600 font-semibold">Credits</th>
                                <th className="text-left px-4 py-3.5 text-gray-600 font-semibold">Amount</th>
                                <th className="text-left px-4 py-3.5 text-gray-600 font-semibold hidden sm:table-cell">Method</th>
                                <th className="text-left px-4 py-3.5 text-gray-600 font-semibold hidden md:table-cell">Account</th>
                                <th className="text-left px-4 py-3.5 text-gray-600 font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {requests.map((r, i) => (
                                <motion.tr
                                    key={r._id}
                                    variants={rowVariants}
                                    initial="hidden"
                                    animate="visible"
                                    custom={i}
                                    className="hover:bg-gray-50/50 transition-colors"
                                >
                                    <td className="px-4 py-3 font-medium text-gray-800">{r.creatorName}</td>
                                    <td className="px-4 py-3 text-gray-700">{r.withdrawalCredits} 🪙</td>
                                    <td className="px-4 py-3 text-emerald-600 font-semibold">${r.withdrawalAmount}</td>
                                    <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{r.paymentSystem}</td>
                                    <td className="px-4 py-3 text-xs text-gray-500 hidden md:table-cell font-mono">{r.accountNumber}</td>
                                    <td className="px-4 py-3">
                                        <motion.button
                                            onClick={() => handleApprove(r._id)}
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:from-emerald-600 hover:to-teal-600 shadow-sm shadow-emerald-200 flex items-center gap-1.5 transition-all"
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