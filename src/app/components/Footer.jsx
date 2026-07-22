import { Github, Linkedin, MessageCircle, Heart } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="bg-gradient-to-b from-gray-800 to-gray-900 text-gray-400">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">

                    {/* Brand */}
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Heart className="w-6 h-6 text-amber-400" fill="currentColor" fillOpacity="0.25" />
                            <div className="absolute inset-0 bg-amber-400 blur-lg opacity-20 rounded-full" />
                        </div>
                        <span className="text-white font-bold text-lg">CrowdFund</span>
                    </div>

                    {/* Tagline */}
                    <p className="text-sm text-gray-500 text-center md:text-left">
                        Fueling ideas, one campaign at a time.
                    </p>

                    {/* Social Links */}
                    <div className="flex items-center gap-6">
                        <a
                            href="https://github.com/তোমার"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-amber-400 transition-all duration-200 hover:scale-110"
                        >
                            <FaGithub className="w-5 h-5" />
                        </a>
                        <a
                            href="https://linkedin.com/in/তোমার"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-amber-400 transition-all duration-200 hover:scale-110"
                        >
                            <FaLinkedin className="w-5 h-5" />
                        </a>
                        <a
                            href="https://facebook.com/তোমার"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-emerald-400 transition-all duration-200 hover:scale-110"
                        >
                            <MessageCircle className="w-5 h-5" />
                        </a>
                    </div>
                </div>

                {/* Divider & Copyright */}
                <div className="mt-8 pt-8 border-t border-gray-700/60 text-center">
                    <p className="text-sm text-gray-600">
                        &copy; {new Date().getFullYear()} CrowdFund. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}