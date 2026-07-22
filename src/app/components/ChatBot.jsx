'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatBot() {
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'Hi! 👋 Ask me anything about CrowdFund.' },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef();

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        if (!user) {
            setMessages((prev) => [
                ...prev,
                { role: 'user', text: input.trim() },
                { role: 'bot', text: '🔒 Please login to get a reply from our AI assistant.' },
            ]);
            setInput('');
            return;
        }

        const userMsg = input.trim();
        setInput('');
        setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
        setLoading(true);

        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/chatbot`,
                { message: userMsg },
                { withCredentials: true }
            );
            setMessages((prev) => [...prev, { role: 'bot', text: res.data.reply }]);
        } catch {
            setMessages((prev) => [...prev, { role: 'bot', text: 'Sorry, something went wrong.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Floating Button */}
            <motion.button
                onClick={() => setOpen(!open)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className="fixed bottom-5 right-5 z-50 bg-gradient-to-r from-amber-500 to-orange-500 text-white w-14 h-14 rounded-full shadow-lg shadow-amber-200/50 hover:shadow-xl hover:shadow-amber-200/70 transition-shadow flex items-center justify-center"
            >
                {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="fixed bottom-20 right-5 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl shadow-gray-300/40 border border-gray-200 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-3.5 font-semibold text-sm flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <span className="text-lg">🤖</span> CrowdFund Assistant
                            </span>
                            <button
                                onClick={() => setOpen(false)}
                                className="hover:bg-white/20 p-1 rounded-lg transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="h-80 overflow-y-auto p-3 space-y-2.5 bg-gradient-to-b from-gray-50 to-white">
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ duration: 0.2 }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm ${msg.role === 'user'
                                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-br-md'
                                            : 'bg-white border border-gray-200 text-gray-700 rounded-bl-md shadow-sm'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}
                            {loading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex justify-start"
                                >
                                    <div className="bg-white border border-gray-200 px-4 py-2.5 rounded-2xl rounded-bl-md text-sm text-gray-400 shadow-sm flex items-center gap-1.5">
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </motion.div>
                            )}
                            <div ref={bottomRef} />
                        </div>

                        {/* Input */}
                        <div className="p-3 border-t border-gray-200 bg-white flex gap-2">
                            {user ? (
                                <>
                                    <input
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                        placeholder="Ask about CrowdFund..."
                                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 transition-all"
                                    />
                                    <motion.button
                                        onClick={sendMessage}
                                        disabled={loading}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-2.5 rounded-xl hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                                    >
                                        <Send className="w-4 h-4" />
                                    </motion.button>
                                </>
                            ) : (
                                <div className="flex items-center gap-2 text-sm text-gray-500 w-full justify-center py-1.5">
                                    <Lock className="w-4 h-4" />
                                    Login to chat with AI assistant
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}