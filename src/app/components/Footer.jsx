import { Github, Linkedin, MessageCircle, Heart } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="bg-slate-800 text-slate-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">

                    <div className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-brand-400" />
                        <span className="text-white font-semibold">CrowdFund</span>
                    </div>

                    <p className="text-sm text-slate-400">Fueling ideas, one campaign at a time.</p>

                    <div className="flex items-center gap-5">
                        <a href="https://github.com/তোমার" target="_blank" rel="noopener noreferrer" className="hover:text-brand-400 transition">
                            <FaGithub className="w-5 h-5" />
                        </a>
                        <a href="https://linkedin.com/in/তোমার" target="_blank" rel="noopener noreferrer" className="hover:text-brand-400 transition">
                            <FaLinkedin className="w-5 h-5" />
                        </a>
                        <a href="https://facebook.com/তোমার" target="_blank" rel="noopener noreferrer" className="hover:text-brand-400 transition">
                            <MessageCircle className="w-5 h-5" />
                        </a>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-700 text-center text-sm text-slate-500">
                    &copy; {new Date().getFullYear()} CrowdFund. All rights reserved.
                </div>
            </div>
        </footer>
    );
}