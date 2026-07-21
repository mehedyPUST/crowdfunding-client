import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-brand-600 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-slate-800 mb-2">Page Not Found</h2>
                <p className="text-slate-500 mb-6">The page you are looking for does not exist.</p>
                <Link href="/" className="bg-brand-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-700 transition">
                    Go Home
                </Link>
            </div>
        </div>
    );
}