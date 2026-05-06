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
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import './settings.css';
import { ProfileSettings, SecuritySettings, Notifications, ConnectedApps } from '../components/settings/GeneralSettings';
import { SystemSettings, CompanySettings, Localization, Prefixes, Preference, Appearance, SocialAuthentication, Language } from '../components/settings/WebsiteSettings';
import { InvoiceSettings, InvoiceTemplate, Printer, PosSettings, CustomFields } from '../components/settings/AppSettings';
import { EmailSettings, EmailTemplate, SmsSettings, SmsTemplate, OtpSettings, GdprCookies } from '../components/settings/SystemSettings';
import { PaymentGateway, BankAccounts, TaxRates, Currencies } from '../components/settings/FinancialSettings';
import { Storage, BanIp } from '../components/settings/OtherSettings';

export default function Settings() {
    const [openSection, setOpenSection] = useState('general');
    const navigate = useNavigate();
    const location = useLocation();
    
    // Helper to check if a tab is active
    const isActive = (path) => location.pathname.includes(`/settings/${path}`);

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
                            className={`settings-sidebar-section-title ${openSection === 'general' ? 'active' : ''}`}
                            onClick={() => setOpenSection(openSection === 'general' ? null : 'general')}
                        >
                            <div className="settings-sidebar-section-icon">
                                <SettingsIcon size={18} />
                                <span>General Settings</span>
                            </div>
                            {openSection === 'general' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                        {openSection === 'general' && (
                            <ul className="settings-sidebar-list">
                                <li className={`settings-sidebar-item ${isActive('profile') ? 'active' : ''}`} onClick={() => navigate('/settings/profile')}>Profile</li>
                                <li className={`settings-sidebar-item ${isActive('security') ? 'active' : ''}`} onClick={() => navigate('/settings/security')}>Security</li>
                                <li className={`settings-sidebar-item ${isActive('notifications') ? 'active' : ''}`} onClick={() => navigate('/settings/notifications')}>Notifications</li>
                                <li className={`settings-sidebar-item ${isActive('connected_apps') ? 'active' : ''}`} onClick={() => navigate('/settings/connected_apps')}>Connected Apps</li>
                            </ul>
                        )}
                    </div>

                    {/* Website Settings */}
                    <div className="settings-sidebar-section">
                        <div 
                            className={`settings-sidebar-section-title ${openSection === 'website' ? 'active' : ''}`}
                            onClick={() => setOpenSection(openSection === 'website' ? null : 'website')}
                        >
                            <div className="settings-sidebar-section-icon">
                                <Globe size={18} />
                                <span>Website Settings</span>
                            </div>
                            {openSection === 'website' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                        {openSection === 'website' && (
                            <ul className="settings-sidebar-list">
                                <li className={`settings-sidebar-item ${isActive('system_settings') ? 'active' : ''}`} onClick={() => navigate('/settings/system_settings')}>System Settings</li>
                                <li className={`settings-sidebar-item ${isActive('company_settings') ? 'active' : ''}`} onClick={() => navigate('/settings/company_settings')}>Company Settings</li>
                                <li className={`settings-sidebar-item ${isActive('localization') ? 'active' : ''}`} onClick={() => navigate('/settings/localization')}>Localization</li>
                                <li className={`settings-sidebar-item ${isActive('prefixes') ? 'active' : ''}`} onClick={() => navigate('/settings/prefixes')}>Prefixes</li>
                                <li className={`settings-sidebar-item ${isActive('preference') ? 'active' : ''}`} onClick={() => navigate('/settings/preference')}>Preference</li>
                                <li className={`settings-sidebar-item ${isActive('appearance') ? 'active' : ''}`} onClick={() => navigate('/settings/appearance')}>Appearance</li>
                                <li className={`settings-sidebar-item ${isActive('social_authentication') ? 'active' : ''}`} onClick={() => navigate('/settings/social_authentication')}>Social Authentication</li>
                                <li className={`settings-sidebar-item ${isActive('language') ? 'active' : ''}`} onClick={() => navigate('/settings/language')}>Language</li>
                            </ul>
                        )}
                    </div>

                    {/* App Settings */}
                    <div className="settings-sidebar-section">
                        <div 
                            className={`settings-sidebar-section-title ${openSection === 'app' ? 'active' : ''}`}
                            onClick={() => setOpenSection(openSection === 'app' ? null : 'app')}
                        >
                            <div className="settings-sidebar-section-icon">
                                <Smartphone size={18} />
                                <span>App Settings</span>
                            </div>
                            {openSection === 'app' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                        {openSection === 'app' && (
                            <ul className="settings-sidebar-list">
                                <li className={`settings-sidebar-item ${isActive('invoice_settings') ? 'active' : ''}`} onClick={() => navigate('/settings/invoice_settings')}>Invoice Settings</li>
                                <li className={`settings-sidebar-item ${isActive('invoice_template') ? 'active' : ''}`} onClick={() => navigate('/settings/invoice_template')}>Invoice Template</li>
                                <li className={`settings-sidebar-item ${isActive('printer') ? 'active' : ''}`} onClick={() => navigate('/settings/printer')}>Printer</li>
                                <li className={`settings-sidebar-item ${isActive('pos_settings') ? 'active' : ''}`} onClick={() => navigate('/settings/pos_settings')}>POS Settings</li>
                                <li className={`settings-sidebar-item ${isActive('custom_fields') ? 'active' : ''}`} onClick={() => navigate('/settings/custom_fields')}>Custom Fields</li>
                            </ul>
                        )}
                    </div>

                    {/* System Settings */}
                    <div className="settings-sidebar-section">
                        <div 
                            className={`settings-sidebar-section-title ${openSection === 'system' ? 'active' : ''}`}
                            onClick={() => setOpenSection(openSection === 'system' ? null : 'system')}
                        >
                            <div className="settings-sidebar-section-icon">
                                <Monitor size={18} />
                                <span>System Settings</span>
                            </div>
                            {openSection === 'system' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                        {openSection === 'system' && (
                            <ul className="settings-sidebar-list">
                                <li className={`settings-sidebar-item ${isActive('email_settings') ? 'active' : ''}`} onClick={() => navigate('/settings/email_settings')}>Email Settings</li>
                                <li className={`settings-sidebar-item ${isActive('email_template') ? 'active' : ''}`} onClick={() => navigate('/settings/email_template')}>Email Template</li>
                                <li className={`settings-sidebar-item ${isActive('sms_settings') ? 'active' : ''}`} onClick={() => navigate('/settings/sms_settings')}>SMS Settings</li>
                                <li className={`settings-sidebar-item ${isActive('sms_template') ? 'active' : ''}`} onClick={() => navigate('/settings/sms_template')}>SMS Template</li>
                                <li className={`settings-sidebar-item ${isActive('otp') ? 'active' : ''}`} onClick={() => navigate('/settings/otp')}>OTP Settings</li>
                                <li className={`settings-sidebar-item ${isActive('gdpr_cookies') ? 'active' : ''}`} onClick={() => navigate('/settings/gdpr_cookies')}>GDPR Cookies</li>
                            </ul>
                        )}
                    </div>

                    {/* Financial Settings */}
                    <div className="settings-sidebar-section">
                        <div 
                            className={`settings-sidebar-section-title ${openSection === 'financial' ? 'active' : ''}`}
                            onClick={() => setOpenSection(openSection === 'financial' ? null : 'financial')}
                        >
                            <div className="settings-sidebar-section-icon">
                                <DollarSign size={18} />
                                <span>Financial Settings</span>
                            </div>
                            {openSection === 'financial' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                        {openSection === 'financial' && (
                            <ul className="settings-sidebar-list">
                                <li className={`settings-sidebar-item ${isActive('payment_gateway') ? 'active' : ''}`} onClick={() => navigate('/settings/payment_gateway')}>Payment Gateway</li>
                                <li className={`settings-sidebar-item ${isActive('bank_accounts') ? 'active' : ''}`} onClick={() => navigate('/settings/bank_accounts')}>Bank Accounts</li>
                                <li className={`settings-sidebar-item ${isActive('tax_rates') ? 'active' : ''}`} onClick={() => navigate('/settings/tax_rates')}>Tax Rates</li>
                                <li className={`settings-sidebar-item ${isActive('currencies') ? 'active' : ''}`} onClick={() => navigate('/settings/currencies')}>Currencies</li>
                            </ul>
                        )}
                    </div>

                    {/* Other Settings */}
                    <div className="settings-sidebar-section">
                        <div 
                            className={`settings-sidebar-section-title ${openSection === 'other' ? 'active' : ''}`}
                            onClick={() => setOpenSection(openSection === 'other' ? null : 'other')}
                        >
                            <div className="settings-sidebar-section-icon">
                                <MoreHorizontal size={18} />
                                <span>Other Settings</span>
                            </div>
                            {openSection === 'other' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                        {openSection === 'other' && (
                            <ul className="settings-sidebar-list">
                                <li className={`settings-sidebar-item ${isActive('storage') ? 'active' : ''}`} onClick={() => navigate('/settings/storage')}>Storage</li>
                                <li className={`settings-sidebar-item ${isActive('ban_ip') ? 'active' : ''}`} onClick={() => navigate('/settings/ban_ip')}>Ban IP Address</li>
                            </ul>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="settings-content">
                    <Routes>
                        <Route path="/" element={<Navigate to="profile" replace />} />
                        <Route path="profile" element={<ProfileSettings />} />
                        <Route path="security" element={<SecuritySettings />} />
                        <Route path="notifications" element={<Notifications />} />
                        <Route path="connected_apps" element={<ConnectedApps />} />
                        
                        <Route path="system_settings" element={<SystemSettings />} />
                        <Route path="company_settings" element={<CompanySettings />} />
                        <Route path="localization" element={<Localization />} />
                        <Route path="prefixes" element={<Prefixes />} />
                        <Route path="preference" element={<Preference />} />
                        <Route path="appearance" element={<Appearance />} />
                        <Route path="social_authentication" element={<SocialAuthentication />} />
                        <Route path="language" element={<Language />} />
                        
                        <Route path="invoice_settings" element={<InvoiceSettings />} />
                        <Route path="invoice_template" element={<InvoiceTemplate />} />
                        <Route path="printer" element={<Printer />} />
                        <Route path="pos_settings" element={<PosSettings />} />
                        <Route path="custom_fields" element={<CustomFields />} />
                        
                        <Route path="email_settings" element={<EmailSettings />} />
                        <Route path="email_template" element={<EmailTemplate />} />
                        <Route path="sms_settings" element={<SmsSettings />} />
                        <Route path="sms_template" element={<SmsTemplate />} />
                        <Route path="otp" element={<OtpSettings />} />
                        <Route path="gdpr_cookies" element={<GdprCookies />} />
                        
                        <Route path="payment_gateway" element={<PaymentGateway />} />
                        <Route path="bank_accounts" element={<BankAccounts />} />
                        <Route path="tax_rates" element={<TaxRates />} />
                        <Route path="currencies" element={<Currencies />} />
                        
                        <Route path="storage" element={<Storage />} />
                        <Route path="ban_ip" element={<BanIp />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}
