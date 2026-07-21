'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { Clock, Target, User, Search } from 'lucide-react';
import ChatBot from '../components/ChatBot';

export default function ExplorePage() {
    const [campaigns, setCampaigns] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(true);

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
    }, [search, category, campaigns]);

    const categories = [...new Set(campaigns.map((c) => c.category))];

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
                </div>
            </div>

            {/* Campaign Cards */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {filtered.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-slate-500 text-lg mb-2">No campaigns found</p>
                        <p className="text-slate-400 text-sm">Try adjusting your search or filter</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filtered.map((camp) => (
                            <div key={camp._id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition group">
                                <div className="relative h-44 overflow-hidden">
                                    <Image
                                        src={camp.image || 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop'}
                                        alt={camp.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition duration-300"
                                        sizes="(max-width: 640px) 100vw, 33vw"
                                    />
                                </div>
                                <div className="p-4">
                                    <span className="text-xs text-accent-600 bg-accent-50 px-2 py-0.5 rounded-full">{camp.category}</span>
                                    <h3 className="font-semibold text-slate-800 mt-2 mb-2 truncate">{camp.title}</h3>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                                        <User className="w-3 h-3" /> {camp.creatorName}
                                    </div>
                                    <div className="flex items-center justify-between text-sm mb-3">
                                        <span className="flex items-center gap-1 text-slate-500">
                                            <Target className="w-3 h-3" /> {camp.fundingGoal} Credits
                                        </span>
                                        <span className="text-brand-600 font-medium">{camp.raisedAmount || 0} Raised</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-slate-400 mb-3">
                                        <Clock className="w-3 h-3" /> {new Date(camp.deadline).toLocaleDateString()}
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
                )}
            </div>

            <ChatBot />
        </div>
    );
}