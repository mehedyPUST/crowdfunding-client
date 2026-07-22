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
                ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-amber-100/30 border-b border-gray-200'
                : 'bg-gradient-to-b from-white to-gray-50 border-b border-transparent'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-18">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="relative">
                            <Heart className="w-7 h-7 text-amber-500 group-hover:scale-110 transition-transform duration-300" fill="currentColor" fillOpacity="0.2" />
                            <div className="absolute inset-0 bg-amber-400 blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-full" />
                        </div>
                        <span className="text-xl font-bold text-gray-800">
                            Crowd<span className="text-amber-600">Fund</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="flex items-center gap-1.5 text-gray-700 hover:text-amber-600 hover:bg-amber-50/80 px-4 py-2 rounded-xl transition-all duration-200 text-sm font-medium"
                            >
                                <link.icon className="w-4 h-4" />
                                {link.label}
                            </Link>
                        ))}

                        <div className="w-px h-6 bg-gray-300/60 mx-3" />

                        {!user ? (
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/login"
                                    className="text-gray-700 hover:text-amber-600 hover:bg-gray-100 px-5 py-2 rounded-xl transition-all duration-200 text-sm font-medium"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-200 text-sm font-semibold shadow-md shadow-amber-200 hover:shadow-lg hover:shadow-amber-200/60 active:scale-95"
                                >
                                    Get Started
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                {/* Credits Badge - Emerald accent */}
                                <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full shadow-sm">
                                    <span className="text-sm">🪙</span>
                                    <span className="text-emerald-700 font-semibold text-sm">{user?.credits || 0}</span>
                                </div>

                                <div className="w-px h-6 bg-gray-300/60 mx-1" />

                                <NotificationBell />

                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-1.5 text-gray-700 hover:text-amber-600 hover:bg-amber-50/80 px-3 py-2 rounded-xl transition-all duration-200 text-sm font-medium"
                                    title="Dashboard"
                                >
                                    <LayoutDashboard className="w-4 h-4" />
                                    <span className="hidden lg:inline">Dashboard</span>
                                </Link>

                                <button
                                    onClick={logout}
                                    className="flex items-center gap-1.5 text-gray-600 hover:text-rose-500 hover:bg-rose-50 px-3 py-2 rounded-xl transition-all duration-200 text-sm font-medium"
                                    title="Logout"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span className="hidden lg:inline">Logout</span>
                                </button>
                            </div>
                        )}

                        <div className="w-px h-6 bg-gray-300/60 mx-1" />

                        {/* Developer Link - Emerald accent */}
                        <a
                            href="https://github.com/mehedyPUST/crowdfunding-client"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-700 font-medium border border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50/50 px-3 py-2 rounded-xl transition-all duration-200"
                        >
                            <ExternalLink className="w-3 h-3" />
                            Developer
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden relative p-2.5 text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200 active:scale-95"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden border-t border-gray-200 bg-white shadow-2xl shadow-gray-300/20 animate-in slide-in-from-top-2">
                    <div className="px-4 py-5 space-y-1.5">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="flex items-center gap-2.5 text-gray-700 hover:text-amber-600 hover:bg-amber-50/80 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200"
                                onClick={() => setMenuOpen(false)}
                            >
                                <link.icon className="w-4 h-4" />
                                {link.label}
                            </Link>
                        ))}

                        <div className="border-t border-gray-200 my-3" />

                        {!user ? (
                            <div className="space-y-1.5 pt-1">
                                <Link
                                    href="/login"
                                    className="block text-gray-700 hover:text-amber-600 hover:bg-gray-100 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="block bg-gradient-to-r from-amber-500 to-orange-500 text-white px-5 py-3 rounded-xl text-center text-sm font-semibold shadow-md shadow-amber-200 active:scale-95 transition-all duration-200"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Get Started
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-1.5 pt-1">
                                <div className="flex items-center justify-between px-4 py-3 bg-emerald-50 rounded-xl border border-emerald-200">
                                    <span className="text-emerald-700 font-semibold text-sm flex items-center gap-2">
                                        🪙 {user?.credits || 0} Credits
                                    </span>
                                    <NotificationBell />
                                </div>
                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-2.5 text-gray-700 hover:text-amber-600 hover:bg-amber-50/80 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                                </Link>
                                <button
                                    onClick={() => { logout(); setMenuOpen(false); }}
                                    className="flex items-center gap-2.5 text-rose-500 hover:bg-rose-50 px-4 py-3 rounded-xl font-medium text-sm w-full transition-all duration-200"
                                >
                                    <LogOut className="w-4 h-4" /> Logout
                                </button>
                            </div>
                        )}

                        <a
                            href="https://github.com/mehedyPUST/crowdfunding-client"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2.5 text-emerald-600 font-medium text-sm px-4 py-3 hover:bg-emerald-50 rounded-xl transition-all duration-200 mt-1"
                        >
                            <ExternalLink className="w-3.5 h-3.5" /> Developer
                        </a>
                    </div>
                </div>
            )}
        </nav>
    );
}