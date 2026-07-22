'use client';

import { Code, Palette, HeartPulse, Leaf, GraduationCap, Music } from 'lucide-react';
import { motion } from 'framer-motion';

const categories = [
    { icon: Code, name: 'Technology', count: '120+ Projects' },
    { icon: Palette, name: 'Art & Design', count: '95+ Projects' },
    { icon: HeartPulse, name: 'Health', count: '80+ Projects' },
    { icon: Leaf, name: 'Environment', count: '65+ Projects' },
    { icon: GraduationCap, name: 'Education', count: '110+ Projects' },
    { icon: Music, name: 'Music & Film', count: '70+ Projects' },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
        },
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
        <section className="py-16 md:py-20 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
                        Explore by Category
                    </h2>
                    <p className="text-gray-500 max-w-2xl mx-auto text-base">
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
                                y: -6,
                                transition: { duration: 0.2, ease: "easeOut" }
                            }}
                            className="bg-white rounded-xl p-5 text-center border border-gray-200 hover:border-amber-300 hover:shadow-lg hover:shadow-amber-100/50 transition-shadow cursor-pointer group"
                        >
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-50 text-amber-600 mb-3 group-hover:bg-amber-100 group-hover:scale-110 transition-all duration-200">
                                <cat.icon className="w-6 h-6" />
                            </div>
                            <h4 className="font-semibold text-gray-800 text-sm">{cat.name}</h4>
                            <p className="text-xs text-gray-400 mt-1">{cat.count}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}