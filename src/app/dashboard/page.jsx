'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Check, X, Eye, User, Mail, Coins, FileText, TrendingUp, CreditCard, Users, HandHeart } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import StatsSkeleton from '@/app/components/StatsSkeleton';

export default function DashboardHome() {
    const { user, api } = useAuth();
    const [stats, setStats] = useState(null);
    const [contributions, setContributions] = useState([]);
    const [viewModal, setViewModal] = useState(null);

    useEffect(() => {
        if (!user) return;

        if (user.role === 'creator') {
            Promise.all([api.get('/campaigns/my'), api.get('/contributions/pending')])
                .then(([campRes, contribRes]) => {
                    const campaigns = campRes.data;
                    setStats({
                        total: campaigns.length,
                        active: campaigns.filter((c) => new Date(c.deadline) > new Date() && c.status === 'approved').length,
                        raised: campaigns.reduce((sum, c) => sum + (c.raisedAmount || 0), 0),
                    });
                    setContributions(contribRes.data);
                }).catch(() => { });
        }

        if (user.role === 'supporter') {
            api.get('/contributions/my?page=1&limit=100').then((res) => {
                const contribs = res.data.contributions;
                setStats({
                    total: contribs.length,
                    pending: contribs.filter((c) => c.status === 'pending').length,
                    contributed: contribs.filter((c) => c.status === 'approved').reduce((sum, c) => sum + c.amount, 0),
                });
            }).catch(() => { });
        }

        if (user.role === 'admin') {
            Promise.all([api.get('/auth/users?role=supporter'), api.get('/auth/users?role=creator'), api.get('/auth/users')])
                .then(([supRes, creRes, allRes]) => {
                    const allUsers = allRes.data;
                    setStats({
                        supporters: supRes.data.length,
                        creators: creRes.data.length,
                        totalCredits: allUsers.reduce((sum, u) => sum + (u.credits || 0), 0),
                        totalPayments: allUsers.length,
                    });
                }).catch(() => { });
        }
    }, [user]);

    const handleApprove = async (id) => {
        try { await api.patch(`/contributions/${id}/approve`); toast.success('Contribution approved'); setContributions(contributions.filter((c) => c._id !== id)); }
        catch { toast.error('Failed to approve'); }
    };

    const handleReject = async (id) => {
        try { await api.patch(`/contributions/${id}/reject`); toast.success('Contribution rejected & refunded'); setContributions(contributions.filter((c) => c._id !== id)); }
        catch { toast.error('Failed to reject'); }
    };

    const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
    const cardVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } } };

    return (
        <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    Welcome, <span className="text-amber-600 dark:text-amber-400">{user?.name}</span>!
                </h1>
            </motion.div>

            {/* Info Cards */}
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { icon: User, label: 'Role', value: user?.role, color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20', capitalize: true },
                    { icon: Coins, label: 'Available Credits', value: `🪙 ${user?.credits || 0}`, color: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20', bold: true },
                    { icon: Mail, label: 'Email', value: user?.email, color: 'text-gray-500 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-gray-700', truncate: true },
                ].map((card, i) => (
                    <motion.div key={i} variants={cardVariants} whileHover={{ y: -3 }} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center flex-shrink-0`}><card.icon className={`w-5 h-5 ${card.color}`} /></div>
                        <div className="min-w-0"><p className="text-xs text-gray-500 dark:text-gray-400">{card.label}</p><p className={`text-sm ${card.bold ? 'font-bold text-emerald-600 dark:text-emerald-400' : 'font-semibold text-gray-800 dark:text-gray-200'} ${card.capitalize ? 'capitalize' : ''} ${card.truncate ? 'truncate' : ''}`}>{card.value}</p></div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Stats */}
            {!stats ? <StatsSkeleton cards={3} /> : (
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {user?.role === 'creator' && [
                        { icon: FileText, label: 'Total Campaigns', value: stats.total, gradient: 'from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20', border: 'border-amber-200 dark:border-amber-800', textColor: 'text-amber-600 dark:text-amber-400', iconBg: 'bg-amber-100 dark:bg-amber-900/30' },
                        { icon: TrendingUp, label: 'Active Campaigns', value: stats.active, gradient: 'from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20', border: 'border-emerald-200 dark:border-emerald-800', textColor: 'text-emerald-600 dark:text-emerald-400', iconBg: 'bg-emerald-100 dark:bg-emerald-900/30' },
                        { icon: Coins, label: 'Total Raised', value: `${stats.raised} 🪙`, gradient: 'from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20', border: 'border-amber-200 dark:border-amber-800', textColor: 'text-amber-600 dark:text-amber-400', iconBg: 'bg-amber-100 dark:bg-amber-900/30', highlight: true },
                    ].map((stat, i) => (
                        <motion.div key={i} variants={cardVariants} whileHover={{ y: -4 }} className={`bg-gradient-to-br ${stat.gradient} rounded-2xl border ${stat.border} p-5 relative overflow-hidden`}>
                            <div className={`absolute -top-4 -right-4 w-20 h-20 rounded-full ${stat.iconBg} opacity-50`} />
                            <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg ${stat.iconBg} mb-3 relative`}><stat.icon className={`w-5 h-5 ${stat.textColor}`} /></div>
                            <p className={`text-sm font-medium mb-1 relative ${stat.textColor}`}>{stat.label}</p>
                            <p className={`text-2xl font-bold relative ${stat.highlight ? stat.textColor : 'text-gray-800 dark:text-gray-100'}`}>{stat.value}</p>
                        </motion.div>
                    ))}
                    {user?.role === 'supporter' && [
                        { icon: HandHeart, label: 'Total Contributions', value: stats.total, gradient: 'from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20', border: 'border-amber-200 dark:border-amber-800', textColor: 'text-amber-600 dark:text-amber-400', iconBg: 'bg-amber-100 dark:bg-amber-900/30' },
                        { icon: TrendingUp, label: 'Pending', value: stats.pending, gradient: 'from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20', border: 'border-amber-200 dark:border-amber-800', textColor: 'text-amber-600 dark:text-amber-400', iconBg: 'bg-amber-100 dark:bg-amber-900/30', highlight: true },
                        { icon: CreditCard, label: 'Total Contributed', value: `${stats.contributed} 🪙`, gradient: 'from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20', border: 'border-emerald-200 dark:border-emerald-800', textColor: 'text-emerald-600 dark:text-emerald-400', iconBg: 'bg-emerald-100 dark:bg-emerald-900/30', highlight: true },
                    ].map((stat, i) => (
                        <motion.div key={i} variants={cardVariants} whileHover={{ y: -4 }} className={`bg-gradient-to-br ${stat.gradient} rounded-2xl border ${stat.border} p-5 relative overflow-hidden`}>
                            <div className={`absolute -top-4 -right-4 w-20 h-20 rounded-full ${stat.iconBg} opacity-50`} />
                            <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg ${stat.iconBg} mb-3 relative`}><stat.icon className={`w-5 h-5 ${stat.textColor}`} /></div>
                            <p className={`text-sm font-medium mb-1 relative ${stat.textColor}`}>{stat.label}</p>
                            <p className={`text-2xl font-bold relative ${stat.highlight ? stat.textColor : 'text-gray-800 dark:text-gray-100'}`}>{stat.value}</p>
                        </motion.div>
                    ))}
                    {user?.role === 'admin' && [
                        { icon: Users, label: 'Total Supporters', value: stats.supporters, gradient: 'from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20', border: 'border-amber-200 dark:border-amber-800', textColor: 'text-amber-600 dark:text-amber-400', iconBg: 'bg-amber-100 dark:bg-amber-900/30' },
                        { icon: Users, label: 'Total Creators', value: stats.creators, gradient: 'from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20', border: 'border-emerald-200 dark:border-emerald-800', textColor: 'text-emerald-600 dark:text-emerald-400', iconBg: 'bg-emerald-100 dark:bg-emerald-900/30' },
                        { icon: Coins, label: 'Credits in System', value: stats.totalCredits, gradient: 'from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20', border: 'border-amber-200 dark:border-amber-800', textColor: 'text-amber-600 dark:text-amber-400', iconBg: 'bg-amber-100 dark:bg-amber-900/30', highlight: true },
                    ].map((stat, i) => (
                        <motion.div key={i} variants={cardVariants} whileHover={{ y: -4 }} className={`bg-gradient-to-br ${stat.gradient} rounded-2xl border ${stat.border} p-5 relative overflow-hidden`}>
                            <div className={`absolute -top-4 -right-4 w-20 h-20 rounded-full ${stat.iconBg} opacity-50`} />
                            <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg ${stat.iconBg} mb-3 relative`}><stat.icon className={`w-5 h-5 ${stat.textColor}`} /></div>
                            <p className={`text-sm font-medium mb-1 relative ${stat.textColor}`}>{stat.label}</p>
                            <p className={`text-2xl font-bold relative ${stat.highlight ? stat.textColor : 'text-gray-800 dark:text-gray-100'}`}>{stat.value}</p>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* Creator: Pending Contributions */}
            {user?.role === 'creator' && contributions.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
                    <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                        Contributions to Review
                        <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs px-2.5 py-1 rounded-full font-semibold">{contributions.length} pending</span>
                    </h2>
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
                        <table className="w-full text-sm">
                            <thead className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-b border-gray-200 dark:border-gray-700">
                                <tr><th className="text-left px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400">Supporter</th><th className="text-left px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400">Campaign</th><th className="text-left px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400">Amount</th><th className="text-left px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400">Actions</th></tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {contributions.map((c) => (
                                    <tr key={c._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                        <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">{c.contributorName}</td>
                                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400 truncate max-w-[120px]">{c.campaignTitle}</td>
                                        <td className="px-4 py-3 text-amber-600 dark:text-amber-400 font-semibold">{c.amount} 🪙</td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-1.5">
                                                <motion.button onClick={() => setViewModal(c)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200 transition-colors" title="View"><Eye className="w-4 h-4" /></motion.button>
                                                <motion.button onClick={() => handleApprove(c._id)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 rounded-lg border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors" title="Approve"><Check className="w-4 h-4" /></motion.button>
                                                <motion.button onClick={() => handleReject(c._id)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 rounded-lg border border-rose-200 dark:border-rose-800 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors" title="Reject"><X className="w-4 h-4" /></motion.button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}

            {/* View Modal */}
            <AnimatePresence>
                {viewModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setViewModal(null)}>
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} transition={{ duration: 0.25, ease: "easeOut" }} onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-gray-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-700">
                            <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4">Contribution Details</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Supporter</span><span className="font-medium text-gray-800 dark:text-gray-200">{viewModal.contributorName}</span></div>
                                <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Campaign</span><span className="font-medium text-gray-800 dark:text-gray-200">{viewModal.campaignTitle}</span></div>
                                <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Amount</span><span className="font-bold text-amber-600 dark:text-amber-400">{viewModal.amount} Credits</span></div>
                                <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Date</span><span className="text-gray-600 dark:text-gray-400">{new Date(viewModal.date).toLocaleDateString()}</span></div>
                            </div>
                            <button onClick={() => setViewModal(null)} className="mt-5 w-full py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Close</button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}