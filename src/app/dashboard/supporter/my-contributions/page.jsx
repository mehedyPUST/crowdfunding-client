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
            approved: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
            pending: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
            rejected: 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400',
        };
        return (
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${colors[status] || 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
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
                <Skeleton width={240} height={32} className="mb-6" baseColor="#e5e7eb" highlightColor="#f3f4f6" />
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <TableRowSkeleton cols={5} rows={5} />
                </div>
            </div>
        );
    }

    return (
        <div>
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    <Heart className="w-6 h-6 text-amber-500" />
                    My Contributions
                </h1>
            </motion.div>

            {data.contributions.length === 0 ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 text-center shadow-sm">
                    <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 mb-6">
                        <Clock className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">No Contributions Yet</h2>
                    <p className="text-gray-500 dark:text-gray-400">Start exploring campaigns and support what inspires you!</p>
                </motion.div>
            ) : (
                <>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
                        <table className="w-full text-sm">
                            <thead className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-b border-gray-200 dark:border-gray-700">
                                <tr>
                                    <th className="text-left px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400">Campaign</th>
                                    <th className="text-left px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400">Amount</th>
                                    <th className="text-left px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400 hidden sm:table-cell">Creator</th>
                                    <th className="text-left px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400">Date</th>
                                    <th className="text-left px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {data.contributions.map((c, i) => (
                                    <motion.tr key={c._id} variants={rowVariants} initial="hidden" animate="visible" custom={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                        <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200 truncate max-w-[120px]">{c.campaignTitle}</td>
                                        <td className="px-4 py-3"><span className="text-amber-600 dark:text-amber-400 font-semibold">{c.amount}</span><span className="text-gray-400 dark:text-gray-500 text-xs ml-1">🪙</span></td>
                                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400 hidden sm:table-cell">{c.creatorName}</td>
                                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">{new Date(c.date).toLocaleDateString()}</td>
                                        <td className="px-4 py-3">{statusBadge(c.status)}</td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </motion.div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.3 }} className="flex items-center justify-between mt-4 text-sm">
                        <p className="text-gray-500 dark:text-gray-400">Page {data.page} of {data.totalPages} ({data.total} total)</p>
                        <div className="flex gap-2">
                            <button onClick={() => fetchContributions(data.page - 1)} disabled={data.page <= 1} className="flex items-center gap-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 font-medium transition-colors"><ChevronLeft className="w-4 h-4" /> Prev</button>
                            <button onClick={() => fetchContributions(data.page + 1)} disabled={data.page >= data.totalPages} className="flex items-center gap-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 font-medium transition-colors">Next <ChevronRight className="w-4 h-4" /></button>
                        </div>
                    </motion.div>
                </>
            )}
        </div>
    );
}