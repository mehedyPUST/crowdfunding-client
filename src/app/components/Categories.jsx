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
        <section className="py-16 md:py-20 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">Explore by Category</h2>
                    <p className="text-slate-500 max-w-2xl mx-auto">Find campaigns that match your interests.</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {categories.map((cat, index) => (
                        <div key={index} className="bg-white rounded-xl p-5 text-center border border-slate-200 hover:border-brand-300 hover:shadow-md transition cursor-pointer group">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-50 text-brand-600 mb-3 group-hover:bg-brand-100 transition">
                                <cat.icon className="w-6 h-6" />
                            </div>
                            <h4 className="font-medium text-slate-800 text-sm">{cat.name}</h4>
                            <p className="text-xs text-slate-400 mt-1">{cat.count}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}