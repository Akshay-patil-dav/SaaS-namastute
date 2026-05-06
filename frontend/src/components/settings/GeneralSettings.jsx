import React from 'react';

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
