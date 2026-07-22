'use client';

import { Users, Rocket, Coins, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const stats = [
    { icon: Users, value: '12,000+', label: 'Active Supporters', gradient: 'from-amber-400 to-orange-400' },
    { icon: Rocket, value: '850+', label: 'Funded Campaigns', gradient: 'from-amber-500 to-orange-500' },
    { icon: Coins, value: '$2.5M+', label: 'Total Raised', gradient: 'from-emerald-400 to-teal-400' },
    { icon: CheckCircle, value: '98%', label: 'Success Rate', gradient: 'from-emerald-500 to-teal-500' },
];

const containerVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.1 },
    },
};

const statVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" }
    },
};

export default function PlatformStats() {
    return (
        <section className="py-16 md:py-20 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-10 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Platform Impact in Numbers</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">Our community is making waves every day.</p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-6"
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            variants={statVariants}
                            whileHover={{ y: -6, scale: 1.02 }}
                            className="text-center text-white p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all group"
                        >
                            <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${stat.gradient} mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                                <stat.icon className="w-7 h-7 text-white" />
                            </div>
                            <div className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</div>
                            <div className="text-sm text-gray-400">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}