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

    const [openMenus, setOpenMenus] = useState({
        dashboard: location.pathname.startsWith('/dashboard') || location.pathname === '/',
        superAdmin: false,
        application: false,
        layouts: false
    });

    const toggleMenu = (menu) => {
        setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
    };

    const isDashboardActive = location.pathname.startsWith('/dashboard') || location.pathname === '/';

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
                        <span style={{color: '#1a1a1a'}}>DREAM</span><span className="pos-logo-text-orange">POS</span>
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
                            <a className={`pos-menu-link ${openMenus.superAdmin ? 'open' : ''}`} onClick={() => toggleMenu('superAdmin')}>
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
                                <li>
                                    <NavLink to="/dashboard/super-domain" className={({isActive}) => `pos-submenu-link ${isActive ? 'active' : ''}`}>
                                        Domain
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/dashboard/super-purchase-transaction" className={({isActive}) => `pos-submenu-link ${isActive ? 'active' : ''}`}>
                                        Purchase Transaction
                                    </NavLink>
                                </li>
                            </ul>
                        </li>
                        <li className="pos-menu-item">
                            <a className={`pos-menu-link ${openMenus.application ? 'open' : ''}`} onClick={() => toggleMenu('application')}>
                                <div className="pos-menu-link-content">
                                    <Layers className="pos-menu-icon" />
                                    <span>Application</span>
                                </div>
                                <ChevronRight className="pos-menu-chevron" />
                            </a>
                        </li>
                        <li className="pos-menu-item">
                            <a className={`pos-menu-link ${openMenus.layouts ? 'open' : ''}`} onClick={() => toggleMenu('layouts')}>
                                <div className="pos-menu-link-content">
                                    <Layout className="pos-menu-icon" />
                                    <span>Layouts</span>
                                </div>
                                <ChevronRight className="pos-menu-chevron" />
                            </a>
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
