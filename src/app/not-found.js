import Link from 'next/link';
import { Home, Compass } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4">
            <div className="text-center max-w-md">
                {/* 404 Number */}
                <h1 className="text-8xl font-black text-amber-500 mb-4 tracking-tighter">404</h1>

                {/* Icon */}
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-amber-50 mb-6">
                    <Compass className="w-10 h-10 text-amber-400" />
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h2>
                <p className="text-gray-500 mb-8">
                    The page you are looking for does not exist or has been moved.
                </p>

                <Link
                    href="/"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-md shadow-amber-200/50"
                >
                    <Home className="w-4 h-4" />
                    Go Home
                </Link>
            </div>
        </div>
    );
}