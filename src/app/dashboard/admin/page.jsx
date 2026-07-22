'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, Rocket, Coins, CreditCard, UserCheck, FileText, Shield } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import StatsSkeleton from '@/app/components/StatsSkeleton';

export default function AdminDashboardHome() {
    const { user, api } = useAuth();
    const [stats, setStats] = useState(null);

    useEffect(() => {
        Promise.all([
            api.get('/auth/users?role=supporter'),
            api.get('/auth/users?role=creator'),
            api.get('/auth/users'),
        ]).then(([supRes, creRes, allRes]) => {
            const allUsers = allRes.data;
            setStats({
                supporters: supRes.data.length,
                creators: creRes.data.length,
                totalCredits: allUsers.reduce((sum, u) => sum + (u.credits || 0), 0),
                totalUsers: allUsers.length,
            });
        }).catch(() => { });
    }, []);

    const quickActions = [
        { href: '/dashboard/admin/manage-users', icon: UserCheck, label: 'Manage Users', desc: 'View, edit roles, remove users', gradient: 'from-amber-500 to-orange-500' },
        { href: '/dashboard/admin/manage-campaigns', icon: FileText, label: 'Manage Campaigns', desc: 'Approve, reject, delete campaigns', gradient: 'from-emerald-500 to-teal-500' },
        { href: '/dashboard/admin/withdrawal-requests', icon: Coins, label: 'Withdrawal Requests', desc: 'Process creator payouts', gradient: 'from-amber-500 to-orange-500' },
        { href: '/dashboard/admin/reports', icon: Rocket, label: 'Reports', desc: 'View reported campaigns', gradient: 'from-emerald-500 to-teal-500' },
    ];

    const statCards = stats ? [
        { icon: Users, label: 'Total Supporters', value: stats.supporters, gradient: 'from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20', border: 'border-amber-200 dark:border-amber-800', textColor: 'text-amber-600 dark:text-amber-400', iconBg: 'bg-amber-100 dark:bg-amber-900/30' },
        { icon: Users, label: 'Total Creators', value: stats.creators, gradient: 'from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20', border: 'border-emerald-200 dark:border-emerald-800', textColor: 'text-emerald-600 dark:text-emerald-400', iconBg: 'bg-emerald-100 dark:bg-emerald-900/30' },
        { icon: Coins, label: 'Credits in System', value: stats.totalCredits, gradient: 'from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20', border: 'border-amber-200 dark:border-amber-800', textColor: 'text-amber-600 dark:text-amber-400', iconBg: 'bg-amber-100 dark:bg-amber-900/30', highlight: true },
        { icon: CreditCard, label: 'Total Users', value: stats.totalUsers, gradient: 'from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20', border: 'border-emerald-200 dark:border-emerald-800', textColor: 'text-emerald-600 dark:text-emerald-400', iconBg: 'bg-emerald-100 dark:bg-emerald-900/30' },
    ] : [];

    const containerVariants = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.08 } },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    <Shield className="w-6 h-6 text-amber-500" />
                    Admin Dashboard
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    Welcome back, <span className="font-medium text-gray-700 dark:text-gray-300">{user?.name}</span>! Manage the platform from here.
                </p>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
                {quickActions.map((action, i) => (
                    <motion.div key={i} variants={cardVariants}>
                        <Link
                            href={action.href}
                            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg hover:shadow-gray-100/50 dark:hover:shadow-gray-900/30 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 group block"
                        >
                            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${action.gradient} mb-3 group-hover:scale-110 transition-transform duration-200 shadow-md`}>
                                <action.icon className="w-5 h-5 text-white" />
                            </div>
                            <p className="font-semibold text-gray-800 dark:text-gray-200">{action.label}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{action.desc}</p>
                        </Link>
                    </motion.div>
                ))}
            </motion.div>

            {/* Stats */}
            {!stats ? (
                <StatsSkeleton cards={4} />
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                >
                    {statCards.map((stat, i) => (
                        <motion.div
                            key={i}
                            variants={cardVariants}
                            whileHover={{ y: -4 }}
                            className={`bg-gradient-to-br ${stat.gradient} rounded-2xl border ${stat.border} p-5 relative overflow-hidden`}
                        >
                            <div className={`absolute -top-4 -right-4 w-20 h-20 rounded-full ${stat.iconBg} opacity-50`} />
                            <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg ${stat.iconBg} mb-3 relative`}>
                                <stat.icon className={`w-5 h-5 ${stat.textColor}`} />
                            </div>
                            <p className={`text-sm font-medium mb-1 relative ${stat.textColor}`}>{stat.label}</p>
                            <p className={`text-3xl font-bold relative ${stat.highlight ? stat.textColor : 'text-gray-800 dark:text-gray-100'}`}>
                                {stat.value}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
}