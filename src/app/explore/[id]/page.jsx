'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../context/AuthContext';
import { Clock, Target, User, ArrowLeft, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

export default function CampaignDetailPage() {
    const { id } = useParams();
    const { user, api } = useAuth();
    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showContribute, setShowContribute] = useState(false);
    const [amount, setAmount] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/campaigns/${id}`)
            .then((res) => setCampaign(res.data))
            .catch(() => toast.error('Failed to load campaign'))
            .finally(() => setLoading(false));
    }, [id]);

    const handleContribute = async () => {
        if (!user) return toast.error('Please login to contribute');
        if (!amount || Number(amount) < 1) return toast.error('Enter a valid amount');
        if (Number(amount) > user.credits) return toast.error('Insufficient credits');

        setSubmitting(true);
        try {
            await api.post('/contributions', {
                campaignId: campaign._id,
                campaignTitle: campaign.title,
                amount: Number(amount),
                creatorEmail: campaign.creatorEmail,
                creatorName: campaign.creatorName,
            });
            toast.success('Contribution submitted!');
            setShowContribute(false);
            setAmount('');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Contribution failed');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="w-8 h-8 rounded-full border-2 border-amber-200 dark:border-amber-700 border-t-amber-500 animate-spin" />
            </div>
        );
    }

    if (!campaign) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">Campaign not found</p>
                    <Link href="/explore" className="text-amber-600 dark:text-amber-400 font-semibold hover:underline">
                        ← Back to Explore
                    </Link>
                </div>
            </div>
        );
    }

    const progress = Math.min((campaign.raisedAmount / campaign.fundingGoal) * 100, 100);
    const daysLeft = Math.max(0, Math.ceil((new Date(campaign.deadline) - new Date()) / (1000 * 60 * 60 * 24)));

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <Link
                    href="/explore"
                    className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 mb-6 transition-colors text-sm font-medium"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Explore
                </Link>

                {/* Hero Image */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative w-full h-[300px] sm:h-[400px] rounded-3xl overflow-hidden mb-8 shadow-xl"
                >
                    <Image
                        src={campaign.image || 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop'}
                        alt={campaign.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 896px) 100vw, 896px"
                        priority
                        onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop';
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute top-4 left-4">
                        <span className="text-xs text-amber-600 dark:text-amber-400 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full font-semibold shadow-sm">
                            {campaign.category}
                        </span>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="lg:col-span-2 space-y-6"
                    >
                        <div>
                            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 dark:text-gray-100 mb-3">
                                {campaign.title}
                            </h1>
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <User className="w-4 h-4" />
                                <span className="font-medium text-gray-700 dark:text-gray-300">{campaign.creatorName}</span>
                            </div>
                        </div>

                        {/* Story */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                            <h2 className="font-bold text-gray-800 dark:text-gray-200 mb-3 text-lg">Story</h2>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                                {campaign.story}
                            </p>
                        </div>

                        {/* Reward */}
                        {campaign.rewardInfo && (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                                <h2 className="font-bold text-gray-800 dark:text-gray-200 mb-3 text-lg">Reward</h2>
                                <p className="text-gray-600 dark:text-gray-400">{campaign.rewardInfo}</p>
                            </div>
                        )}
                    </motion.div>

                    {/* Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="space-y-6"
                    >
                        {/* Stats Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm sticky top-24">
                            {/* Progress */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                                        {campaign.raisedAmount || 0} 🪙
                                    </span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {Math.round(progress)}%
                                    </span>
                                </div>
                                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                    />
                                </div>
                                <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                                    <span className="flex items-center gap-1"><Target className="w-3 h-3" /> Goal: {campaign.fundingGoal} 🪙</span>
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {daysLeft} days left</span>
                                </div>
                            </div>

                            {/* Min Contribution */}
                            <div className="mb-6 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800">
                                <p className="text-xs text-amber-700 dark:text-amber-400">
                                    Minimum contribution: <span className="font-bold">{campaign.minContribution || 1} 🪙</span>
                                </p>
                            </div>

                            {/* Contribute Button */}
                            {user ? (
                                <button
                                    onClick={() => setShowContribute(true)}
                                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 text-white py-3.5 rounded-2xl font-bold hover:from-amber-600 hover:to-orange-600 dark:hover:from-amber-500 dark:hover:to-orange-500 transition-all shadow-md shadow-amber-200 dark:shadow-amber-900/30 active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <Send className="w-4 h-4" /> Contribute Now
                                </button>
                            ) : (
                                <Link
                                    href="/login"
                                    className="w-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 py-3.5 rounded-2xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all text-center block"
                                >
                                    Login to Contribute
                                </Link>
                            )}

                            {/* Creator Info */}
                            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Campaign by</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center text-white font-bold text-sm">
                                        {campaign.creatorName?.charAt(0)?.toUpperCase() || 'C'}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{campaign.creatorName}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{campaign.creatorEmail}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Contribute Modal */}
            <AnimatePresence>
                {showContribute && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowContribute(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-700"
                        >
                            <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4 text-lg">Contribute to Campaign</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{campaign.title}</p>
                            <div className="flex items-center justify-between text-sm mb-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800">
                                <span className="text-gray-600 dark:text-gray-400">Your Credits</span>
                                <span className="font-bold text-amber-700 dark:text-amber-400 text-lg">🪙 {user?.credits || 0}</span>
                            </div>
                            <input
                                type="number"
                                min={campaign.minContribution || 1}
                                max={user?.credits || 0}
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder={`Min ${campaign.minContribution || 1} credits`}
                                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-300 dark:focus:ring-amber-600 focus:border-amber-400 dark:focus:border-amber-500 mb-4 transition-all bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                            />
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowContribute(false)}
                                    className="flex-1 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <motion.button
                                    onClick={handleContribute}
                                    disabled={submitting}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 text-white rounded-xl text-sm font-semibold hover:from-amber-600 hover:to-orange-600 dark:hover:from-amber-500 dark:hover:to-orange-500 disabled:opacity-50 transition-all shadow-md shadow-amber-200 dark:shadow-amber-900/30 flex items-center justify-center gap-2"
                                >
                                    {submitting ? 'Sending...' : <><Send className="w-3.5 h-3.5" /> Confirm</>}
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}