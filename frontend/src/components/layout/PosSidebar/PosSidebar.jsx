import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useCompany } from '../../../context/CompanyContext';
import TextLogo from '../../common/TextLogo/TextLogo';
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
    Boxes
} from 'lucide-react';

export default function PosSidebar({ sidebarOpen, setSidebarOpen }) {
    const location = useLocation();
    const { user } = useAuth();
    const isSuperAdmin = user?.role === 'SUPER_ADMIN';
    const isClientOrAdmin = user?.role === 'ADMIN' || user?.role === 'CLIENT';

    const { companyInfo } = useCompany();

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

    const [openMenus, setOpenMenus] = useState({
        dashboard: isDashboardActive,
        superAdmin: isSuperAdminActive,
        inventory: isInventoryActive,
        sales: isSalesActive
    });

    React.useEffect(() => {
        // When the route changes, ensure only the active section is open
        if (isDashboardActive) {
            setOpenMenus({ dashboard: true, superAdmin: false, inventory: false, sales: false });
        } else if (isSuperAdminActive) {
            setOpenMenus({ dashboard: false, superAdmin: true, inventory: false, sales: false });
        } else if (isInventoryActive) {
            setOpenMenus({ dashboard: false, superAdmin: false, inventory: true, sales: false });
        } else if (isSalesActive) {
            setOpenMenus({ dashboard: false, superAdmin: false, inventory: false, sales: true });
        }
    }, [isDashboardActive, isSuperAdminActive, isInventoryActive, isSalesActive]);

    const toggleMenu = (menu) => {
        setOpenMenus(prev => {
            const isCurrentlyOpen = prev[menu];
            // Close everything first
            const newState = {
                dashboard: false,
                superAdmin: false,
                inventory: false,
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
                    <Link to="/dashboard" className="pos-sidebar-logo" style={{ textDecoration: 'none' }}>
                        {companyInfo.logo
                            ? <img src={companyInfo.logo} alt={companyInfo.name || 'Logo'} style={{ height: '32px', maxWidth: '120px', objectFit: 'contain' }} />
                            : <TextLogo name={companyInfo.name} color="#ff6b35" />}
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
                                        <li>
                                            <NavLink to="/create-product" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>
                                                Create Product
                                            </NavLink>
                                        </li>
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
                                        {user?.plan !== 'STARTER' && (
                                            <li>
                                                <NavLink to="/print-barcode" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>
                                                    Print Barcode
                                                </NavLink>
                                            </li>
                                        )}
                                        {user?.plan !== 'STARTER' && (
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

                            {/* Manufacturing Section */}
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
                                            <ShoppingCart className="pos-menu-icon" strokeWidth={1.5} />
                                            <span>Sales</span>
                                        </div>
                                        <ChevronRight className="pos-menu-chevron" strokeWidth={1.5} />
                                    </a>
                                    <ul className={`pos-submenu ${openMenus.sales ? 'show' : ''}`}>
                                        {/* Hidden for Starter Plan */}
                                        {user?.plan !== 'STARTER' && (
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
                                        <li>
                                            <NavLink to="/dashboard/invoices" className={({ isActive }) => `pos-submenu-link ${isActive ? 'active' : ''}`}>
                                                Invoices
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

                            {/* Reports Section */}
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
                </div>
            </aside>
        </>
    );
}
