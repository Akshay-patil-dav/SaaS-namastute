import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, Package, LayoutDashboard, Settings, User, Bell } from 'lucide-react';
import './ProductLayout.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProductLayout = ({ children }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDesktopMenuCollapsed, setIsDesktopMenuCollapsed] = useState(false);
    const location = useLocation();

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    const toggleMenu = () => {
        if (window.innerWidth < 992) {
            setIsMobileMenuOpen(!isMobileMenuOpen);
        } else {
            setIsDesktopMenuCollapsed(!isDesktopMenuCollapsed);
        }
    };

    return (
        <div className="product-layout-wrapper">
            {/* Sidebar Overlay for Mobile */}
            <div 
                className={`product-sidebar-overlay ${isMobileMenuOpen ? 'show' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Slide Navbar */}
            <aside 
                className={`product-sidebar 
                    ${isMobileMenuOpen ? '' : 'mobile-hidden'} 
                    ${isDesktopMenuCollapsed ? 'desktop-collapsed' : ''}`}
            >
                <div className="sidebar-brand">
                    <a href="/products" className="text-decoration-none">
                        Dream<span>POS</span>
                    </a>
                </div>
                <ul className="sidebar-menu">
                    <li>
                        <NavLink to="/dashboard" className="sidebar-menu-item">
                            <LayoutDashboard />
                            Dashboard
                        </NavLink>
                    </li>
                    <li>
                        <NavLink 
                            to="/products" 
                            className={({ isActive }) => `sidebar-menu-item ${isActive ? 'active' : ''}`}
                        >
                            <Package />
                            Products
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/settings" className="sidebar-menu-item">
                            <Settings />
                            Settings
                        </NavLink>
                    </li>
                </ul>
            </aside>

            {/* Main Content */}
            <main className="product-main-content">
                {/* Top Navbar */}
                <header className="product-top-navbar">
                    <div className="d-flex align-items-center">
                        <button className="navbar-toggle-btn" onClick={toggleMenu} aria-label="Toggle Navigation">
                            <Menu />
                        </button>
                    </div>

                    <div className="navbar-right-actions">
                        <button className="nav-action-btn">
                            <Bell size={20} />
                        </button>
                        <div className="nav-user-profile dropdown">
                            <div className="nav-user-avatar" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                S
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="product-content-area">
                    {/* The user specifically asked NOT to add the center dashboard section elements here. */}
                    {children}
                </div>
            </main>
        </div>
    );
};

export default ProductLayout;
