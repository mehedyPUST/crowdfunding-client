'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Heart, LayoutDashboard, LogOut, Sparkles, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { user, logout } = useAuth();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { href: '/explore', label: 'Explore Campaigns', icon: Sparkles },
    ];

    return (
        <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-slate-200'
                : 'bg-white border-b border-transparent'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative">
                            <Heart className="w-7 h-7 text-brand-600 group-hover:scale-110 transition-transform" />
                            <div className="absolute inset-0 bg-brand-400 blur-lg opacity-30 group-hover:opacity-50 transition-opacity rounded-full" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-brand-600 to-accent-600 bg-clip-text text-transparent">
                            CrowdFund
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="flex items-center gap-1.5 text-slate-600 hover:text-brand-600 hover:bg-brand-50 px-3 py-2 rounded-lg transition-all text-sm font-medium"
                            >
                                <link.icon className="w-4 h-4" />
                                {link.label}
                            </Link>
                        ))}

                        <div className="w-px h-6 bg-slate-200 mx-2" />

                        {!user ? (
                            <div className="flex items-center gap-2">
                                <Link href="/login" className="text-slate-600 hover:text-brand-600 hover:bg-brand-50 px-4 py-2 rounded-lg transition-all text-sm font-medium">
                                    Login
                                </Link>
                                <Link href="/register" className="bg-gradient-to-r from-brand-600 to-brand-500 text-white px-5 py-2 rounded-lg hover:from-brand-700 hover:to-brand-600 transition-all text-sm font-semibold shadow-sm hover:shadow-md">
                                    Get Started
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1">
                                <div className="flex items-center gap-1.5 bg-brand-50 border border-brand-100 px-3 py-1.5 rounded-full">
                                    <span className="text-xs">🪙</span>
                                    <span className="text-brand-700 font-semibold text-sm">{user?.credits || 0}</span>
                                </div>

                                <div className="w-px h-6 bg-slate-200 mx-1" />

                                <NotificationBell />

                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-1.5 text-slate-600 hover:text-brand-600 hover:bg-brand-50 px-3 py-2 rounded-lg transition-all text-sm font-medium"
                                    title="Dashboard"
                                >
                                    <LayoutDashboard className="w-4 h-4" />
                                    <span className="hidden lg:inline">Dashboard</span>
                                </Link>

                                <button
                                    onClick={logout}
                                    className="flex items-center gap-1.5 text-slate-500 hover:text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-all text-sm font-medium"
                                    title="Logout"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span className="hidden lg:inline">Logout</span>
                                </button>
                            </div>
                        )}

                        <div className="w-px h-6 bg-slate-200 mx-1" />

                        <a
                            href="https://github.com/mehedyPUST/crowdfunding-client"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs text-accent-600 hover:text-accent-700 font-medium border border-accent-200 hover:border-accent-300 hover:bg-accent-50 px-3 py-2 rounded-lg transition-all"
                        >
                            <ExternalLink className="w-3 h-3" />
                            Developer
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden relative p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden border-t border-slate-200 bg-white shadow-lg animate-in slide-in-from-top-2">
                    <div className="px-4 py-4 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="flex items-center gap-2 text-slate-600 hover:text-brand-600 hover:bg-brand-50 px-3 py-2.5 rounded-lg font-medium text-sm transition-all"
                                onClick={() => setMenuOpen(false)}
                            >
                                <link.icon className="w-4 h-4" />
                                {link.label}
                            </Link>
                        ))}

                        <div className="border-t border-slate-100 my-2" />

                        {!user ? (
                            <div className="space-y-1">
                                <Link href="/login" className="block text-slate-600 hover:text-brand-600 hover:bg-brand-50 px-3 py-2.5 rounded-lg font-medium text-sm transition-all" onClick={() => setMenuOpen(false)}>
                                    Login
                                </Link>
                                <Link href="/register" className="block bg-gradient-to-r from-brand-600 to-brand-500 text-white px-4 py-2.5 rounded-lg text-center text-sm font-semibold shadow-sm" onClick={() => setMenuOpen(false)}>
                                    Get Started
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                <div className="flex items-center justify-between px-3 py-2">
                                    <span className="text-brand-600 font-semibold text-sm flex items-center gap-1.5">
                                        🪙 {user?.credits || 0} Credits
                                    </span>
                                    <NotificationBell />
                                </div>
                                <Link href="/dashboard" className="flex items-center gap-2 text-slate-600 hover:text-brand-600 hover:bg-brand-50 px-3 py-2.5 rounded-lg font-medium text-sm transition-all" onClick={() => setMenuOpen(false)}>
                                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                                </Link>
                                <button onClick={() => { logout(); setMenuOpen(false); }} className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-3 py-2.5 rounded-lg font-medium text-sm w-full transition-all">
                                    <LogOut className="w-4 h-4" /> Logout
                                </button>
                            </div>
                        )}

                        <a href="https://github.com/mehedyPUST/crowdfunding-client" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-accent-600 font-medium text-sm px-3 py-2.5 hover:bg-accent-50 rounded-lg transition-all">
                            <ExternalLink className="w-3 h-3" /> Developer
                        </a>
                    </div>
                </div>
            )}
        </nav>
    );
}