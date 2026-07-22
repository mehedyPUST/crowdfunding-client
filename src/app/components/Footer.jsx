import { Github, Linkedin, MessageCircle, Heart } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="bg-gray-900 dark:bg-gray-950 text-gray-400 dark:text-gray-500 border-t border-gray-800 dark:border-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    {/* Brand */}
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Heart className="w-6 h-6 text-amber-400" fill="currentColor" fillOpacity="0.3" />
                            <div className="absolute inset-0 bg-amber-400/20 blur-lg rounded-full" />
                        </div>
                        <span className="text-white font-extrabold text-lg tracking-tight">
                            Crowd<span className="text-amber-400">Fund</span>
                        </span>
                    </div>

                    {/* Tagline */}
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center md:text-left font-medium">
                        Fueling ideas, one campaign at a time.
                    </p>

                    {/* Social Links */}
                    <div className="flex items-center gap-5">
                        <a
                            href="https://github.com/mehedyPUST"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 dark:text-gray-400 hover:text-amber-400 dark:hover:text-amber-400 transition-all duration-200 hover:scale-110 p-2 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-800"
                            aria-label="GitHub"
                        >
                            <FaGithub className="w-5 h-5" />
                        </a>
                        <a
                            href="https://linkedin.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 dark:text-gray-400 hover:text-amber-400 dark:hover:text-amber-400 transition-all duration-200 hover:scale-110 p-2 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-800"
                            aria-label="LinkedIn"
                        >
                            <FaLinkedin className="w-5 h-5" />
                        </a>
                        <a
                            href="https://facebook.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 dark:text-gray-400 hover:text-emerald-400 dark:hover:text-emerald-400 transition-all duration-200 hover:scale-110 p-2 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-800"
                            aria-label="Facebook"
                        >
                            <MessageCircle className="w-5 h-5" />
                        </a>
                    </div>
                </div>

                {/* Divider */}
                <div className="mt-8 pt-8 border-t border-gray-800 dark:border-gray-800">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-500">
                            &copy; {new Date().getFullYear()} CrowdFund. All rights reserved.
                        </p>
                        <p className="text-xs text-gray-700 dark:text-gray-600">
                            Built with ❤️ by Mehedy
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}