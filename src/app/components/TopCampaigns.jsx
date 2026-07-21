import Image from 'next/image';
import { Heart, TrendingUp } from 'lucide-react';

const campaigns = [
    { id: 1, title: 'Solar-Powered Water Pump', image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop', raised: 5200 },
    { id: 2, title: 'Community Art Studio', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=300&fit=crop', raised: 4800 },
    { id: 3, title: 'Tech for Rural Schools', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop', raised: 4100 },
    { id: 4, title: 'Green Energy Startup', image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=300&fit=crop', raised: 3900 },
    { id: 5, title: 'Urban Garden Project', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop', raised: 3600 },
    { id: 6, title: 'Mobile Health Clinic', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop', raised: 3400 },
];

export default function TopCampaigns() {
    return (
        <section className="py-16 md:py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">Top Funded Campaigns</h2>
                    <p className="text-slate-500 max-w-2xl mx-auto">
                        The most successful campaigns making a difference right now.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {campaigns.map((campaign, index) => (
                        <div key={campaign.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md hover:border-brand-200 transition group">
                            <div className="relative h-48 overflow-hidden">
                                <Image src={campaign.image} alt={campaign.title} fill className="object-cover group-hover:scale-105 transition duration-300" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" priority={index < 2} />
                                <div className="absolute top-3 right-3 bg-brand-600 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 z-10">
                                    <TrendingUp className="w-3 h-3" /> Top
                                </div>
                            </div>
                            <div className="p-5">
                                <h3 className="font-semibold text-slate-800 mb-3">{campaign.title}</h3>
                                <div className="flex items-center gap-2 text-brand-600 font-bold">
                                    <Heart className="w-4 h-4" />
                                    <span>{campaign.raised.toLocaleString()} Credits Raised</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}