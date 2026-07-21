'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

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

        // Check if user is logged in
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
            const token = localStorage.getItem('token');
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/chatbot`,
                { message: userMsg },
                { headers: { Authorization: `Bearer ${token}` } }
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
            <button
                onClick={() => setOpen(!open)}
                className="fixed bottom-5 right-5 z-50 bg-brand-600 text-white w-14 h-14 rounded-full shadow-lg hover:bg-brand-700 transition flex items-center justify-center"
            >
                {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
            </button>

            {/* Chat Window */}
            {open && (
                <div className="fixed bottom-20 right-5 z-50 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
                    <div className="bg-brand-600 text-white px-4 py-3 font-semibold text-sm flex items-center justify-between">
                        <span>🤖 CrowdFund Assistant</span>
                        <button onClick={() => setOpen(false)}><X className="w-4 h-4" /></button>
                    </div>

                    <div className="h-80 overflow-y-auto p-3 space-y-2 bg-slate-50">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${msg.role === 'user' ? 'bg-brand-600 text-white' : 'bg-white border border-slate-200 text-slate-700'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-slate-200 px-3 py-2 rounded-lg text-sm text-slate-400">
                                    Typing...
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    <div className="p-3 border-t border-slate-200 bg-white flex gap-2">
                        {user ? (
                            <>
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                    placeholder="Ask about CrowdFund..."
                                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-brand-500"
                                />
                                <button onClick={sendMessage} disabled={loading} className="bg-brand-600 text-white p-2 rounded-lg hover:bg-brand-700 disabled:opacity-50">
                                    <Send className="w-4 h-4" />
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center gap-2 text-sm text-slate-500 w-full justify-center py-1">
                                <Lock className="w-4 h-4" />
                                Login to chat with AI assistant
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}