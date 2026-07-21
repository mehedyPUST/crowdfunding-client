'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { Check } from 'lucide-react';
import toast from 'react-hot-toast';

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
        return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div></div>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-6">Withdrawal Requests</h1>

            {requests.length === 0 ? (
                <p className="text-slate-500 text-center py-12">No pending withdrawal requests.</p>
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="text-left px-4 py-3">Creator</th>
                                <th className="text-left px-4 py-3">Credits</th>
                                <th className="text-left px-4 py-3">Amount</th>
                                <th className="text-left px-4 py-3">Method</th>
                                <th className="text-left px-4 py-3">Account</th>
                                <th className="text-left px-4 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {requests.map((r) => (
                                <tr key={r._id}>
                                    <td className="px-4 py-3 font-medium">{r.creatorName}</td>
                                    <td className="px-4 py-3">{r.withdrawalCredits}</td>
                                    <td className="px-4 py-3 text-brand-600 font-medium">${r.withdrawalAmount}</td>
                                    <td className="px-4 py-3">{r.paymentSystem}</td>
                                    <td className="px-4 py-3 text-xs">{r.accountNumber}</td>
                                    <td className="px-4 py-3">
                                        <button onClick={() => handleApprove(r._id)} className="bg-brand-600 text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-brand-700 flex items-center gap-1">
                                            <Check className="w-3 h-3" /> Payment Sent
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}