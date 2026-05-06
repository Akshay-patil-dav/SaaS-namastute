import React from 'react';
import { User, Plus, MapPin, EyeOff, Shield, Phone, CheckCircle2, Mail, Key, Activity, Ban, Trash2 } from 'lucide-react';

export const ProfileSettings = () => (
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
);

export const SecuritySettings = () => (
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
);

export const Notifications = () => (
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
                        <input type="checkbox" defaultChecked />
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
                        <input type="checkbox" />
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
                        <input type="checkbox" defaultChecked />
                        <span className="toggle-slider"></span>
                    </label>
                </div>
            </div>
            <div className="settings-actions">
                <button className="btn-save">Save Changes</button>
            </div>
        </div>
    </>
);

export const ConnectedApps = () => (
    <>
        <div className="settings-content-header">
            <h3>Connected Apps</h3>
        </div>
        <div className="settings-content-body">
            <div className="security-item">
                <div className="security-item-icon">
                    <span style={{ fontSize: '18px', fontWeight: 'bold' }}>G</span>
                </div>
                <div className="security-item-content">
                    <h4>Google Calendar</h4>
                    <p>Sync your schedule with Google Calendar</p>
                </div>
                <div className="security-item-action">
                    <span className="status-text">Connected</span>
                    <button className="btn-action dark">Disconnect</button>
                </div>
            </div>
            <div className="security-item">
                <div className="security-item-icon">
                    <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#1877F2' }}>f</span>
                </div>
                <div className="security-item-content">
                    <h4>Facebook Ads</h4>
                    <p>Manage ads from POS</p>
                </div>
                <div className="security-item-action">
                    <button className="btn-action orange">Connect</button>
                </div>
            </div>
            <div className="security-item">
                <div className="security-item-icon">
                    <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#25D366' }}>W</span>
                </div>
                <div className="security-item-content">
                    <h4>WhatsApp Integration</h4>
                    <p>Send invoices via WhatsApp</p>
                </div>
                <div className="security-item-action">
                    <button className="btn-action orange">Connect</button>
                </div>
            </div>
        </div>
    </>
);
