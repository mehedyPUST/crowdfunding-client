import { Lightbulb, Users, HandHeart, TrendingUp } from 'lucide-react';

const steps = [
    { icon: Lightbulb, title: 'Start a Campaign', desc: 'Share your idea and set a funding goal.' },
    { icon: Users, title: 'Build Community', desc: 'Reach supporters who believe in your vision.' },
    { icon: HandHeart, title: 'Get Funded', desc: 'Receive contributions toward your goal.' },
    { icon: TrendingUp, title: 'Make It Real', desc: 'Use funds to bring your project to life.' },
];

export default function HowItWorks() {
    return (
        <section className="py-16 md:py-20 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">How It Works</h2>
                    <p className="text-slate-500 max-w-2xl mx-auto">Launching and supporting campaigns is simple.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <div key={index} className="text-center group">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white border border-slate-200 text-brand-600 mb-4 group-hover:border-brand-300 group-hover:shadow-md transition">
                                <step.icon className="w-8 h-8" />
                            </div>
                            <h3 className="font-semibold text-slate-800 mb-2">{step.title}</h3>
                            <p className="text-sm text-slate-500">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}