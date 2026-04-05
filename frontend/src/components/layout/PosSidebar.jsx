import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
    QrCode, 
    Box, 
    SlidersHorizontal, 
    ArrowRightLeft,
    ChevronRight,
    ShoppingBag,
    LayoutGrid,
    FileText,
    RotateCcw,
    Copy,
    Monitor
} from 'lucide-react';

export default function PosSidebar({ sidebarOpen, setSidebarOpen }) {
    const location = useLocation();

    const isDashboardActive = location.pathname === '/' || location.pathname === '/dashboard' || location.pathname === '/dashboard/admin2' || location.pathname === '/dashboard/sales';
    const isSuperAdminActive = location.pathname.startsWith('/dashboard/super-');
    const isSalesActive = location.pathname.startsWith('/dashboard/sales-');

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
                    <a href="/dashboard" className="pos-sidebar-logo">
                        <ShoppingBag className="pos-logo-icon" />
                        <span style={{color: '#1a1a1a', fontWeight: '800'}}>Namustute</span>
                    </a>
                </div>

                <div className="pos-sidebar-content">
                    {/* Main Section */}
                    <div className="pos-menu-divider" style={{marginTop: '0'}}></div>
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
                                    <NavLink to="/dashboard" end className={({isActive}) => `pos-submenu-link ${isActive ? 'active' : ''}`}>
                                        Admin Dashboard
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/dashboard/admin2" className={({isActive}) => `pos-submenu-link ${isActive ? 'active' : ''}`}>
                                Admin Dashboard 2
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/dashboard/sales" className={({isActive}) => `pos-submenu-link ${isActive ? 'active' : ''}`}>
                                        <BarChart2 size={16} className="me-2" /> Sales Dashboard
                                    </NavLink>
                                </li>
                            </ul>
                        </li>
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
                                    <NavLink to="/dashboard/super-dashboard" className={({isActive}) => `pos-submenu-link ${isActive ? 'active' : ''}`}>
                                        Dashboard
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/dashboard/super-companies" className={({isActive}) => `pos-submenu-link ${isActive ? 'active' : ''}`}>
                                        Companies
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/dashboard/super-subscriptions" className={({isActive}) => `pos-submenu-link ${isActive ? 'active' : ''}`}>
                                        Subscriptions
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/dashboard/super-packages" className={({isActive}) => `pos-submenu-link ${isActive ? 'active' : ''}`}>
                                        Packages
                                    </NavLink>
                                </li>
                            </ul>
                        </li>
                    </ul>

                    {/* Inventory Section */}
                    <div className="pos-menu-divider"></div>
                    <div className="pos-menu-section">Inventory</div>
                    <ul className="pos-menu-list">
                        <li className="pos-menu-item"><a className="pos-menu-link"><div className="pos-menu-link-content"><Package className="pos-menu-icon" strokeWidth={1.5} /><span>Products</span></div></a></li>
                        <li className="pos-menu-item"><a className="pos-menu-link"><div className="pos-menu-link-content"><FilePlus className="pos-menu-icon" strokeWidth={1.5} /><span>Create Product</span></div></a></li>
                        <li className="pos-menu-item"><a className="pos-menu-link"><div className="pos-menu-link-content"><CalendarX className="pos-menu-icon" strokeWidth={1.5} /><span>Expired Products</span></div></a></li>
                        <li className="pos-menu-item"><a className="pos-menu-link"><div className="pos-menu-link-content"><TrendingDown className="pos-menu-icon" strokeWidth={1.5} /><span>Low Stocks</span></div></a></li>
                        <li className="pos-menu-item"><a className="pos-menu-link"><div className="pos-menu-link-content"><ListTree className="pos-menu-icon" strokeWidth={1.5} /><span>Category</span></div></a></li>
                        <li className="pos-menu-item"><a className="pos-menu-link"><div className="pos-menu-link-content"><List className="pos-menu-icon" strokeWidth={1.5} /><span>Sub Category</span></div></a></li>
                        <li className="pos-menu-item"><a className="pos-menu-link"><div className="pos-menu-link-content"><Tag className="pos-menu-icon" strokeWidth={1.5} /><span>Brands</span></div></a></li>
                        <li className="pos-menu-item"><a className="pos-menu-link"><div className="pos-menu-link-content"><Scale className="pos-menu-icon" strokeWidth={1.5} /><span>Units</span></div></a></li>
                        <li className="pos-menu-item"><a className="pos-menu-link"><div className="pos-menu-link-content"><Puzzle className="pos-menu-icon" strokeWidth={1.5} /><span>Variant Attributes</span></div></a></li>
                        <li className="pos-menu-item"><a className="pos-menu-link"><div className="pos-menu-link-content"><ShieldCheck className="pos-menu-icon" strokeWidth={1.5} /><span>Warranties</span></div></a></li>
                        <li className="pos-menu-item"><a className="pos-menu-link"><div className="pos-menu-link-content"><Barcode className="pos-menu-icon" strokeWidth={1.5} /><span>Print Barcode</span></div></a></li>
                        <li className="pos-menu-item"><a className="pos-menu-link"><div className="pos-menu-link-content"><QrCode className="pos-menu-icon" strokeWidth={1.5} /><span>Print QR Code</span></div></a></li>
                    </ul>

                    {/* Stock Section */}
                    <div className="pos-menu-divider"></div>
                    <div className="pos-menu-section">Stock</div>
                    <ul className="pos-menu-list pb-4">
                        <li className="pos-menu-item">
                            <NavLink to="/dashboard/manage-stock" className={({isActive}) => `pos-menu-link ${isActive ? 'active' : ''}`}>
                                <div className="pos-menu-link-content">
                                    <Box className="pos-menu-icon" strokeWidth={1.5} />
                                    <span>Manage Stock</span>
                                </div>
                            </NavLink>
                        </li>
                        <li className="pos-menu-item">
                            <NavLink to="/dashboard/stock-adjustment" className={({isActive}) => `pos-menu-link ${isActive ? 'active' : ''}`}>
                                <div className="pos-menu-link-content">
                                    <SlidersHorizontal className="pos-menu-icon" strokeWidth={1.5} />
                                    <span>Stock Adjustment</span>
                                </div>
                            </NavLink>
                        </li>
                        <li className="pos-menu-item">
                            <NavLink to="/dashboard/stock-transfer" className={({isActive}) => `pos-menu-link ${isActive ? 'active' : ''}`}>
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
                                    <NavLink to="/dashboard/sales-online" className={({isActive}) => `pos-submenu-link ${isActive ? 'active' : ''}`}>
                                        Online Orders
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/dashboard/sales-pos" className={({isActive}) => `pos-submenu-link ${isActive ? 'active' : ''}`}>
                                        POS Orders
                                    </NavLink>
                                </li>
                            </ul>
                        </li>
                        <li className="pos-menu-item">
                            <a className="pos-menu-link">
                                <div className="pos-menu-link-content">
                                    <FileText className="pos-menu-icon" strokeWidth={1.5} />
                                    <span>Invoices</span>
                                </div>
                            </a>
                        </li>
                        <li className="pos-menu-item">
                            <a className="pos-menu-link">
                                <div className="pos-menu-link-content">
                                    <RotateCcw className="pos-menu-icon" strokeWidth={1.5} />
                                    <span>Sales Return</span>
                                </div>
                            </a>
                        </li>
                        <li className="pos-menu-item">
                            <a className="pos-menu-link">
                                <div className="pos-menu-link-content">
                                    <Copy className="pos-menu-icon" strokeWidth={1.5} />
                                    <span>Quotation</span>
                                </div>
                            </a>
                        </li>
                        <li className="pos-menu-item">
                            <a className="pos-menu-link">
                                <div className="pos-menu-link-content">
                                    <Monitor className="pos-menu-icon" strokeWidth={1.5} />
                                    <span>POS</span>
                                </div>
                                <ChevronRight className="pos-menu-chevron" strokeWidth={1.5} />
                            </a>
                        </li>
                    </ul>
                </div>
            </aside>
        </>
    );
}
