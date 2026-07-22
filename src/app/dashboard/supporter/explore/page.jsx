'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../../context/AuthContext';
import { Clock, Target, User, Search, ChevronLeft, ChevronRight, Coins, Send, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const ITEMS_PER_PAGE = 9;

export default function SupporterExplorePage() {
    const { user, api } = useAuth();
    const [campaigns, setCampaigns] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const [contributeModal, setContributeModal] = useState(null);
    const [contributeAmount, setContributeAmount] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        api.get('/campaigns')
            .then((res) => {
                setCampaigns(res.data);
                setFiltered(res.data);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        let result = campaigns;
        if (search) {
            result = result.filter((c) =>
                c.title.toLowerCase().includes(search.toLowerCase()) ||
                c.creatorName?.toLowerCase().includes(search.toLowerCase())
            );
        }
        if (category) {
            result = result.filter((c) => c.category === category);
        }
        setFiltered(result);
        setCurrentPage(1);
    }, [search, category, campaigns]);

    const handleContribute = async () => {
        if (!contributeAmount || Number(contributeAmount) < 1) {
            return toast.error('Enter a valid amount');
        }
        if (Number(contributeAmount) > user.credits) {
            return toast.error('Insufficient credits');
        }

        setSubmitting(true);
        try {
            await api.post('/contributions', {
                campaignId: contributeModal._id,
                campaignTitle: contributeModal.title,
                amount: Number(contributeAmount),
                creatorEmail: contributeModal.creatorEmail,
                creatorName: contributeModal.creatorName,
            });
            toast.success('Contribution submitted!');
            setContributeModal(null);
            setContributeAmount('');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Contribution failed');
        } finally {
            setSubmitting(false);
        }
    };

    const categories = [...new Set(campaigns.map((c) => c.category))];
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedCampaigns = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" }
        }),
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-10 h-10 rounded-full border-2 border-amber-200 border-t-amber-500"
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with Credits */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Explore Campaigns</h1>
                    <p className="text-gray-500 text-sm mt-1">Discover and support projects that matter</p>
                </div>
                <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl px-5 py-3 shadow-sm">
                    <Coins className="w-5 h-5 text-amber-500" />
                    <div>
                        <p className="text-xs text-gray-500">Your Credits</p>
                        <p className="text-lg font-bold text-amber-700">🪙 {user?.credits || 0}</p>
                    </div>
                </div>
            </motion.div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search campaigns..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 bg-white transition-all"
                    />
                </div>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 bg-white transition-all"
                >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            <p className="text-xs text-gray-400">
                Showing {paginatedCampaigns.length} of {filtered.length} campaigns
            </p>

            {/* Campaign Cards */}
            {paginatedCampaigns.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-gray-500 text-lg mb-2">No campaigns found</p>
                    <p className="text-gray-400 text-sm">Try adjusting your search or filter</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {paginatedCampaigns.map((camp, i) => (
                            <motion.div
                                key={camp._id}
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                custom={i % ITEMS_PER_PAGE}
                                whileHover={{ y: -4 }}
                                className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:shadow-amber-100/30 hover:border-amber-200 transition-all duration-300 group"
                            >
                                <div className="relative h-44 overflow-hidden">
                                    <Image
                                        src={camp.image || 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop'}
                                        alt={camp.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition duration-500"
                                        sizes="(max-width: 640px) 100vw, 33vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-200">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min((camp.raisedAmount / camp.fundingGoal) * 100, 100)}%` }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                        />
                                    </div>
                                </div>
                                <div className="p-4">
                                    <span className="text-xs text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full font-medium">{camp.category}</span>
                                    <h3 className="font-semibold text-gray-800 mt-2 mb-2 line-clamp-1 group-hover:text-amber-700 transition-colors">{camp.title}</h3>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                                        <User className="w-3 h-3" /> {camp.creatorName}
                                    </div>
                                    <div className="mb-3">
                                        <div className="flex items-center justify-between text-sm mb-1">
                                            <span className="text-amber-600 font-bold">{camp.raisedAmount || 0} 🪙</span>
                                            <span className="text-gray-400 text-xs">{Math.round((camp.raisedAmount / camp.fundingGoal) * 100)}%</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <Target className="w-3 h-3" /> Goal: {camp.fundingGoal}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> {new Date(camp.deadline).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link
                                            href={`/explore/${camp._id}`}
                                            className="flex-1 text-center border border-gray-300 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                                        >
                                            Details
                                        </Link>
                                        <motion.button
                                            onClick={() => setContributeModal(camp)}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-sm shadow-amber-200 flex items-center justify-center gap-1.5"
                                        >
                                            <Send className="w-3.5 h-3.5" /> Contribute
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-8">
                            <button
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="flex items-center gap-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" /> Prev
                            </button>
                            {[...Array(totalPages)].map((_, i) => (
                                <motion.button
                                    key={i + 1}
                                    onClick={() => goToPage(i + 1)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${currentPage === i + 1
                                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-200'
                                            : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    {i + 1}
                                </motion.button>
                            ))}
                            <button
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="flex items-center gap-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                Next <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Contribute Modal */}
            <AnimatePresence>
                {contributeModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setContributeModal(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-gray-800">Quick Contribute</h3>
                                <button
                                    onClick={() => setContributeModal(null)}
                                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{contributeModal.title}</p>
                            <div className="flex items-center justify-between text-sm mb-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
                                <span className="text-gray-600">Your Credits</span>
                                <span className="font-bold text-amber-700 text-lg">🪙 {user?.credits || 0}</span>
                            </div>
                            <input
                                type="number"
                                min="1"
                                max={user?.credits || 0}
                                value={contributeAmount}
                                onChange={(e) => setContributeAmount(e.target.value)}
                                placeholder="Enter amount"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 mb-4 transition-all"
                            />
                            <motion.button
                                onClick={handleContribute}
                                disabled={submitting}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 transition-all text-sm shadow-md shadow-amber-200"
                            >
                                {submitting ? 'Sending...' : 'Confirm Contribution'}
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}