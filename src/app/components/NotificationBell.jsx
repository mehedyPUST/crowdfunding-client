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
                className="relative text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Notifications"
            >
                <Bell className="w-5 h-5" />
                <AnimatePresence>
                    {unread > 0 && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[10px] rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-bold shadow-md ring-2 ring-white dark:ring-gray-800"
                        >
                            {unread > 99 ? '99+' : unread}
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl shadow-gray-300/20 dark:shadow-black/30 border border-gray-200 dark:border-gray-700 z-50 max-h-[480px] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
                            <div className="flex items-center justify-between">
                                <p className="font-bold text-sm text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                    <Bell className="w-4 h-4 text-amber-500" />
                                    Notifications
                                </p>
                                {unread > 0 && (
                                    <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold bg-amber-100 dark:bg-amber-900/30 px-2.5 py-1 rounded-full">
                                        {unread} new
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* List */}
                        <div className="overflow-y-auto max-h-80 divide-y divide-gray-50 dark:divide-gray-700/50">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center">
                                    <Bell className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                                    <p className="text-sm text-gray-400 dark:text-gray-500 font-medium">No notifications yet</p>
                                    <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">We'll let you know when something arrives</p>
                                </div>
                            ) : (
                                notifications.map((n) => (
                                    <Link
                                        key={n._id}
                                        href={n.actionRoute || '#'}
                                        onClick={() => setOpen(false)}
                                        className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all text-sm group"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="w-2 h-2 bg-amber-400 rounded-full mt-1.5 flex-shrink-0 group-hover:bg-amber-500 transition-colors" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors line-clamp-2">
                                                    {n.message}
                                                </p>
                                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">
                                                    {new Date(n.time).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
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