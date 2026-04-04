import React, { useState, useEffect } from 'react';
import PosSidebar from './PosSidebar';
import PosHeader from './PosHeader';
import '../../assets/pos-layout.css'; // Import the custom POS layout styles

export default function PosLayout({ children }) {
    // True means sidebar is expanded. We default to true on desktop.
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 991);

    // Close sidebar on route change on mobile, and handle resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 991) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className={`pos-layout-wrapper ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
            <PosSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="pos-main-content">
                <PosHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <main className="pos-content-area">
                    {children}
                </main>
            </div>
        </div>
    );
}
