'use client';

import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AccessDenied({ role }) {
    return (
        <div className="flex items-center justify-center min-h-[60vh] px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-center max-w-md"
            >
                {/* Shield Icon */}
                <div className="relative inline-block mb-6">
                    <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="relative z-10 inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-rose-50 dark:bg-rose-900/20"
                    >
                        <ShieldAlert className="w-12 h-12 text-rose-500 dark:text-rose-400" />
                    </motion.div>
                    <div className="absolute inset-0 bg-rose-200 dark:bg-rose-800/30 blur-2xl rounded-full opacity-40" />
                </div>

                {/* Content */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                >
                    <h1 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 mb-3">
                        Access Denied
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-8 text-base leading-relaxed">
                        You do not have permission to access this page as a{' '}
                        <span className="capitalize font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2.5 py-0.5 rounded-lg border border-amber-200 dark:border-amber-800">
                            {role}
                        </span>
                        .
                    </p>
                </motion.div>

                {/* Button */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 text-white px-8 py-3.5 rounded-2xl font-semibold shadow-lg shadow-amber-200/40 dark:shadow-amber-900/30 hover:shadow-xl hover:shadow-amber-200/60 dark:hover:shadow-amber-900/40 hover:from-amber-600 hover:to-orange-600 dark:hover:from-amber-500 dark:hover:to-orange-500 transition-all duration-200 text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go to Dashboard
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
}