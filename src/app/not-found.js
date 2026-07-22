import Link from 'next/link';
import { Home, Compass } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 px-4">
            <div className="text-center max-w-md">
                {/* 404 Number */}
                <h1 className="text-8xl font-black text-amber-500 dark:text-amber-400 mb-4 tracking-tighter select-none">
                    404
                </h1>

                {/* Icon */}
                <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 mb-6">
                    <Compass className="w-12 h-12 text-amber-400 dark:text-amber-500" />
                    <div className="absolute inset-0 bg-amber-300/10 dark:bg-amber-500/5 rounded-3xl blur-xl" />
                </div>

                <h2 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100 mb-2">
                    Page Not Found
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                    The page you are looking for does not exist or has been moved to another location.
                </p>

                <Link
                    href="/"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 text-white px-8 py-3.5 rounded-2xl font-semibold hover:from-amber-600 hover:to-orange-600 dark:hover:from-amber-500 dark:hover:to-orange-500 transition-all shadow-lg shadow-amber-200/40 dark:shadow-amber-900/30 hover:shadow-xl hover:shadow-amber-200/60 dark:hover:shadow-amber-900/40 active:scale-95"
                >
                    <Home className="w-4 h-4" />
                    Go Home
                </Link>
            </div>
        </div>
    );
}