import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function CampaignCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <Skeleton height={176} className="rounded-none leading-none block" />
            <div className="p-4 space-y-3">
                <Skeleton width={80} height={24} borderRadius={100} />
                <Skeleton height={20} width="85%" />
                <Skeleton height={14} width="45%" />
                <div className="flex justify-between items-center pt-1">
                    <Skeleton width={90} height={16} />
                    <Skeleton width={40} height={16} />
                </div>
                <div className="flex gap-2">
                    <Skeleton height={40} borderRadius={12} containerClassName="flex-1" />
                    <Skeleton height={40} borderRadius={12} containerClassName="flex-1" />
                </div>
            </div>
        </div>
    );
}