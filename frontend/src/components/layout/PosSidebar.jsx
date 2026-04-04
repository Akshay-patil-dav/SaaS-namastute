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
    ShoppingBag
} from 'lucide-react';

export default function PosSidebar({ sidebarOpen, setSidebarOpen }) {
    const location = useLocation();

    const isDashboardActive = location.pathname === '/' || location.pathname === '/dashboard' || location.pathname === '/dashboard/admin2' || location.pathname === '/dashboard/sales';
    const isSuperAdminActive = location.pathname.startsWith('/dashboard/super-');

    const [openMenus, setOpenMenus] = useState({
        dashboard: isDashboardActive,
        superAdmin: isSuperAdminActive
    });

    React.useEffect(() => {
        // When the route changes, ensure only the active section is open
        if (isDashboardActive) {
            setOpenMenus({ dashboard: true, superAdmin: false });
        } else if (isSuperAdminActive) {
            setOpenMenus({ dashboard: false, superAdmin: true });
        }
    }, [isDashboardActive, isSuperAdminActive]);

    const toggleMenu = (menu) => {
        setOpenMenus(prev => {
            const isCurrentlyOpen = prev[menu];
            // Close everything first
            const newState = {
                dashboard: false,
                superAdmin: false
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
                    <div className="pos-menu-section">Main</div>
                    <ul className="pos-menu-list">
                        <li className="pos-menu-item">
                            <a 
                                className={`pos-menu-link ${isDashboardActive ? 'active' : ''} ${openMenus.dashboard ? 'open' : ''}`} 
                                onClick={() => toggleMenu('dashboard')}
                            >
                                <div className="pos-menu-link-content">
                                    <LayoutDashboard className="pos-menu-icon" />
                                    <span>Dashboard</span>
                                </div>
                                <ChevronRight className="pos-menu-chevron" />
                            </a>
                            <ul className={`pos-submenu ${openMenus.dashboard ? 'show' : ''}`}>
                                <li>
                                    <NavLink to="/dashboard" end className={({isActive}) => `pos-submenu-link ${isActive ? 'active' : ''}`}>
                                        <Square size={6} className="me-2" fill="currentColor" /> Admin Dashboard
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/dashboard/admin2" className={({isActive}) => `pos-submenu-link ${isActive ? 'active' : ''}`}>
                                        <Circle size={6} className="me-2" fill="currentColor" /> Admin Dashboard 2
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
                                    <UserCog className="pos-menu-icon" />
                                    <span>Super Admin</span>
                                </div>
                                <ChevronRight className="pos-menu-chevron" />
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
                    <div className="pos-menu-section mt-4">Inventory</div>
                    <ul className="pos-menu-list">
                        <li className="pos-menu-item"><a className="pos-menu-link"><div className="pos-menu-link-content"><Package className="pos-menu-icon" /><span>Products</span></div></a></li>
                        <li className="pos-menu-item"><a className="pos-menu-link"><div className="pos-menu-link-content"><FilePlus className="pos-menu-icon" /><span>Create Product</span></div></a></li>
                        <li className="pos-menu-item"><a className="pos-menu-link"><div className="pos-menu-link-content"><CalendarX className="pos-menu-icon" /><span>Expired Products</span></div></a></li>
                        <li className="pos-menu-item"><a className="pos-menu-link"><div className="pos-menu-link-content"><TrendingDown className="pos-menu-icon" /><span>Low Stocks</span></div></a></li>
                        <li className="pos-menu-item"><a className="pos-menu-link"><div className="pos-menu-link-content"><ListTree className="pos-menu-icon" /><span>Category</span></div></a></li>
                        <li className="pos-menu-item"><a className="pos-menu-link"><div className="pos-menu-link-content"><List className="pos-menu-icon" /><span>Sub Category</span></div></a></li>
                        <li className="pos-menu-item"><a className="pos-menu-link"><div className="pos-menu-link-content"><Tag className="pos-menu-icon" /><span>Brands</span></div></a></li>
                        <li className="pos-menu-item"><a className="pos-menu-link"><div className="pos-menu-link-content"><Scale className="pos-menu-icon" /><span>Units</span></div></a></li>
                        <li className="pos-menu-item"><a className="pos-menu-link"><div className="pos-menu-link-content"><Puzzle className="pos-menu-icon" /><span>Variant Attributes</span></div></a></li>
                        <li className="pos-menu-item"><a className="pos-menu-link"><div className="pos-menu-link-content"><ShieldCheck className="pos-menu-icon" /><span>Warranties</span></div></a></li>
                        <li className="pos-menu-item"><a className="pos-menu-link"><div className="pos-menu-link-content"><Barcode className="pos-menu-icon" /><span>Print Barcode</span></div></a></li>
                        <li className="pos-menu-item"><a className="pos-menu-link"><div className="pos-menu-link-content"><QrCode className="pos-menu-icon" /><span>Print QR Code</span></div></a></li>
                    </ul>

                    {/* Stock Section */}
                    <div className="pos-menu-section mt-4">Stock</div>
                    <ul className="pos-menu-list pb-4">
                        <li className="pos-menu-item"><a className="pos-menu-link"><div className="pos-menu-link-content"><Box className="pos-menu-icon" /><span>Manage Stock</span></div></a></li>
                        <li className="pos-menu-item"><a className="pos-menu-link"><div className="pos-menu-link-content"><SlidersHorizontal className="pos-menu-icon" /><span>Stock Adjustment</span></div></a></li>
                        <li className="pos-menu-item"><a className="pos-menu-link"><div className="pos-menu-link-content"><ArrowRightLeft className="pos-menu-icon" /><span>Stock Transfer</span></div></a></li>
                    </ul>
                </div>
            </aside>
        </>
    );
}
