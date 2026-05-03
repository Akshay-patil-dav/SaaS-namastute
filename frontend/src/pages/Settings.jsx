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
    Plus
} from 'lucide-react';
import './settings.css';

export default function Settings() {
    const [generalOpen, setGeneralOpen] = useState(true);
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
                        <div className="settings-sidebar-section-title">
                            <div className="settings-sidebar-section-icon">
                                <Globe size={18} />
                                <span>Website Settings</span>
                            </div>
                            <ChevronDown size={16} />
                        </div>
                    </div>

                    {/* App Settings */}
                    <div className="settings-sidebar-section">
                        <div className="settings-sidebar-section-title">
                            <div className="settings-sidebar-section-icon">
                                <Smartphone size={18} />
                                <span>App Settings</span>
                            </div>
                            <ChevronDown size={16} />
                        </div>
                    </div>

                    {/* System Settings */}
                    <div className="settings-sidebar-section">
                        <div className="settings-sidebar-section-title">
                            <div className="settings-sidebar-section-icon">
                                <Monitor size={18} />
                                <span>System Settings</span>
                            </div>
                            <ChevronDown size={16} />
                        </div>
                    </div>

                    {/* Financial Settings */}
                    <div className="settings-sidebar-section">
                        <div className="settings-sidebar-section-title">
                            <div className="settings-sidebar-section-icon">
                                <DollarSign size={18} />
                                <span>Financial Settings</span>
                            </div>
                            <ChevronDown size={16} />
                        </div>
                    </div>

                    {/* Other Settings */}
                    <div className="settings-sidebar-section">
                        <div className="settings-sidebar-section-title">
                            <div className="settings-sidebar-section-icon">
                                <MoreHorizontal size={18} />
                                <span>Other Settings</span>
                            </div>
                            <ChevronDown size={16} />
                        </div>
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
                    
                    {activeTab !== 'profile' && (
                        <div className="settings-content-body d-flex justify-content-center align-items-center" style={{ minHeight: '300px', color: '#64748b' }}>
                            <p>Coming Soon</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
