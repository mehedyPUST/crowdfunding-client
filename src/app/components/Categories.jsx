'use client';

import { Code, Palette, HeartPulse, Leaf, GraduationCap, Music } from 'lucide-react';
import { motion } from 'framer-motion';

const categories = [
    { icon: Code, name: 'Technology', count: '120+ Projects', gradient: 'from-amber-400 to-orange-400' },
    { icon: Palette, name: 'Art & Design', count: '95+ Projects', gradient: 'from-emerald-400 to-teal-400' },
    { icon: HeartPulse, name: 'Health', count: '80+ Projects', gradient: 'from-amber-400 to-orange-400' },
    { icon: Leaf, name: 'Environment', count: '65+ Projects', gradient: 'from-emerald-400 to-teal-400' },
    { icon: GraduationCap, name: 'Education', count: '110+ Projects', gradient: 'from-amber-400 to-orange-400' },
    { icon: Music, name: 'Music & Film', count: '70+ Projects', gradient: 'from-emerald-400 to-teal-400' },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.06 },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" }
    },
};

export default function Categories() {
    return (
        <section className="py-16 md:py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-3">
                        Explore by Category
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-base">
                        Find campaigns that match your interests.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-30px" }}
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
                >
                    {categories.map((cat, index) => (
                        <motion.div
                            key={index}
                            variants={cardVariants}
                            whileHover={{
                                y: -8,
                                transition: { duration: 0.2, ease: "easeOut" }
                            }}
                            className="relative bg-white dark:bg-gray-800 rounded-2xl p-5 text-center border border-gray-200 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-600 hover:shadow-xl hover:shadow-amber-100/30 dark:hover:shadow-amber-900/20 transition-all duration-300 cursor-pointer group overflow-hidden"
                        >
                            {/* Decorative gradient dot */}
                            <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl ${cat.gradient} opacity-0 group-hover:opacity-10 rounded-bl-full transition-opacity duration-300`} />

                            <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.gradient} mb-4 shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300`}>
                                <cat.icon className="w-6 h-6 text-white" />
                            </div>
                            <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm mb-1">{cat.name}</h4>
                            <p className="text-xs text-gray-400 dark:text-gray-500">{cat.count}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}