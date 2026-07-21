'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

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
            <button onClick={handleOpen} className="relative text-slate-600 hover:text-slate-800">
                <Bell className="w-5 h-5" />
                {unread > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {unread}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 z-50 max-h-96 overflow-y-auto">
                    <div className="p-3 border-b border-slate-100">
                        <p className="font-semibold text-sm text-slate-800">Notifications</p>
                    </div>
                    {notifications.length === 0 ? (
                        <p className="p-4 text-sm text-slate-500 text-center">No notifications</p>
                    ) : (
                        notifications.map((n) => (
                            <Link
                                key={n._id}
                                href={n.actionRoute || '#'}
                                onClick={() => setOpen(false)}
                                className="block p-3 border-b border-slate-50 hover:bg-slate-50 transition text-sm"
                            >
                                <p className="text-slate-700">{n.message}</p>
                                <p className="text-xs text-slate-400 mt-1">{new Date(n.time).toLocaleString()}</p>
                            </Link>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}