'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Tooltip({ children, content, position = 'top' }) {
    const [show, setShow] = useState(false);

    const positions = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    };

    const arrows = {
        top: 'top-full left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-100',
        bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900 dark:border-b-gray-100',
        right: 'right-full top-1/2 -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900 dark:border-r-gray-100',
    };

    return (
        <div
            className="relative inline-flex"
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
        >
            {children}
            <AnimatePresence>
                {show && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.15 }}
                        className={`absolute z-50 ${positions[position]} px-3 py-1.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-xl whitespace-nowrap shadow-xl pointer-events-none font-medium`}
                    >
                        {content}
                        <div className={`absolute ${arrows[position] || arrows.top}`} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}