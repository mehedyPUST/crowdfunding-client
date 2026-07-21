'use client';

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Coins, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const packages = [
    { id: '100', credits: 100, price: 10 },
    { id: '300', credits: 300, price: 25, popular: true },
    { id: '800', credits: 800, price: 60 },
    { id: '1500', credits: 1500, price: 110 },
];

function CheckoutForm({ clientSecret, onSuccess }) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);
        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {},
        });

        if (error) {
            toast.error(error.message);
        } else if (paymentIntent?.status === 'succeeded') {
            toast.success('Payment successful!');
            onSuccess(paymentIntent.id);
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <PaymentElement />
            <button
                type="submit"
                disabled={!stripe || loading}
                className="w-full bg-brand-600 text-white py-2.5 rounded-lg font-semibold hover:bg-brand-700 transition disabled:opacity-50 text-sm"
            >
                {loading ? 'Processing...' : 'Pay Now'}
            </button>
        </form>
    );
}

export default function PurchaseCreditPage() {
    const { api } = useAuth();
    const [selected, setSelected] = useState(null);
    const [clientSecret, setClientSecret] = useState(null);
    const [message, setMessage] = useState('');

    const handleSelectPackage = async (pkg) => {
        setSelected(pkg);
        setClientSecret(null);
        setMessage('');
        try {
            const res = await api.post('/payments/create-intent', { packageId: pkg.id });
            setClientSecret(res.data.clientSecret);
        } catch {
            toast.error('Failed to initialize payment');
        }
    };

    const handlePaymentSuccess = async (paymentIntentId) => {
        try {
            const res = await api.post('/payments/confirm', { paymentIntentId, packageId: selected.id });
            setMessage(`✅ ${selected.credits} credits added! New balance: ${res.data.credits}`);
            setSelected(null);
            setClientSecret(null);
        } catch {
            toast.error('Failed to confirm payment');
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-slate-800 mb-6">Purchase Credits</h1>

            {message && (
                <div className="bg-brand-50 text-brand-700 border border-brand-200 rounded-lg p-4 mb-6 text-sm font-medium">
                    {message}
                </div>
            )}

            {!selected ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {packages.map((pkg) => (
                        <div
                            key={pkg.id}
                            onClick={() => handleSelectPackage(pkg)}
                            className={`relative bg-white rounded-xl border-2 p-5 text-center cursor-pointer transition hover:shadow-md ${pkg.popular ? 'border-brand-500' : 'border-slate-200 hover:border-brand-300'
                                }`}
                        >
                            {pkg.popular && (
                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-xs font-semibold px-3 py-0.5 rounded-full">
                                    Popular
                                </span>
                            )}
                            <Coins className="w-8 h-8 mx-auto text-brand-600 mb-2" />
                            <p className="text-2xl font-bold text-slate-800">{pkg.credits}</p>
                            <p className="text-sm text-slate-500 mb-3">Credits</p>
                            <p className="text-lg font-bold text-brand-600">${pkg.price}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    <button
                        onClick={() => { setSelected(null); setClientSecret(null); }}
                        className="text-sm text-slate-500 hover:text-slate-700 mb-4"
                    >
                        ← Back to packages
                    </button>

                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="font-semibold text-slate-800">{selected.credits} Credits</p>
                                <p className="text-sm text-slate-500">${selected.price}</p>
                            </div>
                            <Coins className="w-6 h-6 text-brand-600" />
                        </div>

                        {clientSecret ? (
                            <Elements stripe={stripePromise} options={{ clientSecret }}>
                                <CheckoutForm clientSecret={clientSecret} onSuccess={handlePaymentSuccess} />
                            </Elements>
                        ) : (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-600"></div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}