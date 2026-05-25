import React, { useState } from 'react';
import { 
    Search, Plus, Eye, Edit, Trash2, Bell, AlertTriangle, 
    Wrench, DollarSign, Clock, CheckCircle2, RotateCcw
} from 'lucide-react';
import './inventory-pages-custom.css';

// Initial Mock Notifications
const initialNotifications = [
    { id: 'AL-101', type: 'Stock', title: 'Critical Stock Alert: Corrugated Packaging Boxes (L)', desc: 'Current available stock is 120 Units (Minimum reorder threshold: 200 Units).', date: '10 mins ago', status: 'Unread' },
    { id: 'AL-102', type: 'Production', title: 'Production Delay Alert: Lot `LOT-27B-ERGO` Delayed', desc: 'Batch is currently waiting for core components assembly inspection from Shift 1.', date: '2 hrs ago', status: 'Unread' },
    { id: 'AL-103', type: 'Maintenance', title: 'Machine Maintenance Reminder: Molding Press A', desc: 'Hydraulic seals scheduled replacement due in 3 days. Prepare replacement kit.', date: '1 day ago', status: 'Unread' },
    { id: 'AL-104', type: 'Payment', title: 'Customer Payment Reminder: Somesh Distributors Ltd', desc: 'Outstanding wholesale collection invoice #INV-9081 of ₹45,000 is 5 days overdue.', date: '2 days ago', status: 'Read' },
];

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState(initialNotifications);
    const [filterType, setFilterType] = useState('All'); // 'All', 'Stock', 'Production', 'Maintenance', 'Payment'
    const [toastMessage, setToastMessage] = useState('');

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(''), 3000);
    };

    const handleMarkAsRead = (id) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, status: 'Read' } : n));
        showToast('Notification marked as read!');
    };

    const handleDeleteNotification = (id) => {
        setNotifications(notifications.filter(n => n.id !== id));
        showToast('Notification dismissed!');
    };

    const handleMarkAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, status: 'Read' })));
        showToast('All notifications marked as read!');
    };

    const filteredAlerts = filterType === 'All' 
        ? notifications 
        : notifications.filter(n => n.type === filterType);

    return (
        <div className="sub-category-page px-3 py-2">
            {toastMessage && (
                <div className="prod-toast prod-toast-success">
                    <CheckCircle2 size={16} />
                    <span>{toastMessage}</span>
                    <button className="toast-close" onClick={() => setToastMessage('')}>×</button>
                </div>
            )}

            {/* Header Row */}
            <div className="ss-header-row mb-4">
                <div>
                    <h2 className="ss-page-title">Alerts & Notifications</h2>
                    <p className="ss-page-subtitle">Track low stock items, production delays, machine schedules, and pending payment reminders</p>
                </div>
                <div className="ss-header-actions">
                    <button className="ss-btn-orange d-flex align-items-center gap-2" style={{ background: '#ff9b29' }} onClick={handleMarkAllRead}>
                        <CheckCircle2 size={16} /> Mark All as Read
                    </button>
                </div>
            </div>

            {/* Filter Pills */}
            <div className="d-flex mb-4 p-1 bg-light rounded-3 overflow-auto" style={{ border: '1px solid #eaedf0', gap: '6px' }}>
                <button onClick={() => setFilterType('All')} className={`btn btn-sm px-4 py-2 text-nowrap rounded-2 fw-semibold border-0 ${filterType === 'All' ? 'bg-white text-dark shadow-sm' : 'text-secondary bg-transparent'}`}>All Alerts ({notifications.length})</button>
                <button onClick={() => setFilterType('Stock')} className={`btn btn-sm px-4 py-2 text-nowrap rounded-2 fw-semibold border-0 ${filterType === 'Stock' ? 'bg-white text-dark shadow-sm' : 'text-secondary bg-transparent'}`}>Low Stock ({notifications.filter(n => n.type === 'Stock').length})</button>
                <button onClick={() => setFilterType('Production')} className={`btn btn-sm px-4 py-2 text-nowrap rounded-2 fw-semibold border-0 ${filterType === 'Production' ? 'bg-white text-dark shadow-sm' : 'text-secondary bg-transparent'}`}>Production Delays ({notifications.filter(n => n.type === 'Production').length})</button>
                <button onClick={() => setFilterType('Maintenance')} className={`btn btn-sm px-4 py-2 text-nowrap rounded-2 fw-semibold border-0 ${filterType === 'Maintenance' ? 'bg-white text-dark shadow-sm' : 'text-secondary bg-transparent'}`}>Machine Maint ({notifications.filter(n => n.type === 'Maintenance').length})</button>
                <button onClick={() => setFilterType('Payment')} className={`btn btn-sm px-4 py-2 text-nowrap rounded-2 fw-semibold border-0 ${filterType === 'Payment' ? 'bg-white text-dark shadow-sm' : 'text-secondary bg-transparent'}`}>Payment Reminders ({notifications.filter(n => n.type === 'Payment').length})</button>
            </div>

            {/* Alerts Listing Panel */}
            <div className="ss-main-panel shadow-sm bg-white">
                <div className="d-flex flex-column">
                    {filteredAlerts.length > 0 ? (
                        filteredAlerts.map((n) => (
                            <div 
                                key={n.id} 
                                className={`p-4 border-bottom d-flex justify-content-between align-items-start gap-3 transition-all ${
                                    n.status === 'Unread' ? 'bg-light-subtle' : ''
                                }`}
                                style={{ borderLeft: n.status === 'Unread' ? '4px solid #ff9b29' : '4px solid transparent' }}
                            >
                                <div className="d-flex align-items-start gap-3">
                                    <div className={`p-2.5 rounded-3 d-flex align-items-center justify-content-center ${
                                        n.type === 'Stock' ? 'bg-danger-subtle text-danger' : 
                                        n.type === 'Production' ? 'bg-warning-subtle text-warning' : 
                                        n.type === 'Maintenance' ? 'bg-indigo-subtle text-indigo' : 'bg-success-subtle text-success'
                                    }`} style={{ 
                                        background: n.type === 'Stock' ? '#fef2f2' : n.type === 'Production' ? '#fff7ed' : n.type === 'Maintenance' ? '#eff6ff' : '#ecfdf5',
                                        color: n.type === 'Stock' ? '#ef4444' : n.type === 'Production' ? '#ff9b29' : n.type === 'Maintenance' ? '#4f46e5' : '#10b981'
                                    }}>
                                        {n.type === 'Stock' && <AlertTriangle size={20} />}
                                        {n.type === 'Production' && <Clock size={20} />}
                                        {n.type === 'Maintenance' && <Wrench size={20} />}
                                        {n.type === 'Payment' && <DollarSign size={20} />}
                                    </div>
                                    <div>
                                        <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                                            <h6 className={`fw-bold mb-0 text-dark ${n.status === 'Unread' ? 'fw-extrabold' : ''}`} style={{ fontSize: '15px' }}>{n.title}</h6>
                                            <span className="small text-muted font-monospace" style={{ fontSize: '11px' }}>({n.date})</span>
                                        </div>
                                        <p className="text-secondary small mb-0">{n.desc}</p>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    {n.status === 'Unread' && (
                                        <button className="btn btn-sm btn-outline-secondary py-1.5 px-3 rounded fw-semibold text-nowrap" style={{ fontSize: '11px' }} onClick={() => handleMarkAsRead(n.id)}>Mark Read</button>
                                    )}
                                    <button className="ss-action-btn delete" onClick={() => handleDeleteNotification(n.id)} title="Dismiss Alert"><Trash2 size={14} /></button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-5">
                            <Bell size={48} className="text-secondary mb-3 opacity-30" />
                            <h5 className="fw-bold mb-1 text-dark">No active notifications</h5>
                            <p className="text-muted small mb-0">You are completely up to date. All ERP systems nominal.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
