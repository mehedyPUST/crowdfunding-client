import { Users, Rocket, Coins, CheckCircle } from 'lucide-react';

const stats = [
    { icon: Users, value: '12,000+', label: 'Active Supporters' },
    { icon: Rocket, value: '850+', label: 'Funded Campaigns' },
    { icon: Coins, value: '$2.5M+', label: 'Total Raised' },
    { icon: CheckCircle, value: '98%', label: 'Success Rate' },
];

export default function PlatformStats() {
    return (
        <section className="py-16 md:py-20 bg-gradient-to-r from-brand-700 via-brand-600 to-accent-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Platform Impact in Numbers</h2>
                    <p className="text-white/70 max-w-2xl mx-auto">Our community is making waves every day.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center text-white p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
                            <stat.icon className="w-8 h-8 mx-auto mb-3 text-white/80" />
                            <div className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</div>
                            <div className="text-sm text-white/60">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}