import { Package, Search, Clock, FileText, Wallet, CreditCard, Users, Heart } from 'lucide-react';

const icons = {
    package: Package,
    search: Search,
    clock: Clock,
    file: FileText,
    wallet: Wallet,
    card: CreditCard,
    users: Users,
    heart: Heart,
};

export default function EmptyState({ icon = 'package', title, description, action }) {
    const Icon = icons[icon] || Package;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 text-center shadow-sm">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-amber-50 dark:bg-amber-900/20 mb-6">
                <Icon className="w-10 h-10 text-amber-400 dark:text-amber-500" />
            </div>
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">{title}</h2>
            {description && <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">{description}</p>}
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
}