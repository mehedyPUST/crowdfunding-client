'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function MyContributionsPage() {
    const { api } = useAuth();
    const [data, setData] = useState({ contributions: [], total: 0, page: 1, totalPages: 1 });
    const [loading, setLoading] = useState(true);

    const fetchContributions = async (page = 1) => {
        setLoading(true);
        try {
            const res = await api.get(`/contributions/my?page=${page}&limit=5`);
            setData(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContributions();
    }, []);

    const statusBadge = (status) => {
        const colors = {
            approved: 'bg-green-100 text-green-700',
            pending: 'bg-yellow-100 text-yellow-700',
            rejected: 'bg-red-100 text-red-700',
        };
        return (
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[status] || ''}`}>
                {status}
            </span>
        );
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-6">My Contributions</h1>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
                </div>
            ) : data.contributions.length === 0 ? (
                <p className="text-slate-500 text-center py-12">No contributions yet.</p>
            ) : (
                <>
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="text-left px-4 py-3 font-medium text-slate-600">Campaign</th>
                                    <th className="text-left px-4 py-3 font-medium text-slate-600">Amount</th>
                                    <th className="text-left px-4 py-3 font-medium text-slate-600 hidden sm:table-cell">Creator</th>
                                    <th className="text-left px-4 py-3 font-medium text-slate-600">Date</th>
                                    <th className="text-left px-4 py-3 font-medium text-slate-600">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {data.contributions.map((c) => (
                                    <tr key={c._id} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 font-medium text-slate-800 truncate max-w-[120px]">{c.campaignTitle}</td>
                                        <td className="px-4 py-3">{c.amount}</td>
                                        <td className="px-4 py-3 text-slate-500 hidden sm:table-cell">{c.creatorName}</td>
                                        <td className="px-4 py-3 text-slate-500 text-xs">{new Date(c.date).toLocaleDateString()}</td>
                                        <td className="px-4 py-3">{statusBadge(c.status)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between mt-4 text-sm">
                        <p className="text-slate-500">
                            Page {data.page} of {data.totalPages} ({data.total} total)
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => fetchContributions(data.page - 1)}
                                disabled={data.page <= 1}
                                className="flex items-center gap-1 px-3 py-1.5 border border-slate-300 rounded-lg disabled:opacity-40 hover:bg-slate-50 text-slate-600"
                            >
                                <ChevronLeft className="w-4 h-4" /> Prev
                            </button>
                            <button
                                onClick={() => fetchContributions(data.page + 1)}
                                disabled={data.page >= data.totalPages}
                                className="flex items-center gap-1 px-3 py-1.5 border border-slate-300 rounded-lg disabled:opacity-40 hover:bg-slate-50 text-slate-600"
                            >
                                Next <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}