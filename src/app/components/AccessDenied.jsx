import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

export default function AccessDenied({ role }) {
    return (
        <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md">
                <ShieldAlert className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Access Denied</h1>
                <p className="text-slate-500 mb-6">
                    You do not have permission to access this page as a{' '}
                    <span className="capitalize font-medium">{role}</span>.
                </p>
                <Link
                    href="/dashboard"
                    className="bg-brand-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-700 transition"
                >
                    Go to Dashboard
                </Link>
            </div>
        </div>
    );
}