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
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Flag className="w-6 h-6 text-amber-500" />
                    Reports
                </h1>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm"
            >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gray-100 mb-6">
                    <BarChart3 className="w-10 h-10 text-gray-400" />
                </div>
                <h2 className="text-lg font-semibold text-gray-700 mb-2">Coming Soon</h2>
                <p className="text-gray-500 max-w-md mx-auto">
                    Reported campaigns will appear here for admin review. This feature is currently under development.
                </p>
            </motion.div>
        </div>
    );
}