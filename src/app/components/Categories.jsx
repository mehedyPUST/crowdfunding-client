import { Code, Palette, HeartPulse, Leaf, GraduationCap, Music } from 'lucide-react';

const categories = [
    { icon: Code, name: 'Technology', count: '120+ Projects' },
    { icon: Palette, name: 'Art & Design', count: '95+ Projects' },
    { icon: HeartPulse, name: 'Health', count: '80+ Projects' },
    { icon: Leaf, name: 'Environment', count: '65+ Projects' },
    { icon: GraduationCap, name: 'Education', count: '110+ Projects' },
    { icon: Music, name: 'Music & Film', count: '70+ Projects' },
];

export default function Categories() {
    return (
        <section className="py-16 md:py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Explore by Category</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Find campaigns that match your interests and passions.
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {categories.map((cat, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl p-5 text-center border border-gray-100 hover:border-brand-300 hover:shadow-md transition cursor-pointer group"
                        >
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-brand-50 to-accent-50 text-brand-600 mb-3 group-hover:scale-110 transition">
                                <cat.icon className="w-6 h-6" />
                            </div>
                            <h4 className="font-medium text-gray-900 text-sm">{cat.name}</h4>
                            <p className="text-xs text-gray-500 mt-1">{cat.count}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}