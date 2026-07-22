'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { Clock, Target, User, Search, ChevronLeft, ChevronRight, Compass } from 'lucide-react';
import ChatBot from '../components/ChatBot';
import { motion } from 'framer-motion';

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
            <div className="flex items-center justify-center py-20">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-10 h-10 rounded-full border-2 border-amber-200 border-t-amber-500"
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                            <Compass className="w-7 h-7 text-amber-500" />
                            Explore Campaigns
                        </h1>
                        <p className="text-gray-500">Discover innovative projects and support what matters to you.</p>
                    </motion.div>

                    {/* Search & Filter */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="flex flex-col sm:flex-row gap-3 mt-6"
                    >
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
                    </motion.div>

                    {/* Results count */}
                    <p className="text-xs text-gray-400 mt-3">
                        Showing {paginatedCampaigns.length} of {filtered.length} campaigns
                    </p>
                </div>
            </div>

            {/* Campaign Cards */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {paginatedCampaigns.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16"
                    >
                        <p className="text-gray-500 text-lg mb-2">No campaigns found</p>
                        <p className="text-gray-400 text-sm">Try adjusting your search or filter</p>
                    </motion.div>
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
                                        {/* Progress Bar */}
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

                                        {/* Progress Stats */}
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

                                        <Link
                                            href={`/explore/${camp._id}`}
                                            className="block text-center bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-sm shadow-amber-200"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-10">
                                <button
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="flex items-center gap-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft className="w-4 h-4" /> Previous
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
            </div>

            <ChatBot />
        </div>
    );
}