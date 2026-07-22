import { Package, Search, Clock, FileText, Wallet, CreditCard, Users, Heart, Inbox } from 'lucide-react';

const icons = {
    package: Package,
    search: Search,
    clock: Clock,
    file: FileText,
    wallet: Wallet,
    card: CreditCard,
    users: Users,
    heart: Heart,
    inbox: Inbox,
};

export default function EmptyState({ icon = 'inbox', title, description, action }) {
    const Icon = icons[icon] || Inbox;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 text-center shadow-sm">
            <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 mb-6">
                <Icon className="w-12 h-12 text-amber-400 dark:text-amber-500" />
                <div className="absolute inset-0 bg-amber-300/10 dark:bg-amber-500/5 rounded-3xl blur-xl" />
            </div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">{title}</h2>
            {description && (
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto text-sm leading-relaxed">{description}</p>
            )}
            {action && <div className="mt-6">{action}</div>}
        </div>
    );
}