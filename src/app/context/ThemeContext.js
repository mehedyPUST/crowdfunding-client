'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext({ dark: false, toggle: () => { }, mounted: false });

export function ThemeProvider({ children }) {
    const [dark, setDark] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (saved === 'dark' || (!saved && prefersDark)) {
            setDark(true);
            document.documentElement.classList.add('dark');
        } else if (saved === 'light') {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggle = useCallback(() => {
        setDark(prev => {
            const next = !prev;
            document.documentElement.classList.toggle('dark', next);
            localStorage.setItem('theme', next ? 'dark' : 'light');
            return next;
        });
    }, []);

    return (
        <ThemeContext.Provider value={{ dark, toggle, mounted }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);