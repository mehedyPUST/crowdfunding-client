'use client';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

export default function DarkModeToggle({ className = '' }) {
    const { dark, toggle } = useTheme();

    return (
        <motion.button
            onClick={toggle}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`relative p-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-amber-400 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-700 dark:hover:text-amber-300 transition-all duration-200 border border-gray-200 dark:border-gray-600 ${className}`}
            title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
            <motion.div
                initial={false}
                animate={{ rotate: dark ? 180 : 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
            >
                {dark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </motion.div>
        </motion.button>
    );
}