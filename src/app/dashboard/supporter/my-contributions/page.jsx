'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Heart, Clock } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { motion } from 'framer-motion';
import TableRowSkeleton from '@/app/components/TableRowSkeleton';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function MyContributionsPage() {
    const { api } = useAuth();
    const [data, setData] = useState({ contributions: [], total: 0, page: 1, totalPages: 1 });
    const [loading, setLoading] = useState(true);

    const fetchContributions = async (page = 1) => {
        setLoading(true);
        try {
            const res = await api.get(`/contributions/my?page=${page}&limit=5`);
            setData(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContributions();
    }, []);

    const statusBadge = (status) => {
        const colors = {
            approved: 'bg-emerald-100 text-emerald-700',
            pending: 'bg-amber-100 text-amber-700',
            rejected: 'bg-rose-100 text-rose-700',
        };
        return (
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${colors[status] || 'bg-gray-100 text-gray-700'}`}>
                {status}
            </span>
        );
    };

    const rowVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: (i) => ({
            opacity: 1,
            x: 0,
            transition: { delay: i * 0.06, duration: 0.3 }
        }),
    };

    if (loading) {
        return (
            <div>
                <Skeleton width={240} height={32} className="mb-6" />
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <TableRowSkeleton cols={5} rows={5} />
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
                    <Heart className="w-6 h-6 text-amber-500" />
                    My Contributions
                </h1>
            </motion.div>

            {data.contributions.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm"
                >
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gray-100 mb-6">
                        <Clock className="w-10 h-10 text-gray-400" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">No Contributions Yet</h2>
                    <p className="text-gray-500">Start exploring campaigns and support what inspires you!</p>
                </motion.div>
            ) : (
                <>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
                    >
                        <table className="w-full text-sm">
                            <thead className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left px-4 py-3.5 font-semibold text-gray-600">Campaign</th>
                                    <th className="text-left px-4 py-3.5 font-semibold text-gray-600">Amount</th>
                                    <th className="text-left px-4 py-3.5 font-semibold text-gray-600 hidden sm:table-cell">Creator</th>
                                    <th className="text-left px-4 py-3.5 font-semibold text-gray-600">Date</th>
                                    <th className="text-left px-4 py-3.5 font-semibold text-gray-600">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {data.contributions.map((c, i) => (
                                    <motion.tr
                                        key={c._id}
                                        variants={rowVariants}
                                        initial="hidden"
                                        animate="visible"
                                        custom={i}
                                        className="hover:bg-gray-50/50 transition-colors"
                                    >
                                        <td className="px-4 py-3 font-medium text-gray-800 truncate max-w-[120px]">{c.campaignTitle}</td>
                                        <td className="px-4 py-3">
                                            <span className="text-amber-600 font-semibold">{c.amount}</span>
                                            <span className="text-gray-400 text-xs ml-1">🪙</span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{c.creatorName}</td>
                                        <td className="px-4 py-3 text-gray-500 text-xs">{new Date(c.date).toLocaleDateString()}</td>
                                        <td className="px-4 py-3">{statusBadge(c.status)}</td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                        className="flex items-center justify-between mt-4 text-sm"
                    >
                        <p className="text-gray-500">
                            Page {data.page} of {data.totalPages} ({data.total} total)
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => fetchContributions(data.page - 1)}
                                disabled={data.page <= 1}
                                className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-xl disabled:opacity-40 hover:bg-gray-50 text-gray-600 font-medium transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" /> Prev
                            </button>
                            <button
                                onClick={() => fetchContributions(data.page + 1)}
                                disabled={data.page >= data.totalPages}
                                className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-xl disabled:opacity-40 hover:bg-gray-50 text-gray-600 font-medium transition-colors"
                            >
                                Next <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </div>
    );
}