import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function ProfileSkeleton() {
    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <Skeleton
                width={180}
                height={32}
                baseColor="#e5e7eb"
                highlightColor="#f3f4f6"
            />

            {/* Profile Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <Skeleton
                    height={112}
                    className="rounded-none leading-none block"
                    baseColor="#e5e7eb"
                    highlightColor="#f3f4f6"
                />
                <div className="px-6 pb-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-10">
                        <Skeleton
                            circle
                            width={96}
                            height={96}
                            baseColor="#e5e7eb"
                            highlightColor="#f3f4f6"
                        />
                        <div className="flex-1 pt-2 space-y-2">
                            <Skeleton
                                width={200}
                                height={24}
                                baseColor="#e5e7eb"
                                highlightColor="#f3f4f6"
                            />
                            <Skeleton
                                width={80}
                                height={16}
                                baseColor="#e5e7eb"
                                highlightColor="#f3f4f6"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Skeleton
                                width={80}
                                height={40}
                                borderRadius={12}
                                baseColor="#e5e7eb"
                                highlightColor="#f3f4f6"
                            />
                            <Skeleton
                                width={100}
                                height={40}
                                borderRadius={12}
                                baseColor="#e5e7eb"
                                highlightColor="#f3f4f6"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 flex items-center gap-4">
                        <Skeleton
                            circle
                            width={40}
                            height={40}
                            baseColor="#e5e7eb"
                            highlightColor="#f3f4f6"
                        />
                        <div className="flex-1">
                            <Skeleton
                                width="50%"
                                height={12}
                                className="mb-1.5"
                                baseColor="#e5e7eb"
                                highlightColor="#f3f4f6"
                            />
                            <Skeleton
                                width="75%"
                                height={16}
                                baseColor="#e5e7eb"
                                highlightColor="#f3f4f6"
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Activity Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                <Skeleton
                    width={140}
                    height={20}
                    className="mb-4"
                    baseColor="#e5e7eb"
                    highlightColor="#f3f4f6"
                />
                <div className="grid grid-cols-2 gap-4">
                    <Skeleton
                        height={80}
                        borderRadius={12}
                        baseColor="#e5e7eb"
                        highlightColor="#f3f4f6"
                    />
                    <Skeleton
                        height={80}
                        borderRadius={12}
                        baseColor="#e5e7eb"
                        highlightColor="#f3f4f6"
                    />
                </div>
            </div>
        </div>
    );
}