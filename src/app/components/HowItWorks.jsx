'use client';

import { Lightbulb, Users, HandHeart, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
    { icon: Lightbulb, title: 'Start a Campaign', desc: 'Share your idea and set a funding goal.', color: 'from-amber-400 to-orange-400' },
    { icon: Users, title: 'Build Community', desc: 'Reach supporters who believe in your vision.', color: 'from-amber-500 to-orange-500' },
    { icon: HandHeart, title: 'Get Funded', desc: 'Receive contributions toward your goal.', color: 'from-emerald-400 to-teal-400' },
    { icon: TrendingUp, title: 'Make It Real', desc: 'Use funds to bring your project to life.', color: 'from-emerald-500 to-teal-500' },
];

const containerVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.15 },
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

export default function HowItWorks() {
    return (
        <section className="py-16 md:py-20 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">How It Works</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto text-base">Launching and supporting campaigns is simple.</p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-30px" }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            variants={cardVariants}
                            whileHover={{ y: -8 }}
                            className="text-center group relative"
                        >
                            {/* Step number line */}
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-8 left-[60%] w-full h-0.5 bg-gradient-to-r from-amber-200 to-emerald-200 -z-10" />
                            )}

                            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} text-white mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                                <step.icon className="w-8 h-8" />
                            </div>
                            <h3 className="font-semibold text-gray-800 mb-2">{step.title}</h3>
                            <p className="text-sm text-gray-500">{step.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}