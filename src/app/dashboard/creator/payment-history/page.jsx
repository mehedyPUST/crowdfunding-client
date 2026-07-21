'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useState, useEffect } from 'react';


export default function PaymentHistoryPage() {
    const { api, user } = useAuth();
    const [payments, setPayments] = useState([]);
    const [withdrawals, setWithdrawals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (user?.role === 'supporter') {
                    const res = await api.get('/payments/history');
                    setPayments(res.data);
                } else if (user?.role === 'creator') {
                    const res = await api.get('/withdrawals/my');
                    setWithdrawals(res.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-6">Payment History</h1>

            {user?.role === 'supporter' && (
                <>
                    {payments.length === 0 ? (
                        <p className="text-slate-500 text-center py-12">No payments yet.</p>
                    ) : (
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="text-left px-4 py-3 font-medium text-slate-600">Date</th>
                                        <th className="text-left px-4 py-3 font-medium text-slate-600">Package</th>
                                        <th className="text-left px-4 py-3 font-medium text-slate-600">Credits</th>
                                        <th className="text-left px-4 py-3 font-medium text-slate-600">Amount</th>
                                        <th className="text-left px-4 py-3 font-medium text-slate-600 hidden sm:table-cell">Transaction ID</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {payments.map((p, i) => (
                                        <tr key={i} className="hover:bg-slate-50">
                                            <td className="px-4 py-3 text-xs">{new Date(p.date).toLocaleDateString()}</td>
                                            <td className="px-4 py-3">{p.credits} Credits</td>
                                            <td className="px-4 py-3 font-medium">{p.credits}</td>
                                            <td className="px-4 py-3 text-brand-600 font-medium">${p.amount}</td>
                                            <td className="px-4 py-3 text-xs text-slate-400 hidden sm:table-cell truncate max-w-[100px]">{p.paymentIntentId}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}

            {user?.role === 'creator' && (
                <>
                    {withdrawals.length === 0 ? (
                        <p className="text-slate-500 text-center py-12">No withdrawals yet.</p>
                    ) : (
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="text-left px-4 py-3 font-medium text-slate-600">Date</th>
                                        <th className="text-left px-4 py-3 font-medium text-slate-600">Credits</th>
                                        <th className="text-left px-4 py-3 font-medium text-slate-600">Amount</th>
                                        <th className="text-left px-4 py-3 font-medium text-slate-600">Method</th>
                                        <th className="text-left px-4 py-3 font-medium text-slate-600">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {withdrawals.map((w, i) => (
                                        <tr key={i} className="hover:bg-slate-50">
                                            <td className="px-4 py-3 text-xs">{new Date(w.requestDate).toLocaleDateString()}</td>
                                            <td className="px-4 py-3">{w.withdrawalCredits}</td>
                                            <td className="px-4 py-3 text-brand-600 font-medium">${w.withdrawalAmount}</td>
                                            <td className="px-4 py-3">{w.paymentSystem}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${w.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {w.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}