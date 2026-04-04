import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, ChevronDown, LayoutDashboard, Shield } from 'lucide-react';

export default function AppHeader() {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 shrink-0">
            {/* Logo */}
            <div className="flex items-center gap-2">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 12V20H8V12H4Z" fill="#6366f1"/>
                    <path d="M10 8V20H14V8H10Z" fill="#a855f7"/>
                    <path d="M16 16V20H20V16H16Z" fill="#ec4899"/>
                </svg>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tight">
                    Namastute
                </span>
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
                <button
                    onClick={() => setProfileOpen(o => !o)}
                    className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-gray-100 transition-all duration-200"
                >
                    <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.identifier || 'user'}`}
                        alt="Avatar"
                        className="w-9 h-9 rounded-full border border-gray-200 object-cover"
                    />
                    <div className="text-left hidden sm:block">
                        <p className="text-sm font-semibold text-gray-800 leading-tight">
                            {user?.identifier?.split('@')[0] || 'User'}
                        </p>
                        <p className="text-xs text-gray-500">
                            {user?.roles?.[0] || 'Member'}
                        </p>
                    </div>
                    <ChevronDown
                        size={14}
                        className={`text-gray-400 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`}
                    />
                </button>

                {profileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 py-2 overflow-hidden">
                        {/* User info */}
                        <div className="px-4 py-3 border-b border-gray-50">
                            <p className="text-sm font-bold text-gray-800 truncate">{user?.identifier || 'User'}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{user?.roles?.[0] || 'Member'}</p>
                        </div>

                        <button
                            onClick={() => { setProfileOpen(false); }}
                            className="w-[92%] mx-auto mt-1 flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all duration-150"
                        >
                            <User size={16} className="text-gray-400" />
                            <span className="font-medium">Profile</span>
                        </button>

                        {isAdmin() && (
                            <>
                                <button
                                    onClick={() => { setProfileOpen(false); navigate('/admin'); }}
                                    className="w-[92%] mx-auto mt-1 flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-purple-50 hover:text-purple-600 rounded-xl transition-all duration-150"
                                >
                                    <Shield size={16} className="text-gray-400" />
                                    <span className="font-medium">Admin Panel</span>
                                </button>
                            </>
                        )}

                        <div className="h-px bg-gray-100 my-1 mx-3" />

                        <button
                            onClick={handleLogout}
                            className="w-[92%] mx-auto flex items-center gap-3 px-3 py-2 text-sm text-gray-500 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all duration-150"
                        >
                            <LogOut size={16} className="text-gray-400" />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}
