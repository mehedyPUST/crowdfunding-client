'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/app/context/AuthContext';
import { Trash2, Edit3, Users, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import TableRowSkeleton from '@/app/components/TableRowSkeleton';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function ManageUsersPage() {
    const { api } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState(null);
    const [newRole, setNewRole] = useState('');

    const fetchUsers = async () => {
        try {
            const res = await api.get('/auth/users');
            setUsers(res.data);
        } catch {
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm('Delete this user?')) return;
        try {
            await api.delete(`/admin/users/${id}`);
            toast.success('User deleted');
            fetchUsers();
        } catch {
            toast.error('Delete failed');
        }
    };

    const handleRoleUpdate = async () => {
        if (!newRole) return;
        try {
            await api.patch(`/admin/users/${editingUser._id}/role`, { role: newRole });
            toast.success('Role updated');
            setEditingUser(null);
            fetchUsers();
        } catch {
            toast.error('Update failed');
        }
    };

    const roleBadgeColors = {
        admin: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
        creator: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
        supporter: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
    };

    if (loading) {
        return (
            <div>
                <Skeleton width={240} height={32} className="mb-6" baseColor="#e5e7eb" highlightColor="#f3f4f6" />
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <TableRowSkeleton cols={5} rows={8} />
                </div>
            </div>
        );
    }

    const rowVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: (i) => ({
            opacity: 1,
            x: 0,
            transition: { delay: i * 0.04, duration: 0.3 }
        }),
    };

    return (
        <div>
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-6"
            >
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    <Users className="w-6 h-6 text-amber-500" />
                    Manage Users
                </h1>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm"
            >
                <table className="w-full text-sm">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-700/30 border-b border-gray-200 dark:border-gray-700">
                        <tr>
                            <th className="text-left px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400">User</th>
                            <th className="text-left px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400 hidden sm:table-cell">Email</th>
                            <th className="text-left px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400">Role</th>
                            <th className="text-left px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400">Credits</th>
                            <th className="text-left px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {users.map((u, i) => (
                            <motion.tr
                                key={u._id}
                                variants={rowVariants}
                                initial="hidden"
                                animate="visible"
                                custom={i}
                                className="hover:bg-amber-50/30 dark:hover:bg-amber-900/10 transition-colors"
                            >
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-gray-200 dark:ring-gray-600">
                                            <Image
                                                src={u.photoURL || 'https://ui-avatars.com/api/?name=' + u.name}
                                                alt={u.name}
                                                fill
                                                className="object-cover"
                                                sizes="36px"
                                            />
                                        </div>
                                        <span className="font-medium text-gray-800 dark:text-gray-200 truncate max-w-[80px]">{u.name}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-gray-500 dark:text-gray-400 hidden sm:table-cell truncate max-w-[150px]">{u.email}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${roleBadgeColors[u.role] || 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">{u.credits || 0} 🪙</td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-1">
                                        <motion.button
                                            onClick={() => { setEditingUser(u); setNewRole(u.role); }}
                                            whileHover={{ scale: 1.15 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="p-2 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
                                            title="Edit role"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                        </motion.button>
                                        <motion.button
                                            onClick={() => handleDelete(u._id)}
                                            whileHover={{ scale: 1.15 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                                            title="Delete user"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </motion.button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </motion.div>

            <AnimatePresence>
                {editingUser && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setEditingUser(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-gray-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-700"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Update Role</h2>
                                <button
                                    onClick={() => setEditingUser(null)}
                                    className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                                    <Image
                                        src={editingUser.photoURL || 'https://ui-avatars.com/api/?name=' + editingUser.name}
                                        alt={editingUser.name}
                                        fill
                                        className="object-cover"
                                        sizes="40px"
                                    />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800 dark:text-gray-200 text-sm">{editingUser.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[180px]">{editingUser.email}</p>
                                </div>
                            </div>

                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">Select Role</label>
                            <select
                                value={newRole}
                                onChange={(e) => setNewRole(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-300 dark:focus:ring-amber-600 focus:border-amber-400 dark:focus:border-amber-500 transition-all mb-5 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                            >
                                <option value="supporter">Supporter</option>
                                <option value="creator">Creator</option>
                                <option value="admin">Admin</option>
                            </select>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setEditingUser(null)}
                                    className="flex-1 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <motion.button
                                    onClick={handleRoleUpdate}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-amber-200 dark:shadow-amber-900/30 hover:shadow-lg hover:shadow-amber-200/60 dark:hover:shadow-amber-900/40 transition-all"
                                >
                                    Save Changes
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}