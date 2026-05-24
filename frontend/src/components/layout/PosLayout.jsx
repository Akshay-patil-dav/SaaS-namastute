import React, { useState, useEffect } from 'react';
import PosSidebar from './PosSidebar';
import PosHeader from './PosHeader';
import '../../assets/pos-layout.css';
import AIHelper from '../ai/AIHelper';

// ── Safe initial sidebar state ───────────────────────────────────────────────
// Guard against `window` being undefined in SSR / test environments.
// On desktop (> 991 px) start expanded; on mobile start collapsed.
function getInitialSidebarState() {
    if (typeof window === 'undefined') return true; // SSR default: open
    return window.innerWidth > 991;
}

export default function PosLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(getInitialSidebarState);

    // Use matchMedia for efficient, event-driven breakpoint detection —
    // avoids polling innerWidth on every resize event.
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const mql = window.matchMedia('(max-width: 991px)');

        const handleChange = (e) => {
            setSidebarOpen(!e.matches); // matches = mobile → close sidebar
        };

        // Sync state immediately in case viewport changed before component mounted
        setSidebarOpen(!mql.matches);

        // Modern API (all browsers ≥ Safari 14)
        if (mql.addEventListener) {
            mql.addEventListener('change', handleChange);
            return () => mql.removeEventListener('change', handleChange);
        } else {
            // Legacy fallback for older Safari
            mql.addListener(handleChange);
            return () => mql.removeListener(handleChange);
        }
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
            {/* AI Helper — floats on all authenticated pages, per-user isolated */}
            <AIHelper />
        </div>
    );
}
