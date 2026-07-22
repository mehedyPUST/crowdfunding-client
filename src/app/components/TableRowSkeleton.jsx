import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function TableRowSkeleton({ cols = 5, rows = 5 }) {
    return (
        <div className="p-4 space-y-4">
            <div className="flex gap-4 pb-3 border-b border-gray-100">
                {[...Array(cols)].map((_, j) => (
                    <Skeleton key={j} height={16} width={`${100 / cols}%`} />
                ))}
            </div>
            {[...Array(rows)].map((_, i) => (
                <div key={i} className="flex gap-4 py-2">
                    {[...Array(cols)].map((_, j) => (
                        <Skeleton key={j} height={20} width={`${100 / cols}%`} />
                    ))}
                </div>
            ))}
        </div>
    );
}