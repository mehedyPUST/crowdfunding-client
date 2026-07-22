'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { fireConfetti } from '@/utils/confetti';

export default function LoginPage() {
    const { login, googleLogin } = useAuth();
    const router = useRouter();
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        script.onload = () => {
            if (window.google) {
                window.google.accounts.id.initialize({
                    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
                    callback: (response) => {
                        setLoading(true);
                        googleLogin(response.credential)
                            .then(() => {
                                fireConfetti();
                                toast.success('Welcome!');
                                router.push('/dashboard');
                            })
                            .catch((err) => {
                                setError(err.response?.data?.error || 'Google sign-in failed');
                            })
                            .finally(() => setLoading(false));
                    },
                });
                window.google.accounts.id.renderButton(
                    document.getElementById('googleSignInBtn'),
                    {
                        type: 'standard',
                        theme: 'outline',
                        size: 'large',
                        text: 'continue_with',
                        shape: 'rectangular',
                        logo_alignment: 'left',
                        width: 400,
                    }
                );
            }
        };

        return () => {
            const el = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
            if (el) document.body.removeChild(el);
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            fireConfetti();
            toast.success('Welcome back!');
            router.push('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-10 sm:py-12">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-5xl bg-white rounded-3xl shadow-xl shadow-amber-100/50 overflow-hidden grid md:grid-cols-2 border border-amber-100"
            >
                {/* Left Panel */}
                <div className="hidden md:flex bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 p-10 flex-col justify-center items-center text-white relative overflow-hidden">
                    <div className="absolute top-10 right-10 w-40 h-40 bg-amber-300/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-10 left-10 w-48 h-48 bg-orange-300/20 rounded-full blur-3xl" />

                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                        className="relative z-10 bg-white/10 backdrop-blur-sm p-5 rounded-3xl mb-8"
                    >
                        <svg className="w-16 h-16 sm:w-20 sm:h-20" viewBox="0 0 24 24" fill="currentColor" fillOpacity="0.3">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                    </motion.div>

                    <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="text-2xl sm:text-3xl font-extrabold mb-4 tracking-tight">
                        Welcome Back!
                    </motion.h2>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="text-center text-amber-100 text-sm sm:text-base leading-relaxed mb-8">
                        Sign in to continue supporting amazing campaigns and creative projects.
                    </motion.p>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }} className="space-y-3 w-full max-w-xs">
                        {['Discover innovative projects', 'Support creators worldwide', 'Track your contributions'].map((item, i) => (
                            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-2.5 backdrop-blur-sm">
                                <div className="w-2 h-2 bg-amber-300 rounded-full flex-shrink-0" /><span className="text-sm">{item}</span>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Right Panel */}
                <div className="p-8 sm:p-10 md:p-12">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="mb-8">
                        <div className="md:hidden flex justify-center mb-6">
                            <div className="bg-gradient-to-br from-amber-500 to-orange-500 p-4 rounded-2xl">
                                <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor" fillOpacity="0.3">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                </svg>
                            </div>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Sign In</h1>
                        <p className="text-sm sm:text-base text-gray-500 mt-2">Access your CrowdFund account</p>
                    </motion.div>

                    {error && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs sm:text-sm font-medium">
                            {error}
                        </motion.div>
                    )}

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="flex justify-center mb-6">
                        <div id="googleSignInBtn"></div>
                    </motion.div>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
                        <div className="relative flex justify-center text-xs sm:text-sm"><span className="bg-white px-4 text-gray-400 font-medium">or continue with email</span></div>
                    </div>

                    <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className="w-full pl-11 sm:pl-12 pr-4 py-3 sm:py-3.5 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-sm sm:text-base placeholder-gray-400" placeholder="you@example.com" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                <input id="password" type={showPass ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" className="w-full pl-11 sm:pl-12 pr-12 py-3 sm:py-3.5 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-sm sm:text-base placeholder-gray-400" placeholder="Your password" />
                                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-600 transition-colors">{showPass ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}</button>
                            </div>
                        </div>
                        <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3.5 sm:py-4 rounded-2xl font-bold text-sm sm:text-base hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-md shadow-amber-200">
                            {loading ? "Signing in..." : <><LogIn className="w-4 h-4 sm:w-5 sm:h-5" /> Sign In</>}
                        </motion.button>
                    </motion.form>

                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }} className="mt-8 text-center text-xs sm:text-sm text-gray-500">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="text-amber-600 font-bold hover:text-amber-700 transition-colors">Create one<ArrowRight className="w-3.5 h-3.5 inline ml-1" /></Link>
                    </motion.p>
                </div>
            </motion.div>
        </div>
    );
}