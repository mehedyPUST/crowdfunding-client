'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationBell() {
    const { api, user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unread, setUnread] = useState(0);
    const [open, setOpen] = useState(false);
    const ref = useRef();

    const fetchNotifications = async () => {
        try {
            const [notifRes, countRes] = await Promise.all([
                api.get('/notifications'),
                api.get('/notifications/unread-count'),
            ]);
            setNotifications(notifRes.data);
            setUnread(countRes.data.count);
        } catch { }
    };

    useEffect(() => {
        if (user) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 15000);
            return () => clearInterval(interval);
        }
    }, [user]);

    useEffect(() => {
        const handleClick = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handleOpen = () => {
        setOpen(!open);
        if (!open && unread > 0) {
            api.patch('/notifications/read-all').then(() => setUnread(0));
        }
    };

    return (
        <div ref={ref} className="relative">
            <motion.button
                onClick={handleOpen}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative text-gray-600 hover:text-amber-600 transition-colors p-1.5 rounded-lg hover:bg-amber-50"
            >
                <Bell className="w-5 h-5" />
                <AnimatePresence>
                    {unread > 0 && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-bold shadow-sm"
                        >
                            {unread}
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl shadow-gray-300/30 border border-gray-200 z-50 max-h-96 overflow-hidden"
                    >
                        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-orange-50">
                            <p className="font-semibold text-sm text-gray-800 flex items-center gap-2">
                                🔔 Notifications
                                {unread > 0 && (
                                    <span className="text-xs text-amber-600 font-normal bg-amber-100 px-2 py-0.5 rounded-full">
                                        {unread} new
                                    </span>
                                )}
                            </p>
                        </div>
                        <div className="overflow-y-auto max-h-80">
                            {notifications.length === 0 ? (
                                <p className="p-6 text-sm text-gray-400 text-center">No notifications yet</p>
                            ) : (
                                notifications.map((n) => (
                                    <Link
                                        key={n._id}
                                        href={n.actionRoute || '#'}
                                        onClick={() => setOpen(false)}
                                        className="block p-3.5 border-b border-gray-50 hover:bg-amber-50/40 transition-all text-sm"
                                    >
                                        <p className="text-gray-700">{n.message}</p>
                                        <p className="text-xs text-gray-400 mt-1.5">{new Date(n.time).toLocaleString()}</p>
                                    </Link>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}