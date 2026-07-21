'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { Clock, Target, User, Gift, ArrowLeft } from 'lucide-react';

export default function ExploreDetailsPage() {
    const { id } = useParams();
    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/campaigns/${id}`)
            .then((res) => setCampaign(res.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
            </div>
        );
    }

    if (!campaign) {
        return (
            <div className="text-center py-20">
                <p className="text-slate-500">Campaign not found.</p>
                <Link href="/explore" className="text-brand-600 hover:underline mt-2 inline-block">Back to Explore</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="max-w-3xl mx-auto px-4">
                <Link href="/explore" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4">
                    <ArrowLeft className="w-4 h-4" /> Back to Explore
                </Link>

                <div className="relative h-56 md:h-72 rounded-xl overflow-hidden mb-6">
                    <Image
                        src={campaign.image || 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop'}
                        alt={campaign.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 768px"
                        priority
                    />
                </div>

                <span className="text-xs text-accent-600 bg-accent-50 px-2 py-0.5 rounded-full">{campaign.category}</span>
                <h1 className="text-2xl font-bold text-slate-800 mt-2 mb-4">{campaign.title}</h1>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    <div className="bg-white rounded-lg border border-slate-200 p-3 text-center">
                        <Target className="w-4 h-4 mx-auto text-brand-600 mb-1" />
                        <p className="text-xs text-slate-500">Goal</p>
                        <p className="font-semibold">{campaign.fundingGoal} Credits</p>
                    </div>
                    <div className="bg-white rounded-lg border border-slate-200 p-3 text-center">
                        <Gift className="w-4 h-4 mx-auto text-brand-600 mb-1" />
                        <p className="text-xs text-slate-500">Raised</p>
                        <p className="font-semibold text-brand-600">{campaign.raisedAmount || 0}</p>
                    </div>
                    <div className="bg-white rounded-lg border border-slate-200 p-3 text-center">
                        <Clock className="w-4 h-4 mx-auto text-brand-600 mb-1" />
                        <p className="text-xs text-slate-500">Deadline</p>
                        <p className="font-semibold text-sm">{new Date(campaign.deadline).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-white rounded-lg border border-slate-200 p-3 text-center">
                        <User className="w-4 h-4 mx-auto text-brand-600 mb-1" />
                        <p className="text-xs text-slate-500">Creator</p>
                        <p className="font-semibold text-sm truncate">{campaign.creatorName}</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
                    <h2 className="font-semibold text-slate-800 mb-3">Story</h2>
                    <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{campaign.story}</p>
                </div>

                {campaign.rewardInfo && (
                    <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
                        <h2 className="font-semibold text-slate-800 mb-3">Reward</h2>
                        <p className="text-slate-600 text-sm">{campaign.rewardInfo}</p>
                    </div>
                )}

                <div className="text-center">
                    <Link
                        href="/login"
                        className="inline-block bg-brand-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-brand-700 transition"
                    >
                        Login to Contribute
                    </Link>
                </div>
            </div>
        </div>
    );
}