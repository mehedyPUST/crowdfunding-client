'use client';

import { useState } from 'react';

export default function Tooltip({ children, content, position = 'top' }) {
    const [show, setShow] = useState(false);

    const positions = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    };

    return (
        <div
            className="relative inline-flex"
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
        >
            {children}
            {show && (
                <div className={`absolute z-50 ${positions[position]} px-3 py-1.5 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-xs rounded-lg whitespace-nowrap shadow-lg pointer-events-none`}>
                    {content}
                </div>
            )}
        </div>
    );
}