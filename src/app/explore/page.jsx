'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { Clock, Target, User, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import ChatBot from '../components/ChatBot';

const ITEMS_PER_PAGE = 9;

export default function ExplorePage() {
    const [campaigns, setCampaigns] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/campaigns`)
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

    const categories = [...new Set(campaigns.map((c) => c.category))];

    // Pagination logic
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
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">Explore Campaigns</h1>
                    <p className="text-slate-500">Discover innovative projects and support what matters to you.</p>

                    {/* Search & Filter */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search campaigns..."
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-500"
                            />
                        </div>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="px-4 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-500"
                        >
                            <option value="">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* Results count */}
                    <p className="text-xs text-slate-400 mt-3">
                        Showing {paginatedCampaigns.length} of {filtered.length} campaigns
                    </p>
                </div>
            </div>

            {/* Campaign Cards */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                                        {/* Progress Bar */}
                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-200">
                                            <div
                                                className="h-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all duration-300"
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

                                        {/* Progress Stats */}
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

                                        <Link
                                            href={`/explore/${camp._id}`}
                                            className="block text-center bg-brand-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-10">
                                <button
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="flex items-center gap-1 px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                >
                                    <ChevronLeft className="w-4 h-4" /> Previous
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
                                    className="flex items-center gap-1 px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                >
                                    Next <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            <ChatBot />
        </div>
    );
}