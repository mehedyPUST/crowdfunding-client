'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';
import { Wallet, DollarSign, Info } from 'lucide-react';
import { motion } from 'framer-motion';

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
        if (raised < 200) return toast.error('Minimum 200 credits required to withdraw');
        if (Number(form.withdrawalCredits) > raised) return toast.error('Insufficient raised credits');
        if (Number(form.withdrawalCredits) < 200) return toast.error('Minimum withdrawal is 200 credits');
        if (!form.accountNumber) return toast.error('Account number is required');

        try {
            await api.post('/withdrawals', form);
            toast.success('Withdrawal request submitted!');
            fetchData();
            setForm({ withdrawalCredits: '', withdrawalAmount: '', paymentSystem: 'Stripe', accountNumber: '' });
        } catch (err) {
            toast.error(err.response?.data?.error || 'Withdrawal failed');
        }
    };

    const inputClasses = "w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 transition-all";

    const statusBadge = (status) => ({
        approved: 'bg-emerald-100 text-emerald-700',
        pending: 'bg-amber-100 text-amber-700',
    }[status] || 'bg-gray-100 text-gray-700');

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Wallet className="w-6 h-6 text-amber-500" />
                    Withdrawals
                </h1>
            </motion.div>

            {/* Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
                <div className="bg-gradient-to-br from-amber-50 to-white rounded-2xl border border-amber-200 p-6">
                    <p className="text-sm text-amber-600 font-medium mb-1">Total Raised Credits</p>
                    <p className="text-3xl font-bold text-gray-800">{raised} 🪙</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl border border-emerald-200 p-6">
                    <p className="text-sm text-emerald-600 font-medium mb-1">Available for Withdrawal</p>
                    <p className="text-3xl font-bold text-gray-800">${(raised / 20).toFixed(2)}</p>
                    <p className="text-xs text-gray-400 mt-1">20 Credits = $1 | Min 200 Credits ($10)</p>
                </div>
            </motion.div>

            {/* Withdrawal Form */}
            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-sm"
            >
                <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-amber-500" />
                    Request Withdrawal
                </h2>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Credits to Withdraw</label>
                    <input
                        type="number"
                        required
                        min="200"
                        max={raised}
                        value={form.withdrawalCredits}
                        onChange={(e) => handleCreditsChange(e.target.value)}
                        className={inputClasses}
                        placeholder="Minimum 200 credits"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Withdrawal Amount ($)</label>
                    <input
                        type="text"
                        value={`$${form.withdrawalAmount || '0.00'}`}
                        readOnly
                        className="w-full px-4 py-2.5 border border-gray-200 bg-gray-50 rounded-xl text-sm text-gray-600"
                    />
                    <p className="text-xs text-gray-400 mt-1">20 Credits = $1 (auto-calculated)</p>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Payment System</label>
                    <select
                        value={form.paymentSystem}
                        onChange={(e) => setForm({ ...form, paymentSystem: e.target.value })}
                        className={inputClasses}
                    >
                        <option value="Stripe">Stripe</option>
                        <option value="Bkash">Bkash</option>
                        <option value="Rocket">Rocket</option>
                        <option value="Nagad">Nagad</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Account Number</label>
                    <input
                        type="text"
                        required
                        value={form.accountNumber}
                        onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
                        className={inputClasses}
                        placeholder="Enter account number"
                    />
                </div>

                {raised >= 200 ? (
                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all text-sm shadow-md shadow-amber-200/50"
                    >
                        Withdraw
                    </motion.button>
                ) : (
                    <div className="text-center text-rose-600 font-medium text-sm py-3 bg-rose-50 rounded-xl flex items-center justify-center gap-2">
                        <Info className="w-4 h-4" />
                        Insufficient credit — Minimum 200 credits ($10) required
                    </div>
                )}
            </motion.form>

            {/* History */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
            >
                <h2 className="font-semibold text-gray-800 mb-3">Payment History</h2>
                {withdrawals.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
                        <p className="text-gray-400 text-sm">No withdrawals yet.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                        <table className="w-full text-sm">
                            <thead className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
                                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Credits</th>
                                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Amount</th>
                                    <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Method</th>
                                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {withdrawals.map((w, i) => (
                                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-4 py-3 text-xs text-gray-600">{new Date(w.requestDate).toLocaleDateString()}</td>
                                        <td className="px-4 py-3 text-gray-700">{w.withdrawalCredits} 🪙</td>
                                        <td className="px-4 py-3 text-emerald-600 font-semibold">${w.withdrawalAmount}</td>
                                        <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{w.paymentSystem}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusBadge(w.status)}`}>
                                                {w.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </motion.div>
        </div>
    );
}