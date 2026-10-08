import React, { useState, useRef } from 'react';
import { User, Plus, MapPin, EyeOff, Shield, Phone, CheckCircle2, Mail, Key, Activity, Ban, Trash2, Store, Factory, ShoppingCart, Briefcase, FileText } from 'lucide-react';
import { useSettings } from '../../../hooks/useSettings';
import { useCurrency } from '../../../hooks/useCurrency';
import { useAuth } from '../../../context/AuthContext';
import apiClient, { API, ENV } from '@/api/config';
import Billing from './Billing';
import ConnectedApps from './ConnectedApps';

export { Billing, ConnectedApps };

export const ProfileSettings = () => {
    const { user, updateBusinessType } = useAuth();
    const { currencySymbol } = useCurrency();
    const { settings, loading, saving, handleChange, saveSettings } = useSettings();
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    // pendingBizType: null = no pending change, otherwise the type the user has clicked but not yet saved
    const [pendingBizType, setPendingBizType] = useState(null);
    const [bizTypeSaving, setBizTypeSaving] = useState(false);
    const [bizTypeMsg, setBizTypeMsg] = useState(null); // { type: 'success'|'error', text }

    // The "active" display selection: pending if user clicked a card, otherwise their saved type
    const activeBizType = pendingBizType ?? (user?.businessType || '');
    // Show save button only if they've picked something different from what's saved
    const hasBizTypeChange = pendingBizType !== null && pendingBizType !== (user?.businessType || '');

    const handleFileUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            alert('File size exceeds 2MB limit.');
            return;
        }

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await apiClient.post(API.UPLOAD, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const data = response.data;

            if (data.url) {
                handleChange('profileImage', data.url);
                await saveSettings(['profileImage']);
            } else {
                alert(data.error || 'Failed to upload image.');
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Error uploading image.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemoveImage = () => {
        handleChange('profileImage', '');
        saveSettings(['profileImage']);
    };

    if (loading) return (
        <div className="settings-loading-state">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <p>Loading your profile settings...</p>
        </div>
    );

    return (
        <>
            <div className="settings-content-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h3>Profile Information</h3>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>Update your personal details and public profile.</p>
                </div>
                <button
                    className="btn-save"
                    onClick={() => saveSettings([
                        'profileFirstName', 'profileLastName', 'profileUserName',
                        'profilePhone', 'profileEmail', 'profileAddress',
                        'profileCountry', 'profileState', 'profileCity', 'profilePostalCode', 'currency'
                    ])}
                    disabled={saving}
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="settings-content-body">
                {/* Profile Image */}
                {/* <div className="settings-form-row">
                    <div className="settings-form-group">
                        <label>Profile Picture</label>
                        <div className="profile-upload-section">
                            <div 
                                className="profile-upload-box" 
                                style={settings.profileImage ? {
                                    backgroundImage: `url(${settings.profileImage.startsWith('http') ? settings.profileImage : ENV.BACKEND_BASE_URL + settings.profileImage})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    border: 'none'
                                } : {}}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {!settings.profileImage && (
                                    <>
                                        <Plus size={24} />
                                        <span>Upload</span>
                                    </>
                                )}
                            </div>
                            <div className="profile-upload-actions">
                                <input 
                                    type="file" 
                                    accept="image/png, image/jpeg, image/jpg" 
                                    ref={fileInputRef} 
                                    style={{ display: 'none' }}
                                    onChange={handleFileUpload}
                                />
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button 
                                        className="btn-upload" 
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isUploading}
                                    >
                                        {isUploading ? 'Uploading...' : 'Upload New'}
                                    </button>
                                    {settings.profileImage && (
                                        <button 
                                            className="btn-cancel" 
                                            onClick={handleRemoveImage}
                                            style={{ background: '#ef4444', color: '#fff', border: 'none' }}
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                                <p>Upload a high-res image below 2 MB (JPG, PNG)</p>
                            </div>
                        </div>
                    </div>
                </div> */}

                <div className="settings-section-title mt-4">
                    <User size={18} />
                    <span>Basic Information</span>
                </div>

                <div className="settings-form-row">
                    <div className="settings-form-group">
                        <label>First Name <span className="required">*</span></label>
                        <input
                            type="text"
                            placeholder="e.g. John"
                            value={settings.profileFirstName !== undefined ? settings.profileFirstName : (user?.firstName || '')}
                            onChange={(e) => handleChange('profileFirstName', e.target.value)}
                        />
                    </div>
                    <div className="settings-form-group">
                        <label>Last Name <span className="required">*</span></label>
                        <input
                            type="text"
                            placeholder="e.g. Doe"
                            value={settings.profileLastName !== undefined ? settings.profileLastName : (user?.lastName || '')}
                            onChange={(e) => handleChange('profileLastName', e.target.value)}
                        />
                    </div>
                </div>

                <div className="settings-form-row">
                    <div className="settings-form-group">
                        <label>User Name <span className="required">*</span></label>
                        <input
                            type="text"
                            placeholder="e.g. johndoe"
                            value={settings.profileUserName !== undefined ? settings.profileUserName : (user?.username || '')}
                            onChange={(e) => handleChange('profileUserName', e.target.value)}
                        />
                    </div>
                    <div className="settings-form-group">
                        <label>Preferred Currency <span className="required">*</span></label>
                        <select
                            value={settings.currency || 'INR'}
                            onChange={(e) => handleChange('currency', e.target.value)}
                        >
                            <option value="INR">INR ({currencySymbol})</option>
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="GBP">GBP (£)</option>
                        </select>
                    </div>
                </div>

                <div className="settings-form-row">
                    <div className="settings-form-group">
                        <label>Phone Number <span className="required">*</span></label>
                        <input
                            type="text"
                            placeholder="+1 (555) 000-0000"
                            value={settings.profilePhone !== undefined ? settings.profilePhone : (user?.phone || '')}
                            onChange={(e) => handleChange('profilePhone', e.target.value)}
                        />
                    </div>
                    <div className="settings-form-group">
                        <label>Email Address <span className="required">*</span></label>
                        <input
                            type="email"
                            placeholder="john@example.com"
                            value={settings.profileEmail !== undefined ? settings.profileEmail : (user?.email || '')}
                            onChange={(e) => handleChange('profileEmail', e.target.value)}
                        />
                    </div>
                </div>

                <div className="settings-divider"></div>

                <div className="settings-section-title">
                    <MapPin size={18} />
                    <span>Location Information</span>
                </div>

                <div className="settings-form-row">
                    <div className="settings-form-group">
                        <label>Street Address <span className="required">*</span></label>
                        <input
                            type="text"
                            placeholder="123 Main St, Apt 4B"
                            value={settings.profileAddress || ''}
                            onChange={(e) => handleChange('profileAddress', e.target.value)}
                        />
                    </div>
                </div>

                <div className="settings-form-row">
                    <div className="settings-form-group">
                        <label>Country <span className="required">*</span></label>
                        <select
                            value={settings.profileCountry || 'Select'}
                            onChange={(e) => handleChange('profileCountry', e.target.value)}
                        >
                            <option value="Select">Select Country</option>
                            <option value="USA">USA</option>
                            <option value="UK">UK</option>
                            <option value="India">India</option>
                        </select>
                    </div>
                    <div className="settings-form-group">
                        <label>State / Province <span className="required">*</span></label>
                        <select
                            value={settings.profileState || 'Select'}
                            onChange={(e) => handleChange('profileState', e.target.value)}
                        >
                            <option value="Select">Select State</option>
                            <option value="NY">NY</option>
                            <option value="CA">CA</option>
                            <option value="MH">MH</option>
                        </select>
                    </div>
                </div>

                <div className="settings-form-row">
                    <div className="settings-form-group">
                        <label>City <span className="required">*</span></label>
                        <select
                            value={settings.profileCity || 'Select'}
                            onChange={(e) => handleChange('profileCity', e.target.value)}
                        >
                            <option value="Select">Select City</option>
                            <option value="New York">New York</option>
                            <option value="Los Angeles">Los Angeles</option>
                            <option value="Mumbai">Mumbai</option>
                        </select>
                    </div>
                    <div className="settings-form-group">
                        <label>Postal / Zip Code <span className="required">*</span></label>
                        <input
                            type="text"
                            placeholder="10001"
                            value={settings.profilePostalCode || ''}
                            onChange={(e) => handleChange('profilePostalCode', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* ── Business Type ────────────────────────────────────────────── */}
            <div className="settings-divider"></div>
            <div className="settings-section-title" style={{ padding: '0 24px', marginTop: '8px' }}>
                <Briefcase size={18} />
                <span>Business Type</span>
            </div>
            <div className="settings-content-body" style={{ paddingTop: '8px' }}>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '16px' }}>
                    Choose the type that best describes your business. This instantly updates your sidebar navigation.
                </p>
                <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                    {[
                        { value: 'Store', label: 'Retail Store', desc: 'POS, inventory & offline sales.', Icon: Store },
                        { value: 'E-comm', label: 'E-Commerce', desc: 'Online sales & multi-channel fulfilment.', Icon: ShoppingCart },
                        { value: 'Billing Invoice', label: 'Billing Invoice', desc: 'Create and manage billing invoices for clients.', Icon: FileText },
                    ].map(({ value, label, desc, Icon }) => {
                        const isSelected = activeBizType === value;
                        const isSaved = user?.businessType === value;
                        return (
                            <div
                                key={value}
                                onClick={() => { setPendingBizType(value); setBizTypeMsg(null); }}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '14px',
                                    padding: '14px 20px', borderRadius: '10px', cursor: 'pointer',
                                    border: isSelected ? '2px solid #f97316' : '2px solid #e2e8f0',
                                    background: isSelected
                                        ? 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)'
                                        : '#f8fafc',
                                    transition: 'all 0.18s ease',
                                    flex: '1 1 180px', minWidth: '180px',
                                    boxShadow: isSelected ? '0 0 0 3px rgba(249,115,22,0.15)' : 'none',
                                    position: 'relative',
                                }}
                            >
                                {/* "Saved" badge on the currently-saved card */}
                                {isSaved && !hasBizTypeChange && (
                                    <span style={{
                                        position: 'absolute', top: 8, right: 10,
                                        fontSize: '10px', fontWeight: 700, letterSpacing: '0.03em',
                                        background: '#dcfce7', color: '#16a34a',
                                        padding: '2px 8px', borderRadius: '20px',
                                    }}>Active</span>
                                )}
                                <div style={{
                                    width: 42, height: 42, borderRadius: '10px', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center',
                                    background: isSelected ? '#f97316' : '#e2e8f0',
                                    color: isSelected ? '#fff' : '#64748b',
                                    flexShrink: 0, transition: 'all 0.18s ease',
                                }}>
                                    <Icon size={20} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>{label}</div>
                                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 2 }}>{desc}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {bizTypeMsg && (
                    <div style={{
                        marginTop: '12px', padding: '10px 16px', borderRadius: '8px', fontSize: '0.85rem',
                        display: 'flex', alignItems: 'center', gap: '8px',
                        background: bizTypeMsg.type === 'success' ? '#f0fdf4' : '#fef2f2',
                        color: bizTypeMsg.type === 'success' ? '#16a34a' : '#dc2626',
                        border: `1px solid ${bizTypeMsg.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
                    }}>
                        <span>{bizTypeMsg.type === 'success' ? '✓' : '✕'}</span>
                        {bizTypeMsg.text}
                    </div>
                )}

                {hasBizTypeChange && (
                    <div style={{ marginTop: '16px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <button
                            className="btn-save"
                            disabled={bizTypeSaving}
                            onClick={async () => {
                                setBizTypeSaving(true);
                                setBizTypeMsg(null);
                                const result = await updateBusinessType(pendingBizType);
                                setBizTypeSaving(false);
                                if (result.success) {
                                    setPendingBizType(null); // clear pending — card resets to saved state
                                    setBizTypeMsg({ type: 'success', text: `Business type changed to "${pendingBizType}". Your sidebar has been updated.` });
                                } else {
                                    setBizTypeMsg({ type: 'error', text: result.error || 'Failed to update. Please try again.' });
                                }
                            }}
                        >
                            {bizTypeSaving ? 'Saving...' : 'Save Business Type'}
                        </button>
                        <button
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: '0.85rem', textDecoration: 'underline' }}
                            onClick={() => { setPendingBizType(null); setBizTypeMsg(null); }}
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export const SecuritySettings = () => {
    const { settings, loading, _saving, handleChange, saveSettings } = useSettings();

    if (loading) return <div style={{ padding: '20px' }}>Loading settings...</div>;

    return (
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
                            <input
                                type="checkbox"
                                checked={settings.twoFactorAuth !== 'false'}
                                onChange={(e) => { handleChange('twoFactorAuth', e.target.checked ? 'true' : 'false'); saveSettings(['twoFactorAuth']); }}
                            />
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
                        {settings.googleAuthConnected === 'true' ? (
                            <>
                                <span className="status-text">Connected</span>
                                <label className="toggle-switch">
                                    <input
                                        type="checkbox"
                                        checked={true}
                                        onChange={(_e) => { handleChange('googleAuthConnected', 'false'); saveSettings(['googleAuthConnected']); }}
                                    />
                                    <span className="toggle-slider"></span>
                                </label>
                            </>
                        ) : (
                            <>
                                <span className="status-text">Disconnected</span>
                                <label className="toggle-switch">
                                    <input
                                        type="checkbox"
                                        checked={false}
                                        onChange={(_e) => { handleChange('googleAuthConnected', 'true'); saveSettings(['googleAuthConnected']); }}
                                    />
                                    <span className="toggle-slider"></span>
                                </label>
                            </>
                        )}
                    </div>
                </div>

                <div className="security-item">
                    <div className="security-item-icon">
                        <Phone size={18} />
                    </div>
                    <div className="security-item-content">
                        <h4>Phone Number Verification</h4>
                        <p>Verified Mobile Number : {settings.verifiedPhone || '+81699799974'}</p>
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
                        <p>Verified Email : {settings.verifiedEmail || 'info@example.com'}</p>
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
    );
};

export const Notifications = () => {
    const { settings, loading, saving, handleChange, saveSettings } = useSettings();

    if (loading) return <div style={{ padding: '20px' }}>Loading settings...</div>;

    return (
        <>
            <div className="settings-content-header">
                <h3>Notifications</h3>
            </div>
            <div className="settings-content-body">
                <div className="security-item">
                    <div className="security-item-content">
                        <h4>Email Notifications</h4>
                        <p>Receive notifications via email</p>
                    </div>
                    <div className="security-item-action">
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={settings.emailNotifications !== 'false'}
                                onChange={(e) => handleChange('emailNotifications', e.target.checked ? 'true' : 'false')}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>
                </div>
                <div className="security-item">
                    <div className="security-item-content">
                        <h4>SMS Notifications</h4>
                        <p>Receive notifications via SMS</p>
                    </div>
                    <div className="security-item-action">
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={settings.smsNotifications === 'true'}
                                onChange={(e) => handleChange('smsNotifications', e.target.checked ? 'true' : 'false')}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>
                </div>
                <div className="security-item">
                    <div className="security-item-content">
                        <h4>Push Notifications</h4>
                        <p>Receive push notifications in browser</p>
                    </div>
                    <div className="security-item-action">
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={settings.pushNotifications !== 'false'}
                                onChange={(e) => handleChange('pushNotifications', e.target.checked ? 'true' : 'false')}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>
                </div>
                <div className="settings-actions">
                    <button
                        className="btn-save"
                        onClick={() => saveSettings(['emailNotifications', 'smsNotifications', 'pushNotifications'])}
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </>
    );
};
