'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Heart, User, LogOut, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const user = null; // আপাতত null, পরে auth context থেকে আসবে

    const navLinks = [
        { href: '/explore', label: 'Explore Campaigns' },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <Heart className="w-7 h-7 text-brand-600" />
                        <span className="text-xl font-bold bg-gradient-to-r from-brand-600 to-accent-600 bg-clip-text text-transparent">
                            CrowdFund
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link key={link.href} href={link.href} className="text-gray-700 hover:text-brand-600 transition font-medium">
                                {link.label}
                            </Link>
                        ))}

                        {!user ? (
                            <div className="flex items-center gap-3">
                                <Link href="/login" className="text-gray-700 hover:text-brand-600 transition font-medium">Login</Link>
                                <Link href="/register" className="bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition font-medium">
                                    Register
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <span className="text-brand-600 font-medium">🪙 50 Credits</span>
                                <Link href="/dashboard" className="text-gray-700 hover:text-brand-600 transition">
                                    <LayoutDashboard className="w-5 h-5" />
                                </Link>
                                <button className="flex items-center gap-1 text-gray-700 hover:text-red-500 transition">
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        )}

                        <a
                            href="https://github.com/YOUR_GITHUB/crowdfunding-client"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-accent-600 hover:text-accent-700 font-medium border border-accent-300 px-3 py-1.5 rounded-lg hover:bg-accent-50 transition"
                        >
                            Join as Developer
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white">
                    <div className="px-4 py-4 space-y-3">
                        {navLinks.map((link) => (
                            <Link key={link.href} href={link.href} className="block text-gray-700 hover:text-brand-600 font-medium" onClick={() => setMenuOpen(false)}>
                                {link.label}
                            </Link>
                        ))}
                        <hr />
                        {!user ? (
                            <div className="space-y-2">
                                <Link href="/login" className="block text-gray-700 hover:text-brand-600 font-medium">Login</Link>
                                <Link href="/register" className="block bg-brand-600 text-white px-4 py-2 rounded-lg text-center font-medium">Register</Link>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <Link href="/dashboard" className="block text-gray-700 hover:text-brand-600 font-medium">Dashboard</Link>
                                <button className="text-red-500 font-medium">Logout</button>
                            </div>
                        )}
                        <a href="https://github.com" target="_blank" className="block text-accent-600 font-medium text-sm">Join as Developer</a>
                    </div>
                </div>
            )}
        </nav>
    );
}