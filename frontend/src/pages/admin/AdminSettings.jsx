import React, { useState } from 'react';
import {
    Bell,
    Shield,
    Globe,
    Mail,
    Database,
    Palette,
    Save,
    Check,
    Layout,
    Lock,
    User
} from 'lucide-react';

const settingsSections = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'emails', label: 'Email', icon: Mail },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'database', label: 'Database', icon: Database },
];

export default function AdminSettings() {
    const [activeTab, setActiveTab] = useState('general');
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="fade-in">
            {/* Header */}
            <div className="mb-4">
                <h1 className="h3 fw-bold text-dark mb-1">Settings</h1>
                <p className="text-muted mb-0">Manage your application settings and preferences</p>
            </div>

            <div className="row g-4">
                {/* Sidebar */}
                <div className="col-12 col-lg-3">
                    <div className="content-card sticky-lg-top" style={{ top: '20px' }}>
                        <div className="list-group list-group-flush">
                            {settingsSections.map((section) => {
                                const Icon = section.icon;
                                return (
                                    <button
                                        key={section.id}
                                        onClick={() => setActiveTab(section.id)}
                                        className={`list-group-item list-group-item-action d-flex align-items-center gap-2 border-0 py-3 ${
                                            activeTab === section.id ? 'active' : ''
                                        }`}
                                    >
                                        <Icon size={18} />
                                        {section.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="col-12 col-lg-9">
                    <div className="content-card">
                        {activeTab === 'general' && <GeneralSettings onSave={handleSave} saved={saved} />}
                        {activeTab === 'security' && <SecuritySettings onSave={handleSave} saved={saved} />}
                        {activeTab === 'notifications' && <NotificationSettings onSave={handleSave} saved={saved} />}
                        {activeTab === 'emails' && <EmailSettings onSave={handleSave} saved={saved} />}
                        {activeTab === 'appearance' && <AppearanceSettings onSave={handleSave} saved={saved} />}
                        {activeTab === 'database' && <DatabaseSettings onSave={handleSave} saved={saved} />}
                    </div>
                </div>
            </div>
        </div>
    );
}

function SettingSection({ title, description, children, onSave, saved }) {
    return (
        <div className="p-4">
            <div className="mb-4">
                <h2 className="h5 fw-bold text-dark">{title}</h2>
                {description && <p className="text-muted small mb-0">{description}</p>}
            </div>
            <div className="mb-4">{children}</div>
            <div className="d-flex justify-content-end gap-2 pt-3 border-top">
                <button className="btn btn-light">Cancel</button>
                <button onClick={onSave} className={`btn ${saved ? 'btn-success' : 'btn-primary'} d-flex align-items-center gap-2`}>
                    {saved ? (
                        <><Check size={18} /> Saved</>
                    ) : (
                        <><Save size={18} /> Save Changes</>
                    )}
                </button>
            </div>
        </div>
    );
}

function GeneralSettings({ onSave, saved }) {
    return (
        <SettingSection title="General Settings" description="Configure basic application settings" onSave={onSave} saved={saved}>
            <div className="row g-3">
                <div className="col-12">
                    <label className="form-label fw-semibold">Application Name</label>
                    <input type="text" defaultValue="Namastute" className="form-control form-control-custom" />
                </div>
                <div className="col-12">
                    <label className="form-label fw-semibold">Description</label>
                    <textarea rows="3" defaultValue="A modern SaaS platform for managing your business." className="form-control form-control-custom" />
                </div>
                <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">Timezone</label>
                    <select className="form-select">
                        <option>UTC (GMT+0)</option>
                        <option>EST (GMT-5)</option>
                        <option>PST (GMT-8)</option>
                        <option>IST (GMT+5:30)</option>
                    </select>
                </div>
                <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">Language</label>
                    <select className="form-select">
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                    </select>
                </div>
            </div>
        </SettingSection>
    );
}

function SecuritySettings({ onSave, saved }) {
    return (
        <SettingSection title="Security Settings" description="Configure security and authentication options" onSave={onSave} saved={saved}>
            <div className="vstack gap-3">
                {[
                    { label: 'Two-Factor Authentication', desc: 'Require 2FA for all admin accounts', checked: true },
                    { label: 'Force Password Reset', desc: 'Require password change every 90 days', checked: false },
                    { label: 'Login Notifications', desc: 'Send email on new device login', checked: true },
                ].map((setting) => (
                    <div key={setting.label} className="d-flex align-items-center justify-content-between p-3 bg-light rounded-3">
                        <div>
                            <p className="fw-semibold mb-1">{setting.label}</p>
                            <p className="text-muted small mb-0">{setting.desc}</p>
                        </div>
                        <div className="form-check form-switch">
                            <input className="form-check-input" type="checkbox" defaultChecked={setting.checked} />
                        </div>
                    </div>
                ))}
                <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">Session Timeout (minutes)</label>
                    <input type="number" defaultValue="30" min="5" max="120" className="form-control form-control-custom" />
                </div>
            </div>
        </SettingSection>
    );
}

function NotificationSettings({ onSave, saved }) {
    return (
        <SettingSection title="Notification Settings" description="Manage system notification preferences" onSave={onSave} saved={saved}>
            <div className="vstack gap-3">
                {[
                    { label: 'New User Registrations', desc: 'Get notified when a new user signs up', checked: true },
                    { label: 'User Reports', desc: 'Receive reports about user activity', checked: true },
                    { label: 'System Alerts', desc: 'Critical system notifications', checked: true },
                    { label: 'Security Alerts', desc: 'Security-related notifications', checked: false },
                    { label: 'Marketing Updates', desc: 'Marketing and promotional notifications', checked: false },
                ].map((setting) => (
                    <div key={setting.label} className="d-flex align-items-center justify-content-between p-3 bg-light rounded-3">
                        <div>
                            <p className="fw-semibold mb-1">{setting.label}</p>
                            <p className="text-muted small mb-0">{setting.desc}</p>
                        </div>
                        <div className="form-check form-switch">
                            <input className="form-check-input" type="checkbox" defaultChecked={setting.checked} />
                        </div>
                    </div>
                ))}
            </div>
        </SettingSection>
    );
}

function EmailSettings({ onSave, saved }) {
    return (
        <SettingSection title="Email Settings" description="Configure email server and templates" onSave={onSave} saved={saved}>
            <div className="row g-3">
                <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">SMTP Host</label>
                    <input type="text" defaultValue="smtp.example.com" className="form-control form-control-custom" />
                </div>
                <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">SMTP Port</label>
                    <input type="number" defaultValue="587" className="form-control form-control-custom" />
                </div>
                <div className="col-12">
                    <label className="form-label fw-semibold">From Email</label>
                    <input type="email" defaultValue="noreply@example.com" className="form-control form-control-custom" />
                </div>
                <div className="col-12">
                    <label className="form-label fw-semibold">From Name</label>
                    <input type="text" defaultValue="Namastute Team" className="form-control form-control-custom" />
                </div>
                <div className="col-12">
                    <div className="d-flex align-items-center justify-content-between p-3 bg-light rounded-3">
                        <div>
                            <p className="fw-semibold mb-1">Email Verification</p>
                            <p className="text-muted small mb-0">Require email verification for new accounts</p>
                        </div>
                        <div className="form-check form-switch">
                            <input className="form-check-input" type="checkbox" defaultChecked />
                        </div>
                    </div>
                </div>
            </div>
        </SettingSection>
    );
}

function AppearanceSettings({ onSave, saved }) {
    return (
        <SettingSection title="Appearance" description="Customize the look and feel of your application" onSave={onSave} saved={saved}>
            <div className="row g-4">
                <div className="col-12">
                    <label className="form-label fw-semibold">Theme</label>
                    <div className="d-flex gap-2">
                        {['Light', 'Dark', 'Auto'].map((theme) => (
                            <button
                                key={theme}
                                className={`btn flex-fill py-3 ${theme === 'Light' ? 'btn-primary' : 'btn-light border'}`}
                            >
                                {theme}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="col-12">
                    <label className="form-label fw-semibold">Primary Color</label>
                    <div className="d-flex gap-2 flex-wrap">
                        {['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'].map((color) => (
                            <button
                                key={color}
                                className="btn rounded-circle p-3 border-0"
                                style={{ backgroundColor: color, width: '48px', height: '48px' }}
                            />
                        ))}
                    </div>
                </div>
                <div className="col-12">
                    <label className="form-label fw-semibold">Logo URL</label>
                    <input type="url" placeholder="https://example.com/logo.png" className="form-control form-control-custom" />
                </div>
            </div>
        </SettingSection>
    );
}

function DatabaseSettings({ onSave, saved }) {
    return (
        <SettingSection title="Database" description="Manage database settings and maintenance" onSave={onSave} saved={saved}>
            <div className="vstack gap-4">
                <div className="p-4 bg-light rounded-3">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                        <div>
                            <p className="fw-semibold mb-1">Database Status</p>
                            <p className="text-muted small mb-0">Connected to PostgreSQL</p>
                        </div>
                        <span className="badge bg-success">Healthy</span>
                    </div>
                    <div className="mb-2">
                        <div className="d-flex justify-content-between small">
                            <span className="text-muted">Storage Used</span>
                            <span className="fw-semibold">45.2 GB / 100 GB</span>
                        </div>
                    </div>
                    <div className="progress-custom">
                        <div className="progress-custom-bar bg-primary" style={{ width: '45%' }} />
                    </div>
                </div>

                <div className="row g-3">
                    <div className="col-12 col-md-6">
                        <button className="btn btn-light border w-100 py-3">
                            <p className="fw-semibold mb-1">Backup Database</p>
                            <p className="text-muted small mb-0">Create a manual backup</p>
                        </button>
                    </div>
                    <div className="col-12 col-md-6">
                        <button className="btn btn-light border w-100 py-3">
                            <p className="fw-semibold mb-1">Optimize Database</p>
                            <p className="text-muted small mb-0">Clean up unused data</p>
                        </button>
                    </div>
                </div>

                <div className="d-flex align-items-center justify-content-between p-3 bg-light rounded-3">
                    <div>
                        <p className="fw-semibold mb-1">Auto Backup</p>
                        <p className="text-muted small mb-0">Daily automated backups at 2 AM</p>
                    </div>
                    <div className="form-check form-switch">
                        <input className="form-check-input" type="checkbox" defaultChecked />
                    </div>
                </div>
            </div>
        </SettingSection>
    );
}
