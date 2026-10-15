import React, { useState, useEffect, useRef } from 'react';
import './PosHeader.css';
import { createPortal } from 'react-dom';
import { useAuth } from '../../../context/AuthContext';
import { useCompany } from '../../../context/CompanyContext';
import { useNavigate, Link } from 'react-router-dom';
import { useCurrency } from '../../../hooks/useCurrency';
import { useSettings } from '../../../hooks/useSettings';
import { ENV } from '@/api/config';
import apiClient from '../../../api/config';
import {
    ChevronsLeft,
    Menu,
    Search,
    Store,
    MonitorDot,
    Globe,
    Maximize,
    Minimize,
    Bell,
    Settings,
    Puzzle,
    ChevronDown,
    PlusCircle,
    User,
    LogOut,
    Building,
    Package,
    AlertTriangle,
    Cpu,
    DollarSign,
    Calendar,
    Check,
    X,
    LayoutDashboard,
    ShoppingCart,
    FileText,
    RotateCcw,
    Archive,
    Users,
    Briefcase,
    BarChart2,
    UserCog,
    CalendarX,
    TrendingDown,
    Folder,
    List,
    Tag,
    Scale,
    ShieldCheck,
    Barcode,
    Box,
    SlidersHorizontal,
    ArrowRightLeft,
    ShoppingBag,
    FileUp,
    BookOpen
} from 'lucide-react';

const initialNotifications = [
    { id: 'NT-1', title: 'Low Stock Alert', message: 'Item "PVC Resin Molding Compound" has dropped below safe stock levels (Currently: 14 kg, Safe: 50 kg). Immediate replenishment ordered.', type: 'Stock', date: '2026-05-25', unread: true },
    { id: 'NT-2', title: 'Leave Application Received', message: 'Staff member Anita Deshpukh has submitted a Sick Leave request for 2 days starting 2026-05-28. Rationale: Dental Treatment.', type: 'Leave', date: '2026-05-25', unread: true },
    { id: 'NT-3', title: 'Biometric Gateway Offline', message: 'Biometric Gate-02 scanner terminal connection timed out. Gate fallback audit mode activated.', type: 'System', date: '2026-05-24', unread: false },
    { id: 'NT-4', title: 'Payroll Run Completed', message: 'Monthly salary runs sheet for May 2026 was processed successfully. 12 payslip receipts compiled.', type: 'Payroll', date: '2026-05-23', unread: false }
];

const searchablePages = [
    { title: 'Dashboard', path: '/dashboard', category: 'Dashboard', icon: <LayoutDashboard size={15} /> },
    { title: 'Sales Dashboard', path: '/dashboard/sales', category: 'Dashboard', icon: <BarChart2 size={15} /> },
    { title: 'POS Terminal (Sell)', path: '/dashboard/sales-pos', category: 'Sales', badge: 'Live POS', icon: <MonitorDot size={15} /> },
    { title: 'Generate Invoice', path: '/dashboard/invoices', category: 'Sales', icon: <FileText size={15} /> },
    { title: 'Online Orders', path: '/dashboard/sales-online', category: 'Sales', icon: <ShoppingCart size={15} /> },
    { title: 'POS Orders List', path: '/dashboard/sales-pos', category: 'Sales', icon: <MonitorDot size={15} /> },
    { title: 'Sales Return', path: '/dashboard/sales-return', category: 'Sales', icon: <RotateCcw size={15} /> },
    { title: 'Orders History', path: '/dashboard/orders', category: 'Sales', icon: <ShoppingCart size={15} /> },
    { title: 'Products Inventory', path: '/products', category: 'Inventory', icon: <Package size={15} /> },
    { title: 'Create Product', path: '/create-product', category: 'Inventory', icon: <PlusCircle size={15} /> },
    { title: 'Expired Products', path: '/expired-products', category: 'Inventory', icon: <CalendarX size={15} /> },
    { title: 'Low Stock Alerts', path: '/low-stocks', category: 'Inventory', icon: <TrendingDown size={15} /> },
    { title: 'Categories', path: '/category', category: 'Inventory', icon: <Folder size={15} /> },
    { title: 'Sub Categories', path: '/sub-category', category: 'Inventory', icon: <List size={15} /> },
    { title: 'Brands', path: '/brands', category: 'Inventory', icon: <Tag size={15} /> },
    { title: 'Units of Measure', path: '/units', category: 'Inventory', icon: <Scale size={15} /> },
    { title: 'Manage Stock', path: '/dashboard/manage-stock', category: 'Stock', icon: <Box size={15} /> },
    { title: 'Stock Adjustment', path: '/dashboard/stock-adjustment', category: 'Stock', icon: <SlidersHorizontal size={15} /> },
    { title: 'Stock Transfer', path: '/dashboard/stock-transfer', category: 'Stock', icon: <ArrowRightLeft size={15} /> },
    { title: 'Purchase Orders', path: '/purchases', category: 'Stock', icon: <ShoppingBag size={15} /> },
    { title: 'Purchase Return', path: '/purchase-return', category: 'Stock', icon: <FileUp size={15} /> },
    { title: 'Khata Book Overview', path: '/khata-book', category: 'Khata', icon: <BookOpen size={15} /> },
    { title: 'Khata Customers', path: '/khata-book?tab=customers', category: 'Khata', icon: <Users size={15} /> },
    { title: 'Khata Suppliers', path: '/khata-book?tab=suppliers', category: 'Khata', icon: <Briefcase size={15} /> },
    { title: 'Khata Day Book', path: '/khata-book?tab=daybook', category: 'Khata', icon: <BookOpen size={15} /> },
    { title: 'Company Settings', path: '/settings/company_settings', category: 'Settings', icon: <Building size={15} /> },
    { title: 'Profile Settings', path: '/settings/profile', category: 'Settings', icon: <User size={15} /> },
    { title: 'Billing & Subscriptions', path: '/settings/billing', category: 'Settings', icon: <DollarSign size={15} /> },
    { title: 'Connected Apps', path: '/settings/connected_apps', category: 'Settings', icon: <Puzzle size={15} /> },
    { title: 'Print Barcode', path: '/print-barcode', category: 'Tools', icon: <Barcode size={15} /> },
    { title: 'Warranties', path: '/warranties', category: 'Tools', icon: <ShieldCheck size={15} /> },
    { title: 'Super Admin Dashboard', path: '/dashboard/super-dashboard', category: 'Settings', icon: <UserCog size={15} /> },
    { title: 'Super Admin Companies', path: '/dashboard/super-companies', category: 'Settings', icon: <Building size={15} /> },
    { title: 'Super Admin Subscriptions', path: '/dashboard/super-subscriptions', category: 'Settings', icon: <DollarSign size={15} /> }
];

