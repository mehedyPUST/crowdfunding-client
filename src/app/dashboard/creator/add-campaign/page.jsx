'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Upload, X, PlusCircle, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/app/context/AuthContext';
import { motion } from 'framer-motion';
import { fireEmojiConfetti } from '@/utils/confetti';

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
            fireEmojiConfetti();
            toast.success('Campaign submitted for approval!');
            router.push('/dashboard/my-campaigns');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to create campaign');
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = "w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-300 dark:focus:ring-amber-600 focus:border-amber-400 dark:focus:border-amber-500 outline-none text-sm transition-all bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500";

    return (
        <div className="max-w-2xl mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-6"
            >
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    <PlusCircle className="w-6 h-6 text-amber-500" />
                    Add New Campaign
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Share your idea with the world and start raising funds.</p>
            </motion.div>

            {/* Form */}
            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                onSubmit={handleSubmit}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-5 shadow-sm"
            >
                {/* Title */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        Campaign Title <span className="text-rose-500">*</span>
                    </label>
                    <input
                        type="text"
                        required
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        className={inputClasses}
                        placeholder="Help us build a solar-powered water pump"
                    />
                </div>

                {/* Story */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        Campaign Story <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                        required
                        rows={5}
                        value={form.story}
                        onChange={(e) => setForm({ ...form, story: e.target.value })}
                        className={`${inputClasses} resize-none`}
                        placeholder="Describe your campaign in detail..."
                    />
                </div>

                {/* Category & Goal */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                            Category <span className="text-rose-500">*</span>
                        </label>
                        <select
                            value={form.category}
                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                            className={inputClasses}
                        >
                            {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                            Funding Goal (credits) <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="number"
                            required
                            min="1"
                            value={form.fundingGoal}
                            onChange={(e) => setForm({ ...form, fundingGoal: e.target.value })}
                            className={inputClasses}
                            placeholder="5000"
                        />
                    </div>
                </div>

                {/* Min Contribution & Deadline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Min Contribution</label>
                        <input
                            type="number"
                            min="1"
                            value={form.minContribution}
                            onChange={(e) => setForm({ ...form, minContribution: e.target.value })}
                            className={inputClasses}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                            Deadline <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="date"
                            required
                            value={form.deadline}
                            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                            className={inputClasses}
                        />
                    </div>
                </div>

                {/* Reward */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Reward Info</label>
                    <input
                        type="text"
                        value={form.rewardInfo}
                        onChange={(e) => setForm({ ...form, rewardInfo: e.target.value })}
                        className={inputClasses}
                        placeholder="What backers receive"
                    />
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Campaign Image</label>
                    {form.image ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative w-full h-48 mb-2 rounded-xl overflow-hidden"
                        >
                            <Image
                                src={form.image}
                                alt="Campaign"
                                fill
                                className="object-cover"
                                sizes="(max-width: 672px) 100vw, 672px"
                            />
                            <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors" />
                            <motion.button
                                type="button"
                                onClick={() => setForm({ ...form, image: '' })}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="absolute top-3 right-3 bg-rose-500 text-white rounded-full p-1.5 shadow-lg hover:bg-rose-600 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </motion.button>
                        </motion.div>
                    ) : (
                        <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl px-4 py-10 cursor-pointer hover:border-amber-400 dark:hover:border-amber-500 hover:bg-amber-50/30 dark:hover:bg-amber-900/10 transition-all text-sm text-gray-500 dark:text-gray-400">
                            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                <Upload className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                            </div>
                            <div className="text-center">
                                <p className="font-medium text-gray-600 dark:text-gray-300">{uploading ? 'Uploading...' : 'Click to upload image'}</p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">PNG, JPG up to 2MB</p>
                            </div>
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                        </label>
                    )}
                </div>

                {/* Info tip */}
                <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                    <Info className="w-4 h-4 text-amber-500 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700 dark:text-amber-400">
                        Your campaign will be reviewed by our team before going live. This usually takes 24-48 hours.
                    </p>
                </div>

                {/* Submit */}
                <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.01 }}
                    whileTap={{ scale: loading ? 1 : 0.99 }}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 text-white py-3 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 dark:hover:from-amber-500 dark:hover:to-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-md shadow-amber-200/50 dark:shadow-amber-900/30"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <motion.span
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full inline-block"
                            />
                            Submitting...
                        </span>
                    ) : (
                        'Submit Campaign for Review'
                    )}
                </motion.button>
            </motion.form>
        </div>
    );
}