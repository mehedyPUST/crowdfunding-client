'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '../../context/AuthContext';
import {
    Mail, Shield, Coins, Calendar, Edit3, Save, X, Lock, Eye, EyeOff
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
    const { user, api } = useAuth();
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ name: '', photoURL: '' });
    const [stats, setStats] = useState(null);

    // Password change states
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
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await api.put('/auth/profile', form);
            toast.success('Profile updated!', { duration: 3000 });
            setEditing(false);
            const savedUser = JSON.parse(localStorage.getItem('user'));
            savedUser.name = res.data.user.name;
            savedUser.photoURL = res.data.user.photoURL;
            localStorage.setItem('user', JSON.stringify(savedUser));
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

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>

            {/* Profile Card */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="h-24 bg-gradient-to-r from-brand-600 via-brand-500 to-accent-600"></div>
                <div className="px-6 pb-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-10">
                        <div className="relative w-20 h-20 rounded-full border-4 border-white overflow-hidden bg-white shadow-sm">
                            <Image
                                src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.name}&background=059669&color=fff&size=80`}
                                alt={user?.name || 'User'}
                                fill
                                className="object-cover"
                                sizes="80px"
                                priority
                            />
                        </div>
                        <div className="flex-1 pt-2">
                            {editing ? (
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-500"
                                        placeholder="Name"
                                    />
                                    <input
                                        type="url"
                                        value={form.photoURL}
                                        onChange={(e) => setForm({ ...form, photoURL: e.target.value })}
                                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-500"
                                        placeholder="Photo URL"
                                    />
                                </div>
                            ) : (
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800">{user?.name}</h2>
                                    <p className="text-sm text-slate-500 capitalize">{user?.role}</p>
                                </div>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => (editing ? handleSave() : setEditing(true))}
                                disabled={saving}
                                className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition ${editing
                                    ? 'bg-brand-600 text-white hover:bg-brand-700'
                                    : 'border border-slate-300 text-slate-600 hover:bg-slate-50'
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
                            </button>
                            {editing && (
                                <button
                                    onClick={() => setEditing(false)}
                                    className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium border border-red-300 text-red-500 hover:bg-red-50"
                                >
                                    <X className="w-4 h-4" /> Cancel
                                </button>
                            )}
                            <button
                                onClick={() => setShowPasswordModal(true)}
                                className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium border border-slate-300 text-slate-600 hover:bg-slate-50"
                            >
                                <Lock className="w-4 h-4" /> Password
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-3">
                    <Mail className="w-5 h-5 text-brand-600 flex-shrink-0" />
                    <div>
                        <p className="text-xs text-slate-500">Email</p>
                        <p className="text-sm font-medium text-slate-800">{user?.email}</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-3">
                    <Shield className="w-5 h-5 text-accent-600 flex-shrink-0" />
                    <div>
                        <p className="text-xs text-slate-500">Role</p>
                        <p className="text-sm font-medium text-slate-800 capitalize">{user?.role}</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-3">
                    <Coins className="w-5 h-5 text-brand-600 flex-shrink-0" />
                    <div>
                        <p className="text-xs text-slate-500">Available Credits</p>
                        <p className="text-sm font-bold text-brand-600">🪙 {user?.credits || 0}</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-accent-600 flex-shrink-0" />
                    <div>
                        <p className="text-xs text-slate-500">Member Since</p>
                        <p className="text-sm font-medium text-slate-800">
                            {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>

            {/* Activity Summary */}
            {stats && (
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <h3 className="font-semibold text-slate-800 mb-4">Activity Summary</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {user?.role === 'creator' && (
                            <>
                                <div className="text-center p-3 bg-brand-50 rounded-lg">
                                    <p className="text-2xl font-bold text-brand-600">{stats.campaigns}</p>
                                    <p className="text-xs text-slate-500">Total Campaigns</p>
                                </div>
                                <div className="text-center p-3 bg-brand-50 rounded-lg">
                                    <p className="text-2xl font-bold text-brand-600">{stats.raised}</p>
                                    <p className="text-xs text-slate-500">Credits Raised</p>
                                </div>
                            </>
                        )}
                        {user?.role === 'supporter' && (
                            <>
                                <div className="text-center p-3 bg-brand-50 rounded-lg">
                                    <p className="text-2xl font-bold text-brand-600">{stats.contributions}</p>
                                    <p className="text-xs text-slate-500">Total Contributions</p>
                                </div>
                                <div className="text-center p-3 bg-brand-50 rounded-lg">
                                    <p className="text-2xl font-bold text-brand-600">{stats.contributed}</p>
                                    <p className="text-xs text-slate-500">Credits Contributed</p>
                                </div>
                            </>
                        )}
                        {user?.role === 'admin' && (
                            <div className="text-center p-3 bg-brand-50 rounded-lg">
                                <p className="text-2xl font-bold text-brand-600">{stats.totalUsers}</p>
                                <p className="text-xs text-slate-500">Total Users</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Password Change Modal */}
            {showPasswordModal && (
                <div
                    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                    onClick={() => setShowPasswordModal(false)}
                >
                    <div
                        className="bg-white rounded-xl max-w-md w-full p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Change Password</h3>
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Current Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showCurrent ? 'text' : 'password'}
                                        required
                                        value={passwordForm.currentPassword}
                                        onChange={(e) =>
                                            setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-500 pr-10"
                                        placeholder="Enter current password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrent(!showCurrent)}
                                        className="absolute right-3 top-2.5 text-slate-400"
                                    >
                                        {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    New Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showNew ? 'text' : 'password'}
                                        required
                                        value={passwordForm.newPassword}
                                        onChange={(e) =>
                                            setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-500 pr-10"
                                        placeholder="Min 6 characters"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNew(!showNew)}
                                        className="absolute right-3 top-2.5 text-slate-400"
                                    >
                                        {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordModal(false)}
                                    className="flex-1 py-2 border border-slate-300 rounded-lg text-sm font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={changingPassword}
                                    className="flex-1 py-2 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700 disabled:opacity-50"
                                >
                                    {changingPassword ? 'Changing...' : 'Change Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}