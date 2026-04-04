import React, { useState } from 'react';
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
    PlusCircle
} from 'lucide-react';

export default function PosHeader({ sidebarOpen, setSidebarOpen }) {
    const [isFullscreen, setIsFullscreen] = useState(false);

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

                {/* User Profile */}
                <img 
                    src="https://ui-avatars.com/api/?name=Admin&background=random" 
                    alt="User" 
                    className="pos-user-avatar ms-1"
                />
            </div>
        </header>
    );
}
