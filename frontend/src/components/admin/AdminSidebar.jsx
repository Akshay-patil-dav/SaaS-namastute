import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Settings,
    Shield,
    BarChart3,
    FileText,
    Bell,
    ChevronLeft,
    ChevronRight,
    Menu,
    X,
    ShieldCheck,
    Layers,
    ListTree
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/users', label: 'Users', icon: Users },
    { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/admin/content', label: 'Content', icon: FileText },
    { path: '/admin/roles', label: 'Roles', icon: Shield },
    { path: '/admin/notifications', label: 'Notifications', icon: Bell },
    { path: '/admin/category', label: 'Category', icon: Layers },
    { path: '/admin/sub-category', label: 'Sub Category', icon: ListTree },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminSidebar({ collapsed, setCollapsed }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user } = useAuth();
    const location = useLocation();

    // Close mobile sidebar when route changes
    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname]);

    // Close mobile sidebar when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (mobileOpen && !e.target.closest('.admin-sidebar') && !e.target.closest('.mobile-menu-btn')) {
                setMobileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [mobileOpen]);

    const toggleSidebar = () => setCollapsed(!collapsed);
    const toggleMobile = () => setMobileOpen(!mobileOpen);

    const isActive = (path) => {
        if (path === '/admin') {
            return location.pathname === '/admin';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={toggleMobile}
                className="mobile-menu-btn d-lg-none position-fixed top-0 start-0 m-3 btn btn-light rounded-circle shadow-sm p-2"
                style={{ zIndex: 1002 }}
                aria-label="Toggle menu"
            >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Mobile Overlay */}
            <div
                className={`mobile-overlay ${mobileOpen ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
            />

            {/* Sidebar */}
            <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
                <div className="d-flex flex-column h-100">
                    {/* Header */}
                    <div className="admin-sidebar-header">
                        <NavLink to="/admin" className="admin-logo text-decoration-none">
                            <div className="admin-logo-icon">
                                <ShieldCheck size={24} className="text-white" />
                            </div>
                            <span className="admin-logo-text">Admin</span>
                        </NavLink>

                        {/* Desktop Toggle Button */}
                        <button
                            onClick={toggleSidebar}
                            className="sidebar-toggle d-none d-lg-flex"
                            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        >
                            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="admin-nav flex-grow-1 overflow-auto">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.path);
                            return (
                                <div key={item.path} className="admin-nav-item">
                                    <NavLink
                                        to={item.path}
                                        end={item.path === '/admin'}
                                        data-title={item.label}
                                        className={`admin-nav-link ${active ? 'active' : ''}`}
                                    >
                                        <Icon size={22} className="admin-nav-icon" />
                                        <span className="admin-nav-text">{item.label}</span>
                                    </NavLink>
                                </div>
                            );
                        })}
                    </nav>

                    {/* User Card at Bottom */}
                    <div className="admin-sidebar-footer">
                        <div className="admin-user-card">
                            <img
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.identifier || 'admin'}`}
                                alt="Admin"
                                className="admin-user-avatar"
                            />
                            <div className="admin-user-info">
                                <p className="admin-user-name mb-0">{user?.identifier?.split('@')[0] || 'Admin'}</p>
                                <p className="admin-user-role mb-0">Administrator</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
