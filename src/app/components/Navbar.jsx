'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Heart, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';


export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { user, logout } = useAuth();

    const navLinks = [
        { href: '/explore', label: 'Explore Campaigns' },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <Heart className="w-7 h-7 text-brand-600" />
                        <span className="text-xl font-bold text-slate-800">CrowdFund</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-slate-600 hover:text-brand-600 transition font-medium text-sm"
                            >
                                {link.label}
                            </Link>
                        ))}

                        {!user ? (
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/login"
                                    className="text-slate-600 hover:text-brand-600 transition font-medium text-sm"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition text-sm font-medium"
                                >
                                    Register
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <span className="text-brand-600 font-medium text-sm">
                                    🪙 {user?.credits || 0} Credits
                                </span>
                                <Link
                                    href="/dashboard"
                                    className="text-slate-600 hover:text-brand-600 transition"
                                    title="Dashboard"
                                >
                                    <LayoutDashboard className="w-5 h-5" />
                                </Link>
                                <button
                                    onClick={logout}
                                    className="flex items-center gap-1 text-slate-600 hover:text-red-500 transition text-sm"
                                    title="Logout"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        )}

                        <a
                            href="https://github.com/তোমার/crowdfunding-client"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-accent-600 hover:text-accent-700 font-medium border border-accent-200 px-3 py-1.5 rounded-lg hover:bg-accent-50 transition"
                        >
                            Join as Developer
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-slate-700"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden border-t border-slate-200 bg-white">
                    <div className="px-4 py-4 space-y-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="block text-slate-600 hover:text-brand-600 font-medium text-sm"
                                onClick={() => setMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}

                        <hr className="border-slate-200" />

                        {!user ? (
                            <div className="space-y-2 pt-1">
                                <Link
                                    href="/login"
                                    className="block text-slate-600 hover:text-brand-600 font-medium text-sm"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="block bg-brand-600 text-white px-4 py-2 rounded-lg text-center text-sm font-medium"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Register
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-2 pt-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-brand-600 font-medium text-sm">
                                        🪙 {user?.credits || 0} Credits
                                    </span>
                                </div>
                                <Link
                                    href="/dashboard"
                                    className="block text-slate-600 hover:text-brand-600 font-medium text-sm"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={() => {
                                        logout();
                                        setMenuOpen(false);
                                    }}
                                    className="block text-red-500 font-medium text-sm w-full text-left"
                                >
                                    Logout
                                </button>
                            </div>
                        )}

                        <a
                            href="https://github.com/তোমার/crowdfunding-client"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-accent-600 font-medium text-sm"
                        >
                            Join as Developer
                        </a>
                    </div>
                </div>
            )}
        </nav>
    );
}