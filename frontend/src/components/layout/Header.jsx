import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Moon, Bell, Grid, Maximize, Settings, ChevronDown, Menu, Check, X, Folder, Clock, Users, User, LogOut, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Header({ onMenuClick }) {
    const { user, isAdmin } = useAuth();
    const navigate = useNavigate();
    const { triggerRefresh } = useWorkspace() || {};

    // Notification state
    const [notifOpen, setNotifOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [notifLoading, setNotifLoading] = useState(false);
    const [processingId, setProcessingId] = useState(null);
    const notifRef = useRef(null);
    const profileRef = useRef(null);

    const isClientOrAdmin = true;

    const fetchNotifications = useCallback(() => {
        setNotifLoading(true);
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/builder/notifications`)
        .then(res => setNotifications(res.data || []))
        .catch(() => {})
        .finally(() => setNotifLoading(false));
    }, []);

    // On load: fetch any pending invitations the user missed while offline,
    // then open an SSE stream so future invitations arrive in real-time (0ms delay)
    useEffect(() => {
        // 1. Initial HTTP fetch for accumulated pending invitations
        fetchNotifications();

        // 2. SSE stream — Open access (no token)
        const url = `${import.meta.env.VITE_API_BASE_URL}/builder/notifications/stream`;
        const es = new EventSource(url);

        es.addEventListener('invitation', (e) => {
            try {
                const newNotif = JSON.parse(e.data);
                // Add to notification list only if not already present
                setNotifications(prev => {
                    if (prev.some(n => n.id === newNotif.id)) return prev;
                    return [newNotif, ...prev];
                });
            } catch (err) {
                console.warn('Failed to parse SSE notification', err);
            }
        });

        es.addEventListener('error', () => {
            // Browser will auto-reconnect, no action needed
        });

        return () => es.close(); // Cleanup on unmount / token change
    }, [token, isClientOrAdmin]);

    // Refresh the list whenever the dropdown is opened (catch any missed events)
    useEffect(() => {
        if (notifOpen) fetchNotifications();
    }, [notifOpen, fetchNotifications]);

    // Click outside to close
    useEffect(() => {
        const handler = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setNotifOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleAccept = async (notif) => {
        setProcessingId(notif.id);
        try {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/builder/notifications/${notif.id}/accept`, {});
            setNotifications(prev => prev.filter(n => n.id !== notif.id));
            // Refresh sidebar so the shared folder appears immediately
            if (triggerRefresh) triggerRefresh();
        } catch (err) {
            alert('Failed to accept invitation');
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (notif) => {
        setProcessingId(notif.id);
        try {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/builder/notifications/${notif.id}/reject`, {});
            setNotifications(prev => prev.filter(n => n.id !== notif.id));
        } catch (err) {
            alert('Failed to reject invitation');
        } finally {
            setProcessingId(null);
        }
    };

    const formatTime = (isoStr) => {
        try {
            const diff = Math.floor((Date.now() - new Date(isoStr).getTime()) / 60000);
            if (diff < 1) return 'Just now';
            if (diff < 60) return `${diff}m ago`;
            if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
            return `${Math.floor(diff / 1440)}d ago`;
        } catch { return ''; }
    };

    const pendingCount = notifications.length;

    return (
        <header className="h-[70px] bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-6 shrink-0 z-30">
            {/* Left side */}
            <div className="flex items-center gap-3 lg:gap-6">
                <button
                    onClick={onMenuClick}
                    className="md:hidden text-gray-500 hover:text-gray-700 transition-colors bg-gray-50 p-2 rounded-lg"
                >
                    <Menu size={20} />
                </button>
                <div className="relative hidden sm:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Quick Search..."
                        className="pl-10 pr-4 py-2 bg-gray-50/50 border-none rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 w-[180px] lg:w-[240px] text-gray-600 placeholder-gray-400 font-medium"
                    />
                </div>
                <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
                    <div className="flex items-center gap-1.5 cursor-pointer hover:text-gray-900 transition-colors">
                        Mega Menu <ChevronDown size={14} className="text-gray-400" />
                    </div>
                    <div className="flex items-center gap-1.5 cursor-pointer hover:text-gray-900 transition-colors">
                        Apps <ChevronDown size={14} className="text-gray-400" />
                    </div>
                </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <Moon size={20} />
                </button>

                {/* Notification Bell */}
                {isClientOrAdmin ? (
                    <div className="relative" ref={notifRef}>
                        <button
                            id="notification-bell-btn"
                            onClick={() => setNotifOpen(o => !o)}
                            className={`relative text-gray-400 hover:text-indigo-600 transition-colors p-1 rounded-lg ${notifOpen ? 'bg-indigo-50 text-indigo-600' : ''}`}
                        >
                            <Bell size={20} />
                            {pendingCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-bold px-1.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center border-2 border-white animate-pulse">
                                    {pendingCount > 9 ? '9+' : pendingCount}
                                </span>
                            )}
                        </button>

                        {notifOpen && (
                            <div className="absolute right-0 top-full mt-3 w-[380px] bg-white rounded-2xl shadow-2xl border border-gray-100 z-[200] overflow-hidden">
                                {/* Header */}
                                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                                    <div className="flex items-center gap-2">
                                        <Bell size={16} className="text-indigo-500" />
                                        <span className="font-bold text-gray-800 text-sm">Notifications</span>
                                        {pendingCount > 0 && (
                                            <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                {pendingCount} pending
                                            </span>
                                        )}
                                    </div>
                                    {pendingCount > 0 && (
                                        <span className="text-xs text-indigo-500 font-medium">
                                            Folder Invitations
                                        </span>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="max-h-[420px] overflow-y-auto">
                                    {notifLoading && notifications.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                            <div className="w-8 h-8 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
                                            <span className="text-sm">Loading notifications...</span>
                                        </div>
                                    ) : notifications.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-14 text-gray-400">
                                            <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                                                <Bell size={24} className="text-gray-300" />
                                            </div>
                                            <p className="font-semibold text-gray-500 text-sm">All caught up!</p>
                                            <p className="text-xs text-gray-400 mt-1">No pending invitations</p>
                                        </div>
                                    ) : (
                                        <div>
                                            {notifications.map((notif, idx) => (
                                                <div
                                                    key={notif.id}
                                                    className={`px-5 py-4 border-b border-gray-50 hover:bg-gray-50/60 transition-colors ${processingId === notif.id ? 'opacity-50 pointer-events-none' : ''}`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        {/* Avatar / Icon */}
                                                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                                                            <Folder size={16} className="text-white" />
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            {/* Title */}
                                                            <p className="text-sm font-semibold text-gray-800 leading-snug">
                                                                Folder Invitation
                                                            </p>
                                                            {/* Description */}
                                                            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                                                                <span className="font-medium text-indigo-600">{notif.sharedByEmail}</span>
                                                                {' '}invited you to access{' '}
                                                                <span className="font-semibold text-gray-700">"{notif.folderName}"</span>
                                                            </p>
                                                            {/* Time */}
                                                            <div className="flex items-center gap-1 mt-1.5">
                                                                <Clock size={10} className="text-gray-400" />
                                                                <span className="text-[11px] text-gray-400">{formatTime(notif.createdAt)}</span>
                                                            </div>

                                                            {/* Action Buttons */}
                                                            <div className="flex items-center gap-2 mt-3">
                                                                <button
                                                                    id={`accept-notif-${notif.id}`}
                                                                    onClick={() => handleAccept(notif)}
                                                                    className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                                                                >
                                                                    <Check size={12} />
                                                                    Accept
                                                                </button>
                                                                <button
                                                                    id={`reject-notif-${notif.id}`}
                                                                    onClick={() => handleReject(notif)}
                                                                    className="flex items-center gap-1.5 bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-500 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                                                                >
                                                                    <X size={12} />
                                                                    Decline
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50">
                                    <p className="text-xs text-gray-400 text-center">
                                        Accepting an invitation grants access to that team's folder
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="relative">
                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                            <Bell size={20} />
                        </button>
                        <span className="absolute -top-1.5 -right-1.5 bg-indigo-500 text-white text-[10px] font-bold px-1.5 rounded-full min-w-[16px] text-center border-2 border-white">
                            5
                        </span>
                    </div>
                )}

                <button className="text-gray-400 hover:text-gray-600 transition-colors hidden sm:block">
                    <Grid size={20} />
                </button>
                <button className="text-gray-400 hover:text-gray-600 transition-colors hidden sm:block">
                    <Maximize size={20} />
                </button>
                <button className="text-gray-400 hover:text-gray-600 transition-colors hidden sm:block">
                    <Settings size={20} />
                </button>

                <div className="h-6 w-px bg-gray-200 mx-1"></div>

                <div className="flex items-center gap-2 cursor-pointer">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full overflow-hidden bg-gray-100">
                        <svg viewBox="0 0 64 64" width="100%" height="100%"><rect width="64" height="64" fill="#eee"/><rect width="32" height="32" fill="#203354"/><path fill="#d95147" d="M32 6h32v4H32zm0 8h32v4H32zm0 8h32v4H32zm0 8h32v4H32zm-32 8h64v4H0zm0 8h64v4H0zm0 8h64v4H0z"/></svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">EN</span>
                </div>

                <div className="flex items-center gap-3 cursor-pointer group/profile ml-2 relative" ref={profileRef}>
                    <div 
                        className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-gray-100/80 transition-all duration-200" 
                        onClick={() => setProfileOpen(o => !o)}
                    >
                        <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.identifier || 'user'}`}
                            alt="User Avatar"
                            className="w-10 h-10 rounded-full border border-gray-200 object-cover shadow-sm group-hover/profile:border-indigo-200 transition-colors"
                        />
                        <div className="hidden sm:block">
                            <div className="text-sm font-bold text-gray-800 leading-tight group-hover/profile:text-indigo-600 transition-colors">
                                {user?.identifier?.split('@')[0] || 'David Dev'}
                            </div>
                            <div className="text-xs text-gray-500 font-medium">
                                {isClientOrAdmin ? 'Client' : 'Admin'}
                            </div>
                        </div>
                        <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''} group-hover/profile:text-indigo-500`} />
                    </div>

                    {profileOpen && (
                        <div className="absolute right-0 top-full mt-3 w-60 bg-white rounded-2xl shadow-2xl border border-gray-100 z-[210] py-2.5 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            {/* User Info Header in Dropdown */}
                            <div className="px-5 py-3 border-b border-gray-50 sm:hidden bg-gray-50/50">
                                <p className="text-sm font-bold text-gray-800 truncate">{user?.identifier || 'User'}</p>
                                <p className="text-xs text-gray-500">{isClientOrAdmin ? 'Client' : 'Admin'}</p>
                            </div>

                            <button
                                onClick={() => { navigate('/profile'); setProfileOpen(false); }}
                                className="w-[92%] mx-auto flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-indigo-50/60 hover:text-indigo-600 hover:translate-x-1 rounded-xl transition-all duration-200 group/item"
                            >
                                <User size={18} className="text-gray-400 group-hover/item:text-indigo-500 transition-colors" />
                                <span className="font-medium">Profile</span>
                            </button>

                            <button
                                onClick={() => { navigate('/settings'); setProfileOpen(false); }}
                                className="w-[92%] mx-auto flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-indigo-50/60 hover:text-indigo-600 hover:translate-x-1 rounded-xl transition-all duration-200 group/item"
                            >
                                <Settings size={18} className="text-gray-400 group-hover/item:text-indigo-500 transition-colors" />
                                <span className="font-medium">Settings</span>
                            </button>

                            <div className="px-3 py-1.5">
                                <button
                                    onClick={() => { navigate('/upgrade'); setProfileOpen(false); }}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-indigo-600 bg-indigo-50/50 hover:bg-indigo-600 hover:text-white border border-indigo-100/50 hover:border-indigo-600 rounded-xl transition-all duration-300 group/upgrade shadow-sm hover:shadow-indigo-200 hover:shadow-lg"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-indigo-600 group-hover/upgrade:bg-white flex items-center justify-center shrink-0 shadow-indigo-100 shadow-md transition-colors">
                                        <Zap size={16} className="text-white fill-white group-hover/upgrade:text-indigo-600 group-hover/upgrade:fill-indigo-600 transition-colors" />
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <span className="font-bold group-hover/upgrade:text-white transition-colors">Upgrade Plan</span>
                                        <span className="text-[10px] text-indigo-500 group-hover/upgrade:text-indigo-100 font-medium transition-colors">Get Pro Features</span>
                                    </div>
                                </button>
                            </div>

                            <div className="h-px bg-gray-50 my-1 mx-4"></div>

                            <button
                                onClick={() => { navigate('/settings'); setProfileOpen(false); }}
                                className="w-[92%] mx-auto flex items-center gap-3 px-4 py-2.5 text-sm text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 hover:translate-x-1 rounded-xl transition-all duration-200 group/logout"
                            >
                                <Users size={18} className="text-gray-400 group-hover/logout:text-indigo-500 transition-colors" />
                                <span className="font-medium">Switch Account</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
