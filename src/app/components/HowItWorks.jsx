import { Lightbulb, Users, HandHeart, TrendingUp } from 'lucide-react';

const steps = [
    {
        icon: Lightbulb,
        title: 'Start a Campaign',
        desc: 'Share your idea, set a funding goal, and tell your story to inspire backers.',
    },
    {
        icon: Users,
        title: 'Build Community',
        desc: 'Reach supporters who believe in your vision and want to see it come to life.',
    },
    {
        icon: HandHeart,
        title: 'Get Funded',
        desc: 'Receive contributions and watch your campaign grow toward its goal.',
    },
    {
        icon: TrendingUp,
        title: 'Make It Real',
        desc: 'Use the funds to bring your project to life and deliver rewards to backers.',
    },
];

export default function HowItWorks() {
    return (
        <section className="py-16 md:py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">How It Works</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Launching and supporting campaigns is simple — here is the process.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <div key={index} className="text-center group">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-100 to-accent-100 text-brand-600 mb-4 group-hover:scale-110 transition">
                                <step.icon className="w-8 h-8" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                            <p className="text-sm text-gray-500">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}