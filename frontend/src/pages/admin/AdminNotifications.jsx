import React, { useState } from 'react';
import {
    Bell,
    Mail,
    MessageSquare,
    Smartphone,
    Check,
    X,
    Plus,
    Trash2,
    Edit3,
    Send,
    ChevronDown,
    Users,
    Settings
} from 'lucide-react';

const notificationTypes = ['All', 'Unread', 'Sent', 'Scheduled'];

const notifications = [
    { id: 1, title: 'Welcome to Namastute', message: 'Thank you for joining!', type: 'email', status: 'sent', sentTo: 'All Users', date: '2024-01-15', recipients: 1234 },
    { id: 2, title: 'New Feature Alert', message: 'New analytics features available', type: 'push', status: 'sent', sentTo: 'Active Users', date: '2024-01-14', recipients: 892 },
    { id: 3, title: 'Maintenance', message: 'System maintenance scheduled', type: 'email', status: 'scheduled', sentTo: 'All Users', date: '2024-01-20', recipients: 1234 },
];

const templates = [
    { id: 1, name: 'Welcome Email', type: 'email' },
    { id: 2, name: 'Password Reset', type: 'email' },
    { id: 3, name: 'New Feature', type: 'push' },
];

export default function AdminNotifications() {
    const [activeTab, setActiveTab] = useState('notifications');
    const [showCompose, setShowCompose] = useState(false);
    const [selectedType, setSelectedType] = useState('All');

    return (
        <div className="fade-in">
            {/* Header */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
                <div>
                    <h1 className="h3 fw-bold text-dark mb-1">Notifications</h1>
                    <p className="text-muted mb-0">Manage notifications and communication</p>
                </div>
                <button onClick={() => setShowCompose(true)} className="btn btn-primary d-flex align-items-center gap-2">
                    <Send size={18} />
                    Compose
                </button>
            </div>

            {/* Stats Cards */}
            <div className="row g-4 mb-4">
                {[
                    { label: 'Total Sent', value: '5,234', icon: Send, color: 'primary' },
                    { label: 'Email Rate', value: '65%', icon: Mail, color: 'success' },
                    { label: 'Push Rate', value: '42%', icon: Smartphone, color: 'warning' },
                    { label: 'In-App Rate', value: '78%', icon: MessageSquare, color: 'info' },
                ].map((stat) => (
                    <div key={stat.label} className="col-6 col-xl-3">
                        <div className="stat-card">
                            <div className="d-flex align-items-center gap-3">
                                <div className={`stat-card-icon ${stat.color}`}>
                                    <stat.icon size={24} />
                                </div>
                                <div>
                                    <p className="stat-card-value mb-0">{stat.value}</p>
                                    <p className="stat-card-label mb-0">{stat.label}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="border-bottom mb-4">
                <ul className="nav nav-tabs border-0">
                    {[
                        { id: 'notifications', label: 'Notifications', icon: Bell },
                        { id: 'templates', label: 'Templates', icon: Mail },
                        { id: 'settings', label: 'Settings', icon: Settings },
                    ].map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <li key={tab.id} className="nav-item">
                                <button
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`nav-link border-0 d-flex align-items-center gap-2 ${activeTab === tab.id ? 'active fw-semibold' : 'text-muted'}`}
                                >
                                    <Icon size={16} />
                                    {tab.label}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* Notifications View */}
            {activeTab === 'notifications' && (
                <>
                    <div className="d-flex flex-wrap gap-2 mb-3">
                        {notificationTypes.map((type) => (
                            <button
                                key={type}
                                onClick={() => setSelectedType(type)}
                                className={`btn btn-sm ${selectedType === type ? 'btn-primary' : 'btn-light border'}`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>

                    <div className="content-card">
                        <div className="list-group list-group-flush">
                            {notifications.map((notification) => (
                                <div key={notification.id} className="list-group-item p-4">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div className="d-flex gap-3">
                                            <div className={`bg-${
                                                notification.type === 'email' ? 'primary' :
                                                notification.type === 'push' ? 'warning' :
                                                'info'
                                            } bg-opacity-10 rounded d-flex align-items-center justify-content-center`} style={{width: '48px', height: '48px'}}>
                                                {notification.type === 'email' && <Mail size={20} className="text-primary" />}
                                                {notification.type === 'push' && <Smartphone size={20} className="text-warning" />}
                                                {notification.type === 'in_app' && <MessageSquare size={20} className="text-info" />}
                                            </div>
                                            <div>
                                                <div className="d-flex align-items-center gap-2 mb-1">
                                                    <h6 className="fw-semibold mb-0">{notification.title}</h6>
                                                    <span className={`badge bg-${
                                                        notification.status === 'sent' ? 'success' :
                                                        notification.status === 'scheduled' ? 'warning' :
                                                        'secondary'
                                                    }`}>
                                                        {notification.status}
                                                    </span>
                                                </div>
                                                <p className="text-muted small mb-1">{notification.message}</p>
                                                <div className="d-flex gap-3 text-muted small">
                                                    <span>To: {notification.sentTo}</span>
                                                    <span>Recipients: {notification.recipients.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d-flex gap-1">
                                            <span className="text-muted small">{notification.date}</span>
                                            <button className="btn btn-light btn-sm p-1">
                                                <Edit3 size={16} className="text-primary" />
                                            </button>
                                            <button className="btn btn-light btn-sm p-1">
                                                <Trash2 size={16} className="text-danger" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {/* Templates View */}
            {activeTab === 'templates' && (
                <div className="row g-3">
                    {templates.map((template) => (
                        <div key={template.id} className="col-12 col-md-6 col-lg-4">
                            <div className="content-card h-100">
                                <div className="p-3">
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <div>
                                            <span className={`badge bg-${template.type === 'email' ? 'primary' : 'warning'} mb-2`}>
                                                {template.type.toUpperCase()}
                                            </span>
                                            <h6 className="fw-semibold mb-1">{template.name}</h6>
                                        </div>
                                        <div className="d-flex gap-1">
                                            <button className="btn btn-light btn-sm p-1">
                                                <Edit3 size={16} className="text-primary" />
                                            </button>
                                            <button className="btn btn-light btn-sm p-1">
                                                <Trash2 size={16} className="text-danger" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="col-12 col-md-6 col-lg-4">
                        <button className="content-card h-100 w-100 d-flex flex-column align-items-center justify-content-center p-5 border-2 border-dashed">
                            <Plus size={32} className="text-muted mb-2" />
                            <span className="text-muted fw-medium">Create Template</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Settings View */}
            {activeTab === 'settings' && (
                <div className="content-card">
                    <div className="p-4">
                        <h5 className="fw-bold mb-4">Notification Settings</h5>

                        <div className="vstack gap-3">
                            {[
                                { label: 'Email Notifications', desc: 'Send email notifications to users', enabled: true },
                                { label: 'Push Notifications', desc: 'Send push notifications to mobile devices', enabled: true },
                                { label: 'In-App Notifications', desc: 'Show notifications within the application', enabled: true },
                                { label: 'Daily Digest', desc: 'Send daily summary emails to users', enabled: false },
                                { label: 'Marketing Emails', desc: 'Allow marketing and promotional emails', enabled: false },
                            ].map((setting) => (
                                <div key={setting.label} className="d-flex align-items-center justify-content-between p-3 bg-light rounded-3"
                                    >
                                    <div>
                                        <p className="fw-semibold mb-1">{setting.label}</p>
                                        <p className="text-muted small mb-0">{setting.desc}</p>
                                    </div>
                                    <div className="form-check form-switch"
>
                                        <input className="form-check-input" type="checkbox" defaultChecked={setting.enabled} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Compose Modal */}
            {showCompose && (
                <div className="modal fade show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content border-0 shadow-lg">
                            <div className="modal-header border-0">
                                <h5 className="modal-title fw-bold">Compose Notification</h5>
                                <button onClick={() => setShowCompose(false)} className="btn-close" />
                            </div>
                            <div className="modal-body">
                                <div className="vstack gap-3">
                                    <div>
                                        <label className="form-label fw-semibold">Notification Type</label>
                                        <div className="d-flex gap-2">
                                            {[
                                                { id: 'email', label: 'Email', icon: Mail },
                                                { id: 'push', label: 'Push', icon: Smartphone },
                                                { id: 'in_app', label: 'In-App', icon: MessageSquare },
                                            ].map((type) => {
                                                const Icon = type.icon;
                                                return (
                                                    <button key={type.id} className="btn btn-light border flex-fill d-flex align-items-center justify-content-center gap-2 py-2">
                                                        <Icon size={18} />
                                                        {type.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="form-label fw-semibold">Recipients</label>
                                        <select className="form-select">
                                            <option>All Users</option>
                                            <option>Active Users</option>
                                            <option>Inactive Users</option>
                                            <option>Admins Only</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="form-label fw-semibold">Title</label>
                                        <input type="text" placeholder="Enter notification title..." className="form-control" />
                                    </div>

                                    <div>
                                        <label className="form-label fw-semibold">Message</label>
                                        <textarea rows="4" placeholder="Enter your message..." className="form-control" />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer border-0">
                                <button onClick={() => setShowCompose(false)} className="btn btn-light">Cancel</button>
                                <button onClick={() => setShowCompose(false)} className="btn btn-primary">Send Notification</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
