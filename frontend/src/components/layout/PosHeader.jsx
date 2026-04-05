import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
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
    const { logout } = useAuth();

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
                    <img 
                        src="https://ui-avatars.com/api/?name=Admin&background=random" 
                        alt="User" 
                        className="pos-user-avatar ms-1"
                        onClick={() => setProfileOpen(!profileOpen)}
                    />
                    {profileOpen && (
                        <>
                            {/* Invisible overlay for capturing outside clicks */}
                            <div 
                                style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1040 }} 
                                onClick={() => setProfileOpen(false)}
                            />
                            {/* Dropdown Menu */}
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                right: 0,
                                marginTop: '10px',
                                background: 'white',
                                border: '1px solid #eaedf0',
                                borderRadius: '8px',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                                minWidth: '160px',
                                zIndex: 1050,
                                overflow: 'hidden'
                            }}>
                                <button 
                                    style={{display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '12px 16px', border: 'none', background: 'white', cursor: 'pointer', fontSize: '14px', color: '#333', textAlign: 'left', transition: 'background 0.2s'}}
                                    onMouseOver={(e) => e.currentTarget.style.background = '#f4f5f9'}
                                    onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                                    onClick={() => setProfileOpen(false)}
                                >
                                    <User size={16} color="#888" /> Profile
                                </button>
                                <button 
                                    style={{display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '12px 16px', border: 'none', borderTop: '1px solid #eaedf0', background: 'white', cursor: 'pointer', fontSize: '14px', color: '#6366f1', textAlign: 'left', transition: 'background 0.2s'}}
                                    onMouseOver={(e) => e.currentTarget.style.background = '#f0f3ff'}
                                    onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                                    onClick={() => {
                                        setProfileOpen(false);
                                        window.location.href = '/dashboard';
                                    }}
                                >
                                    <MonitorDot size={16} /> Home
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
