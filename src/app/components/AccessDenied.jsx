'use client';

import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AccessDenied({ role }) {
    return (
        <div className="flex items-center justify-center min-h-[60vh] px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-center max-w-md"
            >
                {/* Animated Shield Icon */}
                <motion.div
                    animate={{
                        rotate: [0, -5, 5, -3, 0],
                    }}
                    transition={{
                        duration: 0.6,
                        delay: 0.3,
                        ease: "easeInOut"
                    }}
                    className="inline-block mb-6"
                >
                    <div className="relative">
                        <ShieldAlert className="w-20 h-20 text-rose-400 mx-auto" />
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.3, 0.1, 0.3]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="absolute inset-0 bg-rose-300 blur-2xl opacity-20 rounded-full"
                        />
                    </div>
                </motion.div>

                {/* Content */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                >
                    <h1 className="text-3xl font-bold text-gray-800 mb-3">
                        Access Denied
                    </h1>
                    <p className="text-gray-500 mb-8 text-base leading-relaxed">
                        You do not have permission to access this page as a{' '}
                        <span className="capitalize font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                            {role}
                        </span>.
                    </p>
                </motion.div>

                {/* Button */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                >
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-amber-200/50 hover:shadow-xl hover:shadow-amber-200/70 hover:from-amber-600 hover:to-orange-600 transition-all duration-200"
                    >
                        Go to Dashboard
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
}