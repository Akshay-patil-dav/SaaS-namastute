import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useCompany } from '../../../context/CompanyContext';
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
    ListTree,
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
    LayoutGrid,
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
    Palette
} from 'lucide-react';

export default function PosSidebar({ sidebarOpen, setSidebarOpen }) {
    const location = useLocation();
    const { user } = useAuth();
    const isSuperAdmin = user?.role === 'SUPER_ADMIN';
    const isClientOrAdmin = user?.role === 'ADMIN' || user?.role === 'CLIENT';

    const { companyInfo } = useCompany();

    const isDashboardActive = location.pathname === '/' || location.pathname === '/dashboard' || location.pathname === '/dashboard/admin2' || location.pathname === '/dashboard/sales';
    const isSuperAdminActive = location.pathname.startsWith('/dashboard/super-');
    const isSalesActive = location.pathname.startsWith('/dashboard/sales-') && !location.pathname.startsWith('/dashboard/sales-return');
    const [openMenus, setOpenMenus] = useState({
        dashboard: isDashboardActive,
        superAdmin: isSuperAdminActive,
        sales: isSalesActive
    });

    React.useEffect(() => {
        // When the route changes, ensure only the active section is open
        if (isDashboardActive) {
            setOpenMenus({ dashboard: true, superAdmin: false, sales: false });
        } else if (isSuperAdminActive) {
            setOpenMenus({ dashboard: false, superAdmin: true, sales: false });
        } else if (isSalesActive) {
            setOpenMenus({ dashboard: false, superAdmin: false, sales: true });
        }
    }, [isDashboardActive, isSuperAdminActive, isSalesActive]);

    const toggleMenu = (menu) => {
        setOpenMenus(prev => {
            const isCurrentlyOpen = prev[menu];
            // Close everything first
            const newState = {
                dashboard: false,
                superAdmin: false,
                sales: false
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
                <div className="pos-sidebar-header">
                    <Link to="/dashboard" className="pos-sidebar-logo">
                        {companyInfo.logo
                            ? <img src={companyInfo.logo} alt={companyInfo.name || 'Logo'} style={{ height: '32px', maxWidth: '120px', objectFit: 'contain' }} />
                            : <ShoppingBag className="pos-logo-icon" />}
                        <span style={{ color: '#1a1a1a', fontWeight: '800' }}>
                            {companyInfo.name || 'Namustute'}
                        </span>
                    </Link>
                </div>

                <div className="pos-sidebar-content">
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
                                        {isClientOrAdmin && (
                                            <li>
                                                <NavLink to="/dashboard/sales" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>
                                                    <BarChart2 size={16} className="me-2" /> Sales Dashboard
                                                </NavLink>
                                            </li>
                                        )}
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
                    {isClientOrAdmin && (
                        <>
                            <div className="pos-menu-divider"></div>
                            <div className="pos-menu-section">Inventory</div>
                            <ul className="pos-menu-list">
                                <li className="pos-menu-item"><NavLink to="/products" className={({ isActive }) => `pos-menu-link ${isActive ? 'active' : ''}`}><div className="pos-menu-link-content"><Package className="pos-menu-icon" /><span>Products</span></div></NavLink></li>

                                {/* <li className="pos-menu-item"><NavLink to="/create-product" className={({ isActive }) => `pos-menu-link ${isActive ? 'active' : ''}`}><div className="pos-menu-link-content"><FilePlus className="pos-menu-icon" /><span>Create Product</span></div></NavLink></li> */}
                                <li className="pos-menu-item"><NavLink to="/expired-products" className={({ isActive }) => `pos-menu-link ${isActive ? 'active' : ''}`}><div className="pos-menu-link-content"><CalendarX className="pos-menu-icon" /><span>Expired Products</span></div></NavLink></li>
                                <li className="pos-menu-item"><NavLink to="/low-stocks" className={({ isActive }) => `pos-menu-link ${isActive ? 'active' : ''}`}><div className="pos-menu-link-content"><TrendingDown className="pos-menu-icon" /><span>Low Stocks</span></div></NavLink></li>
                                <li className="pos-menu-item"><NavLink to="/category" className={({ isActive }) => `pos-menu-link ${isActive ? 'active' : ''}`}><div className="pos-menu-link-content"><ListTree className="pos-menu-icon" /><span>Category</span></div></NavLink></li>
                                <li className="pos-menu-item"><NavLink to="/sub-category" className={({ isActive }) => `pos-menu-link ${isActive ? 'active' : ''}`}><div className="pos-menu-link-content"><List className="pos-menu-icon" /><span>Sub Category</span></div></NavLink></li>
                                <li className="pos-menu-item"><NavLink to="/brands" className={({ isActive }) => `pos-menu-link ${isActive ? 'active' : ''}`}><div className="pos-menu-link-content"><Tag className="pos-menu-icon" /><span>Brands</span></div></NavLink></li>
                                <li className="pos-menu-item"><NavLink to="/units" className={({ isActive }) => `pos-menu-link ${isActive ? 'active' : ''}`}><div className="pos-menu-link-content"><Scale className="pos-menu-icon" /><span>Units</span></div></NavLink></li>
                                {/* <li className="pos-menu-item"><NavLink to="/variant-attributes" className={({isActive}) => `pos-menu-link ${isActive ? 'active' : ''}`}><div className="pos-menu-link-content"><Puzzle className="pos-menu-icon" /><span>Variant Attributes</span></div></NavLink></li> */}
                                <li className="pos-menu-item"><NavLink to="/warranties" className={({ isActive }) => `pos-menu-link ${isActive ? 'active' : ''}`}><div className="pos-menu-link-content"><ShieldCheck className="pos-menu-icon" /><span>Warranties</span></div></NavLink></li>
                                <li className="pos-menu-item"><NavLink to="/print-barcode" className={({ isActive }) => `pos-menu-link ${isActive ? 'active' : ''}`}><div className="pos-menu-link-content"><Barcode className="pos-menu-icon" /><span>Print Barcode</span></div></NavLink></li>

                            </ul>
                        </>
                    )}

                    {/* Stock Section — CLIENT + ADMIN only */}
                    {isClientOrAdmin && (
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

                            {/* Sales Section */}
                            <div className="pos-menu-divider"></div>
                            <div className="pos-menu-section">Sales</div>
                            <ul className="pos-menu-list pb-4">
                                <li className="pos-menu-item">
                                    <a
                                        className={`pos-menu-link ${isSalesActive ? 'active' : ''} ${openMenus.sales ? 'open' : ''}`}
                                        onClick={() => toggleMenu('sales')}
                                    >
                                        <div className="pos-menu-link-content">
                                            <LayoutGrid className="pos-menu-icon" strokeWidth={1.5} />
                                            <span>Sales</span>
                                        </div>
                                        <ChevronRight className="pos-menu-chevron" strokeWidth={1.5} />
                                    </a>
                                    <ul className={`pos-submenu ${openMenus.sales ? 'show' : ''}`}>
                                        <li>
                                            <NavLink to="/dashboard/sales-online" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>
                                                Online Orders
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/dashboard/sales-pos" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>
                                                POS Orders
                                            </NavLink>
                                        </li>

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

                            {/* Purchases Section */}
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



                    {/* Website Builder Section — CLIENT + ADMIN only */}
                    {isClientOrAdmin && (
                        <>
                            <div className="pos-menu-divider"></div>
                            <div className="pos-menu-section">Website Builder</div>
                            <ul className="pos-menu-list pb-4">
                                <li className="pos-menu-item">
                                    <NavLink
                                        to="/website-builder"
                                        className={({ isActive }) => `pos-menu-link ${isActive ? 'active' : ''}`}
                                        style={({ isActive }) => isActive ? {} : {}}
                                    >
                                        <div className="pos-menu-link-content">
                                            <Globe className="pos-menu-icon" strokeWidth={1.5} />
                                            <span>Website Builder</span>
                                        </div>
                                        <span style={{
                                            fontSize: '9px',
                                            fontWeight: 800,
                                            background: 'linear-gradient(135deg,#6366f1,#a855f7)',
                                            color: '#fff',
                                            borderRadius: '4px',
                                            padding: '2px 6px',
                                            letterSpacing: '0.04em',
                                            textTransform: 'uppercase',
                                            flexShrink: 0
                                        }}>NEW</span>
                                    </NavLink>
                                </li>
                                <li className="pos-menu-item">
                                    <NavLink
                                        to="/website-theme-editor"
                                        className={({ isActive }) => `pos-menu-link ${isActive ? 'active' : ''}`}
                                    >
                                        <div className="pos-menu-link-content">
                                            <Palette className="pos-menu-icon" strokeWidth={1.5} />
                                            <span>Website Theme Editor</span>
                                        </div>
                                        <span style={{
                                            fontSize: '9px',
                                            fontWeight: 800,
                                            background: 'linear-gradient(135deg,#ec4899,#f43f5e)',
                                            color: '#fff',
                                            borderRadius: '4px',
                                            padding: '2px 6px',
                                            letterSpacing: '0.04em',
                                            textTransform: 'uppercase',
                                            flexShrink: 0
                                        }}>NEW</span>
                                    </NavLink>
                                </li>
                            </ul>
                        </>

                    )}
                </div>
            </aside>
        </>
    );
}
