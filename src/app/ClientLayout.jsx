'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';

function ClientLayoutInner({ children }) {
    const pathname = usePathname();
    const isDashboard = pathname.startsWith('/dashboard');

    useEffect(() => {
        try {
            const theme = localStorage.getItem('theme');
            if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        } catch (e) { }
    }, []);

    return (
        <>
            {!isDashboard && <Navbar />}
            <main id="main-content" className={isDashboard ? 'pb-16 lg:pb-0' : ''}>
                {children}
            </main>
            {!isDashboard && <Footer />}
            <Toaster
                position="top-right"
                toastOptions={{
                    className: 'dark:!bg-gray-800 dark:!text-gray-200 dark:!border-gray-700',
                    style: {
                        borderRadius: '12px',
                        background: '#fff',
                        color: '#1f2937',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                        border: '1px solid #e5e7eb',
                    },
                    success: { iconTheme: { primary: '#059669', secondary: '#fff' } },
                    error: { iconTheme: { primary: '#f43f5e', secondary: '#fff' } },
                }}
            />
        </>
    );
}

export default function ClientLayout({ children }) {
    return (
        <ThemeProvider>
            <AuthProvider>
                <ClientLayoutInner>{children}</ClientLayoutInner>
            </AuthProvider>
        </ThemeProvider>
    );
}