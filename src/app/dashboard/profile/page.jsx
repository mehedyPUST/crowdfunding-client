'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '../../context/AuthContext';
import {
    Mail, Shield, Coins, Calendar, Edit3, Save, X, Lock, Eye, EyeOff, User
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileSkeleton from '@/app/components/ProfileSkeleton';

export default function ProfilePage() {
    const { user, api } = useAuth();
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ name: '', photoURL: '' });
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
    const [changingPassword, setChangingPassword] = useState(false);

    useEffect(() => {
        if (user) {
            setForm({ name: user.name || '', photoURL: user.photoURL || '' });
            fetchStats();
        }
    }, [user]);

    const fetchStats = async () => {
        try {
            if (user.role === 'creator') {
                const res = await api.get('/campaigns/my');
                const campaigns = res.data;
                setStats({
                    campaigns: campaigns.length,
                    raised: campaigns.reduce((sum, c) => sum + (c.raisedAmount || 0), 0),
                });
            } else if (user.role === 'supporter') {
                const res = await api.get('/contributions/my?page=1&limit=100');
                setStats({
                    contributions: res.data.total,
                    contributed: res.data.contributions
                        .filter((c) => c.status === 'approved')
                        .reduce((sum, c) => sum + c.amount, 0),
                });
            } else if (user.role === 'admin') {
                const res = await api.get('/auth/users');
                setStats({ totalUsers: res.data.length });
            }
        } catch { }
        finally { setLoading(false); }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.put('/auth/profile', form);
            toast.success('Profile updated!', { duration: 3000 });
            setEditing(false);
            setTimeout(() => {
                window.location.reload();
            }, 500);
        } catch {
            toast.error('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordForm.newPassword.length < 6)
            return toast.error('Password must be at least 6 characters');
        setChangingPassword(true);
        try {
            await api.put('/auth/change-password', passwordForm);
            toast.success('Password changed!');
            setShowPasswordModal(false);
            setPasswordForm({ currentPassword: '', newPassword: '' });
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to change password');
        } finally {
            setChangingPassword(false);
        }
    };

    const inputClasses = "w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 transition-all";

    const infoCards = [
        { icon: Mail, label: 'Email', value: user?.email, color: 'text-amber-500', bg: 'bg-amber-50' },
        { icon: Shield, label: 'Role', value: user?.role, color: 'text-emerald-500', bg: 'bg-emerald-50', capitalize: true },
        { icon: Coins, label: 'Available Credits', value: `🪙 ${user?.credits || 0}`, color: 'text-amber-500', bg: 'bg-amber-50', bold: true },
        { icon: Calendar, label: 'Member Since', value: new Date(user?.createdAt || Date.now()).toLocaleDateString(), color: 'text-emerald-500', bg: 'bg-emerald-50' },
    ];

    if (loading) {
        return <ProfileSkeleton />;
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <User className="w-6 h-6 text-amber-500" />
                    My Profile
                </h1>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm"
            >
                <div className="h-28 bg-gradient-to-r from-amber-500 via-orange-400 to-amber-500"></div>
                <div className="px-6 pb-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12">
                        <div className="relative w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-white shadow-md">
                            <Image
                                src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.name}&background=f59e0b&color=fff&size=96`}
                                alt={user?.name || 'User'}
                                fill
                                className="object-cover"
                                sizes="96px"
                                priority
                            />
                        </div>
                        <div className="flex-1 pt-3">
                            {editing ? (
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        className={inputClasses}
                                        placeholder="Name"
                                    />
                                    <input
                                        type="url"
                                        value={form.photoURL}
                                        onChange={(e) => setForm({ ...form, photoURL: e.target.value })}
                                        className={inputClasses}
                                        placeholder="Photo URL"
                                    />
                                </div>
                            ) : (
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">{user?.name}</h2>
                                    <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
                                </div>
                            )}
                        </div>
                        <div className="flex gap-2 pt-2 sm:pt-0">
                            <motion.button
                                onClick={() => (editing ? handleSave() : setEditing(true))}
                                disabled={saving}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${editing
                                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-200'
                                        : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                {editing ? (
                                    <>
                                        <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}
                                    </>
                                ) : (
                                    <>
                                        <Edit3 className="w-4 h-4" /> Edit
                                    </>
                                )}
                            </motion.button>
                            {editing && (
                                <button
                                    onClick={() => setEditing(false)}
                                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium border border-rose-300 text-rose-500 hover:bg-rose-50 transition-colors"
                                >
                                    <X className="w-4 h-4" /> Cancel
                                </button>
                            )}
                            <button
                                onClick={() => setShowPasswordModal(true)}
                                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                <Lock className="w-4 h-4" /> Password
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
                {infoCards.map((card, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4 hover:shadow-sm transition-shadow">
                        <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center flex-shrink-0`}>
                            <card.icon className={`w-5 h-5 ${card.color}`} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">{card.label}</p>
                            <p className={`text-sm ${card.bold ? 'font-bold text-amber-600' : 'font-medium text-gray-800'} ${card.capitalize ? 'capitalize' : ''}`}>
                                {card.value}
                            </p>
                        </div>
                    </div>
                ))}
            </motion.div>

            {stats && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
                >
                    <h3 className="font-semibold text-gray-800 mb-4">Activity Summary</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {user?.role === 'creator' && (
                            <>
                                <div className="text-center p-4 bg-amber-50 rounded-xl border border-amber-100">
                                    <p className="text-3xl font-bold text-amber-600">{stats.campaigns}</p>
                                    <p className="text-xs text-gray-500 mt-1">Total Campaigns</p>
                                </div>
                                <div className="text-center p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                    <p className="text-3xl font-bold text-emerald-600">{stats.raised} 🪙</p>
                                    <p className="text-xs text-gray-500 mt-1">Credits Raised</p>
                                </div>
                            </>
                        )}
                        {user?.role === 'supporter' && (
                            <>
                                <div className="text-center p-4 bg-amber-50 rounded-xl border border-amber-100">
                                    <p className="text-3xl font-bold text-amber-600">{stats.contributions}</p>
                                    <p className="text-xs text-gray-500 mt-1">Total Contributions</p>
                                </div>
                                <div className="text-center p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                    <p className="text-3xl font-bold text-emerald-600">{stats.contributed} 🪙</p>
                                    <p className="text-xs text-gray-500 mt-1">Credits Contributed</p>
                                </div>
                            </>
                        )}
                        {user?.role === 'admin' && (
                            <div className="text-center p-4 bg-amber-50 rounded-xl border border-amber-100 col-span-2">
                                <p className="text-3xl font-bold text-amber-600">{stats.totalUsers}</p>
                                <p className="text-xs text-gray-500 mt-1">Total Users</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}

            <AnimatePresence>
                {showPasswordModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowPasswordModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-gray-800">Change Password</h3>
                                <button
                                    onClick={() => setShowPasswordModal(false)}
                                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <form onSubmit={handlePasswordChange} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Current Password</label>
                                    <div className="relative">
                                        <input
                                            type={showCurrent ? 'text' : 'password'}
                                            required
                                            value={passwordForm.currentPassword}
                                            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                            className={`${inputClasses} pr-10`}
                                            placeholder="Enter current password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrent(!showCurrent)}
                                            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                                        >
                                            {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">New Password</label>
                                    <div className="relative">
                                        <input
                                            type={showNew ? 'text' : 'password'}
                                            required
                                            value={passwordForm.newPassword}
                                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                            className={`${inputClasses} pr-10`}
                                            placeholder="Min 6 characters"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNew(!showNew)}
                                            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                                        >
                                            {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-1">
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswordModal(false)}
                                        className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <motion.button
                                        type="submit"
                                        disabled={changingPassword}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-sm font-semibold shadow-md shadow-amber-200 hover:shadow-lg hover:shadow-amber-200/60 disabled:opacity-50 transition-all"
                                    >
                                        {changingPassword ? 'Changing...' : 'Change Password'}
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}