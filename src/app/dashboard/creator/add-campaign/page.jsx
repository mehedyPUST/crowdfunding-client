'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/app/context/AuthContext';

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

const categories = ['Technology', 'Art', 'Community', 'Health', 'Education', 'Environment', 'Music & Film', 'Other'];

export default function AddCampaignPage() {
    const { api } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [form, setForm] = useState({
        title: '',
        story: '',
        category: 'Technology',
        fundingGoal: '',
        minContribution: '1',
        deadline: '',
        rewardInfo: '',
        image: '',
    });

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) return toast.error('Image must be under 2MB');

        setUploading(true);
        const fd = new FormData();
        fd.append('image', file);
        try {
            const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: 'POST', body: fd });
            const data = await res.json();
            if (data.success) {
                setForm({ ...form, image: data.data.url });
                toast.success('Image uploaded!');
            }
        } catch { toast.error('Upload failed'); }
        finally { setUploading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title || !form.story || !form.fundingGoal || !form.deadline) {
            return toast.error('Fill all required fields');
        }
        setLoading(true);
        try {
            await api.post('/campaigns', form);
            toast.success('Campaign submitted for approval!');
            router.push('/dashboard/my-campaigns');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to create campaign');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-slate-800 mb-6">Add New Campaign</h1>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Campaign Title *</label>
                    <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-sm" placeholder="Help us build a solar-powered water pump" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Campaign Story *</label>
                    <textarea required rows={5} value={form.story} onChange={(e) => setForm({ ...form, story: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-sm resize-none" placeholder="Describe your campaign in detail..." />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Category *</label>
                        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-sm">
                            {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Funding Goal (credits) *</label>
                        <input type="number" required min="1" value={form.fundingGoal} onChange={(e) => setForm({ ...form, fundingGoal: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-sm" placeholder="5000" />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Min Contribution</label>
                        <input type="number" min="1" value={form.minContribution} onChange={(e) => setForm({ ...form, minContribution: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Deadline *</label>
                        <input type="date" required value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-sm" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Reward Info</label>
                    <input type="text" value={form.rewardInfo} onChange={(e) => setForm({ ...form, rewardInfo: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-sm" placeholder="What backers receive" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Campaign Image</label>
                    {form.image ? (
                        <div className="relative w-40 h-24 mb-2">
                            <Image src={form.image} alt="Campaign" fill className="object-cover rounded-lg" sizes="160px" />
                            <button type="button" onClick={() => setForm({ ...form, image: '' })} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"><X className="w-4 h-4" /></button>
                        </div>
                    ) : (
                        <label className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-lg px-4 py-6 cursor-pointer hover:border-brand-400 transition text-sm text-slate-500">
                            <Upload className="w-5 h-5" /> {uploading ? 'Uploading...' : 'Click to upload'}
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                        </label>
                    )}
                </div>

                <button type="submit" disabled={loading} className="w-full bg-brand-600 text-white py-2.5 rounded-lg font-semibold hover:bg-brand-700 transition disabled:opacity-50 text-sm">
                    {loading ? 'Submitting...' : 'Add Campaign'}
                </button>
            </form>
        </div>
    );
}