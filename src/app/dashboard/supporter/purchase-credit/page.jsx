'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { Coins, Check, Sparkles, Zap, Shield, ArrowRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { fireConfetti } from '@/utils/confetti';

const packages = [
    { id: '100', credits: 100, price: 10, popular: false, bonus: 0, gradient: 'from-amber-400 to-orange-400' },
    { id: '300', credits: 300, price: 25, popular: true, bonus: 20, gradient: 'from-amber-500 to-orange-500' },
    { id: '800', credits: 800, price: 60, popular: false, bonus: 50, gradient: 'from-emerald-400 to-teal-400' },
    { id: '1500', credits: 1500, price: 110, popular: false, bonus: 100, gradient: 'from-emerald-500 to-teal-500' },
];

function PurchaseContent() {
    const { user, api } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(null);
    const [verifying, setVerifying] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        const sessionId = searchParams.get('session_id');
        const status = searchParams.get('status');

        if (status === 'success' && sessionId && !verifying) {
            setVerifying(true);
            const pkgId = localStorage.getItem('pendingPackage');
            if (!pkgId) { toast.error('No pending payment found'); router.replace('/dashboard/supporter/purchase-credit'); return; }

            api.post('/payments/confirm', { paymentIntentId: sessionId, packageId: pkgId })
                .then((res) => {
                    localStorage.removeItem('pendingPackage');
                    fireConfetti();
                    if (res.data.alreadyCredited) toast.success('Credits already added!');
                    else toast.success(`${res.data.addedCredits} credits added!`);
                    setSuccessMessage({ credits: res.data.addedCredits || packages.find(p => p.id === pkgId)?.credits || 0, newBalance: res.data.credits });
                    setTimeout(() => { window.location.href = '/dashboard/supporter/purchase-credit'; }, 2000);
                })
                .catch((err) => { toast.error(err.response?.data?.error || 'Payment verification failed'); localStorage.removeItem('pendingPackage'); router.replace('/dashboard/supporter/purchase-credit'); })
                .finally(() => setVerifying(false));
        }
        if (status === 'cancelled') { toast.error('Payment cancelled'); localStorage.removeItem('pendingPackage'); router.replace('/dashboard/supporter/purchase-credit'); }
        if (!status && !sessionId && searchParams.toString()) { router.replace('/dashboard/supporter/purchase-credit'); }
    }, [searchParams]);

    const handlePayment = async (pkg) => {
        setLoading(pkg.id);
        localStorage.setItem('pendingPackage', pkg.id);
        try {
            const res = await api.post('/payments/create-checkout', { packageId: pkg.id });
            window.location.href = res.data.url;
        } catch (err) { toast.error('Failed to initialize payment'); setLoading(null); localStorage.removeItem('pendingPackage'); }
    };

    const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
    const cardVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } } };

    if (verifying) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 text-amber-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 font-medium">Verifying your payment...</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Please wait a moment</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Purchase Credits</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Buy credits to support campaigns you believe in</p>
                </div>
                <div className="flex items-center gap-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl px-5 py-3 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                        <Coins className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div><p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Your Balance</p><p className="text-xl font-bold text-amber-700 dark:text-amber-400">🪙 {user?.credits || 0}</p></div>
                </div>
            </motion.div>

            {successMessage && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center"><Check className="w-6 h-6 text-emerald-600 dark:text-emerald-400" /></div>
                        <div><h3 className="font-bold text-gray-800 dark:text-gray-100">Payment Successful!</h3><p className="text-sm text-gray-600 dark:text-gray-400">{successMessage.credits} credits added. New balance: 🪙 {successMessage.newBalance}</p></div>
                    </div>
                </motion.div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                    { icon: Zap, text: 'Instant Delivery', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
                    { icon: Shield, text: 'Secure Payment', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
                    { icon: Sparkles, text: 'Bonus Credits', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
                ].map((f, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3.5 hover:shadow-sm transition-shadow">
                        <div className={`w-9 h-9 rounded-lg ${f.bg} flex items-center justify-center`}><f.icon className={`w-5 h-5 ${f.color}`} /></div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{f.text}</span>
                    </div>
                ))}
            </div>

            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {packages.map((pkg) => (
                    <motion.div key={pkg.id} variants={cardVariants} whileHover={loading ? {} : { y: -6 }} onClick={() => !loading && handlePayment(pkg)} className={`relative bg-white dark:bg-gray-800 rounded-2xl border-2 p-6 transition-all cursor-pointer ${pkg.popular ? 'border-amber-400 dark:border-amber-500 shadow-lg shadow-amber-100/50 dark:shadow-amber-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-600 hover:shadow-xl'} ${loading === pkg.id ? 'opacity-70 pointer-events-none' : ''}`}>
                        {pkg.popular && <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">MOST POPULAR</div>}
                        {pkg.bonus > 0 && <div className="absolute -top-3 right-3 bg-emerald-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow-md">+{pkg.bonus} BONUS</div>}
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${pkg.gradient} flex items-center justify-center mb-4 shadow-lg`}><Coins className="w-6 h-6 text-white" /></div>
                        <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{pkg.credits}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Credits</p>
                        {pkg.bonus > 0 && <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mb-2">+{pkg.bonus} bonus credits</p>}
                        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700"><p className="text-2xl font-bold text-gray-800 dark:text-gray-100">${pkg.price}</p><p className="text-xs text-gray-400 dark:text-gray-500">one-time payment</p></div>
                        <div className={`mt-4 w-full py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${pkg.popular ? 'bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 text-white shadow-md hover:shadow-lg' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                            {loading === pkg.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><>Buy Now <ArrowRight className="w-4 h-4" /></></>}
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">💳 <span className="font-medium">Test Card:</span> 4242 4242 4242 4242 | Any future date | Any 3-digit CVC</p>
            </div>
        </div>
    );
}

export default function PurchaseCreditPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 text-amber-500 animate-spin" /></div>}>
            <PurchaseContent />
        </Suspense>
    );
}