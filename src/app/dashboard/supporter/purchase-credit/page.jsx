'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { Coins, Check, Sparkles, Zap, Shield, ArrowRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const packages = [
    { id: '100', credits: 100, price: 10, popular: false, bonus: 0, color: 'from-blue-500 to-blue-600' },
    { id: '300', credits: 300, price: 25, popular: true, bonus: 20, color: 'from-brand-500 to-brand-600' },
    { id: '800', credits: 800, price: 60, popular: false, bonus: 50, color: 'from-accent-500 to-accent-600' },
    { id: '1500', credits: 1500, price: 110, popular: false, bonus: 100, color: 'from-purple-500 to-purple-600' },
];

function PurchaseContent() {
    const { user, api } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(null);
    const [verifying, setVerifying] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);

    // Handle Stripe redirect
    useEffect(() => {
        const sessionId = searchParams.get('session_id');
        const status = searchParams.get('status');

        if (status === 'success' && sessionId && !verifying) {
            setVerifying(true);
            const pkgId = localStorage.getItem('pendingPackage');

            if (!pkgId) {
                toast.error('No pending payment found');
                router.replace('/dashboard/supporter/purchase-credit');
                return;
            }

            console.log('Verifying payment:', { sessionId, pkgId });

            api.post('/payments/confirm', {
                paymentIntentId: sessionId,
                packageId: pkgId,
            })
                .then((res) => {
                    console.log('Confirm response:', res.data);
                    localStorage.removeItem('pendingPackage');

                    if (res.data.alreadyCredited) {
                        toast.success('Credits already added!');
                    } else {
                        toast.success(`${res.data.addedCredits} credits added!`);
                    }

                    setSuccessMessage({
                        credits: res.data.addedCredits || packages.find(p => p.id === pkgId)?.credits || 0,
                        newBalance: res.data.credits,
                    });

                    // Force reload to update credits everywhere
                    setTimeout(() => {
                        window.location.href = '/dashboard/supporter/purchase-credit';
                    }, 2000);
                })
                .catch((err) => {
                    console.error('Confirm error:', err.response?.data);
                    toast.error(err.response?.data?.error || 'Payment verification failed');
                    localStorage.removeItem('pendingPackage');
                    router.replace('/dashboard/supporter/purchase-credit');
                })
                .finally(() => setVerifying(false));
        }

        if (status === 'cancelled') {
            toast.error('Payment cancelled');
            localStorage.removeItem('pendingPackage');
            router.replace('/dashboard/supporter/purchase-credit');
        }

        // Clean URL params on fresh load
        if (!status && !sessionId && searchParams.toString()) {
            router.replace('/dashboard/supporter/purchase-credit');
        }
    }, [searchParams]);

    const handlePayment = async (pkg) => {
        setLoading(pkg.id);
        localStorage.setItem('pendingPackage', pkg.id);

        try {
            const res = await api.post('/payments/create-checkout', { packageId: pkg.id });
            console.log('Checkout URL:', res.data.url);
            window.location.href = res.data.url;
        } catch (err) {
            console.error('Payment init error:', err.response?.data);
            toast.error('Failed to initialize payment');
            setLoading(null);
            localStorage.removeItem('pendingPackage');
        }
    };

    if (verifying) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 text-brand-600 animate-spin mx-auto mb-4" />
                    <p className="text-slate-600 font-medium">Verifying your payment...</p>
                    <p className="text-sm text-slate-400 mt-1">Please wait a moment</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Purchase Credits</h1>
                    <p className="text-slate-500 text-sm mt-1">Buy credits to support campaigns you believe in</p>
                </div>
                <div className="flex items-center gap-3 bg-gradient-to-r from-brand-50 to-brand-100/50 border border-brand-100 rounded-2xl px-5 py-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center">
                        <Coins className="w-5 h-5 text-brand-600" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 font-medium">Your Balance</p>
                        <p className="text-xl font-bold text-brand-700">🪙 {user?.credits || 0}</p>
                    </div>
                </div>
            </div>

            {/* Success Message */}
            {successMessage && (
                <div className="bg-gradient-to-r from-brand-50 to-green-50 border border-brand-200 rounded-xl p-6 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center">
                            <Check className="w-6 h-6 text-brand-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">Payment Successful!</h3>
                            <p className="text-sm text-slate-600">
                                {successMessage.credits} credits added. New balance: 🪙 {successMessage.newBalance}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                    { icon: Zap, text: 'Instant Delivery', color: 'text-yellow-500' },
                    { icon: Shield, text: 'Secure Payment', color: 'text-green-500' },
                    { icon: Sparkles, text: 'Bonus Credits', color: 'text-purple-500' },
                ].map((f, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3">
                        <f.icon className={`w-5 h-5 ${f.color}`} />
                        <span className="text-sm font-medium text-slate-700">{f.text}</span>
                    </div>
                ))}
            </div>

            {/* Packages */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {packages.map((pkg) => (
                    <div
                        key={pkg.id}
                        onClick={() => !loading && handlePayment(pkg)}
                        className={`relative bg-white rounded-2xl border-2 p-6 transition-all cursor-pointer hover:shadow-xl hover:-translate-y-1 ${pkg.popular
                                ? 'border-brand-400 shadow-brand-500/10 shadow-lg'
                                : 'border-slate-200 hover:border-brand-300'
                            } ${loading === pkg.id ? 'opacity-70 pointer-events-none' : ''}`}
                    >
                        {pkg.popular && (
                            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-500 to-brand-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                                MOST POPULAR
                            </div>
                        )}
                        {pkg.bonus > 0 && (
                            <div className="absolute -top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                +{pkg.bonus} BONUS
                            </div>
                        )}

                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${pkg.color} flex items-center justify-center mb-4 shadow-lg`}>
                            <Coins className="w-6 h-6 text-white" />
                        </div>

                        <p className="text-3xl font-bold text-slate-800">{pkg.credits}</p>
                        <p className="text-sm text-slate-500 mb-1">Credits</p>

                        {pkg.bonus > 0 && (
                            <p className="text-xs text-green-600 font-medium mb-2">+{pkg.bonus} bonus credits</p>
                        )}

                        <div className="mt-3 pt-3 border-t border-slate-100">
                            <p className="text-2xl font-bold text-slate-800">${pkg.price}</p>
                            <p className="text-xs text-slate-400">one-time payment</p>
                        </div>

                        <div
                            className={`mt-4 w-full py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${pkg.popular
                                    ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-md hover:shadow-lg'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                        >
                            {loading === pkg.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    Buy Now <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Test Card Info */}
            <div className="bg-slate-100 border border-slate-200 rounded-xl p-4 text-center">
                <p className="text-xs text-slate-500">
                    💳 <span className="font-medium">Test Card:</span> 4242 4242 4242 4242 | Any future date | Any 3-digit CVC
                </p>
            </div>
        </div>
    );
}

export default function PurchaseCreditPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
            </div>
        }>
            <PurchaseContent />
        </Suspense>
    );
}