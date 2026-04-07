import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
    ChevronsLeft, 
    Search, 
    Store, 
    MonitorDot,
    Globe,
    Maximize,
    Minimize,
    Bell,
    Settings,
    ChevronDown,
    PlusCircle,
    User,
    LogOut
} from 'lucide-react';

export default function PosHeader({ sidebarOpen, setSidebarOpen }) {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        setProfileOpen(false);
        logout();
        navigate('/login');
    };

    // Build initials for avatar
    const initials = user?.name
        ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
        : '??';

    const roleColor = user?.role === 'SUPER_ADMIN' ? '#f59e0b'
        : user?.role === 'ADMIN' ? '#6366f1'
        : '#22c55e';

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((err) => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullscreen(false);
            }
        }
    };

    return (
        <header className="pos-header">
            {/* Left side */}
            <div className="d-flex align-items-center gap-3">
                <button className="pos-toggle-btn" onClick={() => setSidebarOpen(prev => !prev)}>
                    <ChevronsLeft size={20} style={{ transform: sidebarOpen ? 'none' : 'rotate(180deg)', transition: 'transform 0.3s' }} />
                </button>

                <div className="pos-search-bar hide-on-mobile">
                    <Search size={16} color="#888" className="me-2" />
                    <input type="text" placeholder="Search" />
                    <div className="pos-search-shortcut">
                        <MonitorDot size={12} /> K
                    </div>
                </div>
            </div>

            {/* Right side */}
            <div className="pos-header-actions">
                <div className="pos-store-selector hide-on-mobile">
                    <Store className="pos-store-icon" size={16} />
                    <span>Freshmart</span>
                    <ChevronDown size={14} color="#888" />
                </div>

                <a href="#" className="pos-btn-orange">
                    <PlusCircle size={16} />
                    <span>Add New</span>
                </a>

                <a href="#" className="pos-btn-dark">
                    <MonitorDot size={16} />
                    <span>POS</span>
                </a>

                {/* Icons */}
                <button className="pos-icon-btn hide-on-mobile">
                    <Globe size={18} />
                </button>

                <button className="pos-icon-btn hide-on-mobile" onClick={toggleFullScreen} title="Toggle Fullscreen">
                    {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
                </button>

                <button className="pos-icon-btn">
                    <Bell size={18} />
                    <span className="pos-badge">1</span>
                </button>

                <button className="pos-icon-btn hide-on-mobile">
                    <Settings size={18} />
                </button>

                {/* User Profile Dropdown */}
                <div style={{ position: 'relative' }}>
                    {/* Avatar — shows initials */}
                    <div
                        className="pos-user-avatar ms-1"
                        onClick={() => setProfileOpen(!profileOpen)}
                        style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            background: roleColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            userSelect: 'none',
                            border: `2px solid ${roleColor}44`,
                            flexShrink: 0,
                        }}
                        title={user?.name || 'User'}
                    >
                        {initials}
                    </div>

                    {profileOpen && (
                        <>
                            {/* Overlay */}
                            <div
                                style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1040 }}
                                onClick={() => setProfileOpen(false)}
                            />
                            {/* Dropdown */}
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                right: 0,
                                marginTop: '10px',
                                background: 'white',
                                border: '1px solid #eaedf0',
                                borderRadius: '10px',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                                minWidth: '200px',
                                zIndex: 1050,
                                overflow: 'hidden',
                            }}>
                                {/* User info header */}
                                <div style={{ padding: '14px 16px', borderBottom: '1px solid #eaedf0', background: '#fafafa' }}>
                                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>{user?.name || 'User'}</div>
                                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{user?.email}</div>
                                    <span style={{
                                        display: 'inline-block',
                                        marginTop: '6px',
                                        padding: '2px 8px',
                                        borderRadius: '100px',
                                        fontSize: '10px',
                                        fontWeight: '600',
                                        background: `${roleColor}18`,
                                        color: roleColor,
                                        border: `1px solid ${roleColor}33`,
                                        letterSpacing: '0.04em',
                                    }}>
                                        {user?.role?.replace('_', ' ')}
                                    </span>
                                </div>

                                <button
                                    style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '12px 16px', border: 'none', background: 'white', cursor: 'pointer', fontSize: '13px', color: '#374151', textAlign: 'left', transition: 'background 0.15s' }}
                                    onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
                                    onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                                    onClick={() => setProfileOpen(false)}
                                >
                                    <User size={15} color="#888" /> My Profile
                                </button>

                                <button
                                    style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '12px 16px', border: 'none', borderTop: '1px solid #eaedf0', background: 'white', cursor: 'pointer', fontSize: '13px', color: '#ef4444', textAlign: 'left', transition: 'background 0.15s' }}
                                    onMouseOver={(e) => e.currentTarget.style.background = '#fff5f5'}
                                    onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                                    onClick={handleLogout}
                                >
                                    <LogOut size={15} /> Sign Out
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
