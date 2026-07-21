'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Eye, EyeOff, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

export default function RegisterPage() {
    const { register, googleLogin } = useAuth();
    const router = useRouter();
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [form, setForm] = useState({
        name: '',
        email: '',
        photoURL: '',
        password: '',
        role: 'supporter',
    });

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
                                toast.success('Welcome!');
                                router.push('/dashboard');
                            })
                            .catch((err) => {
                                toast.error(err.response?.data?.error || 'Google sign-in failed');
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
                        text: 'signup_with',
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

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            return toast.error('Image must be under 2MB');
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (data.success) {
                setForm({ ...form, photoURL: data.data.url });
                toast.success('Image uploaded!');
            } else {
                toast.error('Upload failed');
            }
        } catch {
            toast.error('Upload error');
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveImage = () => {
        setForm({ ...form, photoURL: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
        setLoading(true);
        try {
            await register(form);
            toast.success('Registration successful!');
            router.push('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Heart className="w-10 h-10 text-brand-600 mx-auto mb-3" />
                    <h1 className="text-2xl font-bold text-slate-800">Create Your Account</h1>
                    <p className="text-slate-500 mt-1">Join the community and start funding ideas</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
                    <div className="flex justify-center mb-2">
                        <div id="googleSignInBtn"></div>
                    </div>

                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-3 bg-white text-slate-500">Or register with email</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                        <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none text-sm" placeholder="Your name" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none text-sm" placeholder="you@example.com" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Profile Picture</label>

                        {form.photoURL ? (
                            <div className="relative w-24 h-24 mb-2">
                                <Image src={form.photoURL} alt="Profile" fill className="object-cover rounded-lg" sizes="96px" />
                                <button type="button" onClick={handleRemoveImage} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <label className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-lg px-4 py-6 cursor-pointer hover:border-brand-400 transition text-sm text-slate-500">
                                <Upload className="w-5 h-5" />
                                {uploading ? 'Uploading...' : 'Click to upload image'}
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                            </label>
                        )}

                        <p className="text-xs text-slate-400 mt-1">Or paste URL below</p>
                        <input type="url" value={form.photoURL} onChange={(e) => setForm({ ...form, photoURL: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none text-sm mt-1" placeholder="https://... or upload above" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <div className="relative">
                            <input type={showPass ? 'text' : 'password'} required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none text-sm pr-10" placeholder="Min 6 characters" />
                            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-2.5 text-slate-400">
                                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none text-sm">
                            <option value="supporter">Supporter</option>
                            <option value="creator">Creator</option>
                        </select>
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-brand-600 text-white py-2.5 rounded-lg font-semibold hover:bg-brand-700 transition disabled:opacity-50 text-sm">
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>

                    <p className="text-center text-sm text-slate-500">
                        Already have an account? <Link href="/login" className="text-brand-600 hover:underline font-medium">Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}