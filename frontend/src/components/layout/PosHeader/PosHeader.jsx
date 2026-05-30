import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../../../context/AuthContext';
import { useCompany } from '../../../context/CompanyContext';
import { useNavigate, Link } from 'react-router-dom';
import { 
    ChevronsLeft, 
    Search, 
    Store, 
    MonitorDot,
    Globe,
    Maximize,
    Minimize,
    Bell,
    Settings,
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
    X
} from 'lucide-react';

const initialNotifications = [
    { id: 'NT-1', title: 'Low Stock Alert', message: 'Item "PVC Resin Molding Compound" has dropped below safe stock levels (Currently: 14 kg, Safe: 50 kg). Immediate replenishment ordered.', type: 'Stock', date: '2026-05-25', unread: true },
    { id: 'NT-2', title: 'Leave Application Received', message: 'Staff member Anita Deshpukh has submitted a Sick Leave request for 2 days starting 2026-05-28. Rationale: Dental Treatment.', type: 'Leave', date: '2026-05-25', unread: true },
    { id: 'NT-3', title: 'Biometric Gateway Offline', message: 'Biometric Gate-02 scanner terminal connection timed out. Gate fallback audit mode activated.', type: 'System', date: '2026-05-24', unread: false },
    { id: 'NT-4', title: 'Payroll Run Completed', message: 'Monthly salary runs sheet for May 2026 was processed successfully. 12 payslip receipts compiled.', type: 'Payroll', date: '2026-05-23', unread: false }
];

