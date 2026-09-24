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
    Database
} from 'lucide-react';

export default function PosSidebar({ sidebarOpen, setSidebarOpen }) {
    const location = useLocation();
    const { user } = useAuth();
    const { usage } = useDataUsage();
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
            <aside className={`pos-sidebar`}>
                <div className="pos-sidebar-header" style={{ padding: '24px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6', backgroundColor: '#ffffff' }}>
                    <Link to="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                        {companyInfo?.logo && (
                            <img
                                src={companyInfo.logo}
                                alt="Company Logo"
                                style={{ width: '40px', height: '40px', objectFit: 'contain', marginRight: '12px', borderRadius: '4px', flexShrink: 0 }}
                            />
                        )}
                        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                            {(() => {
                                const companyName = companyInfo?.name || 'Samrajya Software';
                                const words = companyName.split(' ');
                                const firstWord = words[0];
                                const restOfWords = words.slice(1).join(' ');
                                return (
                                    <>
                                        <span style={{ margin: 0, fontWeight: '900', fontSize: '24px', letterSpacing: '0.5px', color: '#111827', lineHeight: '1.2', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={firstWord}>
                                            {firstWord.toUpperCase()}
                                        </span>
                                        {restOfWords && (
                                            <span style={{ margin: 0, fontWeight: '700', fontSize: '13px', letterSpacing: '1px', color: '#6B7280', textTransform: 'uppercase', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={restOfWords}>
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
                    {/* Main Section — CLIENT + ADMIN only */}
                    {!isSuperAdmin && (
                        <>
                            <div className="pos-menu-divider" style={{ marginTop: '0' }}></div>
                            <div className="pos-menu-section">Main</div>
                            <ul className="pos-menu-list">
                                <li className="pos-menu-item">
                                    <a
                                        className={`pos-menu-link ${isDashboardActive ? 'active' : ''} ${openMenus.dashboard ? 'open' : ''}`}
                                        onClick={() => toggleMenu('dashboard')}
                                    >
                                        <div className="pos-menu-link-content">
                                            <LayoutDashboard className="pos-menu-icon" strokeWidth={1.5} />
                                            <span>Dashboard</span>
                                        </div>
                                        <ChevronRight className="pos-menu-chevron" strokeWidth={1.5} />
                                    </a>
                                    <ul className={`pos-submenu ${openMenus.dashboard ? 'show' : ''}`}>
                                        <li>
                                            <NavLink to="/dashboard" end className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>
                                                Dashboard
                                            </NavLink>
                                        </li>

                                    </ul>
                                </li>
                            </ul>
                        </>
                    )}

                    {/* Super Admin menu — SUPER_ADMIN only */}
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
                                        <li>
                                            <NavLink to="/dashboard/super-dashboard" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>
                                                Dashboard
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/dashboard/super-companies" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>
                                                Companies
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/dashboard/super-subscriptions" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>
                                                Subscriptions
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/dashboard/super-packages" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>
                                                Packages
                                            </NavLink>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </>
                    )}

                    {/* Inventory Section — CLIENT + ADMIN only */}
                    {isClientOrAdmin && (canView('inventory') || canView('products')) && (
                        <>
                            <div className="pos-menu-divider"></div>
                            <div className="pos-menu-section">Inventory</div>
                            <ul className="pos-menu-list">
                                <li className="pos-menu-item">
                                    <a
                                        className={`pos-menu-link ${isInventoryActive ? 'active' : ''} ${openMenus.inventory ? 'open' : ''}`}
                                        onClick={() => toggleMenu('inventory')}
                                    >
                                        <div className="pos-menu-link-content">
                                            <Boxes className="pos-menu-icon" strokeWidth={1.5} />
                                            <span>Inventory Management</span>
                                        </div>
                                        <ChevronRight className="pos-menu-chevron" strokeWidth={1.5} />
                                    </a>
                                    <ul className={`pos-submenu ${openMenus.inventory ? 'show' : ''}`}>
                                        <li>
                                            <NavLink to="/products" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>
                                                Products List
                                            </NavLink>
                                        </li>
                                        {(canManage('products') || canManage('inventory')) && (
                                            <li>
                                                <NavLink to="/create-product" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>
                                                    Create Product
                                                </NavLink>
                                            </li>
                                        )}
                                        <li>
                                            <NavLink to="/expired-products" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>
                                                Expired Products
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/low-stocks" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>
                                                Low Stocks
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/category" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>
                                                Category
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/sub-category" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>
                                                Sub Category
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/brands" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>
                                                Brands
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/units" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>
                                                Units
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/warranties" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>
                                                Warranties
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/stores" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>
                                                Stores
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/warehouses" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>
                                                Warehouses
                                            </NavLink>
                                        </li>
                                        {hasAdvancedPlan && (
                                            <li>
                                                <NavLink to="/print-barcode" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>
                                                    Print Barcode
                                                </NavLink>
                                            </li>
                                        )}
                                        {hasAdvancedPlan && (
                                            <li>
                                                <NavLink to="/print-qrcode" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>
                                                    Print QR Code
                                                </NavLink>
                                            </li>
                                        )}
                                    </ul>
                                </li>
                            </ul>
                        </>
                    )}

                    {/* Stock Section — CLIENT + ADMIN only */}
                    {isClientOrAdmin && canView('inventory') && (
                        <>
                            <div className="pos-menu-divider"></div>
                            <div className="pos-menu-section">Stock</div>
                            <ul className="pos-menu-list pb-4">
                                <li className="pos-menu-item">
                                    <NavLink to="/dashboard/manage-stock" className={({ isActive }) => `pos-menu-link ${isActive ? 'active' : ''}`}>
                                        <div className="pos-menu-link-content">
                                            <Box className="pos-menu-icon" strokeWidth={1.5} />
                                            <span>Manage Stock</span>
                                        </div>
                                    </NavLink>
                                </li>
                                <li className="pos-menu-item">
                                    <NavLink to="/dashboard/stock-adjustment" className={({ isActive }) => `pos-menu-link ${isActive ? 'active' : ''}`}>
                                        <div className="pos-menu-link-content">
                                            <SlidersHorizontal className="pos-menu-icon" strokeWidth={1.5} />
                                            <span>Stock Adjustment</span>
                                        </div>
                                    </NavLink>
                                </li>
                                <li className="pos-menu-item">
                                    <NavLink to="/dashboard/stock-transfer" className={({ isActive }) => `pos-menu-link ${isActive ? 'active' : ''}`}>
                                        <div className="pos-menu-link-content">
                                            <ArrowRightLeft className="pos-menu-icon" strokeWidth={1.5} />
                                            <span>Stock Transfer</span>
                                        </div>
                                    </NavLink>
                                </li>
                            </ul>

                            {/* Manufacturing Section */}
                            {hasAdvancedPlan && user?.businessType === 'Manufacturing' && canView('manufacturing') && (
                                <>
                                    <div className="pos-menu-divider"></div>
                                    <div className="pos-menu-section">Manufacturing</div>
                                    <ul className="pos-menu-list pb-4">
                                        <li className="pos-menu-item">
                                            <NavLink to="/manufacturing/bom" className={({ isActive }) => `pos-menu-link ${isActive ? 'active' : ''}`}>
                                                <div className="pos-menu-link-content">
                                                    <Layers className="pos-menu-icon" strokeWidth={1.5} />
                                                    <span>Bill of Materials (BOM)</span>
                                                </div>
                                            </NavLink>
                                        </li>
                                        <li className="pos-menu-item">
                                            <NavLink to="/manufacturing/work-orders" className={({ isActive }) => `pos-menu-link ${isActive ? 'active' : ''}`}>
                                                <div className="pos-menu-link-content">
                                                    <Cpu className="pos-menu-icon" strokeWidth={1.5} />
                                                    <span>Work Orders (Production)</span>
                                                </div>
                                            </NavLink>
                                        </li>
                                        <li className="pos-menu-item">
                                            <NavLink to="/manufacturing/work-centers" className={({ isActive }) => `pos-menu-link ${isActive ? 'active' : ''}`}>
                                                <div className="pos-menu-link-content">
                                                    <Factory className="pos-menu-icon" strokeWidth={1.5} />
                                                    <span>Work Centers</span>
                                                </div>
                                            </NavLink>
                                        </li>
                                    </ul>
                                </>
                            )}

                            {/* Sales Section */}
                            {(canView('sales') || canView('pos')) && (
                                <>
                                    <div className="pos-menu-divider"></div>
                                    <div className="pos-menu-section">Sales</div>
                                    <ul className="pos-menu-list pb-4">
                                        <li className="pos-menu-item">
                                            <a
                                                className={`pos-menu-link ${isSalesActive ? 'active' : ''} ${openMenus.sales ? 'open' : ''}`}
                                                onClick={() => toggleMenu('sales')}
                                            >
                                                <div className="pos-menu-link-content">
                                                    <ShoppingCart className="pos-menu-icon" strokeWidth={1.5} />
                                                    <span>Sales</span>
                                                </div>
                                                <ChevronRight className="pos-menu-chevron" strokeWidth={1.5} />
                                            </a>
                                            <ul className={`pos-submenu ${openMenus.sales ? 'show' : ''}`}>
                                                {/* Hidden for Starter Plan */}
                                                {hasAdvancedPlan && (
                                                    <li>
                                                        <NavLink to="/dashboard/sales-online" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>
                                                            Online Orders
                                                        </NavLink>
                                                    </li>
                                                )}
                                                <li>
                                                    <NavLink to="/dashboard/sales-pos" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>
                                                        POS Orders
                                                    </NavLink>
                                                </li>
                                                {hasAdvancedPlan && (
                                                    <li>
                                                        <NavLink to="/dashboard/invoices" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>
                                                            Invoices
                                                        </NavLink>
                                                    </li>
                                                )}

                                            </ul>
                                        </li>
                                        <li className="pos-menu-item">
                                            <NavLink to="/dashboard/sales-return" className={({ isActive }) => `pos-menu-link ${isActive ? 'active' : ''}`}>
                                                <div className="pos-menu-link-content">
                                                    <RotateCcw className="pos-menu-icon" strokeWidth={1.5} />
                                                    <span>Sales Return</span>
                                                </div>
                                            </NavLink>
                                        </li>
                                        {/* <li className="pos-menu-item">
                                    <a className="pos-menu-link">
                                        <div className="pos-menu-link-content">
                                            <Copy className="pos-menu-icon" strokeWidth={1.5} />
                                            <span>Quotation</span>
                                        </div>
                                    </a>
                                </li> */}
                                        {/* <li className="pos-menu-item">
                                     <NavLink to="/pos" className={({ isActive }) => `pos-menu-link ${isActive ? 'active' : ''}`}>
                                         <div className="pos-menu-link-content">
                                             <Monitor className="pos-menu-icon" strokeWidth={1.5} />
                                             <span>POS Terminal</span>
                                         </div>
                                     </NavLink>
                                 </li> */}
                                    </ul>
                                </>
                            )}

                            {/* Purchases Section */}
                            {hasAdvancedPlan && canView('purchases') && (
                                <>
                                    <div className="pos-menu-divider"></div>
                                    <div className="pos-menu-section">Purchases</div>
                                    <ul className="pos-menu-list pb-4">
                                        <li className="pos-menu-item">
                                            <NavLink to="/purchases" className={({ isActive }) => `pos-menu-link ${isActive ? 'active' : ''}`}>
                                                <div className="pos-menu-link-content">
                                                    <ShoppingBag className="pos-menu-icon" strokeWidth={1.5} />
                                                    <span>Purchase</span>
                                                </div>
                                            </NavLink>
                                        </li>

                                        {/* <li className="pos-menu-item">
                                    <NavLink to="/purchase-order" className={({isActive}) => `pos-menu-link ${isActive ? 'active' : ''}`}>
                                        <div className="pos-menu-link-content">
                                            <FileText className="pos-menu-icon" strokeWidth={1.5} />
                                            <span>Purchase Order</span>
                                        </div>
                                    </NavLink>
                                </li> */}
                                        <li className="pos-menu-item">
                                            <NavLink to="/purchase-return" className={({ isActive }) => `pos-menu-link ${isActive ? 'active' : ''}`}>
                                                <div className="pos-menu-link-content">
                                                    <FileUp className="pos-menu-icon" strokeWidth={1.5} />
                                                    <span>Purchase Return</span>
                                                </div>
                                            </NavLink>
                                        </li>
                                    </ul>
                                </>
                            )}

                            {/* Khata Book Section — CLIENT + ADMIN */}
                            <div className="pos-menu-divider"></div>
                            <div className="pos-menu-section">Finance & Khata</div>
                            <ul className="pos-menu-list pb-2">
                                <li className="pos-menu-item">
                                    <a
                                        className={`pos-menu-link ${isKhataActive ? 'active' : ''} ${openMenus.khata ? 'open' : ''}`}
                                        onClick={() => toggleMenu('khata')}
                                    >
                                        <div className="pos-menu-link-content">
                                            <BookOpen className="pos-menu-icon" strokeWidth={1.5} />
                                            <span>Khata Book</span>
                                        </div>
                                        <ChevronRight className="pos-menu-chevron" strokeWidth={1.5} />
                                    </a>
                                    <ul className={`pos-submenu ${openMenus.khata ? 'show' : ''}`}>
                                        <li>
                                            <NavLink to="/khata-book" end className={() => `pos-submenu-link ${location.pathname === '/khata-book' && (!location.search || location.search.includes('customers')) ? 'active' : ''}`}>
                                                Customers Khata
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/khata-book?tab=suppliers" className={() => `pos-submenu-link ${location.pathname === '/khata-book' && location.search.includes('suppliers') ? 'active' : ''}`}>
                                                Suppliers Khata
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/khata-book?tab=daybook" className={() => `pos-submenu-link ${location.pathname === '/khata-book' && location.search.includes('daybook') ? 'active' : ''}`}>
                                                Day Book (Daily Ledger)
                                            </NavLink>
                                        </li>
                                    </ul>
                                </li>
                            </ul>

                            {/* Reports Section */}
                            {hasAdvancedPlan && canView('sales') && (
                                <>
                                    <div className="pos-menu-divider"></div>
                                    <div className="pos-menu-section">Reports</div>
                                    <ul className="pos-menu-list pb-4">
                                        <li className="pos-menu-item">
                                            <NavLink to="/dashboard/financial-report" className={({ isActive }) => `pos-menu-link ${isActive ? 'active' : ''}`}>
                                                <div className="pos-menu-link-content">
                                                    <FileText className="pos-menu-icon" strokeWidth={1.5} />
                                                    <span>Financial Report</span>
                                                </div>
                                            </NavLink>
                                        </li>
                                    </ul>
                                </>
                            )}

                            {/* Settings & Integrations Section */}
                            <div className="pos-menu-divider"></div>
                            <div className="pos-menu-section">{isSubscriber ? 'Settings & Integrations' : 'System Settings'}</div>
                            <ul className="pos-menu-list pb-4">
                                {isSubscriber && (
                                    <li className="pos-menu-item">
                                        <NavLink 
                                            to="/settings/connected_apps" 
                                            className={() => `pos-menu-link ${isConnectedAppsActive ? 'active' : ''}`}
                                        >
                                            <div className="pos-menu-link-content">
                                                <Puzzle className="pos-menu-icon" strokeWidth={1.5} />
                                                <span>Connected Apps</span>
                                            </div>
                                            <span style={{ 
                                                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                                                color: '#fff',
                                                fontSize: '10px',
                                                fontWeight: '700',
                                                padding: '2px 7px',
                                                borderRadius: '10px',
                                                letterSpacing: '0.04em'
                                            }}>
                                                APPS
                                            </span>
                                        </NavLink>
                                    </li>
                                )}
                                <li className="pos-menu-item">
                                    <a
                                        className={`pos-menu-link ${isSystemSettingsActive ? 'active' : ''} ${openMenus.settings ? 'open' : ''}`}
                                        onClick={() => toggleMenu('settings')}
                                    >
                                        <div className="pos-menu-link-content">
                                            <Settings className="pos-menu-icon" strokeWidth={1.5} />
                                            <span>System Settings</span>
                                        </div>
                                        <ChevronRight className="pos-menu-chevron" strokeWidth={1.5} />
                                    </a>
                                    <ul className={`pos-submenu ${openMenus.settings ? 'show' : ''}`}>
                                        <li>
                                            <NavLink to="/settings/profile" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>
                                                Profile Settings
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/settings/company_settings" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>
                                                Company Settings
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/settings/payment_gateway" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>
                                                Payment Gateway
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/settings/bank_accounts" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>
                                                Bank Accounts
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/settings/tax_rates" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>
                                                Tax Rates
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/settings/currencies" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>
                                                Currencies
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/settings/pos_settings" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>
                                                POS Settings
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/settings/ai_helper" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>
                                                AI Helper
                                            </NavLink>
                                        </li>
                                    </ul>
                                </li>
                            </ul>

                        </>
                    )}
                </div>

                {/* Subscription Widget */}
                {!isSuperAdmin && (
                    <div style={{ padding: '20px', borderTop: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                        {(!user?.plan || user?.plan === 'NONE' || !isSubscriber) ? (
                            (() => {
                                const freeLimit = usage?.limit && usage.limit > 0 ? usage.limit : 50;
                                const freeUsed = usage?.totalUsed ?? 0;
                                const freeRemaining = Math.max(0, freeLimit - freeUsed);
                                const freePercent = Math.min(100, Math.round((freeUsed / freeLimit) * 100));

                                // Project theme colors: #ff822d -> #ea580c (Namastute Primary Orange)
                                let barColor = 'linear-gradient(90deg, #ff822d 0%, #ea580c 100%)';
                                let badgeBg = 'var(--pos-orange-light, #fff7ed)';
                                let badgeText = 'var(--pos-orange, #ea580c)';
                                let statusText = `${freeRemaining} remaining`;

                                if (freePercent >= 90) {
                                    barColor = 'linear-gradient(90deg, #ef4444 0%, #b91c1c 100%)';
                                    badgeBg = '#fef2f2';
                                    badgeText = '#b91c1c';
                                    statusText = freeRemaining === 0 ? '0 remaining (Limit reached)' : `${freeRemaining} remaining`;
                                } else if (freePercent >= 70) {
                                    barColor = 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)';
                                    badgeBg = '#fffbeb';
                                    badgeText = '#b45309';
                                    statusText = `${freeRemaining} remaining`;
                                }

                                return (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {/* Plan Header & Badge */}
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                                                <div style={{
                                                    width: '24px',
                                                    height: '24px',
                                                    borderRadius: '6px',
                                                    background: 'var(--pos-orange-light, #fff7ed)',
                                                    color: 'var(--pos-orange, #ea580c)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    border: '1px solid rgba(234, 88, 12, 0.15)'
                                                }}>
                                                    <Database size={13} />
                                                </div>
                                                <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--pos-dark-blue, #0f172a)' }}>
                                                    Free Plan
                                                </span>
                                            </div>
                                            <span style={{
                                                fontSize: '10px',
                                                fontWeight: '700',
                                                padding: '2px 8px',
                                                borderRadius: '12px',
                                                background: badgeBg,
                                                color: badgeText,
                                                border: '1px solid rgba(234, 88, 12, 0.2)',
                                                letterSpacing: '0.02em'
                                            }}>
                                                {freeLimit} Records Max
                                            </span>
                                        </div>

                                        {/* Counts: Used / Limit and Remaining */}
                                        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                                            <div>
                                                <span style={{ fontSize: '15px', fontWeight: '800', color: 'var(--pos-dark-blue, #0f172a)' }}>{freeUsed}</span>
                                                <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--pos-text-muted, #64748b)' }}> / {freeLimit} used</span>
                                            </div>
                                            <span style={{
                                                fontSize: '11px',
                                                fontWeight: '600',
                                                color: freePercent >= 90 ? '#ef4444' : 'var(--pos-text-muted, #64748b)'
                                            }}>
                                                {statusText}
                                            </span>
                                        </div>

                                        {/* Progress Bar */}
                                        <div style={{
                                            width: '100%',
                                            backgroundColor: '#fed7aa44',
                                            borderRadius: '9999px',
                                            height: '7px',
                                            overflow: 'hidden',
                                            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.06)'
                                        }}>
                                            <div style={{
                                                background: barColor,
                                                height: '100%',
                                                borderRadius: '9999px',
                                                width: `${freePercent}%`,
                                                transition: 'width 0.4s ease, background 0.3s ease',
                                                boxShadow: freePercent > 0 ? '0 0 6px rgba(234, 88, 12, 0.35)' : 'none'
                                            }}></div>
                                        </div>

                                        {/* Upgrade Button */}
                                        <Link
                                            to="/settings/billing"
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '6px',
                                                background: 'linear-gradient(135deg, #ff822d 0%, #ea580c 100%)',
                                                color: '#ffffff',
                                                padding: '9px 12px',
                                                borderRadius: '7px',
                                                textDecoration: 'none',
                                                fontSize: '12px',
                                                fontWeight: '700',
                                                boxShadow: '0 3px 8px rgba(234, 88, 12, 0.28)',
                                                transition: 'all 0.2s ease',
                                                marginTop: '2px',
                                                letterSpacing: '0.01em'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.filter = 'brightness(1.05)';
                                                e.currentTarget.style.transform = 'translateY(-1px)';
                                                e.currentTarget.style.boxShadow = '0 5px 12px rgba(234, 88, 12, 0.4)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.filter = 'none';
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = '0 3px 8px rgba(234, 88, 12, 0.28)';
                                            }}
                                        >
                                            <Sparkles size={13} />
                                            <span>Upgrade to Pro</span>
                                        </Link>
                                    </div>
                                );
                            })()
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ fontSize: '13px', color: '#111827', fontWeight: '600', textTransform: 'capitalize' }}>
                                    {user.plan.toLowerCase()} Plan
                                </div>
                                {user.subscriptionEndDate && (
                                    <>
                                        <div style={{ width: '100%', backgroundColor: '#fed7aa44', borderRadius: '9999px', height: '6px', overflow: 'hidden' }}>
                                            <div style={{
                                                background: 'linear-gradient(90deg, #ff822d 0%, #ea580c 100%)', height: '100%', borderRadius: '9999px',
                                                boxShadow: '0 0 6px rgba(234, 88, 12, 0.35)',
                                                width: `${(() => {
                                                    const end = new Date(user.subscriptionEndDate).getTime();
                                                    const start = end - (30 * 24 * 60 * 60 * 1000);
                                                    const now = new Date().getTime();
                                                    const total = end - start;
                                                    const current = now - start;
                                                    let percent = (current / total) * 100;
                                                    if (percent > 100) percent = 100;
                                                    if (percent < 0) percent = 0;
                                                    return percent;
                                                })()}%`
                                            }}></div>
                                        </div>
                                        <div style={{ fontSize: '11px', color: '#6b7280' }}>
                                            Ends on {new Date(user.subscriptionEndDate).toLocaleDateString()} at {new Date(user.subscriptionEndDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </aside>
        </>
    );
}
