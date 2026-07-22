import Link from 'next/link';
import { Heart, Mail, MapPin, Phone, ArrowRight, Shield, HelpCircle, FileText, Star } from 'lucide-react';
import { FaGithub, FaLinkedin, FaFacebook } from 'react-icons/fa';

const footerLinks = {
    platform: {
        title: 'Platform',
        links: [
            { href: '/explore', label: 'Explore Campaigns' },
            { href: '/register', label: 'Start a Campaign' },
            { href: '/login', label: 'Sign In' },
            { href: '/register', label: 'Create Account' },
        ],
    },
    resources: {
        title: 'Resources',
        links: [
            { href: '#', label: 'Help Center' },
            { href: '#', label: 'Community Guidelines' },
            { href: '#', label: 'Trust & Safety' },
            { href: '#', label: 'Blog' },
        ],
    },
    company: {
        title: 'Company',
        links: [
            { href: '#', label: 'About Us' },
            { href: '#', label: 'Careers' },
            { href: '#', label: 'Press' },
            { href: '#', label: 'Contact' },
        ],
    },
    legal: {
        title: 'Legal',
        links: [
            { href: '#', label: 'Privacy Policy' },
            { href: '#', label: 'Terms of Service' },
            { href: '#', label: 'Cookie Policy' },
            { href: '#', label: 'GDPR' },
        ],
    },
};

export default function Footer() {
    return (
        <footer className="bg-gray-900 dark:bg-gray-950 text-gray-400 dark:text-gray-500 border-t border-gray-800 dark:border-gray-900">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                    {/* Brand Column */}
                    <div className="col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="relative">
                                <Heart className="w-7 h-7 text-amber-400" fill="currentColor" fillOpacity="0.3" />
                                <div className="absolute inset-0 bg-amber-400/20 blur-lg rounded-full" />
                            </div>
                            <span className="text-white font-extrabold text-xl tracking-tight">
                                Crowd<span className="text-amber-400">Fund</span>
                            </span>
                        </div>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mb-6 leading-relaxed max-w-sm">
                            The world's most trusted crowdfunding platform. Turn your ideas into reality with the power of community.
                        </p>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div>
                                <p className="text-white font-bold text-lg">$2.5M+</p>
                                <p className="text-xs text-gray-500">Total Raised</p>
                            </div>
                            <div>
                                <p className="text-white font-bold text-lg">850+</p>
                                <p className="text-xs text-gray-500">Campaigns</p>
                            </div>
                            <div>
                                <p className="text-white font-bold text-lg">12K+</p>
                                <p className="text-xs text-gray-500">Supporters</p>
                            </div>
                        </div>

                        {/* Contact */}
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-gray-400">
                                <Mail className="w-4 h-4 text-amber-500" />
                                <span>support@crowdfund.com</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                                <MapPin className="w-4 h-4 text-amber-500" />
                                <span>San Francisco, CA 94105</span>
                            </div>
                        </div>
                    </div>

                    {/* Link Columns */}
                    {Object.values(footerLinks).map((section) => (
                        <div key={section.title}>
                            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
                                {section.title}
                            </h3>
                            <ul className="space-y-2.5">
                                {section.links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-gray-400 dark:text-gray-500 hover:text-amber-400 dark:hover:text-amber-400 transition-colors duration-200 flex items-center gap-1 group"
                                        >
                                            <span className="w-0 group-hover:w-3 transition-all duration-200 overflow-hidden">
                                                <ArrowRight className="w-3 h-3 text-amber-500 inline" />
                                            </span>
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Trust Badges */}
            <div className="border-t border-gray-800 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-emerald-500" />
                            <span>Secure Payments</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-amber-500" />
                            <span>4.9/5 TrustScore</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <HelpCircle className="w-4 h-4 text-blue-500" />
                            <span>24/7 Support</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-purple-500" />
                            <span>Verified Campaigns</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-xs text-gray-500 dark:text-gray-600">
                            &copy; {new Date().getFullYear()} CrowdFund. All rights reserved.
                        </p>

                        {/* Social Links */}
                        <div className="flex items-center gap-4">
                            <a href="https://github.com/mehedyPUST" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-amber-400 transition-colors p-2 rounded-lg hover:bg-gray-800" aria-label="GitHub">
                                <FaGithub className="w-5 h-5" />
                            </a>
                            <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-amber-400 transition-colors p-2 rounded-lg hover:bg-gray-800" aria-label="LinkedIn">
                                <FaLinkedin className="w-5 h-5" />
                            </a>
                            <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-amber-400 transition-colors p-2 rounded-lg hover:bg-gray-800" aria-label="Facebook">
                                <FaFacebook className="w-5 h-5" />
                            </a>
                        </div>

                        <p className="text-xs text-gray-600 dark:text-gray-600">
                            Built with ❤️ by <span className="text-amber-500 font-medium">Mehedy</span>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}