'use client';

import { Users, Rocket, Coins, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const stats = [
    { icon: Users, value: '12,000+', label: 'Active Supporters', gradient: 'from-amber-400 to-orange-400', shadowColor: 'shadow-amber-500/20' },
    { icon: Rocket, value: '850+', label: 'Funded Campaigns', gradient: 'from-amber-500 to-orange-500', shadowColor: 'shadow-amber-500/20' },
    { icon: Coins, value: '$2.5M+', label: 'Total Raised', gradient: 'from-emerald-400 to-teal-400', shadowColor: 'shadow-emerald-500/20' },
    { icon: CheckCircle, value: '98%', label: 'Success Rate', gradient: 'from-emerald-500 to-teal-500', shadowColor: 'shadow-emerald-500/20' },
];

const containerVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.1 },
    },
};

const statVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" }
    },
};

export default function PlatformStats() {
    return (
        <section className="py-20 md:py-28 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{
                backgroundImage: 'radial-gradient(circle, #f59e0b 1px, transparent 1px)',
                backgroundSize: '50px 50px',
            }} />

            {/* Glow effects */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block text-xs font-bold tracking-widest text-amber-400 uppercase bg-amber-400/10 px-4 py-1.5 rounded-full mb-4">
                        Our Impact
                    </span>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
                        Platform Impact in Numbers
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Our community is making waves every day. Here's the proof.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            variants={statVariants}
                            whileHover={{ y: -8, scale: 1.03 }}
                            className="relative text-center text-white p-6 md:p-8 rounded-3xl bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 group cursor-default"
                        >
                            {/* Hover glow */}
                            <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${stat.shadowColor} blur-xl`} />

                            {/* Icon */}
                            <div className={`relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.gradient} mb-5 shadow-2xl group-hover:scale-110 transition-all duration-300`}>
                                <stat.icon className="w-7 h-7 text-white" />
                            </div>

                            {/* Value */}
                            <div className="relative">
                                <motion.div
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    whileInView={{ scale: 1, opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                                    className="text-3xl md:text-5xl font-black mb-2 tracking-tight"
                                >
                                    {stat.value}
                                </motion.div>
                            </div>

                            {/* Label */}
                            <div className="text-sm md:text-base text-gray-400 group-hover:text-gray-300 transition-colors font-medium">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}