import ProjectSwitcher from './ProjectSwitcher';

export default function PosHeader({ sidebarOpen, setSidebarOpen }) {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const { user, logout } = useAuth();
    const { settings } = useSettings();
    const { companyInfo } = useCompany();
    const navigate = useNavigate();
    const isBilling = user?.businessType === 'Billing Invoice';

    // Notifications & Alert States
    const [notiOpen, setNotiOpen] = useState(false);
    const [notifications, setNotifications] = useState(initialNotifications);
    const [selectedNotiPopup, setSelectedNotiPopup] = useState(null);
    const [allNotiMaximized, setAllNotiMaximized] = useState(false);
    const [maximizedActiveId, setMaximizedActiveId] = useState(initialNotifications[0]?.id || null);

    // macOS Spotlight Search State
    const [spotlightOpen, setSpotlightOpen] = useState(false);
    const [spotlightQuery, setSpotlightQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const spotlightInputRef = useRef(null);
    const resultsListRef = useRef(null);

    // Sales Dropdown State
    const [salesOpen, setSalesOpen] = useState(false);
    const salesRef = useRef(null);

    const filteredPages = searchablePages.filter(page => {
        const matchesCategory = activeCategory === 'All' || page.category === activeCategory;
        const q = spotlightQuery.trim().toLowerCase();
        const matchesQuery = !q ||
            page.title.toLowerCase().includes(q) ||
            page.category.toLowerCase().includes(q) ||
            page.path.toLowerCase().includes(q);
        return matchesCategory && matchesQuery;
    });

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (salesRef.current && !salesRef.current.contains(event.target)) {
                setSalesOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setSpotlightOpen(prev => !prev);
            }
            if (e.key === 'Escape' && spotlightOpen) {
                setSpotlightOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [spotlightOpen]);

    useEffect(() => {
        if (spotlightOpen) {
            setSelectedIndex(0);
            setTimeout(() => {
                spotlightInputRef.current?.focus();
            }, 60);
        } else {
            setSpotlightQuery('');
            setActiveCategory('All');
        }
    }, [spotlightOpen]);

    useEffect(() => {
        if (resultsListRef.current) {
            const selectedEl = resultsListRef.current.querySelector('.pos-mac-result-item.selected');
            if (selectedEl) {
                selectedEl.scrollIntoView({ block: 'nearest' });
            }
        }
    }, [selectedIndex]);

    const handleSpotlightKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (filteredPages.length > 0 ? (prev + 1) % filteredPages.length : 0));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (filteredPages.length > 0 ? (prev - 1 + filteredPages.length) % filteredPages.length : 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (filteredPages[selectedIndex]) {
                handleSelectPage(filteredPages[selectedIndex].path);
            }
        }
    };

    const handleSelectPage = (path) => {
        setSpotlightOpen(false);
        navigate(path);
    };

    const fetchMyInvitations = async () => {
        try {
            const { data } = await apiClient.get('/invitations/me');
            const invNotis = data.map(inv => ({
                id: `INV-${inv.id}`,
                title: 'Project Invitation',
                message: `You have been invited to join a workspace.`,
                type: 'Invitation',
                date: new Date().toISOString().split('T')[0],
                unread: true,
                invitationId: inv.id,
                token: inv.token
            }));
            setNotifications(prev => {
                const others = prev.filter(n => n.type !== 'Invitation');
                return [...invNotis, ...others];
            });
        } catch (e) {
            console.error("Failed to fetch invitations", e);
        }
    };

    useEffect(() => {
        if (user) {
            fetchMyInvitations();
        }
    }, [user]);

    const handleLogout = () => {
        setProfileOpen(false);
        logout();
        navigate('/login');
    };

    // Build initials for avatar
    const nameToUse = settings?.profileFirstName
        ? `${settings.profileFirstName} ${settings.profileLastName || ''}`.trim()
        : (user?.name || user?.identifier?.split('@')[0] || 'User');

    const initials = nameToUse.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

    const roleColor = user?.role === 'SUPER_ADMIN' ? '#f59e0b'
        : user?.role === 'ADMIN' ? '#6366f1'
            : '#22c55e';

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((err) => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullscreen(false);
            }
        }
    };

    const unreadCount = notifications.filter(n => n.unread).length;

    const handleMarkAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    };

    const handleNotiClick = (noti) => {
        setNotifications(prev => prev.map(n => n.id === noti.id ? { ...n, unread: false } : n));
        setSelectedNotiPopup(noti);
        setNotiOpen(false);
    };

    const handleAcceptInvitation = async (token) => {
        try {
            await apiClient.post(`/invitations/${token}/accept`);
            fetchMyInvitations();
            window.location.reload();
        } catch (e) {
            console.error("Failed to accept", e);
        }
    };

    const handleRejectInvitation = async (token) => {
        try {
            await apiClient.post(`/invitations/${token}/reject`);
            fetchMyInvitations();
        } catch (e) {
            console.error("Failed to reject", e);
        }
    };

    return (
        <header className="pos-header">
            {/* Left side */}
            <div className="pos-header-left d-flex align-items-center gap-2 gap-sm-3">
                <button 
                    className={`pos-toggle-btn ${sidebarOpen ? 'sidebar-is-open' : 'sidebar-is-closed'}`} 
                    onClick={() => setSidebarOpen(prev => !prev)}
                    title={sidebarOpen ? "Close navigation menu" : "Open navigation menu"}
                    aria-label="Toggle navigation menu"
                >
                    {/* Desktop Icon (> 1024px) */}
                    <span className="pos-desktop-toggle-icon">
                        <ChevronsLeft size={20} style={{ transform: sidebarOpen ? 'none' : 'rotate(180deg)', transition: 'transform 0.3s' }} />
                    </span>
                    {/* Mobile & Tablet Icon (<= 1024px) */}
                    <span className="pos-mobile-toggle-icon">
                        {sidebarOpen ? <X size={19} strokeWidth={2.2} /> : <Menu size={19} strokeWidth={2.2} />}
                    </span>
                </button>

                {/* Mobile Brand Identity */}
                <div className="pos-mobile-brand-wrap">
                    <Link to="/dashboard" className="pos-mobile-brand-link">
                        {companyInfo?.logo ? (
                            <img src={companyInfo.logo} alt="Logo" className="pos-mobile-brand-logo" />
                        ) : (
                            <div className="pos-mobile-brand-badge">
                                {(() => {
                                    const cName = companyInfo?.name || 'Samrajya Software';
                                    const words = cName.trim().split(/\s+/);
                                    if (words.length > 1 && words[0] && words[1]) {
                                        return (words[0][0] + words[1][0]).toUpperCase();
                                    }
                                    return (cName.slice(0, 2) || 'SS').toUpperCase();
                                })()}
                            </div>
                        )}
                        <div className="pos-mobile-brand-text">
                            <span className="pos-mobile-brand-name">
                                {companyInfo?.name || 'Namastute'}
                            </span>
                            <span className="pos-mobile-brand-sub">
                                <span className="pos-mobile-live-dot" /> Live
                            </span>
                        </div>
                    </Link>
                </div>

                <div 
                    className="pos-search-bar hide-on-mobile" 
                    onClick={() => setSpotlightOpen(true)}
                    style={{ cursor: 'pointer', position: 'relative' }}
                    title="Press ⌘K or Ctrl+K to open Spotlight Search"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter') setSpotlightOpen(true); }}
                >
                    <Search size={15} color="#888" className="me-2" />
                    <span style={{ fontSize: '13px', color: '#94a3b8', userSelect: 'none' }}>
                        Search pages, actions...
                    </span>
                    <div className="pos-search-shortcut">
                        <MonitorDot size={12} /> K
                    </div>
                </div>

                <ProjectSwitcher />

                {/* Desktop Sales Navbar Dropdown (Hidden on Mobile & Tablet <= 1024px) */}
                <div className="d-none d-lg-flex align-items-center ms-2" ref={salesRef} style={{ position: 'relative' }}>
                    <button
                        onClick={() => setSalesOpen(!salesOpen)}
                        className="d-flex align-items-center gap-1.5 px-3 py-1.5 rounded-pill border-0"
                        style={{
                            cursor: 'pointer',
                            fontSize: '13.5px',
                            fontWeight: '600',
                            backgroundColor: salesOpen ? 'rgba(255, 155, 41, 0.12)' : '#f4f5f9',
                            color: salesOpen ? 'var(--primary-color)' : '#4b5563',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <ShoppingCart size={16} style={{ color: 'var(--primary-color)' }} />
                        <span>Sales</span>
                        <ChevronDown size={14} style={{ transform: salesOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                    </button>

                    {/* Sales Dropdown Menu */}
                    {salesOpen && (
                        <div
                            className="shadow-lg border rounded-3 bg-white py-2"
                            style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                marginTop: '8px',
                                width: '230px',
                                zIndex: 1050,
                                animation: 'fadeIn 0.15s ease-out'
                            }}
                        >
                            <div className="px-3 py-1.5 text-muted small fw-bold border-bottom" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                                SALES & POS
                            </div>

                            <Link
                                to="/dashboard/sales-pos"
                                className="d-flex align-items-center gap-2.5 px-3 py-2 text-decoration-none text-dark notification-feed-item"
                                style={{ fontSize: '13px', fontWeight: '500' }}
                                onClick={() => setSalesOpen(false)}
                            >
                                <div className="p-1.5 rounded" style={{ background: 'rgba(255, 155, 41, 0.12)', color: 'var(--primary-color)' }}>
                                    <MonitorDot size={15} />
                                </div>
                                <div>
                                    <div className="fw-semibold" style={{ fontSize: '13px', color: '#1f2937' }}>POS Page (Sell)</div>
                                    <div className="text-muted" style={{ fontSize: '11px' }}>POS Terminal & Orders</div>
                                </div>
                            </Link>

                            <Link
                                to="/dashboard/invoices"
                                className="d-flex align-items-center gap-2.5 px-3 py-2 text-decoration-none text-dark notification-feed-item"
                                style={{ fontSize: '13px', fontWeight: '500' }}
                                onClick={() => setSalesOpen(false)}
                            >
                                <div className="p-1.5 rounded" style={{ background: 'rgba(14, 165, 233, 0.12)', color: '#0ea5e9' }}>
                                    <FileText size={15} />
                                </div>
                                <div>
                                    <div className="fw-semibold" style={{ fontSize: '13px', color: '#1f2937' }}>Invoice Generate</div>
                                    <div className="text-muted" style={{ fontSize: '11px' }}>Create & Manage Invoices</div>
                                </div>
                            </Link>

                            <Link
                                to="/dashboard/sales-online"
                                className="d-flex align-items-center gap-2.5 px-3 py-2 text-decoration-none text-dark notification-feed-item"
                                style={{ fontSize: '13px', fontWeight: '500' }}
                                onClick={() => setSalesOpen(false)}
                            >
                                <div className="p-1.5 rounded" style={{ background: 'rgba(99, 102, 241, 0.12)', color: '#6366f1' }}>
                                    <ShoppingCart size={15} />
                                </div>
                                <div>
                                    <div className="fw-semibold" style={{ fontSize: '13px', color: '#1f2937' }}>Online Orders</div>
                                    <div className="text-muted" style={{ fontSize: '11px' }}>E-commerce sales</div>
                                </div>
                            </Link>

                            <Link
                                to="/dashboard/sales-return"
                                className="d-flex align-items-center gap-2.5 px-3 py-2 text-decoration-none text-dark notification-feed-item"
                                style={{ fontSize: '13px', fontWeight: '500' }}
                                onClick={() => setSalesOpen(false)}
                            >
                                <div className="p-1.5 rounded" style={{ background: 'rgba(239, 68, 68, 0.12)', color: '#ef4444' }}>
                                    <RotateCcw size={15} />
                                </div>
                                <div>
                                    <div className="fw-semibold" style={{ fontSize: '13px', color: '#1f2937' }}>Sales Return</div>
                                    <div className="text-muted" style={{ fontSize: '11px' }}>Returns & refunds</div>
                                </div>
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Right side */}
            <div className="pos-header-actions">

                {/* Mobile Quick Search Button */}
                <button 
                    type="button"
                    className="pos-icon-btn pos-mobile-search-btn" 
                    onClick={() => setSpotlightOpen(true)}
                    title="Search Pages and Menus (macOS Spotlight)"
                    aria-label="Search"
                >
                    <Search size={18} />
                </button>

                {/* Quick POS Page Action Button (Desktop Only) */}
                <Link
                    to="/dashboard/sales-pos"
                    className="pos-btn-orange text-decoration-none pos-quick-pos-btn"
                    style={{
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontWeight: '600',
                        fontSize: '13px',
                        boxShadow: '0 2px 4px rgba(255, 155, 41, 0.2)',
                        background: "linear-gradient(135deg, #ff822d 0%, #ea580c 100%)"
                    }}
                >
                    <MonitorDot size={16} />
                    <span>POS Page</span>
                </Link>
                <button className="pos-icon-btn hide-on-mobile pos-header-globe-btn" title="Language">
                    <Globe size={18} />
                </button>

                <button className="pos-icon-btn hide-on-mobile pos-header-fullscreen-btn" onClick={toggleFullScreen} title="Toggle Fullscreen">
                    {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
                </button>

                {/* Notification Bell Dropdown Section */}
                <div style={{ position: 'relative' }}>

                    <button className="pos-icon-btn" onClick={() => setNotiOpen(!notiOpen)} title="Corporate Notifications & Alerts">
                        <Bell size={18} />
                        {unreadCount > 0 && <span className="pos-badge" style={{ background: '#ef4444', color: '#fff', fontSize: '9px', fontWeight: '700' }}>{unreadCount}</span>}
                    </button>

                    {notiOpen && (
                        <>
                            {/* Close overlay on tap */}
                            <div
                                style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1040 }}
                                onClick={() => setNotiOpen(false)}
                            />
                            {/* Notification Panel Card */}
                            <div className="shadow-lg border p-3 bg-white pos-notification-panel" style={{
                                position: 'absolute',
                                top: '100%',
                                right: 0,
                                marginTop: '10px',
                                width: 'min(330px, calc(100vw - 20px))',
                                maxWidth: 'calc(100vw - 20px)',
                                zIndex: 1050,
                                maxHeight: '420px',
                                overflowY: 'auto',
                                animation: 'fadeIn 0.15s ease-out',
                                borderRadius: '16px'
                            }}>
                                <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                                    <span className="fw-bold text-dark d-flex align-items-center gap-1.5" style={{ fontSize: '13.5px' }}>
                                        <span style={{ width: '4px', height: '12px', background: 'var(--primary-color)', borderRadius: '2px' }} />
                                        Corporate Alerts
                                    </span>
                                    <div className="d-flex align-items-center gap-2">
                                        {unreadCount > 0 && (
                                            <button
                                                className="btn p-0 text-decoration-none font-semibold border-0"
                                                style={{ color: 'var(--primary-color)', background: 'none', fontSize: '11px' }}
                                                onClick={handleMarkAllRead}
                                            >
                                                Mark all read
                                            </button>
                                        )}
                                        <button
                                            className="btn p-0 text-decoration-none border-0 d-flex align-items-center justify-content-center"
                                            style={{ color: 'var(--primary-color)', background: 'none', opacity: 0.8 }}
                                            onClick={() => {
                                                setAllNotiMaximized(true);
                                                setNotiOpen(false);
                                            }}
                                            title="Maximize Alerts Console"
                                        >
                                            <Maximize size={13} />
                                        </button>
                                    </div>
                                </div>
                                <div className="d-flex flex-column gap-2" style={{ maxHeight: '280px', overflowY: 'auto' }}>
                                    {notifications.length > 0 ? (
                                        notifications.map((n) => {
                                            const notiColors =
                                                n.type === 'Stock' ? { bg: 'rgba(239, 68, 68, 0.08)', color: '#ef4444', icon: <AlertTriangle size={14} /> } :
                                                    n.type === 'Leave' ? { bg: 'rgba(245, 158, 11, 0.08)', color: '#f59e0b', icon: <Calendar size={14} /> } :
                                                        n.type === 'Payroll' ? { bg: 'rgba(16, 185, 129, 0.08)', color: '#10b981', icon: <DollarSign size={14} /> } :
                                                            { bg: 'rgba(99, 102, 241, 0.08)', color: '#6366f1', icon: <Cpu size={14} /> };

                                            return (
                                                <div
                                                    key={n.id}
                                                    onClick={() => handleNotiClick(n)}
                                                    className="p-2.5 rounded-2 d-flex gap-2.5 align-items-start border-bottom cursor-pointer transition-all notification-feed-item"
                                                    style={{
                                                        borderLeft: n.unread ? '3.5px solid var(--primary-color)' : '3.5px solid transparent',
                                                        background: n.unread ? 'rgba(255, 155, 41, 0.03)' : 'transparent',
                                                        cursor: 'pointer',
                                                        position: 'relative',
                                                        paddingRight: '25px'
                                                    }}
                                                >
                                                    <div className="p-2 rounded" style={{ background: notiColors.bg, color: notiColors.color, flexShrink: 0 }}>
                                                        {notiColors.icon}
                                                    </div>
                                                    <div className="flex-grow-1" style={{ minWidth: 0 }}>
                                                        <div className="fw-bold text-dark text-truncate" style={{ fontSize: '12px' }}>{n.title}</div>
                                                        <div className="text-secondary text-truncate small" style={{ fontSize: '11px', opacity: 0.8 }}>{n.message}</div>
                                                        <div className="small text-muted" style={{ fontSize: '9px', marginTop: '2px' }}>{n.date}</div>
                                                        {n.type === 'Invitation' && (
                                                            <div className="d-flex gap-2 mt-2" onClick={e => e.stopPropagation()}>
                                                                <button 
                                                                    className="btn btn-sm text-white px-2 py-1" 
                                                                    style={{ background: '#10b981', fontSize: '10px', border: 'none' }}
                                                                    onClick={() => handleAcceptInvitation(n.token)}
                                                                >
                                                                    Accept
                                                                </button>
                                                                <button 
                                                                    className="btn btn-sm text-white px-2 py-1" 
                                                                    style={{ background: '#ef4444', fontSize: '10px', border: 'none' }}
                                                                    onClick={() => handleRejectInvitation(n.token)}
                                                                >
                                                                    Reject
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="position-absolute end-0 top-50 translate-middle-y me-2 show-on-hover" style={{
                                                        color: 'var(--primary-color)'
                                                    }}>
                                                        <Maximize size={12} />
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="text-center py-4 text-secondary small">No notification feeds available.</div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <button className="pos-icon-btn hide-on-mobile pos-header-settings-btn" onClick={() => navigate('/settings')} title="Settings">
                    <Settings size={18} />
                </button>

                {/* User Profile Dropdown - Hidden on mobile top navbar */}
                <div className="pos-header-profile-section hide-on-mobile" style={{ position: 'relative' }}>
                    {/* Avatar — shows initials */}
                    <div
                        className="pos-user-avatar ms-0 ms-md-1"
                        onClick={() => setProfileOpen(!profileOpen)}
                        style={{
                            background: settings?.profileImage ? 'transparent' : roleColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            userSelect: 'none',
                            border: `2px solid ${roleColor}44`,
                            flexShrink: 0,
                            overflow: 'hidden'
                        }}
                        title={nameToUse}
                    >
                        {settings?.profileImage ? (
                            <img
                                src={settings.profileImage.startsWith('http') ? settings.profileImage : `${ENV.BACKEND_BASE_URL}${settings.profileImage}`}
                                alt="User Avatar"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : initials}
                    </div>

                    {profileOpen && (
                        <>
                            {/* Overlay */}
                            <div
                                style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1040 }}
                                onClick={() => setProfileOpen(false)}
                            />
                            {/* Dropdown */}
                            <div className="pos-profile-dropdown" style={{
                                position: 'absolute',
                                top: '100%',
                                right: 0,
                                marginTop: '10px',
                                background: 'white',
                                border: '1px solid #eaedf0',
                                borderRadius: '16px',
                                boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
                                minWidth: '220px',
                                maxWidth: 'calc(100vw - 20px)',
                                zIndex: 1050,
                                overflow: 'hidden',
                            }}>
                                {/* User info header */}
                                <div style={{ padding: '14px 16px', borderBottom: '1px solid #eaedf0', background: '#fafafa' }}>
                                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>{nameToUse}</div>
                                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{user?.email}</div>
                                    <span style={{
                                        display: 'inline-block',
                                        marginTop: '6px',
                                        padding: '2px 8px',
                                        borderRadius: '100px',
                                        fontSize: '10px',
                                        fontWeight: '600',
                                        background: `${roleColor}18`,
                                        color: roleColor,
                                        border: `1px solid ${roleColor}33`,
                                        letterSpacing: '0.04em',
                                    }}>
                                        {user?.role?.replace('_', ' ')}
                                    </span>
                                </div>

                                <button
                                    style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '12px 16px', border: 'none', background: 'white', cursor: 'pointer', fontSize: '13px', color: '#374151', textAlign: 'left', transition: 'background 0.15s' }}
                                    onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
                                    onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                                    onClick={() => {
                                        setProfileOpen(false);
                                        navigate('/settings/profile');
                                    }}
                                >
                                    <User size={15} color="#888" /> My Profile
                                </button>

                                <button
                                    style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '12px 16px', border: 'none', background: 'white', cursor: 'pointer', fontSize: '13px', color: '#374151', textAlign: 'left', transition: 'background 0.15s' }}
                                    onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
                                    onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                                    onClick={() => {
                                        setProfileOpen(false);
                                        navigate('/settings/company_settings');
                                    }}
                                >
                                    <Building size={15} color="#888" /> Company Settings
                                </button>

                                {!isBilling && (
                                    <button
                                        style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '12px 16px', border: 'none', background: 'white', cursor: 'pointer', fontSize: '13px', color: '#374151', textAlign: 'left', transition: 'background 0.15s' }}
                                        onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
                                        onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                                        onClick={() => {
                                            setProfileOpen(false);
                                            navigate('/settings/connected_apps');
                                        }}
                                    >
                                        <Puzzle size={15} color="#888" /> Connected Apps
                                    </button>
                                )}

                                <button
                                    style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '12px 16px', border: 'none', borderTop: '1px solid #eaedf0', background: 'white', cursor: 'pointer', fontSize: '13px', color: '#ef4444', textAlign: 'left', transition: 'background 0.15s' }}
                                    onMouseOver={(e) => e.currentTarget.style.background = '#fff5f5'}
                                    onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                                    onClick={handleLogout}
                                >
                                    <LogOut size={15} /> Sign Out
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* PopUp Detail Modal - Center aligned, Blurs and covers the sidebar and background completely */}
            {selectedNotiPopup && createPortal(
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(15, 23, 42, 0.7)',
                    backdropFilter: 'blur(8px)',
                    zIndex: 9999, // Render at root of body above sidebars
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div className="card p-4 shadow-lg border rounded-3 bg-white" style={{
                        maxWidth: '460px',
                        width: '90%',
                        animation: 'fadeIn 0.2s ease-in-out',
                        borderLeft: '5px solid var(--primary-color)',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                    }}>
                        <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom" style={{ borderBottomColor: '#f1f5f9' }}>
                            <span className="badge font-monospace text-uppercase" style={{
                                background: selectedNotiPopup.type === 'Stock' ? 'rgba(239, 68, 68, 0.1)' :
                                    selectedNotiPopup.type === 'Leave' ? 'rgba(245, 158, 11, 0.1)' :
                                        selectedNotiPopup.type === 'Payroll' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                                color: selectedNotiPopup.type === 'Stock' ? '#ef4444' :
                                    selectedNotiPopup.type === 'Leave' ? '#f59e0b' :
                                        selectedNotiPopup.type === 'Payroll' ? '#10b981' : '#6366f1',
                                fontWeight: '700',
                                fontSize: '10px'
                            }}>
                                {selectedNotiPopup.type} ALERT
                            </span>
                            <button className="btn-close" onClick={() => setSelectedNotiPopup(null)} style={{ background: 'none', border: 'none', fontSize: '20px', color: '#64748b' }}>×</button>
                        </div>

                        <h5 className="fw-bold mb-1" style={{ color: '#1c2b36' }}>{selectedNotiPopup.title}</h5>
                        <p className="small text-muted font-monospace mb-3">{selectedNotiPopup.date}</p>

                        <p className="text-secondary mb-4 p-3 rounded" style={{ fontSize: '13.5px', background: '#f8fafc', borderLeft: '3px solid #cbd5e1', lineHeight: '1.5' }}>
                            {selectedNotiPopup.message}
                        </p>

                        <div className="d-flex gap-2">
                            <button className="btn btn-secondary w-100" onClick={() => setSelectedNotiPopup(null)}>Close Details</button>
                            <button className="btn text-white w-100 fw-semibold"
                                style={{ background: 'var(--primary-color)', border: 'none' }}
                                onClick={() => {
                                    setSelectedNotiPopup(null);
                                    // Auto route depending on category
                                    if (selectedNotiPopup.type === 'Leave' || selectedNotiPopup.type === 'Payroll') {
                                        navigate('/hr/employees');
                                    } else if (selectedNotiPopup.type === 'Stock') {
                                        navigate('/dashboard/manage-stock');
                                    }
                                }}>
                                Action Center
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Maximized Alerts Console Popup - Center aligned, Blurs and hides sidebar and background completely */}
            {allNotiMaximized && createPortal(
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(15, 23, 42, 0.7)',
                    backdropFilter: 'blur(8px)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div className="card shadow-2xl border rounded-3 bg-white" style={{
                        maxWidth: '900px',
                        width: '92%',
                        height: '580px',
                        maxHeight: '90vh',
                        display: 'flex',
                        flexDirection: 'column',
                        animation: 'fadeIn 0.25s ease-out',
                        overflow: 'hidden',
                        borderLeft: '6px solid var(--primary-color)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                    }}>
                        {/* Modal Header */}
                        <div className="d-flex justify-content-between align-items-center p-3 border-bottom" style={{ background: '#fafafa' }}>
                            <div className="d-flex align-items-center gap-2">
                                <Bell size={18} color="var(--primary-color)" />
                                <span className="fw-bold text-dark" style={{ fontSize: '15px' }}>Corporate Alerts Console</span>
                                <span className="badge rounded-pill bg-danger" style={{ fontSize: '10px' }}>
                                    {unreadCount} Unread
                                </span>
                            </div>
                            <div className="d-flex align-items-center gap-3">
                                {unreadCount > 0 && (
                                    <button
                                        className="btn btn-sm btn-outline-warning fw-semibold"
                                        style={{ fontSize: '11px', color: 'var(--primary-color)', borderColor: 'var(--primary-color)', background: 'none' }}
                                        onClick={handleMarkAllRead}
                                    >
                                        Mark all read
                                    </button>
                                )}
                                <button className="btn-close" onClick={() => setAllNotiMaximized(false)} style={{ background: 'none', border: 'none', fontSize: '20px', color: '#64748b' }}>×</button>
                            </div>
                        </div>

                        {/* Modal Content - Split Workspace */}
                        <div className="d-flex flex-grow-1" style={{ minHeight: 0 }}>
                            {/* Left Pane - List of Alerts */}
                            <div className="border-right" style={{ width: '38%', overflowY: 'auto', borderRight: '1px solid #eaedf0', background: '#f8fafc' }}>
                                {notifications.map((n) => {
                                    const isActive = n.id === maximizedActiveId;
                                    const notiColors =
                                        n.type === 'Stock' ? { color: '#ef4444' } :
                                            n.type === 'Leave' ? { color: '#f59e0b' } :
                                                n.type === 'Payroll' ? { color: '#10b981' } :
                                                    { color: '#6366f1' };

                                    return (
                                        <div
                                            key={n.id}
                                            onClick={() => {
                                                setMaximizedActiveId(n.id);
                                                // Mark read on click
                                                setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, unread: false } : item));
                                            }}
                                            className="p-3 border-bottom cursor-pointer transition-all"
                                            style={{
                                                background: isActive ? '#ffffff' : 'transparent',
                                                borderLeft: isActive ? '4px solid var(--primary-color)' : '4px solid transparent',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                <span className="fw-bold text-uppercase font-monospace" style={{ color: notiColors.color, fontSize: '9px', fontWeight: '700' }}>
                                                    {n.type}
                                                </span>
                                                <span className="small text-muted" style={{ fontSize: '9px' }}>{n.date}</span>
                                            </div>
                                            <div className="fw-semibold text-dark text-truncate" style={{ fontSize: '12.5px' }}>{n.title}</div>
                                            <div className="text-secondary small text-truncate" style={{ fontSize: '11.5px', opacity: 0.85 }}>{n.message}</div>
                                            {n.unread && (
                                                <span className="badge bg-warning ms-1" style={{ fontSize: '8px', padding: '2px 4px' }}>NEW</span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Right Pane - Rich Detailed View */}
                            <div className="p-4 d-flex flex-column flex-grow-1" style={{ width: '62%', overflowY: 'auto' }}>
                                {(() => {
                                    const activeNoti = notifications.find(n => n.id === maximizedActiveId);
                                    if (!activeNoti) {
                                        return (
                                            <div className="d-flex align-items-center justify-content-center h-100 text-muted small">
                                                Select an alert from the sidebar list to inspect details.
                                            </div>
                                        );
                                    }

                                    const notiColors =
                                        activeNoti.type === 'Stock' ? { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', icon: <AlertTriangle size={24} /> } :
                                            activeNoti.type === 'Leave' ? { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', icon: <Calendar size={24} /> } :
                                                activeNoti.type === 'Payroll' ? { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981', icon: <DollarSign size={24} /> } :
                                                    { bg: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', icon: <Cpu size={24} /> };

                                    return (
                                        <div className="d-flex flex-column h-100">
                                            <div className="d-flex align-items-center gap-3 mb-4">
                                                <div className="p-3 rounded-circle" style={{ background: notiColors.bg, color: notiColors.color }}>
                                                    {notiColors.icon}
                                                </div>
                                                <div>
                                                    <span className="badge text-uppercase font-monospace mb-1" style={{ background: notiColors.bg, color: notiColors.color }}>
                                                        {activeNoti.type} Category
                                                    </span>
                                                    <h4 className="fw-bold mb-0 text-dark" style={{ fontSize: '18px' }}>{activeNoti.title}</h4>
                                                </div>
                                            </div>

                                            <div className="mb-2 text-muted font-monospace small" style={{ fontSize: '11px' }}>
                                                Alert Identifier: <span className="text-secondary">{activeNoti.id}</span> &bull; Log Date: {activeNoti.date}
                                            </div>

                                            <hr style={{ borderStyle: 'dashed', color: '#eaedf0' }} />

                                            <div className="flex-grow-1 p-3 rounded mb-4" style={{ background: '#f8fafc', borderLeft: '4px solid var(--primary-color)', minHeight: '120px' }}>
                                                <h6 className="fw-bold text-dark mb-2" style={{ fontSize: '12.5px' }}>Detailed Feed Record</h6>
                                                <p className="text-secondary mb-0" style={{ fontSize: '13.5px', lineHeight: '1.6' }}>
                                                    {activeNoti.message}
                                                </p>
                                            </div>

                                            <div className="d-flex gap-3 mt-auto">
                                                <button className="btn btn-light border flex-grow-1" onClick={() => setAllNotiMaximized(false)}>Close Console</button>
                                                <button
                                                    className="btn text-white fw-semibold"
                                                    style={{ background: 'var(--primary-color)', border: 'none', flexGrow: 2 }}
                                                    onClick={() => {
                                                        setAllNotiMaximized(false);
                                                        if (activeNoti.type === 'Leave' || activeNoti.type === 'Payroll') {
                                                            navigate('/hr/employees');
                                                        } else if (activeNoti.type === 'Stock') {
                                                            navigate('/dashboard/manage-stock');
                                                        }
                                                    }}
                                                >
                                                    Open Connected Action Center
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* ── macOS Spotlight Command Palette Modal ── */}
            {spotlightOpen && createPortal(
                <div 
                    className="pos-mac-spotlight-backdrop" 
                    onClick={() => setSpotlightOpen(false)}
                >
                    <div 
                        className="pos-mac-spotlight-window" 
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                    >
                        {/* macOS Window Titlebar with Traffic Lights */}
                        {/* <div className="pos-mac-spotlight-titlebar">
                            <div className="pos-mac-traffic-lights">
                                <button 
                                    type="button" 
                                    className="pos-mac-dot pos-mac-dot-close" 
                                    onClick={() => setSpotlightOpen(false)} 
                                    title="Close (Esc)" 
                                />
                                <span className="pos-mac-dot pos-mac-dot-min" />
                                <span className="pos-mac-dot pos-mac-dot-max" />
                            </div>
                            <div className="pos-mac-titlebar-title">
                                <span>Spotlight Search</span>
                            </div>
                            <div className="pos-mac-shortcut-hint">
                                <span className="pos-mac-kbd">esc</span>
                            </div>
                        </div> */}

                        {/* macOS Search Input Bar */}
                        <div className="pos-mac-input-row">
                            <div className="pos-mac-search-icon-wrap">
                                <Search size={20} className="pos-mac-search-icon" />
                            </div>
                            <input
                                ref={spotlightInputRef}
                                type="text"
                                className="pos-mac-search-input"
                                placeholder="Search apps, menus, POS, products..."
                                value={spotlightQuery}
                                onChange={(e) => {
                                    setSpotlightQuery(e.target.value);
                                    setSelectedIndex(0);
                                }}
                                onKeyDown={handleSpotlightKeyDown}
                            />
                            {spotlightQuery && (
                                <button 
                                    type="button" 
                                    className="pos-mac-clear-btn" 
                                    onClick={() => {
                                        setSpotlightQuery('');
                                        spotlightInputRef.current?.focus();
                                    }}
                                    title="Clear search"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>

                        {/* macOS Filter Chips */}
                        <div className="pos-mac-chips-bar">
                            {['All', 'Sales', 'Inventory', 'Stock', 'Khata', 'Settings'].map(cat => (
                                <button
                                    key={cat}
                                    type="button"
                                    className={`pos-mac-chip ${activeCategory === cat ? 'active' : ''}`}
                                    onClick={() => {
                                        setActiveCategory(cat);
                                        setSelectedIndex(0);
                                    }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Results List */}
                        <div className="pos-mac-results-list" ref={resultsListRef}>
                            {filteredPages.length > 0 ? (
                                filteredPages.map((page, idx) => {
                                    const isSelected = idx === selectedIndex;
                                    return (
                                        <div
                                            key={page.path + idx}
                                            className={`pos-mac-result-item ${isSelected ? 'selected' : ''}`}
                                            onMouseEnter={() => setSelectedIndex(idx)}
                                            onClick={() => handleSelectPage(page.path)}
                                        >
                                            <div className="pos-mac-item-icon-box">
                                                {page.icon}
                                            </div>
                                            <div className="pos-mac-item-info">
                                                <div className="pos-mac-item-title-row">
                                                    <span className="pos-mac-item-title">{page.title}</span>
                                                    {page.badge && (
                                                        <span className="pos-mac-item-badge">{page.badge}</span>
                                                    )}
                                                </div>
                                                <span className="pos-mac-item-path">{page.path}</span>
                                            </div>
                                            <div className="pos-mac-item-action-tag">
                                                <span className="pos-mac-category-tag">{page.category}</span>
                                                {isSelected && <span className="pos-mac-return-key">Open ↵</span>}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="pos-mac-empty-state">
                                    <div className="pos-mac-empty-icon">
                                        <Search size={28} />
                                    </div>
                                    <div className="pos-mac-empty-title">No matching results found</div>
                                    <div className="pos-mac-empty-sub">Try searching for POS, Invoices, Products, or Settings.</div>
                                </div>
                            )}
                        </div>

                        {/* macOS Spotlight Footer */}
                        <div className="pos-mac-footer">
                            <div className="pos-mac-footer-tips">
                                <span className="pos-mac-tip"><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
                                <span className="pos-mac-tip"><kbd>↵</kbd> Select</span>
                                <span className="pos-mac-tip"><kbd>esc</kbd> Close</span>
                            </div>
                            <div className="pos-mac-footer-count">
                                {filteredPages.length} {filteredPages.length === 1 ? 'result' : 'results'}
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </header>
    );
}
