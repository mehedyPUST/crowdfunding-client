'use client';

import { Lightbulb, Users, HandHeart, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
    {
        icon: Lightbulb,
        title: 'Start a Campaign',
        desc: 'Share your idea and set a funding goal that inspires others to join your journey.',
        color: 'from-amber-400 to-orange-400',
        step: '01'
    },
    {
        icon: Users,
        title: 'Build Community',
        desc: 'Reach supporters worldwide who believe in your vision and want to contribute.',
        color: 'from-amber-500 to-orange-500',
        step: '02'
    },
    {
        icon: HandHeart,
        title: 'Get Funded',
        desc: 'Receive contributions toward your goal from backers who care about your cause.',
        color: 'from-emerald-400 to-teal-400',
        step: '03'
    },
    {
        icon: TrendingUp,
        title: 'Make It Real',
        desc: 'Use the funds to bring your project to life and share your success with the world.',
        color: 'from-emerald-500 to-teal-500',
        step: '04'
    },
];

const containerVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.12 },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" }
    },
};

export default function HowItWorks() {
    return (
        <section className="py-20 md:py-28 bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block text-xs font-bold tracking-widest text-amber-600 dark:text-amber-400 uppercase bg-amber-50 dark:bg-amber-900/20 px-4 py-1.5 rounded-full mb-4">
                        How It Works
                    </span>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-gray-800 dark:text-gray-100 mb-4 tracking-tight">
                        Launch in 4 Simple Steps
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                        Launching and supporting campaigns is simple. Start your journey today.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-30px" }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            variants={cardVariants}
                            whileHover={{ y: -10 }}
                            className="relative group"
                        >
                            {/* Card */}
                            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 text-center border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-2xl hover:shadow-amber-100/30 dark:hover:shadow-amber-900/20 transition-all duration-300 h-full relative overflow-hidden">
                                {/* Step number */}
                                <div className="absolute top-4 right-5 text-6xl font-black text-gray-50 dark:text-gray-700/30 select-none">
                                    {step.step}
                                </div>

                                {/* Icon */}
                                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} text-white mb-5 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 relative z-10`}>
                                    <step.icon className="w-7 h-7" />
                                </div>

                                {/* Content */}
                                <h3 className="font-bold text-gray-800 dark:text-gray-200 text-lg mb-3 relative z-10">
                                    {step.title}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed relative z-10">
                                    {step.desc}
                                </p>
                            </div>

                            {/* Connector arrow (desktop) */}
                            {index < steps.length - 1 && (
                                <div className="hidden lg:flex absolute top-1/2 -right-3 items-center justify-center w-8 h-8 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm z-20">
                                    <svg className="w-3 h-3 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}