'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../../context/AuthContext';
import { Clock, Target, User, Search, ChevronLeft, ChevronRight, Coins, Send, X } from 'lucide-react';
import toast from 'react-hot-toast';

const ITEMS_PER_PAGE = 9;

export default function SupporterExplorePage() {
    const { user, api } = useAuth();
    const [campaigns, setCampaigns] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    // Contribute Modal
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

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with Credits */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Explore Campaigns</h1>
                    <p className="text-slate-500 text-sm mt-1">Discover and support projects that matter</p>
                </div>
                <div className="flex items-center gap-2 bg-gradient-to-r from-brand-50 to-brand-100/50 border border-brand-100 rounded-xl px-4 py-2.5">
                    <Coins className="w-5 h-5 text-brand-600" />
                    <div>
                        <p className="text-xs text-slate-500">Your Credits</p>
                        <p className="text-lg font-bold text-brand-700">🪙 {user?.credits || 0}</p>
                    </div>
                </div>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search campaigns..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                    />
                </div>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            <p className="text-xs text-slate-400">
                Showing {paginatedCampaigns.length} of {filtered.length} campaigns
            </p>

            {/* Campaign Cards */}
            {paginatedCampaigns.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-slate-500 text-lg mb-2">No campaigns found</p>
                    <p className="text-slate-400 text-sm">Try adjusting your search or filter</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {paginatedCampaigns.map((camp) => (
                            <div key={camp._id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition group">
                                <div className="relative h-44 overflow-hidden">
                                    <Image
                                        src={camp.image || 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop'}
                                        alt={camp.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition duration-300"
                                        sizes="(max-width: 640px) 100vw, 33vw"
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-200">
                                        <div
                                            className="h-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all"
                                            style={{ width: `${Math.min((camp.raisedAmount / camp.fundingGoal) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="p-4">
                                    <span className="text-xs text-accent-600 bg-accent-50 px-2 py-0.5 rounded-full">{camp.category}</span>
                                    <h3 className="font-semibold text-slate-800 mt-2 mb-2 line-clamp-1">{camp.title}</h3>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                                        <User className="w-3 h-3" /> {camp.creatorName}
                                    </div>
                                    <div className="mb-3">
                                        <div className="flex items-center justify-between text-sm mb-1">
                                            <span className="text-brand-600 font-bold">{camp.raisedAmount || 0} Credits</span>
                                            <span className="text-slate-400 text-xs">{Math.round((camp.raisedAmount / camp.fundingGoal) * 100)}%</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-slate-400">
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
                                            className="flex-1 text-center border border-slate-300 text-slate-600 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition"
                                        >
                                            Details
                                        </Link>
                                        <button
                                            onClick={() => setContributeModal(camp)}
                                            className="flex-1 bg-brand-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition flex items-center justify-center gap-1"
                                        >
                                            <Send className="w-3 h-3" /> Contribute
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-8">
                            <button
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="flex items-center gap-1 px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-4 h-4" /> Prev
                            </button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => goToPage(i + 1)}
                                    className={`w-10 h-10 rounded-lg text-sm font-medium transition ${currentPage === i + 1
                                            ? 'bg-brand-600 text-white shadow-sm'
                                            : 'border border-slate-300 text-slate-600 hover:bg-slate-100'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="flex items-center gap-1 px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Next <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Contribute Modal */}
            {contributeModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setContributeModal(null)}>
                    <div className="bg-white rounded-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-slate-800">Quick Contribute</h3>
                            <button onClick={() => setContributeModal(null)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-sm text-slate-600 mb-4 line-clamp-2">{contributeModal.title}</p>
                        <div className="flex items-center justify-between text-sm mb-4 p-3 bg-brand-50 rounded-lg">
                            <span className="text-slate-600">Your Credits</span>
                            <span className="font-bold text-brand-700">🪙 {user?.credits || 0}</span>
                        </div>
                        <input
                            type="number"
                            min="1"
                            max={user?.credits || 0}
                            value={contributeAmount}
                            onChange={(e) => setContributeAmount(e.target.value)}
                            placeholder="Enter amount"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-500 mb-4"
                        />
                        <button
                            onClick={handleContribute}
                            disabled={submitting}
                            className="w-full bg-brand-600 text-white py-2.5 rounded-lg font-semibold hover:bg-brand-700 disabled:opacity-50 transition text-sm"
                        >
                            {submitting ? 'Sending...' : 'Confirm Contribution'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}