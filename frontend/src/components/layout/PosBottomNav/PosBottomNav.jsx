import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import {
    LayoutDashboard,
    Package,
    MonitorDot,
    BookOpen,
    FileText,
    Menu,
    X,
    Building2,
    Crown
} from 'lucide-react';
import './PosBottomNav.css';

export default function PosBottomNav({ sidebarOpen, setSidebarOpen }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();

    const isSuperAdmin = user?.role === 'SUPER_ADMIN';
    const isBilling = user?.businessType === 'Billing Invoice';

    // Parse user project permissions if in someone else's workspace
    let permissions = {};
    if (user?.projectPermissions) {
        try {
            permissions = typeof user.projectPermissions === 'string'
                ? JSON.parse(user.projectPermissions)
                : user.projectPermissions;
            if (typeof permissions !== 'object' || permissions === null) {
                permissions = {};
            }
        } catch {
            permissions = {};
        }
    }
    const hasFullAccess = !user?.activeProjectId || user?.activeProjectId === user?.id;
    const canView = (module) => {
        if (hasFullAccess) return true;
        if (!permissions[module]) return false;
        return permissions[module].includes('VIEW') || permissions[module].includes('MANAGE');
    };

    // Active state checkers
    const isHomeActive = location.pathname === '/' ||
        location.pathname === '/dashboard' ||
        location.pathname === '/dashboard/admin2' ||
        location.pathname === '/dashboard/sales' ||
        location.pathname === '/dashboard/super-dashboard';

    const isProductsActive = location.pathname.startsWith('/product') ||
        location.pathname.startsWith('/create-product') ||
        location.pathname.startsWith('/edit-product') ||
        location.pathname.startsWith('/category') ||
        location.pathname.startsWith('/sub-category') ||
        location.pathname.startsWith('/brands') ||
        location.pathname.startsWith('/units') ||
        location.pathname.startsWith('/low-stocks') ||
        location.pathname.startsWith('/expired-products') ||
        location.pathname.startsWith('/dashboard/manage-stock') ||
        location.pathname.startsWith('/dashboard/stock-');

    const isPosActive = location.pathname === '/dashboard/sales-pos' ||
        location.pathname === '/pos' ||
        location.pathname.startsWith('/dashboard/sales-pos');

    const isKhataOrBillingActive = isBilling
        ? (location.pathname === '/dashboard/invoices' || location.pathname.startsWith('/dashboard/sales-'))
        : (location.pathname.startsWith('/khata-book') || location.pathname === '/dashboard/invoices');

    const isSuperCompaniesActive = location.pathname === '/dashboard/super-companies' ||
        location.pathname === '/dashboard/super-subscriptions';

    const handleTabClick = (path) => {
        if (window.navigator?.vibrate) {
            try { window.navigator.vibrate(10); } catch { /* ignore */ }
        }
        if (sidebarOpen) {
            setSidebarOpen(false);
        }
        if (location.pathname !== path) {
            navigate(path);
        }
    };

    const handleMenuToggle = () => {
        if (window.navigator?.vibrate) {
            try { window.navigator.vibrate(15); } catch { /* ignore */ }
        }
        setSidebarOpen(prev => !prev);
    };

    return (
        <nav className="pos-bottom-nav" aria-label="Mobile Bottom Navigation">
            <div className="pos-bottom-nav-inner">
                {/* ── 1. Dashboard / Home ── */}
                <button
                    type="button"
                    className={`pos-bottom-tab ${isHomeActive && !sidebarOpen ? 'active' : ''}`}
                    onClick={() => handleTabClick(isSuperAdmin ? '/dashboard/super-dashboard' : '/dashboard')}
                    aria-label="Dashboard"
                >
                    <div className="pos-bottom-icon-wrap">
                        <LayoutDashboard size={20} strokeWidth={isHomeActive && !sidebarOpen ? 2.3 : 1.8} />
                    </div>
                    <span className="pos-bottom-label">Home</span>
                    {isHomeActive && !sidebarOpen && <span className="pos-bottom-active-indicator" />}
                </button>

                {/* ── 2. Products / Inventory (or Companies for SuperAdmin) ── */}
                {isSuperAdmin ? (
                    <button
                        type="button"
                        className={`pos-bottom-tab ${isSuperCompaniesActive && !sidebarOpen ? 'active' : ''}`}
                        onClick={() => handleTabClick('/dashboard/super-companies')}
                        aria-label="Companies"
                    >
                        <div className="pos-bottom-icon-wrap">
                            <Building2 size={20} strokeWidth={isSuperCompaniesActive && !sidebarOpen ? 2.3 : 1.8} />
                        </div>
                        <span className="pos-bottom-label">Companies</span>
                        {isSuperCompaniesActive && !sidebarOpen && <span className="pos-bottom-active-indicator" />}
                    </button>
                ) : (
                    <button
                        type="button"
                        className={`pos-bottom-tab ${isProductsActive && !sidebarOpen ? 'active' : ''}`}
                        onClick={() => handleTabClick(canView('products') ? '/products' : '/dashboard')}
                        aria-label="Products"
                    >
                        <div className="pos-bottom-icon-wrap">
                            <Package size={20} strokeWidth={isProductsActive && !sidebarOpen ? 2.3 : 1.8} />
                        </div>
                        <span className="pos-bottom-label">Products</span>
                        {isProductsActive && !sidebarOpen && <span className="pos-bottom-active-indicator" />}
                    </button>
                )}

                {/* ── 3. Center Elevated Floating POS / Quick Sell Button ── */}
                <div className="pos-bottom-center-fab-slot">
                    <button
                        type="button"
                        className={`pos-bottom-fab-btn ${isPosActive && !sidebarOpen ? 'active' : ''}`}
                        onClick={() => handleTabClick('/dashboard/sales-pos')}
                        aria-label="Quick POS Terminal"
                        title="Live POS Terminal (Sell)"
                    >
                        <div className="pos-bottom-fab-ring" />
                        <div className="pos-bottom-fab-icon-box">
                            <MonitorDot size={22} strokeWidth={2.4} />
                        </div>
                        <span className="pos-bottom-fab-label">POS</span>
                    </button>
                </div>

                {/* ── 4. Khata / Invoices / Billing ── */}
                <button
                    type="button"
                    className={`pos-bottom-tab ${isKhataOrBillingActive && !sidebarOpen ? 'active' : ''}`}
                    onClick={() => handleTabClick(isBilling ? '/dashboard/invoices' : '/khata-book')}
                    aria-label={isBilling ? 'Invoices' : 'Khata Book'}
                >
                    <div className="pos-bottom-icon-wrap">
                        {isBilling ? (
                            <FileText size={20} strokeWidth={isKhataOrBillingActive && !sidebarOpen ? 2.3 : 1.8} />
                        ) : (
                            <BookOpen size={20} strokeWidth={isKhataOrBillingActive && !sidebarOpen ? 2.3 : 1.8} />
                        )}
                    </div>
                    <span className="pos-bottom-label">{isBilling ? 'Invoices' : 'Khata'}</span>
                    {isKhataOrBillingActive && !sidebarOpen && <span className="pos-bottom-active-indicator" />}
                </button>

                {/* ── 5. Menu / App Drawer Trigger ── */}
                <button
                    type="button"
                    className={`pos-bottom-tab ${sidebarOpen ? 'active' : ''}`}
                    onClick={handleMenuToggle}
                    aria-label="More Menu"
                    aria-expanded={sidebarOpen}
                >
                    <div className="pos-bottom-icon-wrap">
                        {sidebarOpen ? (
                            <X size={20} strokeWidth={2.3} className="pos-bottom-menu-open-icon" />
                        ) : (
                            <Menu size={20} strokeWidth={1.8} />
                        )}
                    </div>
                    <span className="pos-bottom-label">Menu</span>
                    {sidebarOpen && <span className="pos-bottom-active-indicator" />}
                </button>
            </div>
        </nav>
    );
}
