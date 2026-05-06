import React, { useState } from 'react';
import { 
    Settings as SettingsIcon, 
    Globe, 
    Smartphone, 
    Monitor, 
    DollarSign, 
    MoreHorizontal, 
    ChevronUp, 
    ChevronDown, 
    User, 
    MapPin,
    Plus,
    EyeOff,
    Shield,
    Phone,
    Mail,
    Key,
    Activity,
    Ban,
    Trash2,
    CheckCircle2
} from 'lucide-react';
import './settings.css';
import { Notifications, ConnectedApps } from '../components/settings/GeneralSettings';
import { SystemSettings, CompanySettings, Localization, Prefixes, Preference, Appearance, SocialAuthentication, Language } from '../components/settings/WebsiteSettings';
import { InvoiceSettings, InvoiceTemplate, Printer, PosSettings, CustomFields } from '../components/settings/AppSettings';
import { EmailSettings, EmailTemplate, SmsSettings, SmsTemplate, OtpSettings, GdprCookies } from '../components/settings/SystemSettings';
import { PaymentGateway, BankAccounts, TaxRates, Currencies } from '../components/settings/FinancialSettings';
import { Storage, BanIp } from '../components/settings/OtherSettings';

export default function Settings() {
    const [generalOpen, setGeneralOpen] = useState(true);
    const [websiteOpen, setWebsiteOpen] = useState(false);
    const [appOpen, setAppOpen] = useState(false);
    const [systemOpen, setSystemOpen] = useState(false);
    const [financialOpen, setFinancialOpen] = useState(false);
    const [otherOpen, setOtherOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');

    return (
        <div className="settings-container">
            <div className="settings-header d-flex justify-content-between align-items-center">
                <div>
                    <h2>Settings</h2>
                    <p>Manage your settings on portal</p>
                </div>
            </div>

            <div className="settings-layout">
                {/* Sidebar */}
                <div className="settings-sidebar">
                    {/* General Settings */}
                    <div className="settings-sidebar-section">
                        <div 
                            className={`settings-sidebar-section-title ${generalOpen ? 'active' : ''}`}
                            onClick={() => setGeneralOpen(!generalOpen)}
                        >
                            <div className="settings-sidebar-section-icon">
                                <SettingsIcon size={18} />
                                <span>General Settings</span>
                            </div>
                            {generalOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                        {generalOpen && (
                            <ul className="settings-sidebar-list">
                                <li 
                                    className={`settings-sidebar-item ${activeTab === 'profile' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('profile')}
                                >
                                    Profile
                                </li>
                                <li 
                                    className={`settings-sidebar-item ${activeTab === 'security' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('security')}
                                >
                                    Security
                                </li>
                                <li 
                                    className={`settings-sidebar-item ${activeTab === 'notifications' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('notifications')}
                                >
                                    Notifications
                                </li>
                                <li 
                                    className={`settings-sidebar-item ${activeTab === 'connected_apps' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('connected_apps')}
                                >
                                    Connected Apps
                                </li>
                            </ul>
                        )}
                    </div>

                    {/* Website Settings */}
                    <div className="settings-sidebar-section">
                        <div 
                            className={`settings-sidebar-section-title ${websiteOpen ? 'active' : ''}`}
                            onClick={() => setWebsiteOpen(!websiteOpen)}
                        >
                            <div className="settings-sidebar-section-icon">
                                <Globe size={18} />
                                <span>Website Settings</span>
                            </div>
                            {websiteOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                        {websiteOpen && (
                            <ul className="settings-sidebar-list">
                                <li className={`settings-sidebar-item ${activeTab === 'system_settings' ? 'active' : ''}`} onClick={() => setActiveTab('system_settings')}>System Settings</li>
                                <li className={`settings-sidebar-item ${activeTab === 'company_settings' ? 'active' : ''}`} onClick={() => setActiveTab('company_settings')}>Company Settings</li>
                                <li className={`settings-sidebar-item ${activeTab === 'localization' ? 'active' : ''}`} onClick={() => setActiveTab('localization')}>Localization</li>
                                <li className={`settings-sidebar-item ${activeTab === 'prefixes' ? 'active' : ''}`} onClick={() => setActiveTab('prefixes')}>Prefixes</li>
                                <li className={`settings-sidebar-item ${activeTab === 'preference' ? 'active' : ''}`} onClick={() => setActiveTab('preference')}>Preference</li>
                                <li className={`settings-sidebar-item ${activeTab === 'appearance' ? 'active' : ''}`} onClick={() => setActiveTab('appearance')}>Appearance</li>
                                <li className={`settings-sidebar-item ${activeTab === 'social_authentication' ? 'active' : ''}`} onClick={() => setActiveTab('social_authentication')}>Social Authentication</li>
                                <li className={`settings-sidebar-item ${activeTab === 'language' ? 'active' : ''}`} onClick={() => setActiveTab('language')}>Language</li>
                            </ul>
                        )}
                    </div>

                    {/* App Settings */}
                    <div className="settings-sidebar-section">
                        <div 
                            className={`settings-sidebar-section-title ${appOpen ? 'active' : ''}`}
                            onClick={() => setAppOpen(!appOpen)}
                        >
                            <div className="settings-sidebar-section-icon">
                                <Smartphone size={18} />
                                <span>App Settings</span>
                            </div>
                            {appOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                        {appOpen && (
                            <ul className="settings-sidebar-list">
                                <li className={`settings-sidebar-item ${activeTab === 'invoice_settings' ? 'active' : ''}`} onClick={() => setActiveTab('invoice_settings')}>Invoice Settings</li>
                                <li className={`settings-sidebar-item ${activeTab === 'invoice_template' ? 'active' : ''}`} onClick={() => setActiveTab('invoice_template')}>Invoice Template</li>
                                <li className={`settings-sidebar-item ${activeTab === 'printer' ? 'active' : ''}`} onClick={() => setActiveTab('printer')}>Printer</li>
                                <li className={`settings-sidebar-item ${activeTab === 'pos_settings' ? 'active' : ''}`} onClick={() => setActiveTab('pos_settings')}>POS Settings</li>
                                <li className={`settings-sidebar-item ${activeTab === 'custom_fields' ? 'active' : ''}`} onClick={() => setActiveTab('custom_fields')}>Custom Fields</li>
                            </ul>
                        )}
                    </div>

                    {/* System Settings */}
                    <div className="settings-sidebar-section">
                        <div 
                            className={`settings-sidebar-section-title ${systemOpen ? 'active' : ''}`}
                            onClick={() => setSystemOpen(!systemOpen)}
                        >
                            <div className="settings-sidebar-section-icon">
                                <Monitor size={18} />
                                <span>System Settings</span>
                            </div>
                            {systemOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                        {systemOpen && (
                            <ul className="settings-sidebar-list">
                                <li className={`settings-sidebar-item ${activeTab === 'email_settings' ? 'active' : ''}`} onClick={() => setActiveTab('email_settings')}>Email Settings</li>
                                <li className={`settings-sidebar-item ${activeTab === 'email_template' ? 'active' : ''}`} onClick={() => setActiveTab('email_template')}>Email Template</li>
                                <li className={`settings-sidebar-item ${activeTab === 'sms_settings' ? 'active' : ''}`} onClick={() => setActiveTab('sms_settings')}>SMS Settings</li>
                                <li className={`settings-sidebar-item ${activeTab === 'sms_template' ? 'active' : ''}`} onClick={() => setActiveTab('sms_template')}>SMS Template</li>
                                <li className={`settings-sidebar-item ${activeTab === 'otp' ? 'active' : ''}`} onClick={() => setActiveTab('otp')}>OTP Settings</li>
                                <li className={`settings-sidebar-item ${activeTab === 'gdpr_cookies' ? 'active' : ''}`} onClick={() => setActiveTab('gdpr_cookies')}>GDPR Cookies</li>
                            </ul>
                        )}
                    </div>

                    {/* Financial Settings */}
                    <div className="settings-sidebar-section">
                        <div 
                            className={`settings-sidebar-section-title ${financialOpen ? 'active' : ''}`}
                            onClick={() => setFinancialOpen(!financialOpen)}
                        >
                            <div className="settings-sidebar-section-icon">
                                <DollarSign size={18} />
                                <span>Financial Settings</span>
                            </div>
                            {financialOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                        {financialOpen && (
                            <ul className="settings-sidebar-list">
                                <li className={`settings-sidebar-item ${activeTab === 'payment_gateway' ? 'active' : ''}`} onClick={() => setActiveTab('payment_gateway')}>Payment Gateway</li>
                                <li className={`settings-sidebar-item ${activeTab === 'bank_accounts' ? 'active' : ''}`} onClick={() => setActiveTab('bank_accounts')}>Bank Accounts</li>
                                <li className={`settings-sidebar-item ${activeTab === 'tax_rates' ? 'active' : ''}`} onClick={() => setActiveTab('tax_rates')}>Tax Rates</li>
                                <li className={`settings-sidebar-item ${activeTab === 'currencies' ? 'active' : ''}`} onClick={() => setActiveTab('currencies')}>Currencies</li>
                            </ul>
                        )}
                    </div>

                    {/* Other Settings */}
                    <div className="settings-sidebar-section">
                        <div 
                            className={`settings-sidebar-section-title ${otherOpen ? 'active' : ''}`}
                            onClick={() => setOtherOpen(!otherOpen)}
                        >
                            <div className="settings-sidebar-section-icon">
                                <MoreHorizontal size={18} />
                                <span>Other Settings</span>
                            </div>
                            {otherOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                        {otherOpen && (
                            <ul className="settings-sidebar-list">
                                <li className={`settings-sidebar-item ${activeTab === 'storage' ? 'active' : ''}`} onClick={() => setActiveTab('storage')}>Storage</li>
                                <li className={`settings-sidebar-item ${activeTab === 'ban_ip' ? 'active' : ''}`} onClick={() => setActiveTab('ban_ip')}>Ban IP Address</li>
                            </ul>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="settings-content">
                    {activeTab === 'profile' && (
                        <>
                            <div className="settings-content-header">
                                <h3>Profile</h3>
                            </div>
                            <div className="settings-content-body">
                                {/* Basic Information */}
                                <div className="settings-section-title">
                                    <User size={18} />
                                    <span>Basic Information</span>
                                </div>
                                
                                <div className="profile-upload-section">
                                    <div className="profile-upload-box">
                                        <Plus size={20} />
                                        <span>Add Image</span>
                                    </div>
                                    <div className="profile-upload-actions">
                                        <button className="btn-upload">Upload Image</button>
                                        <p>Upload an image below 2 MB, Accepted File format JPG, PNG</p>
                                    </div>
                                </div>

                                <div className="settings-form-row">
                                    <div className="settings-form-group">
                                        <label>First Name <span className="required">*</span></label>
                                        <input type="text" />
                                    </div>
                                    <div className="settings-form-group">
                                        <label>Last Name <span className="required">*</span></label>
                                        <input type="text" />
                                    </div>
                                    <div className="settings-form-group">
                                        <label>User Name <span className="required">*</span></label>
                                        <input type="text" />
                                    </div>
                                </div>

                                <div className="settings-form-row">
                                    <div className="settings-form-group" style={{ flex: 1 }}>
                                        <label>Phone Number <span className="required">*</span></label>
                                        <input type="text" />
                                    </div>
                                    <div className="settings-form-group" style={{ flex: 2 }}>
                                        <label>Email <span className="required">*</span></label>
                                        <input type="email" />
                                    </div>
                                </div>

                                <div className="settings-divider"></div>

                                {/* Address Information */}
                                <div className="settings-section-title">
                                    <MapPin size={18} />
                                    <span>Address Information</span>
                                </div>

                                <div className="settings-form-group" style={{ marginBottom: '20px' }}>
                                    <label>Address <span className="required">*</span></label>
                                    <input type="text" />
                                </div>

                                <div className="settings-form-row">
                                    <div className="settings-form-group">
                                        <label>Country <span className="required">*</span></label>
                                        <select>
                                            <option>Select</option>
                                        </select>
                                    </div>
                                    <div className="settings-form-group">
                                        <label>State <span className="required">*</span></label>
                                        <select>
                                            <option>Select</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="settings-form-row">
                                    <div className="settings-form-group">
                                        <label>City <span className="required">*</span></label>
                                        <select>
                                            <option>Select</option>
                                        </select>
                                    </div>
                                    <div className="settings-form-group">
                                        <label>Postal Code <span className="required">*</span></label>
                                        <input type="text" />
                                    </div>
                                </div>

                                <div className="settings-actions">
                                    <button className="btn-cancel">Cancel</button>
                                    <button className="btn-save">Save Changes</button>
                                </div>
                            </div>
                        </>
                    )}
                    
                    {activeTab === 'security' && (
                        <>
                            <div className="settings-content-header">
                                <h3>Security</h3>
                            </div>
                            <div className="settings-content-body" style={{ padding: '24px' }}>
                                <div className="security-item">
                                    <div className="security-item-icon">
                                        <EyeOff size={18} />
                                    </div>
                                    <div className="security-item-content">
                                        <h4>Password</h4>
                                        <p>Last Changed 22 Dec 2024, 10:30 AM</p>
                                    </div>
                                    <div className="security-item-action">
                                        <button className="btn-action orange">Change Password</button>
                                    </div>
                                </div>

                                <div className="security-item">
                                    <div className="security-item-icon">
                                        <Shield size={18} />
                                    </div>
                                    <div className="security-item-content">
                                        <h4>Two Factor Authentication</h4>
                                        <p>Receive codes via SMS or email every time you login</p>
                                    </div>
                                    <div className="security-item-action">
                                        <label className="toggle-switch">
                                            <input type="checkbox" defaultChecked />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                </div>

                                <div className="security-item">
                                    <div className="security-item-icon">
                                        <span style={{ fontSize: '14px', fontWeight: 'bold' }}>G</span>
                                    </div>
                                    <div className="security-item-content">
                                        <h4>Google Authentication</h4>
                                        <p>Connect to Google</p>
                                    </div>
                                    <div className="security-item-action">
                                        <span className="status-text">Connected</span>
                                        <label className="toggle-switch">
                                            <input type="checkbox" defaultChecked />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                </div>

                                <div className="security-item">
                                    <div className="security-item-icon">
                                        <Phone size={18} />
                                    </div>
                                    <div className="security-item-content">
                                        <h4>Phone Number Verification</h4>
                                        <p>Verified Mobile Number : +81699799974</p>
                                    </div>
                                    <div className="security-item-action">
                                        <CheckCircle2 size={18} className="verified-icon" />
                                        <button className="btn-action orange">Change</button>
                                        <button className="btn-action dark">Remove</button>
                                    </div>
                                </div>

                                <div className="security-item">
                                    <div className="security-item-icon">
                                        <Mail size={18} />
                                    </div>
                                    <div className="security-item-content">
                                        <h4>Email Verification</h4>
                                        <p>Verified Email : info@example.com</p>
                                    </div>
                                    <div className="security-item-action">
                                        <CheckCircle2 size={18} className="verified-icon" />
                                        <button className="btn-action orange">Change</button>
                                        <button className="btn-action dark">Remove</button>
                                    </div>
                                </div>

                                <div className="security-item">
                                    <div className="security-item-icon">
                                        <Key size={18} />
                                    </div>
                                    <div className="security-item-content">
                                        <h4>Device Management</h4>
                                        <p>Manage devices associated with the account</p>
                                    </div>
                                    <div className="security-item-action">
                                        <button className="btn-action orange">Manage</button>
                                    </div>
                                </div>

                                <div className="security-item">
                                    <div className="security-item-icon">
                                        <Activity size={18} />
                                    </div>
                                    <div className="security-item-content">
                                        <h4>Account Activity</h4>
                                        <p>Manage activities associated with the account</p>
                                    </div>
                                    <div className="security-item-action">
                                        <button className="btn-action orange">View</button>
                                    </div>
                                </div>

                                <div className="security-item">
                                    <div className="security-item-icon">
                                        <Ban size={18} />
                                    </div>
                                    <div className="security-item-content">
                                        <h4>Deactivate Account</h4>
                                        <p>This will shutdown your account. Your account will be reactive when you sign in again</p>
                                    </div>
                                    <div className="security-item-action">
                                        <button className="btn-action orange">Deactivate</button>
                                    </div>
                                </div>

                                <div className="security-item">
                                    <div className="security-item-icon">
                                        <Trash2 size={18} />
                                    </div>
                                    <div className="security-item-content">
                                        <h4>Delete Account</h4>
                                        <p>Your account will be permanently deleted</p>
                                    </div>
                                    <div className="security-item-action">
                                        <button className="btn-action red">Delete</button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                    
                    {activeTab === 'notifications' && <Notifications />}
                    {activeTab === 'connected_apps' && <ConnectedApps />}
                    
                    {activeTab === 'system_settings' && <SystemSettings />}
                    {activeTab === 'company_settings' && <CompanySettings />}
                    {activeTab === 'localization' && <Localization />}
                    {activeTab === 'prefixes' && <Prefixes />}
                    {activeTab === 'preference' && <Preference />}
                    {activeTab === 'appearance' && <Appearance />}
                    {activeTab === 'social_authentication' && <SocialAuthentication />}
                    {activeTab === 'language' && <Language />}
                    
                    {activeTab === 'invoice_settings' && <InvoiceSettings />}
                    {activeTab === 'invoice_template' && <InvoiceTemplate />}
                    {activeTab === 'printer' && <Printer />}
                    {activeTab === 'pos_settings' && <PosSettings />}
                    {activeTab === 'custom_fields' && <CustomFields />}
                    
                    {activeTab === 'email_settings' && <EmailSettings />}
                    {activeTab === 'email_template' && <EmailTemplate />}
                    {activeTab === 'sms_settings' && <SmsSettings />}
                    {activeTab === 'sms_template' && <SmsTemplate />}
                    {activeTab === 'otp' && <OtpSettings />}
                    {activeTab === 'gdpr_cookies' && <GdprCookies />}
                    
                    {activeTab === 'payment_gateway' && <PaymentGateway />}
                    {activeTab === 'bank_accounts' && <BankAccounts />}
                    {activeTab === 'tax_rates' && <TaxRates />}
                    {activeTab === 'currencies' && <Currencies />}
                    
                    {activeTab === 'storage' && <Storage />}
                    {activeTab === 'ban_ip' && <BanIp />}
                </div>
            </div>
        </div>
    );
}
