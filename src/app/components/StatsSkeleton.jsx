import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function StatsSkeleton({ cards = 4 }) {
    return (
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${cards} gap-4`}>
            {[...Array(cards)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5">
                    <Skeleton circle width={36} height={36} className="mb-3" />
                    <Skeleton width="65%" height={14} className="mb-1.5" />
                    <Skeleton width="45%" height={28} />
                </div>
            ))}
        </div>
    );
}