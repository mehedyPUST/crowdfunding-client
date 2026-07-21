'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../context/AuthContext';
import { Clock, Target, User } from 'lucide-react';

export default function ExplorePage() {
    const { api } = useAuth();
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/campaigns')
            .then((res) => setCampaigns(res.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-6">Explore Campaigns</h1>

            {campaigns.length === 0 ? (
                <p className="text-slate-500 text-center py-12">No active campaigns right now.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {campaigns.map((camp) => (
                        <div key={camp._id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition">
                            <div className="relative h-44">
                                <Image src={camp.image || 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop'} alt={camp.title} fill className="object-cover" sizes="(max-width: 640px) 100vw, 33vw" />
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-slate-800 mb-2 truncate">{camp.title}</h3>
                                <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                                    <User className="w-3 h-3" /> {camp.creatorName}
                                </div>
                                <div className="flex items-center justify-between text-sm mb-3">
                                    <span className="flex items-center gap-1 text-slate-500">
                                        <Target className="w-3 h-3" /> Goal: {camp.fundingGoal}
                                    </span>
                                    <span className="text-brand-600 font-medium">Raised: {camp.raisedAmount || 0}</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-slate-400 mb-3">
                                    <Clock className="w-3 h-3" />
                                    Deadline: {new Date(camp.deadline).toLocaleDateString()}
                                </div>
                                <Link
                                    href={`/dashboard/explore/${camp._id}`}
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
    );
}