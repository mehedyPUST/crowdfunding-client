'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function WithdrawalsPage() {
    const { api } = useAuth();
    const [raised, setRaised] = useState(0);
    const [withdrawals, setWithdrawals] = useState([]);
    const [form, setForm] = useState({
        withdrawalCredits: '',
        withdrawalAmount: '',
        paymentSystem: 'Stripe',
        accountNumber: '',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [campRes, withRes] = await Promise.all([
                api.get('/campaigns/my'),
                api.get('/withdrawals/my'),
            ]);
            const total = campRes.data.reduce((sum, c) => sum + (c.raisedAmount || 0), 0);
            setRaised(total);
            setWithdrawals(withRes.data);
        } catch {
            toast.error('Failed to load data');
        }
    };

    const handleCreditsChange = (value) => {
        const credits = Number(value);
        setForm({
            ...form,
            withdrawalCredits: value,
            withdrawalAmount: credits ? (credits / 20).toFixed(2) : '',
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (raised < 200) return toast.error('Minimum 200 credits required');
        if (Number(form.withdrawalCredits) > raised) return toast.error('Insufficient credits');
        try {
            await api.post('/withdrawals', form);
            toast.success('Withdrawal request submitted!');
            fetchData();
            setForm({ withdrawalCredits: '', withdrawalAmount: '', paymentSystem: 'Stripe', accountNumber: '' });
        } catch (err) {
            toast.error(err.response?.data?.error || 'Withdrawal failed');
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <h1 className="text-2xl font-bold text-slate-800">Withdrawals</h1>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <p className="text-sm text-slate-500 mb-1">Total Raised Credits</p>
                    <p className="text-2xl font-bold text-brand-600">{raised}</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <p className="text-sm text-slate-500 mb-1">Withdrawal Amount ($)</p>
                    <p className="text-2xl font-bold text-slate-800">${(raised / 20).toFixed(2)}</p>
                    <p className="text-xs text-slate-400 mt-1">20 Credits = $1</p>
                </div>
            </div>

            {/* Withdrawal Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                <h2 className="font-semibold text-slate-800">Request Withdrawal</h2>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Credits to Withdraw</label>
                    <input
                        type="number"
                        required
                        min="200"
                        max={raised}
                        value={form.withdrawalCredits}
                        onChange={(e) => handleCreditsChange(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-500"
                        placeholder="Minimum 200 credits"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Withdrawal Amount ($)</label>
                    <input
                        type="text"
                        value={`$${form.withdrawalAmount || '0.00'}`}
                        readOnly
                        className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-lg text-sm text-slate-600"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Payment System</label>
                    <select
                        value={form.paymentSystem}
                        onChange={(e) => setForm({ ...form, paymentSystem: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-500"
                    >
                        <option value="Stripe">Stripe</option>
                        <option value="Bkash">Bkash</option>
                        <option value="Rocket">Rocket</option>
                        <option value="Nagad">Nagad</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Account Number</label>
                    <input
                        type="text"
                        required
                        value={form.accountNumber}
                        onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-500"
                        placeholder="Enter account number"
                    />
                </div>

                {raised >= 200 ? (
                    <button type="submit" className="w-full bg-brand-600 text-white py-2.5 rounded-lg font-semibold hover:bg-brand-700 transition text-sm">
                        Withdraw
                    </button>
                ) : (
                    <p className="text-center text-red-500 font-medium text-sm">Insufficient credit</p>
                )}
            </form>

            {/* Payment History */}
            <div>
                <h2 className="font-semibold text-slate-800 mb-3">Payment History</h2>
                {withdrawals.length === 0 ? (
                    <p className="text-slate-500 text-sm">No withdrawals yet.</p>
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
                                        <td className="px-4 py-3">{new Date(w.requestDate).toLocaleDateString()}</td>
                                        <td className="px-4 py-3">{w.withdrawalCredits}</td>
                                        <td className="px-4 py-3">${w.withdrawalAmount}</td>
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
            </div>
        </div>
    );
}