export default function PosHeader({ sidebarOpen, setSidebarOpen }) {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const { user, logout } = useAuth();
    const { companyInfo } = useCompany();
    const navigate = useNavigate();

    // Notifications & Alert States
    const [notiOpen, setNotiOpen] = useState(false);
    const [notifications, setNotifications] = useState(initialNotifications);
    const [selectedNotiPopup, setSelectedNotiPopup] = useState(null);
    const [allNotiMaximized, setAllNotiMaximized] = useState(false);
    const [maximizedActiveId, setMaximizedActiveId] = useState(initialNotifications[0]?.id || null);

    const handleLogout = () => {
        setProfileOpen(false);
        logout();
        navigate('/login');
    };

    // Build initials for avatar
    const initials = user?.name
        ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
        : '??';

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

    return (
        <header className="pos-header">
            {/* Left side */}
            <div className="d-flex align-items-center gap-3">
                <button className="pos-toggle-btn" onClick={() => setSidebarOpen(prev => !prev)}>
                    <ChevronsLeft size={20} style={{ transform: sidebarOpen ? 'none' : 'rotate(180deg)', transition: 'transform 0.3s' }} />
                </button>

                <div className="pos-search-bar hide-on-mobile">
                    <Search size={16} color="#888" className="me-2" />
                    <input type="text" placeholder="Search" />
                    <div className="pos-search-shortcut">
                        <MonitorDot size={12} /> K
                    </div>
                </div>
            </div>

            {/* Right side */}
            <div className="pos-header-actions">
                <div className="pos-store-selector hide-on-mobile">
                    <Store className="pos-store-icon" size={16} />
                    <span>{companyInfo.name || 'My Store'}</span>
                    <ChevronDown size={14} color="#888" />
                </div>

                <Link to="/pos" className="pos-btn-orange" style={{ textDecoration: 'none' }}>
                    <MonitorDot size={16} />
                    <span>POS</span>
                </Link>

                {/* Icons */}
                <button className="pos-icon-btn hide-on-mobile">
                    <Globe size={18} />
                </button>

                <button className="pos-icon-btn hide-on-mobile" onClick={toggleFullScreen} title="Toggle Fullscreen">
                    {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
                </button>

                {/* Notification Bell Dropdown Section */}
                <div style={{ position: 'relative' }}>
                    <style>{`
                        .notification-feed-item {
                            transition: background-color 0.2s ease, transform 0.1s ease;
                        }
                        .notification-feed-item:hover {
                            background-color: #f8fafc !important;
                        }
                        .notification-feed-item .show-on-hover {
                            opacity: 0;
                            transform: translateY(-50%) scale(0.8);
                            transition: all 0.2s ease;
                        }
                        .notification-feed-item:hover .show-on-hover {
                            opacity: 0.85 !important;
                            transform: translateY(-50%) scale(1);
                        }
                        @keyframes fadeIn {
                            from { opacity: 0; transform: scale(0.95); }
                            to { opacity: 1; transform: scale(1); }
                        }
                    `}</style>

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
                            <div className="shadow-lg border rounded-3 p-3 bg-white" style={{
                                position: 'absolute',
                                top: '100%',
                                right: 0,
                                marginTop: '10px',
                                width: '330px',
                                zIndex: 1050,
                                maxHeight: '420px',
                                overflowY: 'auto',
                                animation: 'fadeIn 0.15s ease-out'
                            }}>
                                <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                                    <span className="fw-bold text-dark d-flex align-items-center gap-1.5" style={{ fontSize: '13.5px' }}>
                                        <span style={{ width: '4px', height: '12px', background: '#ff9b29', borderRadius: '2px' }} />
                                        Corporate Alerts
                                    </span>
                                    <div className="d-flex align-items-center gap-2">
                                        {unreadCount > 0 && (
                                            <button 
                                                className="btn p-0 text-decoration-none font-semibold border-0" 
                                                style={{ color: '#ff9b29', background: 'none', fontSize: '11px' }}
                                                onClick={handleMarkAllRead}
                                            >
                                                Mark all read
                                            </button>
                                        )}
                                        <button
                                            className="btn p-0 text-decoration-none border-0 d-flex align-items-center justify-content-center"
                                            style={{ color: '#ff9b29', background: 'none', opacity: 0.8 }}
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
                                                        borderLeft: n.unread ? '3.5px solid #ff9b29' : '3.5px solid transparent',
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
                                                    </div>
                                                    <div className="position-absolute end-0 top-50 translate-middle-y me-2 show-on-hover" style={{
                                                        color: '#ff9b29'
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

                <button className="pos-icon-btn hide-on-mobile" onClick={() => navigate('/settings')}>
                    <Settings size={18} />
                </button>

                {/* User Profile Dropdown */}
                <div style={{ position: 'relative' }}>
                    {/* Avatar — shows initials */}
                    <div
                        className="pos-user-avatar ms-1"
                        onClick={() => setProfileOpen(!profileOpen)}
                        style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            background: roleColor,
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
                        }}
                        title={user?.name || 'User'}
                    >
                        {initials}
                    </div>

                    {profileOpen && (
                        <>
                            {/* Overlay */}
                            <div
                                style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1040 }}
                                onClick={() => setProfileOpen(false)}
                            />
                            {/* Dropdown */}
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                right: 0,
                                marginTop: '10px',
                                background: 'white',
                                border: '1px solid #eaedf0',
                                borderRadius: '10px',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                                minWidth: '200px',
                                zIndex: 1050,
                                overflow: 'hidden',
                            }}>
                                {/* User info header */}
                                <div style={{ padding: '14px 16px', borderBottom: '1px solid #eaedf0', background: '#fafafa' }}>
                                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>{user?.name || 'User'}</div>
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
                        borderLeft: '5px solid #ff9b29',
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
                                    style={{ background: '#ff9b29', border: 'none' }}
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
                        borderLeft: '6px solid #ff9b29',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                    }}>
                        {/* Modal Header */}
                        <div className="d-flex justify-content-between align-items-center p-3 border-bottom" style={{ background: '#fafafa' }}>
                            <div className="d-flex align-items-center gap-2">
                                <Bell size={18} color="#ff9b29" />
                                <span className="fw-bold text-dark" style={{ fontSize: '15px' }}>Corporate Alerts Console</span>
                                <span className="badge rounded-pill bg-danger" style={{ fontSize: '10px' }}>
                                    {unreadCount} Unread
                                </span>
                            </div>
                            <div className="d-flex align-items-center gap-3">
                                {unreadCount > 0 && (
                                    <button 
                                        className="btn btn-sm btn-outline-warning fw-semibold" 
                                        style={{ fontSize: '11px', color: '#ff9b29', borderColor: '#ff9b29', background: 'none' }}
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
                                                borderLeft: isActive ? '4px solid #ff9b29' : '4px solid transparent',
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

                                            <div className="flex-grow-1 p-3 rounded mb-4" style={{ background: '#f8fafc', borderLeft: '4px solid #ff9b29', minHeight: '120px' }}>
                                                <h6 className="fw-bold text-dark mb-2" style={{ fontSize: '12.5px' }}>Detailed Feed Record</h6>
                                                <p className="text-secondary mb-0" style={{ fontSize: '13.5px', lineHeight: '1.6' }}>
                                                    {activeNoti.message}
                                                </p>
                                            </div>

                                            <div className="d-flex gap-3 mt-auto">
                                                <button className="btn btn-light border flex-grow-1" onClick={() => setAllNotiMaximized(false)}>Close Console</button>
                                                <button 
                                                    className="btn text-white fw-semibold" 
                                                    style={{ background: '#ff9b29', border: 'none', flexGrow: 2 }}
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
        </header>
    );
}
