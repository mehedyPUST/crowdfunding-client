'use client';

import { Flag, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ReportsPage() {
    return (
        <div>
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-6"
            >
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    <Flag className="w-6 h-6 text-amber-500" />
                    Reports
                </h1>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 text-center shadow-sm"
            >
                <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 mb-6">
                    <BarChart3 className="w-12 h-12 text-amber-400 dark:text-amber-500" />
                    <div className="absolute inset-0 bg-amber-300/10 dark:bg-amber-500/5 rounded-3xl blur-xl" />
                </div>
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Coming Soon</h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto text-sm leading-relaxed">
                    Reported campaigns will appear here for admin review. This feature is currently under development.
                </p>
            </motion.div>
        </div>
    );
}