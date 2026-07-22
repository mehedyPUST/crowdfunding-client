'use client';

import Image from 'next/image';
import { Heart, TrendingUp, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const campaigns = [
    { id: 1, title: 'Solar-Powered Water Pump', image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop', raised: 5200 },
    { id: 2, title: 'Community Art Studio', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=300&fit=crop', raised: 4800 },
    { id: 3, title: 'Tech for Rural Schools', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop', raised: 4100 },
    { id: 4, title: 'Green Energy Startup', image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=300&fit=crop', raised: 3900 },
    { id: 5, title: 'Urban Garden Project', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop', raised: 3600 },
    { id: 6, title: 'Mobile Health Clinic', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop', raised: 3400 },
];

const containerVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.08 },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" }
    },
};

export default function TopCampaigns() {
    return (
        <section className="py-20 md:py-28 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block text-xs font-bold tracking-widest text-amber-600 dark:text-amber-400 uppercase bg-amber-50 dark:bg-amber-900/20 px-4 py-1.5 rounded-full mb-4">
                        Trending Now
                    </span>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-gray-800 dark:text-gray-100 mb-4 tracking-tight">
                        Top Funded Campaigns
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                        The most successful campaigns making a real difference right now.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-30px" }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {campaigns.map((campaign, index) => (
                        <motion.div
                            key={campaign.id}
                            variants={cardVariants}
                            whileHover={{ y: -8 }}
                            className="group relative bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl hover:shadow-amber-100/30 dark:hover:shadow-amber-900/20 transition-all duration-300"
                        >
                            {/* Image */}
                            <div className="relative h-52 overflow-hidden">
                                <Image
                                    src={campaign.image}
                                    alt={campaign.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition duration-700"
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    priority={index < 2}
                                />
                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                                {/* Top badge */}
                                <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg shadow-amber-500/30 z-10">
                                    <TrendingUp className="w-3 h-3" /> Top
                                </div>

                                {/* Title on image */}
                                <div className="absolute bottom-4 left-4 right-4 z-10">
                                    <h3 className="font-bold text-white text-lg leading-tight drop-shadow-lg">
                                        {campaign.title}
                                    </h3>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                            <Heart className="w-4 h-4 text-emerald-600 dark:text-emerald-400 fill-emerald-600 dark:fill-emerald-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Raised</p>
                                            <p className="font-bold text-emerald-600 dark:text-emerald-400">
                                                {campaign.raised.toLocaleString()} Credits
                                            </p>
                                        </div>
                                    </div>
                                    <Link
                                        href={`/explore/${campaign.id}`}
                                        className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 text-sm font-semibold transition-colors"
                                    >
                                        View <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}