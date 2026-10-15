import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PosSidebar from '../PosSidebar/PosSidebar';
import PosHeader from '../PosHeader/PosHeader';
import PosBottomNav from '../PosBottomNav/PosBottomNav';
import './pos-layout.css';
import AIHelper from '../../ai/AIHelper/AIHelper';
import GlobalPrintHeader from '../GlobalPrintHeader/GlobalPrintHeader';
import UpgradePlanModal from '../../modals/UpgradePlanModal/UpgradePlanModal';
import { useAuth } from '../../../context/AuthContext';
import { ShieldAlert, X } from 'lucide-react';

// ── Safe initial sidebar state ───────────────────────────────────────────────
// Guard against `window` being undefined in SSR / test environments.
// On desktop (> 991 px) start expanded; on mobile start collapsed.
function getInitialSidebarState() {
    if (typeof window === 'undefined') return true; // SSR default: open
    return window.innerWidth > 991;
}

export default function PosLayout({ children }) {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const isBillingInvoice = user?.businessType === 'Billing Invoice';
    const [sidebarOpen, setSidebarOpen] = useState(getInitialSidebarState);
    const [permissionAlert, setPermissionAlert] = useState(null);

    // Watch for redirect state from ModuleGuard
    useEffect(() => {
        if (location.state?.permissionDenied) {
            setPermissionAlert(location.state.message || "Access Restricted: You don't have permission to access that section.");

            // Clear state and dismiss after 6 seconds
            const timer = setTimeout(() => {
                setPermissionAlert(null);
                window.history.replaceState({}, document.title);
            }, 6000);
            return () => clearTimeout(timer);
        }
    }, [location]);

    // Global listener for API 403 Forbidden events
    useEffect(() => {
        const handlePermissionDenied = (e) => {
            const rawMsg = e.detail?.message || "You don't have permission to perform this action. Redirected to dashboard.";
            setPermissionAlert(rawMsg);

            // Redirect user away from forbidden view to last working page or /dashboard
            if (location.pathname !== '/dashboard') {
                const lastPage = sessionStorage.getItem('namustutam_last_working_page');
                const target = (lastPage && !lastPage.startsWith(location.pathname) && !lastPage.includes('/unauthorized') && !lastPage.includes('/login'))
                    ? lastPage
                    : '/dashboard';
                navigate(target, {
                    replace: true,
                    state: {
                        permissionDenied: true,
                        message: rawMsg
                    }
                });
            }
        };

        window.addEventListener('permission-denied', handlePermissionDenied);
        return () => window.removeEventListener('permission-denied', handlePermissionDenied);
    }, [location, navigate]);

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
                <GlobalPrintHeader />
                <PosHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                {/* Permission Alert Banner */}
                {permissionAlert && (
                    <div className="pos-permission-banner" role="alert">
                        <div className="pos-permission-banner-left">
                            <div className="pos-permission-icon-wrap">
                                <ShieldAlert size={20} />
                            </div>
                            <div>
                                <div className="pos-permission-title">Access Restricted</div>
                                <div className="pos-permission-desc">{permissionAlert}</div>
                            </div>
                        </div>
                        <button
                            className="pos-permission-close-btn"
                            onClick={() => {
                                setPermissionAlert(null);
                                window.history.replaceState({}, document.title);
                            }}
                            title="Dismiss notice"
                            type="button"
                        >
                            <X size={18} />
                        </button>
                    </div>
                )}

                <main className="pos-content-area">
                    {children}
                </main>
                
                {/* Mobile Bottom App Navigation Bar */}
                <PosBottomNav sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            </div>
            {/* AI Helper — floats on all authenticated pages, per-user isolated */}
            {!isBillingInvoice && <AIHelper />}
            {/* Upgrade Plan Modal — pops up on 50 records limit completion or upgrade trigger */}
            <UpgradePlanModal />
        </div>
    );
}
