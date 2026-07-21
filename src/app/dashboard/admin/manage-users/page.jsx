'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/app/context/AuthContext';
import { Trash2, Edit3 } from 'lucide-react';
import toast from 'react-hot-toast';

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

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-6">Manage Users</h1>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="text-left px-4 py-3 font-medium text-slate-600">User</th>
                            <th className="text-left px-4 py-3 font-medium text-slate-600 hidden sm:table-cell">Email</th>
                            <th className="text-left px-4 py-3 font-medium text-slate-600">Role</th>
                            <th className="text-left px-4 py-3 font-medium text-slate-600">Credits</th>
                            <th className="text-left px-4 py-3 font-medium text-slate-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {users.map((u) => (
                            <tr key={u._id} className="hover:bg-slate-50">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                                            <Image src={u.photoURL || 'https://ui-avatars.com/api/?name=' + u.name} alt={u.name} fill className="object-cover" sizes="32px" />
                                        </div>
                                        <span className="font-medium text-slate-800 truncate max-w-[80px]">{u.name}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-slate-500 hidden sm:table-cell truncate max-w-[150px]">{u.email}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                        u.role === 'creator' ? 'bg-blue-100 text-blue-700' :
                                            'bg-green-100 text-green-700'
                                        }`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="px-4 py-3">{u.credits || 0}</td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-2">
                                        <button onClick={() => { setEditingUser(u); setNewRole(u.role); }} className="text-accent-600 hover:text-accent-700">
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(u._id)} className="text-red-500 hover:text-red-600">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit Role Modal */}
            {editingUser && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-sm w-full p-6">
                        <h2 className="text-lg font-bold text-slate-800 mb-4">Update Role: {editingUser.name}</h2>
                        <select value={newRole} onChange={(e) => setNewRole(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-500 mb-4">
                            <option value="supporter">Supporter</option>
                            <option value="creator">Creator</option>
                            <option value="admin">Admin</option>
                        </select>
                        <div className="flex gap-3">
                            <button onClick={() => setEditingUser(null)} className="flex-1 py-2 border border-slate-300 rounded-lg text-sm font-medium">Cancel</button>
                            <button onClick={handleRoleUpdate} className="flex-1 py-2 bg-brand-600 text-white rounded-lg text-sm font-semibold">Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}