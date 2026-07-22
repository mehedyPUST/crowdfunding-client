'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Search, Heart, CreditCard, History, TrendingUp, HandHeart } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import StatsSkeleton from '@/app/components/StatsSkeleton';

export default function SupporterDashboardHome() {
    const { user, api } = useAuth();
    const [stats, setStats] = useState(null);

    useEffect(() => {
        api.get('/contributions/my?page=1&limit=100').then((res) => {
            const contribs = res.data.contributions;
            setStats({
                total: contribs.length,
                pending: contribs.filter((c) => c.status === 'pending').length,
                contributed: contribs.filter((c) => c.status === 'approved').reduce((sum, c) => sum + c.amount, 0),
                approved: contribs.filter((c) => c.status === 'approved').length,
            });
        }).catch(() => { });
    }, []);

    const quickActions = [
        { href: '/dashboard/supporter/explore', icon: Search, label: 'Explore Campaigns', desc: 'Discover projects to support', gradient: 'from-amber-500 to-orange-500' },
        { href: '/dashboard/supporter/my-contributions', icon: Heart, label: 'My Contributions', desc: 'Track your supported campaigns', gradient: 'from-emerald-500 to-teal-500' },
        { href: '/dashboard/supporter/purchase-credit', icon: CreditCard, label: 'Purchase Credits', desc: 'Buy credits to contribute', gradient: 'from-amber-500 to-orange-500' },
        { href: '/dashboard/supporter/payment-history', icon: History, label: 'Payment History', desc: 'View your credit purchases', gradient: 'from-emerald-500 to-teal-500' },
    ];

    const statCards = stats ? [
        { icon: Heart, label: 'Total Contributions', value: stats.total, gradient: 'from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20', border: 'border-amber-200 dark:border-amber-800', textColor: 'text-amber-600 dark:text-amber-400', iconBg: 'bg-amber-100 dark:bg-amber-900/30' },
        { icon: TrendingUp, label: 'Pending', value: stats.pending, gradient: 'from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20', border: 'border-amber-200 dark:border-amber-800', textColor: 'text-amber-600 dark:text-amber-400', iconBg: 'bg-amber-100 dark:bg-amber-900/30', highlight: true },
        { icon: CreditCard, label: 'Total Contributed', value: `${stats.contributed} 🪙`, gradient: 'from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20', border: 'border-emerald-200 dark:border-emerald-800', textColor: 'text-emerald-600 dark:text-emerald-400', iconBg: 'bg-emerald-100 dark:bg-emerald-900/30', highlight: true },
        { icon: Heart, label: 'Approved', value: stats.approved, gradient: 'from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20', border: 'border-emerald-200 dark:border-emerald-800', textColor: 'text-emerald-600 dark:text-emerald-400', iconBg: 'bg-emerald-100 dark:bg-emerald-900/30' },
    ] : [];

    const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
    const cardVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } } };

    return (
        <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Supporter Dashboard</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    Welcome back, <span className="font-medium text-gray-700 dark:text-gray-300">{user?.name}</span>! Discover and support amazing campaigns.
                </p>
            </motion.div>

            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, i) => (
                    <motion.div key={i} variants={cardVariants}>
                        <Link href={action.href} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg hover:shadow-gray-100/50 dark:hover:shadow-gray-900/30 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 group block">
                            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${action.gradient} mb-3 group-hover:scale-110 transition-transform duration-200 shadow-md`}>
                                <action.icon className="w-5 h-5 text-white" />
                            </div>
                            <p className="font-semibold text-gray-800 dark:text-gray-200">{action.label}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{action.desc}</p>
                        </Link>
                    </motion.div>
                ))}
            </motion.div>

            {!stats ? (
                <StatsSkeleton cards={4} />
            ) : (
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {statCards.map((stat, i) => (
                        <motion.div key={i} variants={cardVariants} whileHover={{ y: -4 }} className={`bg-gradient-to-br ${stat.gradient} rounded-2xl border ${stat.border} p-5 relative overflow-hidden`}>
                            <div className={`absolute -top-4 -right-4 w-20 h-20 rounded-full ${stat.iconBg} opacity-50`} />
                            <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg ${stat.iconBg} mb-3 relative`}><stat.icon className={`w-5 h-5 ${stat.textColor}`} /></div>
                            <p className={`text-sm font-medium mb-1 relative ${stat.textColor}`}>{stat.label}</p>
                            <p className={`text-2xl font-bold relative ${stat.highlight ? stat.textColor : 'text-gray-800 dark:text-gray-100'}`}>{stat.value}</p>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {stats && stats.total > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2"><HandHeart className="w-5 h-5 text-amber-500" />Your Impact</h2>
                        <Link href="/dashboard/supporter/my-contributions" className="text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium hover:underline transition-colors">View All</Link>
                    </div>
                    <div className="text-center py-6">
                        <motion.p initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 0.6, type: "spring" }} className="text-5xl font-bold text-amber-600 dark:text-amber-400 mb-2">{stats.contributed} 🪙</motion.p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Total Credits Contributed</p>
                    </div>
                </motion.div>
            )}
        </div>
    );
}