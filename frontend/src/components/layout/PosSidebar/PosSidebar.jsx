import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useCompany } from '../../../context/CompanyContext';
import { useDataUsage } from '../../../context/UsageContext';

import {
    LayoutDashboard,
    Square,
    Circle,
    BarChart2,
    UserCog,
    Layers,
    Layout,
    Package,
    FilePlus,
    CalendarX,
    TrendingDown,
    Folder,
    List,
    Tag,
    Scale,
    Puzzle,
    ShieldCheck,
    Barcode,
    Box,
    SlidersHorizontal,
    ArrowRightLeft,
    ChevronRight,
    ShoppingBag,
    FileText,
    RotateCcw,
    Copy,
    Monitor,
    FileUp,
    Globe,
    Cpu,
    Bell,
    Wrench,
    DollarSign,
    Users,
    Sparkles,
    Palette,
    ShoppingCart,
    Factory,
    Boxes,
    Settings,
    BookOpen,
    X,
    Database,
    Crown,
    AlertTriangle
} from 'lucide-react';

export default function PosSidebar({ sidebarOpen, setSidebarOpen }) {
    const location = useLocation();
    const { user } = useAuth();
    const { usage, openUpgradeModal } = useDataUsage();
    const isSuperAdmin = user?.role === 'SUPER_ADMIN';
    const isClientOrAdmin = user?.role === 'ADMIN' || user?.role === 'CLIENT';

    const isSubscriber = Boolean(
        user?.role === 'SUPER_ADMIN' ||
        (user?.plan && user.plan !== 'NONE' && (!user.subscriptionEndDate || new Date(user.subscriptionEndDate) > new Date()))
    );
    const hasAdvancedPlan = isSubscriber && user?.plan !== 'STARTER';

    const { companyInfo } = useCompany();

    const handleSidebarNavClick = (e) => {
        if (typeof window !== 'undefined' && window.innerWidth <= 991) {
            const link = e.target.closest('a');
            if (link && link.getAttribute('href')) {
                setSidebarOpen(false);
            }
        }
    };

    const isDashboardActive = location.pathname === '/' || location.pathname === '/dashboard' || location.pathname === '/dashboard/admin2' || location.pathname === '/dashboard/sales';
    const isSuperAdminActive = location.pathname.startsWith('/dashboard/super-');
    const isSalesActive = (location.pathname.startsWith('/dashboard/sales-') && !location.pathname.startsWith('/dashboard/sales-return')) || location.pathname === '/dashboard/invoices';
    const isInventoryActive = location.pathname.startsWith('/products') ||
        location.pathname.startsWith('/create-product') ||
        location.pathname.startsWith('/edit-product') ||
        location.pathname.startsWith('/expired-products') ||
        location.pathname.startsWith('/low-stocks') ||
        location.pathname.startsWith('/category') ||
        location.pathname.startsWith('/sub-category') ||
        location.pathname.startsWith('/brands') ||
        location.pathname.startsWith('/units') ||
        location.pathname.startsWith('/warranties') ||
        location.pathname.startsWith('/stores') ||
        location.pathname.startsWith('/warehouses') ||
        location.pathname.startsWith('/print-barcode') ||
        location.pathname.startsWith('/print-qrcode');
    const isKhataActive = location.pathname.startsWith('/khata-book');
    const isConnectedAppsActive = location.pathname === '/settings/connected_apps' || location.pathname === '/connected-apps' || location.pathname === '/integrations';
    const isSystemSettingsActive = location.pathname.startsWith('/settings') && !isConnectedAppsActive;

    const [openMenus, setOpenMenus] = useState({
        dashboard: isDashboardActive,
        superAdmin: isSuperAdminActive,
        inventory: isInventoryActive,
        sales: isSalesActive,
        khata: isKhataActive,
        settings: isSystemSettingsActive
    });

    let permissions = {};
    if (user?.projectPermissions) {
        try {
            permissions = JSON.parse(user.projectPermissions);
            if (typeof permissions !== 'object' || permissions === null) {
                permissions = {};
            }
        } catch (e) {
            console.error("Failed to parse permissions", e);
        }
    }

    // If they are in their own workspace, or activeProjectId is not set, they have full access.
    // If they are in someone else's workspace (activeProjectId != user.id), they ONLY have access to explicitly assigned permissions.
    const hasFullAccess = !user?.activeProjectId || user?.activeProjectId === user?.id;

    const canView = (module) => {
        if (hasFullAccess) return true;
        if (!permissions[module]) return false;
        return permissions[module].includes('VIEW') || permissions[module].includes('MANAGE');
    };

    const canManage = (module) => {
        if (hasFullAccess) return true;
        if (!permissions[module]) return false;
        return permissions[module].includes('MANAGE') || permissions[module].includes('CREATE') || permissions[module].includes('EDIT') || permissions[module].includes('DELETE');
    };

    React.useEffect(() => {
        // When the route changes, ensure only the active section is open
        if (isDashboardActive) {
            setOpenMenus({ dashboard: true, superAdmin: false, inventory: false, sales: false, khata: false, settings: false });
        } else if (isSuperAdminActive) {
            setOpenMenus({ dashboard: false, superAdmin: true, inventory: false, sales: false, khata: false, settings: false });
        } else if (isInventoryActive) {
            setOpenMenus({ dashboard: false, superAdmin: false, inventory: true, sales: false, khata: false, settings: false });
        } else if (isSalesActive) {
            setOpenMenus({ dashboard: false, superAdmin: false, inventory: false, sales: true, khata: false, settings: false });
        } else if (isKhataActive) {
            setOpenMenus({ dashboard: false, superAdmin: false, inventory: false, sales: false, khata: true, settings: false });
        } else if (isSystemSettingsActive) {
            setOpenMenus({ dashboard: false, superAdmin: false, inventory: false, sales: false, khata: false, settings: true });
        } else if (isConnectedAppsActive) {
            setOpenMenus({ dashboard: false, superAdmin: false, inventory: false, sales: false, khata: false, settings: false });
        }
    }, [isDashboardActive, isSuperAdminActive, isInventoryActive, isSalesActive, isKhataActive, isSystemSettingsActive, isConnectedAppsActive]);

    const toggleMenu = (menu) => {
        setOpenMenus(prev => {
            const isCurrentlyOpen = prev[menu];
            // Close everything first
            const newState = {
                dashboard: false,
                superAdmin: false,
                inventory: false,
                sales: false,
                khata: false,
                settings: false
            };
            // If it wasn't open, open it (accordion effect)
            if (!isCurrentlyOpen) {
                newState[menu] = true;
            }
            return newState;
        });
    };

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`pos-sidebar-overlay ${sidebarOpen ? 'mobile-open' : ''}`}
                onClick={() => setSidebarOpen(false)}
            ></div>

            {/* Sidebar */}
            <aside className={`pos-sidebar ${sidebarOpen ? 'pos-sidebar-open' : 'pos-sidebar-closed'}`}>
                <div className="pos-sidebar-header">
                    <Link to="/dashboard" className="pos-sidebar-brand-link">
                        {companyInfo?.logo ? (
                            <img
                                src={companyInfo.logo}
                                alt="Company Logo"
                                className="pos-sidebar-brand-logo"
                            />
                        ) : (
                            <div 
                                className="pos-sidebar-brand-badge" 
                                title={companyInfo?.name || 'Samrajya Software'}
                            >
                                {(() => {
                                    const companyName = companyInfo?.name || 'Samrajya Software';
                                    const words = companyName.trim().split(/\s+/);
                                    if (words.length > 1 && words[0] && words[1]) {
                                        return (words[0][0] + words[1][0]).toUpperCase();
                                    }
                                    return (companyName.slice(0, 2) || 'SS').toUpperCase();
                                })()}
                            </div>
                        )}
                        <div className="pos-sidebar-brand-text">
                            {(() => {
                                const companyName = companyInfo?.name || 'Samrajya Software';
                                const words = companyName.trim().split(/\s+/);
                                const firstWord = words[0] || 'Samrajya';
                                const restOfWords = words.slice(1).join(' ');
                                return (
                                    <>
                                        <span className="pos-sidebar-brand-title" title={firstWord}>
                                            {firstWord.toUpperCase()}
                                        </span>
                                        {restOfWords && (
                                            <span className="pos-sidebar-brand-subtitle" title={restOfWords}>
                                                {restOfWords}
                                            </span>
                                        )}
                                    </>
                                );
                            })()}
                        </div>
                    </Link>
                    <button
                        className="pos-sidebar-mobile-close"
                        onClick={() => setSidebarOpen(false)}
                        title="Close menu"
                        aria-label="Close navigation"
                        type="button"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="pos-sidebar-content" onClick={handleSidebarNavClick}>
                    {/* ── Super Admin ─────────────────────────────────────── */}
                    {isSuperAdmin && (
                        <>
                            <div className="pos-menu-divider" style={{ marginTop: '0' }}></div>
                            <div className="pos-menu-section">Super Admin</div>
                            <ul className="pos-menu-list">
                                <li className="pos-menu-item">
                                    <a className={`pos-menu-link ${isSuperAdminActive ? 'active' : ''} ${openMenus.superAdmin ? 'open' : ''}`} onClick={() => toggleMenu('superAdmin')}>
                                        <div className="pos-menu-link-content">
                                            <UserCog className="pos-menu-icon" strokeWidth={1.5} />
                                            <span>Super Admin</span>
                                        </div>
                                        <ChevronRight className="pos-menu-chevron" strokeWidth={1.5} />
                                    </a>
                                    <ul className={`pos-submenu ${openMenus.superAdmin ? 'show' : ''}`}>
                                        <li><NavLink to="/dashboard/super-dashboard" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>Dashboard</NavLink></li>
                                        <li><NavLink to="/dashboard/super-companies" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>Companies</NavLink></li>
                                        <li><NavLink to="/dashboard/super-subscriptions" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>Subscriptions</NavLink></li>
                                        <li><NavLink to="/dashboard/super-packages" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>Packages</NavLink></li>
                                    </ul>
                                </li>
                            </ul>
                        </>
                    )}

                    {/* ── CLIENT / ADMIN nav — fully driven by businessType ── */}
                    {isClientOrAdmin && (() => {
                        // `user` is reactive context state — updateBusinessType() → setUser() → instant re-render
                        const bizType         = user?.businessType || 'Store';
                        const isManufacturing = bizType === 'Manufacturing';
                        const isEcomm         = bizType === 'E-comm';
                        const isBilling       = bizType === 'Billing Invoice';
                        const isStore         = !isManufacturing && !isEcomm && !isBilling;

                        // ── Per-type visual identity ────────────────────────
                        const modeConfig = isManufacturing
                            ? { label: 'Manufacturing Mode', bg: '#eff6ff', border: '#bfdbfe', color: '#1d4ed8', dot: '#3b82f6' }
                            : isEcomm
                            ? { label: 'E-Commerce Mode',   bg: '#faf5ff', border: '#e9d5ff', color: '#7c3aed', dot: '#a855f7' }
                            : isBilling
                            ? { label: 'Billing Mode', bg: '#f0fdf4', border: '#bbf7d0', color: '#15803d', dot: '#22c55e' }
                            : { label: 'Retail Store Mode', bg: '#fff7ed', border: '#fed7aa', color: '#c2410c', dot: '#f97316' };

                        return (
                            <>
                                {/* ── Business-type mode indicator badge ── */}
                                {/* <div style={{
                                    margin: '12px 14px 4px',
                                    padding: '7px 12px',
                                    borderRadius: '8px',
                                    background: modeConfig.bg,
                                    border: `1px solid ${modeConfig.border}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '7px',
                                }}>
                                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: modeConfig.dot, flexShrink: 0, boxShadow: `0 0 0 2px ${modeConfig.border}` }} />
                                    <span style={{ fontSize: '11px', fontWeight: 700, color: modeConfig.color, letterSpacing: '0.02em' }}>
                                        {modeConfig.label}
                                    </span>
                                </div> */}

                                {/* ── Dashboard ── (all types) */}
                                <div className="pos-menu-divider" style={{ marginTop: '8px' }}></div>
                                <div className="pos-menu-section">Main</div>
                                <ul className="pos-menu-list">
                                    <li className="pos-menu-item">
                                        <a className={`pos-menu-link ${isDashboardActive ? 'active' : ''} ${openMenus.dashboard ? 'open' : ''}`} onClick={() => toggleMenu('dashboard')}>
                                            <div className="pos-menu-link-content">
                                                <LayoutDashboard className="pos-menu-icon" strokeWidth={1.5} />
                                                <span>Dashboard</span>
                                            </div>
                                            <ChevronRight className="pos-menu-chevron" strokeWidth={1.5} />
                                        </a>
                                        <ul className={`pos-submenu ${openMenus.dashboard ? 'show' : ''}`}>
                                            <li><NavLink to="/dashboard" end className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>Dashboard</NavLink></li>
                                        </ul>
                                    </li>
                                </ul>

                                {/* ═══════════════════════════════════════════════════════
                                    MANUFACTURING — Production section ABOVE Inventory
                                    Signals that production workflow is the primary concern
                                    ═══════════════════════════════════════════════════════ */}
                                {isManufacturing && canView('manufacturing') && (
                                    <>
                                        <div className="pos-menu-divider"></div>
                                        <div className="pos-menu-section" style={{ color: '#1d4ed8' }}>⚙ Production</div>
                                        <ul className="pos-menu-list pb-4">
                                            <li className="pos-menu-item">
                                                <NavLink to="/manufacturing/bom" className={({ isActive }) => `pos-menu-link ${isActive ? 'active' : ''}`}>
                                                    <div className="pos-menu-link-content"><Layers className="pos-menu-icon" strokeWidth={1.5} /><span>Bill of Materials</span></div>
                                                </NavLink>
                                            </li>
                                            <li className="pos-menu-item">
                                                <NavLink to="/manufacturing/work-orders" className={({ isActive }) => `pos-menu-link ${isActive ? 'active' : ''}`}>
                                                    <div className="pos-menu-link-content"><Cpu className="pos-menu-icon" strokeWidth={1.5} /><span>Work Orders</span></div>
                                                </NavLink>
                                            </li>
                                            <li className="pos-menu-item">
                                                <NavLink to="/manufacturing/work-centers" className={({ isActive }) => `pos-menu-link ${isActive ? 'active' : ''}`}>
                                                    <div className="pos-menu-link-content"><Factory className="pos-menu-icon" strokeWidth={1.5} /><span>Work Centers</span></div>
                                                </NavLink>
                                            </li>
                                        </ul>
                                    </>
                                )}

                                {/* ═══════════════════════════════════════════════════════
                                    E-COMM — Online Orders section ABOVE Inventory
                                    Signals that online channel is the primary concern
                                    ═══════════════════════════════════════════════════════ */}
                                {isEcomm && (canView('sales') || canView('pos')) && (
                                    <>
                                        <div className="pos-menu-divider"></div>
                                        <div className="pos-menu-section" style={{ color: '#7c3aed' }}>🛒 Online Channel</div>
                                        <ul className="pos-menu-list pb-4">
                                            <li className="pos-menu-item">
                                                <NavLink to="/dashboard/sales-online" className={({ isActive }) => `pos-menu-link ${isActive ? 'active' : ''}`}>
                                                    <div className="pos-menu-link-content">
                                                        <Globe className="pos-menu-icon" strokeWidth={1.5} />
                                                        <span>Online Orders</span>
                                                    </div>
                                                    <span style={{ fontSize: 10, background: '#7c3aed', color: '#fff', padding: '2px 7px', borderRadius: 10, fontWeight: 700 }}>LIVE</span>
                                                </NavLink>
                                            </li>
                                            <li className="pos-menu-item">
                                                <NavLink to="/dashboard/invoices" className={({ isActive }) => `pos-menu-link ${isActive ? 'active' : ''}`}>
                                                    <div className="pos-menu-link-content"><FileText className="pos-menu-icon" strokeWidth={1.5} /><span>Invoices</span></div>
                                                </NavLink>
                                            </li>
                                            <li className="pos-menu-item">
                                                <NavLink to="/dashboard/sales-return" className={({ isActive }) => `pos-menu-link ${isActive ? 'active' : ''}`}>
                                                    <div className="pos-menu-link-content"><RotateCcw className="pos-menu-icon" strokeWidth={1.5} /><span>Returns &amp; Refunds</span></div>
                                                </NavLink>
                                            </li>
                                        </ul>
                                    </>
                                )}

                                {/* ═══════════════════════════════════════════════════════
                                    STORE — POS section ABOVE Inventory
                                    Signals that the checkout terminal is the primary concern
                                    ═══════════════════════════════════════════════════════ */}
                                {isStore && (canView('sales') || canView('pos')) && (
                                    <>
                                        <div className="pos-menu-divider"></div>
                                        <div className="pos-menu-section" style={{ color: '#c2410c' }}>🏪 Point of Sale</div>
                                        <ul className="pos-menu-list pb-4">
                                            <li className="pos-menu-item">
                                                <NavLink to="/dashboard/sales-pos" className={({ isActive }) => `pos-menu-link ${isActive ? 'active' : ''}`}>
                                                    <div className="pos-menu-link-content">
                                                        <Monitor className="pos-menu-icon" strokeWidth={1.5} />
                                                        <span>POS Orders</span>
                                                    </div>
                                                    <span style={{ fontSize: 10, background: '#f97316', color: '#fff', padding: '2px 7px', borderRadius: 10, fontWeight: 700 }}>POS</span>
                                                </NavLink>
                                            </li>
                                            <li className="pos-menu-item">
                                                <NavLink to="/dashboard/invoices" className={({ isActive }) => `pos-menu-link ${isActive ? 'active' : ''}`}>
                                                    <div className="pos-menu-link-content"><FileText className="pos-menu-icon" strokeWidth={1.5} /><span>Invoices</span></div>
                                                </NavLink>
                                            </li>
                                            <li className="pos-menu-item">
                                                <NavLink to="/dashboard/sales-return" className={({ isActive }) => `pos-menu-link ${isActive ? 'active' : ''}`}>
                                                    <div className="pos-menu-link-content"><RotateCcw className="pos-menu-icon" strokeWidth={1.5} /><span>Sales Return</span></div>
                                                </NavLink>
                                            </li>
                                        </ul>
                                    </>
                                )}

                                {/* ═══════════════════════════════════════════════════════
                                    BILLING INVOICE MODE
                                    ═══════════════════════════════════════════════════════ */}
                                {isBilling && (canView('sales') || canView('pos')) && (
                                    <>
                                        <div className="pos-menu-divider"></div>
                                        <div className="pos-menu-section" style={{ color: '#15803d' }}>📄 Billing</div>
                                        <ul className="pos-menu-list pb-4">
                                            <li className="pos-menu-item">
                                                <NavLink to="/dashboard/sales-pos" className={({ isActive }) => `pos-menu-link ${isActive ? 'active' : ''}`}>
                                                    <div className="pos-menu-link-content">
                                                        <Monitor className="pos-menu-icon" strokeWidth={1.5} />
                                                        <span>POS Orders</span>
                                                    </div>
                                                    <span style={{ fontSize: 10, background: '#15803d', color: '#fff', padding: '2px 7px', borderRadius: 10, fontWeight: 700 }}>POS</span>
                                                </NavLink>
                                            </li>
                                            <li className="pos-menu-item">
                                                <NavLink to="/dashboard/sales-return" className={({ isActive }) => `pos-menu-link ${isActive ? 'active' : ''}`}>
                                                    <div className="pos-menu-link-content"><RotateCcw className="pos-menu-icon" strokeWidth={1.5} /><span>Sales Return</span></div>
                                                </NavLink>
                                            </li>
                                        </ul>
                                    </>
                                )}

                                {/* ── Inventory — all types (after primary section) */}
                                {(canView('inventory') || canView('products')) && (
                                    <>
                                        <div className="pos-menu-divider"></div>
                                        <div className="pos-menu-section">Inventory</div>
                                        <ul className="pos-menu-list">
                                            <li className="pos-menu-item">
                                                <a className={`pos-menu-link ${isInventoryActive ? 'active' : ''} ${openMenus.inventory ? 'open' : ''}`} onClick={() => toggleMenu('inventory')}>
                                                    <div className="pos-menu-link-content"><Boxes className="pos-menu-icon" strokeWidth={1.5} /><span>Inventory Management</span></div>
                                                    <ChevronRight className="pos-menu-chevron" strokeWidth={1.5} />
                                                </a>
                                                <ul className={`pos-submenu ${openMenus.inventory ? 'show' : ''}`}>
                                                    <li><NavLink to="/products" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>Products List</NavLink></li>
                                                    {(canManage('products') || canManage('inventory')) && (
                                                        <li><NavLink to="/create-product" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>Create Product</NavLink></li>
                                                    )}
                                                    <li><NavLink to="/expired-products" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>Expired Products</NavLink></li>
                                                    <li><NavLink to="/low-stocks" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>Low Stocks</NavLink></li>
                                                    <li><NavLink to="/category" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>Category</NavLink></li>
                                                    <li><NavLink to="/sub-category" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>Sub Category</NavLink></li>
                                                    <li><NavLink to="/brands" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>Brands</NavLink></li>
                                                    <li><NavLink to="/units" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>Units</NavLink></li>
                                                    <li><NavLink to="/warranties" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>Warranties</NavLink></li>
                                                    <li><NavLink to="/stores" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>Stores</NavLink></li>
                                                    <li><NavLink to="/warehouses" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>Warehouses</NavLink></li>
                                                    {!isBilling && (
                                                        <>
                                                            <li><NavLink to="/print-barcode" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>Print Barcode</NavLink></li>
                                                            <li><NavLink to="/print-qrcode" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>Print QR Code</NavLink></li>
                                                        </>
                                                    )}
                                                </ul>
                                            </li>
                                        </ul>
                                    </>
                                )}

                                {/* ── Stock — all types except Billing */}
                                {!isBilling && canView('inventory') && (
                                    <>
                                        <div className="pos-menu-divider"></div>
                                        <div className="pos-menu-section">Stock</div>
                                        <ul className="pos-menu-list pb-4">
                                            <li className="pos-menu-item">
                                                <NavLink to="/dashboard/manage-stock" className={({ isActive }) => `pos-menu-link ${isActive ? 'active' : ''}`}>
                                                    <div className="pos-menu-link-content"><Box className="pos-menu-icon" strokeWidth={1.5} /><span>Manage Stock</span></div>
                                                </NavLink>
                                            </li>
                                            <li className="pos-menu-item">
                                                <NavLink to="/dashboard/stock-adjustment" className={({ isActive }) => `pos-menu-link ${isActive ? 'active' : ''}`}>
                                                    <div className="pos-menu-link-content"><SlidersHorizontal className="pos-menu-icon" strokeWidth={1.5} /><span>Stock Adjustment</span></div>
                                                </NavLink>
                                            </li>
                                            <li className="pos-menu-item">
                                                <NavLink to="/dashboard/stock-transfer" className={({ isActive }) => `pos-menu-link ${isActive ? 'active' : ''}`}>
                                                    <div className="pos-menu-link-content"><ArrowRightLeft className="pos-menu-icon" strokeWidth={1.5} /><span>Stock Transfer</span></div>
                                                </NavLink>
                                            </li>
                                        </ul>
                                    </>
                                )}

                                {/* ── Manufacturing: Sales section AFTER Production */}
                                {isManufacturing && (canView('sales') || canView('pos')) && (
                                    <>
                                        <div className="pos-menu-divider"></div>
                                        <div className="pos-menu-section">Sales</div>
                                        <ul className="pos-menu-list pb-4">
                                            <li className="pos-menu-item">
                                                <a className={`pos-menu-link ${isSalesActive ? 'active' : ''} ${openMenus.sales ? 'open' : ''}`} onClick={() => toggleMenu('sales')}>
                                                    <div className="pos-menu-link-content"><ShoppingCart className="pos-menu-icon" strokeWidth={1.5} /><span>Sales</span></div>
                                                    <ChevronRight className="pos-menu-chevron" strokeWidth={1.5} />
                                                </a>
                                                <ul className={`pos-submenu ${openMenus.sales ? 'show' : ''}`}>
                                                    <li><NavLink to="/dashboard/sales-pos" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>POS Orders</NavLink></li>
                                                    <li><NavLink to="/dashboard/sales-online" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>Online Orders</NavLink></li>
                                                    <li><NavLink to="/dashboard/invoices" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>Invoices</NavLink></li>
                                                </ul>
                                            </li>
                                            <li className="pos-menu-item">
                                                <NavLink to="/dashboard/sales-return" className={({ isActive }) => `pos-menu-link ${isActive ? 'active' : ''}`}>
                                                    <div className="pos-menu-link-content"><RotateCcw className="pos-menu-icon" strokeWidth={1.5} /><span>Sales Return</span></div>
                                                </NavLink>
                                            </li>
                                        </ul>
                                    </>
                                )}

                                {/* ── E-Comm: Purchases section too (supplier side) */}
                                {canView('purchases') && (
                                    <>
                                        <div className="pos-menu-divider"></div>
                                        <div className="pos-menu-section">Purchases</div>
                                        <ul className="pos-menu-list pb-4">
                                            <li className="pos-menu-item">
                                                <NavLink to="/purchases" className={({ isActive }) => `pos-menu-link ${isActive ? 'active' : ''}`}>
                                                    <div className="pos-menu-link-content"><ShoppingBag className="pos-menu-icon" strokeWidth={1.5} /><span>Purchase</span></div>
                                                </NavLink>
                                            </li>
                                            <li className="pos-menu-item">
                                                <NavLink to="/purchase-return" className={({ isActive }) => `pos-menu-link ${isActive ? 'active' : ''}`}>
                                                    <div className="pos-menu-link-content"><FileUp className="pos-menu-icon" strokeWidth={1.5} /><span>Purchase Return</span></div>
                                                </NavLink>
                                            </li>
                                        </ul>
                                    </>
                                )}

                                {/* ── Finance & Khata — all types */}
                                <div className="pos-menu-divider"></div>
                                <div className="pos-menu-section">Finance &amp; Khata</div>
                                <ul className="pos-menu-list pb-2">
                                    <li className="pos-menu-item">
                                        <a className={`pos-menu-link ${isKhataActive ? 'active' : ''} ${openMenus.khata ? 'open' : ''}`} onClick={() => toggleMenu('khata')}>
                                            <div className="pos-menu-link-content"><BookOpen className="pos-menu-icon" strokeWidth={1.5} /><span>Khata Book</span></div>
                                            <ChevronRight className="pos-menu-chevron" strokeWidth={1.5} />
                                        </a>
                                        <ul className={`pos-submenu ${openMenus.khata ? 'show' : ''}`}>
                                            <li><NavLink to="/khata-book" end className={() => `pos-submenu-link ${location.pathname === '/khata-book' && (!location.search || location.search.includes('customers')) ? 'active' : ''}`}>Customers Khata</NavLink></li>
                                            <li><NavLink to="/khata-book?tab=suppliers" className={() => `pos-submenu-link ${location.pathname === '/khata-book' && location.search.includes('suppliers') ? 'active' : ''}`}>Suppliers Khata</NavLink></li>
                                            <li><NavLink to="/khata-book?tab=daybook" className={() => `pos-submenu-link ${location.pathname === '/khata-book' && location.search.includes('daybook') ? 'active' : ''}`}>Day Book (Daily Ledger)</NavLink></li>
                                        </ul>
                                    </li>
                                </ul>

                                {/* ── Reports */}
                                {!isBilling && canView('sales') && (
                                    <>
                                        <div className="pos-menu-divider"></div>
                                        <div className="pos-menu-section">Reports</div>
                                        <ul className="pos-menu-list pb-4">
                                            <li className="pos-menu-item">
                                                <NavLink to="/dashboard/financial-report" className={({ isActive }) => `pos-menu-link ${isActive ? 'active' : ''}`}>
                                                    <div className="pos-menu-link-content"><FileText className="pos-menu-icon" strokeWidth={1.5} /><span>Financial Report</span></div>
                                                </NavLink>
                                            </li>
                                        </ul>
                                    </>
                                )}

                                {/* ── Settings & Integrations — all types */}
                                <div className="pos-menu-divider"></div>
                                <div className="pos-menu-section">{isSubscriber && !isBilling ? 'Settings & Integrations' : 'System Settings'}</div>
                                <ul className="pos-menu-list pb-4">
                                    {isSubscriber && !isBilling && (
                                        <li className="pos-menu-item">
                                            <NavLink to="/settings/connected_apps" className={() => `pos-menu-link ${isConnectedAppsActive ? 'active' : ''}`}>
                                                <div className="pos-menu-link-content"><Puzzle className="pos-menu-icon" strokeWidth={1.5} /><span>Connected Apps</span></div>
                                                <span style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', color: '#fff', fontSize: '10px', fontWeight: '700', padding: '2px 7px', borderRadius: '10px', letterSpacing: '0.04em' }}>APPS</span>
                                            </NavLink>
                                        </li>
                                    )}
                                    <li className="pos-menu-item">
                                        <a className={`pos-menu-link ${isSystemSettingsActive ? 'active' : ''} ${openMenus.settings ? 'open' : ''}`} onClick={() => toggleMenu('settings')}>
                                            <div className="pos-menu-link-content"><Settings className="pos-menu-icon" strokeWidth={1.5} /><span>System Settings</span></div>
                                            <ChevronRight className="pos-menu-chevron" strokeWidth={1.5} />
                                        </a>
                                        <ul className={`pos-submenu ${openMenus.settings ? 'show' : ''}`}>
                                            <li><NavLink to="/settings/profile" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>Profile Settings</NavLink></li>
                                            <li><NavLink to="/settings/company_settings" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>Company Settings</NavLink></li>
                                            <li><NavLink to="/settings/bank_accounts" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>Bank Accounts</NavLink></li>
                                            {!isBilling && (
                                                <>
                                                    <li><NavLink to="/settings/payment_gateway" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>Payment Gateway</NavLink></li>
                                                    <li><NavLink to="/settings/tax_rates" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>Tax Rates</NavLink></li>
                                                    <li><NavLink to="/settings/currencies" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>Currencies</NavLink></li>
                                                    <li><NavLink to="/settings/pos_settings" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>POS Settings</NavLink></li>
                                                    <li><NavLink to="/settings/ai_helper" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>AI Helper</NavLink></li>
                                                </>
                                            )}
                                        </ul>
                                    </li>
                                </ul>
                            </>
                        );
                    })()}
                </div>

                {/* Subscription Widget */}
                {!isSuperAdmin && (
                    <div className="pos-sidebar-subscription-container">
                        {(!user?.plan || user?.plan === 'NONE' || !isSubscriber) ? (
                            (() => {
                                const freeLimit = usage?.limit && usage.limit > 0 ? usage.limit : 50;
                                const freeUsed = usage?.totalUsed ?? 0;
                                const freeRemaining = Math.max(0, freeLimit - freeUsed);
                                const freePercent = Math.min(100, Math.round((freeUsed / freeLimit) * 100));
                                const isLimitReached = freeUsed >= freeLimit;

                                // Project theme colors: #ff822d -> #ea580c (Namastute Primary Orange)
                                let barColor = 'linear-gradient(90deg, #ff822d 0%, #ea580c 100%)';
                                let strokeColor = '#ea580c';
                                let badgeBg = '#fff7ed';
                                let badgeText = '#ea580c';
                                let statusText = `${freeRemaining} remaining`;

                                if (isLimitReached) {
                                    barColor = 'linear-gradient(90deg, #ef4444 0%, #b91c1c 100%)';
                                    strokeColor = '#ef4444';
                                    badgeBg = '#fef2f2';
                                    badgeText = '#b91c1c';
                                    statusText = '50 Max Completed';
                                } else if (freePercent >= 90) {
                                    barColor = 'linear-gradient(90deg, #ef4444 0%, #b91c1c 100%)';
                                    strokeColor = '#ef4444';
                                    badgeBg = '#fef2f2';
                                    badgeText = '#b91c1c';
                                    statusText = `${freeRemaining} remaining`;
                                } else if (freePercent >= 70) {
                                    barColor = 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)';
                                    strokeColor = '#f59e0b';
                                    badgeBg = '#fffbeb';
                                    badgeText = '#b45309';
                                    statusText = `${freeRemaining} remaining`;
                                }

                                const circumference = 106.8;
                                const strokeDashoffset = circumference - (freePercent / 100) * circumference;

                                return (
                                    <>
                                        {/* 1) Collapsed Mini View (for mini/collapsed sidebar) */}
                                        <div className="pos-sub-widget-collapsed">
                                            <div 
                                                className="pos-mini-gauge-container" 
                                                onClick={() => isLimitReached && openUpgradeModal('50 Records Max Completed')}
                                                title={`Free Plan: ${freeUsed}/${freeLimit} used (${isLimitReached ? 'Limit Completed' : `${freeRemaining} remaining`})`}
                                            >
                                                {isLimitReached && <span className="pos-mini-alert-dot" />}
                                                <svg className="pos-mini-gauge-svg" width="44" height="44" viewBox="0 0 44 44">
                                                    <circle
                                                        cx="22"
                                                        cy="22"
                                                        r="17"
                                                        fill="none"
                                                        stroke="rgba(234, 88, 12, 0.15)"
                                                        strokeWidth="3.5"
                                                    />
                                                    <circle
                                                        cx="22"
                                                        cy="22"
                                                        r="17"
                                                        fill="none"
                                                        stroke={strokeColor}
                                                        strokeWidth="3.5"
                                                        strokeDasharray={circumference}
                                                        strokeDashoffset={strokeDashoffset}
                                                        strokeLinecap="round"
                                                        style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s ease' }}
                                                    />
                                                </svg>
                                                <div className="pos-mini-gauge-icon" style={{ color: strokeColor }}>
                                                    {isLimitReached ? <AlertTriangle size={15} className="pos-sub-alert-pulse" /> : <Database size={15} />}
                                                </div>
                                            </div>
                                            <div 
                                                className="pos-mini-percent-label" 
                                                style={{ color: freePercent >= 90 ? '#ef4444' : '#64748b' }}
                                            >
                                                {freePercent}%
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => openUpgradeModal('50 Records Max Completed')}
                                                className={`pos-mini-pro-btn ${isLimitReached ? 'pos-mini-pro-btn--alert' : ''}`}
                                                title={`Upgrade Plan (${freeUsed}/${freeLimit} used)`}
                                            >
                                                <Sparkles size={11} />
                                                <span>{isLimitReached ? 'UPG' : 'PRO'}</span>
                                            </button>

                                            {/* Hover Flyout Card */}
                                            <div className="pos-sub-flyout-card">
                                                <div className="pos-flyout-header">
                                                    <div className="pos-flyout-plan-info">
                                                        <div className="pos-flyout-icon-box" style={{ background: isLimitReached ? '#fef2f2' : '#fff7ed', color: isLimitReached ? '#ef4444' : '#ea580c' }}>
                                                            {isLimitReached ? <AlertTriangle size={13} /> : <Database size={13} />}
                                                        </div>
                                                        <span className="pos-flyout-plan-name">Free Plan</span>
                                                    </div>
                                                    <span className={`pos-flyout-badge ${isLimitReached ? 'pos-flyout-badge--alert' : ''}`} style={{ background: badgeBg, color: badgeText }}>
                                                        {freeLimit} Records Max {isLimitReached ? '· Full' : ''}
                                                    </span>
                                                </div>

                                                {isLimitReached && (
                                                    <div className="pos-flyout-limit-alert" onClick={() => openUpgradeModal('50 Records Max Completed')}>
                                                        <AlertTriangle size={13} className="pos-sub-alert-pulse" />
                                                        <span>50 Records limit completed! Click to upgrade.</span>
                                                    </div>
                                                )}

                                                <div className="pos-flyout-stats">
                                                    <div className="pos-flyout-used">
                                                        <strong>{freeUsed}</strong> / {freeLimit} used
                                                    </div>
                                                    <span className="pos-flyout-status" style={{ color: freePercent >= 90 ? '#ef4444' : '#64748b' }}>
                                                        {statusText}
                                                    </span>
                                                </div>

                                                <div className="pos-flyout-progress-track">
                                                    <div
                                                        className="pos-flyout-progress-fill"
                                                        style={{ width: `${freePercent}%`, background: barColor }}
                                                    />
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => openUpgradeModal('50 Records Max Completed')}
                                                    className={`pos-flyout-upgrade-btn ${isLimitReached ? 'pos-flyout-upgrade-btn--alert' : ''}`}
                                                >
                                                    <Sparkles size={13} />
                                                    <span>{isLimitReached ? 'Upgrade Plan Now' : 'Upgrade to Pro'}</span>
                                                </button>
                                            </div>
                                        </div>

                                        {/* 2) Expanded View (for open sidebar) */}
                                        <div className="pos-sub-widget-expanded">
                                            <div className={`pos-sub-expanded-card ${isLimitReached ? 'pos-sub-expanded-card--alert' : ''}`}>
                                                <div className="pos-sub-card-header">
                                                    <div className="pos-sub-plan-title-wrap">
                                                        <div className="pos-sub-plan-icon-box" style={{ background: isLimitReached ? '#fef2f2' : '#fff7ed', color: isLimitReached ? '#ef4444' : '#ea580c' }}>
                                                            {isLimitReached ? <AlertTriangle size={13} /> : <Database size={13} />}
                                                        </div>
                                                        <span className="pos-sub-plan-name">Free Plan</span>
                                                    </div>
                                                    <span
                                                        className={`pos-sub-limit-badge ${isLimitReached ? 'pos-sub-limit-badge--alert' : ''}`}
                                                        style={{ background: badgeBg, color: badgeText }}
                                                    >
                                                        {freeLimit} Records Max {isLimitReached ? '· Reached' : ''}
                                                    </span>
                                                </div>

                                                {/* Notification Banner right here on 50 records completed */}
                                                {isLimitReached && (
                                                    <div
                                                        className="pos-sub-limit-notification"
                                                        onClick={() => openUpgradeModal('50 Records Max Limit Reached')}
                                                    >
                                                        <div className="pos-sub-notification-title">
                                                            <AlertTriangle size={13} className="pos-sub-alert-pulse" />
                                                            <span>Limit Completed (50/50)</span>
                                                        </div>
                                                        <div className="pos-sub-notification-sub">
                                                            Free 50 records quota completed! Upgrade to add more records.
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="pos-sub-card-counts">
                                                    <div className="pos-sub-count-left">
                                                        <span className="pos-sub-count-num">{freeUsed}</span>
                                                        <span className="pos-sub-count-total"> / {freeLimit} used</span>
                                                    </div>
                                                    <span
                                                        className="pos-sub-remaining-text"
                                                        style={{ color: freePercent >= 90 ? '#ef4444' : '#64748b' }}
                                                    >
                                                        {statusText}
                                                    </span>
                                                </div>

                                                <div className="pos-sub-progress-track">
                                                    <div
                                                        className="pos-sub-progress-bar"
                                                        style={{
                                                            width: `${freePercent}%`,
                                                            background: barColor,
                                                            boxShadow: isLimitReached ? '0 0 8px rgba(239, 68, 68, 0.45)' : freePercent > 0 ? '0 0 6px rgba(234, 88, 12, 0.35)' : 'none'
                                                        }}
                                                    />
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => openUpgradeModal('50 Records Max Limit Reached')}
                                                    className={`pos-sub-upgrade-btn ${isLimitReached ? 'pos-sub-upgrade-btn--alert' : ''}`}
                                                >
                                                    <Sparkles size={13} />
                                                    <span>{isLimitReached ? 'Upgrade Plan Now' : 'Upgrade to Pro'}</span>
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                );
                            })()
                        ) : (
                            (() => {
                                const end = user.subscriptionEndDate ? new Date(user.subscriptionEndDate).getTime() : 0;
                                const start = end - (30 * 24 * 60 * 60 * 1000);
                                const now = new Date().getTime();
                                const total = Math.max(1, end - start);
                                const current = now - start;
                                let paidPercent = Math.min(100, Math.max(0, Math.round((current / total) * 100)));

                                return (
                                    <>
                                        {/* Collapsed Paid View */}
                                        <div className="pos-sub-widget-collapsed">
                                            <div className="pos-mini-paid-badge" title={`${user.plan} Plan - Active`}>
                                                <Crown size={16} />
                                            </div>
                                            <div className="pos-mini-percent-label" style={{ color: '#16a34a' }}>
                                                ACTIVE
                                            </div>
                                            <Link
                                                to="/settings/billing"
                                                className="pos-mini-pro-btn pos-mini-paid-btn"
                                                title="Manage Subscription"
                                            >
                                                <Sparkles size={11} />
                                                <span>PLAN</span>
                                            </Link>

                                            {/* Hover Flyout Card */}
                                            <div className="pos-sub-flyout-card">
                                                <div className="pos-flyout-header">
                                                    <div className="pos-flyout-plan-info">
                                                        <div className="pos-flyout-icon-box pos-flyout-paid-icon">
                                                            <Crown size={13} />
                                                        </div>
                                                        <span className="pos-flyout-plan-name" style={{ textTransform: 'capitalize' }}>
                                                            {user.plan?.toLowerCase()} Plan
                                                        </span>
                                                    </div>
                                                    <span className="pos-flyout-badge pos-badge-active">
                                                        Active
                                                    </span>
                                                </div>
                                                {user.subscriptionEndDate && (
                                                    <div className="pos-flyout-expiry-text">
                                                        Expires: {new Date(user.subscriptionEndDate).toLocaleDateString()}
                                                    </div>
                                                )}
                                                <Link to="/settings/billing" className="pos-flyout-manage-btn">
                                                    <span>Manage Billing</span>
                                                </Link>
                                            </div>
                                        </div>

                                        {/* Expanded Paid View */}
                                        <div className="pos-sub-widget-expanded">
                                            <div className="pos-sub-expanded-card">
                                                <div className="pos-sub-card-header">
                                                    <div className="pos-sub-plan-title-wrap">
                                                        <div className="pos-sub-plan-icon-box pos-sub-paid-icon">
                                                            <Crown size={13} />
                                                        </div>
                                                        <span className="pos-sub-plan-name" style={{ textTransform: 'capitalize' }}>
                                                            {user.plan?.toLowerCase()} Plan
                                                        </span>
                                                    </div>
                                                    <span className="pos-sub-limit-badge pos-badge-active">
                                                        Active
                                                    </span>
                                                </div>
                                                {user.subscriptionEndDate && (
                                                    <>
                                                        <div className="pos-sub-progress-track" style={{ marginTop: '2px' }}>
                                                            <div
                                                                className="pos-sub-progress-bar"
                                                                style={{
                                                                    width: `${paidPercent}%`,
                                                                    background: 'linear-gradient(90deg, #ff822d 0%, #ea580c 100%)',
                                                                    boxShadow: '0 0 6px rgba(234, 88, 12, 0.35)'
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="pos-sub-expiry-info">
                                                            Ends on {new Date(user.subscriptionEndDate).toLocaleDateString()} at {new Date(user.subscriptionEndDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                    </>
                                                )}
                                                <Link to="/settings/billing" className="pos-sub-manage-btn">
                                                    <span>Manage Subscription</span>
                                                </Link>
                                            </div>
                                        </div>
                                    </>
                                );
                            })()
                        )}
                    </div>
                )}
            </aside>
        </>
    );
}
