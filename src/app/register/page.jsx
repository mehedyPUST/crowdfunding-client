'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff, Upload, X, User, Mail, Lock, UserPlus, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { fireConfetti } from '@/utils/confetti';
import DarkModeToggle from '../components/DarkModeToggle';

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

export default function RegisterPage() {
    const { register, googleLogin } = useAuth();
    const router = useRouter();
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({ name: '', email: '', photoURL: '', password: '', role: 'supporter' });

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client'; script.async = true; script.defer = true;
        document.body.appendChild(script);
        script.onload = () => {
            if (window.google) {
                window.google.accounts.id.initialize({
                    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
                    callback: (response) => { setLoading(true); googleLogin(response.credential).then(() => { fireConfetti(); toast.success('Welcome!'); router.push('/dashboard'); }).catch((err) => setError(err.response?.data?.error || 'Google sign-in failed')).finally(() => setLoading(false)); },
                });
                window.google.accounts.id.renderButton(document.getElementById('googleSignInBtn'), { type: 'standard', theme: 'outline', size: 'large', text: 'signup_with', shape: 'rectangular', logo_alignment: 'left', width: 400 });
            }
        };
        return () => { const el = document.querySelector('script[src="https://accounts.google.com/gsi/client"]'); if (el) document.body.removeChild(el); };
    }, []);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0]; if (!file) return; if (file.size > 2 * 1024 * 1024) return toast.error('Image must be under 2MB');
        setUploading(true); const fd = new FormData(); fd.append('image', file);
        try { const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: 'POST', body: fd }); const data = await res.json(); if (data.success) { setForm({ ...form, photoURL: data.data.url }); toast.success('Image uploaded!'); } else toast.error('Upload failed'); }
        catch { toast.error('Upload error'); } finally { setUploading(false); }
    };
    const handleRemoveImage = () => setForm({ ...form, photoURL: '' });

    const handleSubmit = async (e) => {
        e.preventDefault(); setError(''); if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
        setLoading(true);
        try { await register(form); fireConfetti(); toast.success('Registration successful!'); router.push('/dashboard'); }
        catch (err) { setError(err.response?.data?.error || 'Registration failed'); } finally { setLoading(false); }
    };

    const inputClasses = "w-full pl-11 sm:pl-12 pr-4 py-3 sm:py-3.5 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600 focus:border-emerald-500 dark:focus:border-emerald-500 outline-none transition-all text-sm sm:text-base placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200";

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-10 sm:py-12">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="w-full max-w-5xl bg-white dark:bg-gray-800 rounded-3xl shadow-xl shadow-amber-100/50 dark:shadow-amber-900/20 overflow-hidden grid md:grid-cols-2 border border-amber-100 dark:border-amber-900/30">
                {/* Left Panel */}
                <div className="hidden md:flex bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 p-10 flex-col justify-center items-center text-white relative overflow-hidden">
                    <div className="absolute top-10 right-10 w-40 h-40 bg-emerald-300/20 rounded-full blur-3xl" /><div className="absolute bottom-10 left-10 w-48 h-48 bg-teal-300/20 rounded-full blur-3xl" />
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.2 }} className="relative z-10 bg-white/10 backdrop-blur-sm p-5 rounded-3xl mb-8"><svg className="w-16 h-16 sm:w-20 sm:h-20" viewBox="0 0 24 24" fill="currentColor" fillOpacity="0.3"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg></motion.div>
                    <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="text-2xl sm:text-3xl font-extrabold mb-4 tracking-tight">Join CrowdFund!</motion.h2>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="text-center text-emerald-100 text-sm sm:text-base leading-relaxed mb-8">Create your account and start supporting or launching amazing campaigns.</motion.p>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }} className="space-y-3 w-full max-w-xs">
                        {['Support creative projects', 'Launch your own campaign', 'Join a global community'].map((item, i) => (<motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-2.5 backdrop-blur-sm"><div className="w-2 h-2 bg-emerald-300 rounded-full flex-shrink-0" /><span className="text-sm">{item}</span></motion.div>))}
                    </motion.div>
                </div>

                {/* Right Panel */}
                <div className="p-8 sm:p-10 md:p-12 overflow-y-auto max-h-[90vh] relative">
                    {/* 🌙 Dark Mode Toggle */}
                    <div className="absolute top-4 right-4 z-10">
                        <DarkModeToggle />
                    </div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="mb-8">
                        <div className="md:hidden flex justify-center mb-6"><div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-4 rounded-2xl"><svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor" fillOpacity="0.3"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg></div></div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">Create Account</h1>
                        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-2">Join the community and start funding ideas</p>
                    </motion.div>

                    {error && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-6 p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 rounded-2xl text-xs sm:text-sm font-medium">{error}</motion.div>}

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="flex justify-center mb-6"><div id="googleSignInBtn"></div></motion.div>

                    <div className="relative mb-6"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-gray-600" /></div><div className="relative flex justify-center text-xs sm:text-sm"><span className="bg-white dark:bg-gray-800 px-4 text-gray-400 dark:text-gray-500 font-medium">or register with email</span></div></div>

                    <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} onSubmit={handleSubmit} className="space-y-4">
                        <div><label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Name</label><div className="relative"><User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500" /><input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClasses} placeholder="Your name" /></div></div>
                        <div><label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email</label><div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500" /><input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClasses} placeholder="you@example.com" /></div></div>
                        <div>
                            <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Profile Picture</label>
                            {form.photoURL ? (
                                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative w-24 h-24 mb-3"><Image src={form.photoURL} alt="Profile" fill className="object-cover rounded-2xl" sizes="96px" /><button type="button" onClick={handleRemoveImage} className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 shadow-lg hover:bg-rose-600 transition-colors"><X className="w-3.5 h-3.5" /></button></motion.div>
                            ) : (
                                <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl px-4 py-8 cursor-pointer hover:border-emerald-400 dark:hover:border-emerald-500 hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10 transition-all text-sm text-gray-500 dark:text-gray-400"><div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center"><Upload className="w-6 h-6 text-gray-400 dark:text-gray-500" /></div><div className="text-center"><p className="font-medium text-gray-600 dark:text-gray-300">{uploading ? 'Uploading...' : 'Click to upload image'}</p><p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">PNG, JPG up to 2MB</p></div><input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} /></label>
                            )}
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 mb-1">Or paste URL below</p>
                            <input type="url" value={form.photoURL} onChange={(e) => setForm({ ...form, photoURL: e.target.value })} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600 focus:border-emerald-500 dark:focus:border-emerald-500 outline-none text-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-all" placeholder="https://... or upload above" />
                        </div>
                        <div><label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Password</label><div className="relative"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500" /><input type={showPass ? 'text' : 'password'} required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={`${inputClasses} pr-12`} placeholder="Min 6 characters" /><button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">{showPass ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}</button></div></div>
                        <div><label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">I want to</label><select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full px-4 py-3 sm:py-3.5 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600 focus:border-emerald-500 dark:focus:border-emerald-500 outline-none text-sm sm:text-base text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 transition-all"><option value="supporter">Support Projects (Supporter)</option><option value="creator">Create Campaigns (Creator)</option></select></div>
                        <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-600 dark:to-teal-600 text-white py-3.5 sm:py-4 rounded-2xl font-bold text-sm sm:text-base hover:from-emerald-600 hover:to-teal-600 dark:hover:from-emerald-500 dark:hover:to-teal-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-md shadow-emerald-200 dark:shadow-emerald-900/30">{loading ? "Creating Account..." : <><UserPlus className="w-4 h-4 sm:w-5 sm:h-5" /> Create Account</>}</motion.button>
                    </motion.form>

                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }} className="mt-8 text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        Already have an account?{" "}<Link href="/login" className="text-emerald-600 dark:text-emerald-400 font-bold hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">Sign in<ArrowRight className="w-3.5 h-3.5 inline ml-1" /></Link>
                    </motion.p>
                </div>
            </motion.div>
        </div>
    );
}