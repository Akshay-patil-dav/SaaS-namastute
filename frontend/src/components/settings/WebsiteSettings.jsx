import React from 'react';

export const SystemSettings = () => (
    <>
        <div className="settings-content-header">
            <h3>System Settings</h3>
        </div>
        <div className="settings-content-body">
            <div className="settings-form-row">
                <div className="settings-form-group">
                    <label>Website Name <span className="required">*</span></label>
                    <input type="text" defaultValue="Preadmin POS" />
                </div>
            </div>
            <div className="profile-upload-section">
                <div className="profile-upload-box">
                    <span>Add Logo</span>
                </div>
                <div className="profile-upload-actions">
                    <button className="btn-upload">Upload Logo</button>
                    <p>Recommended size: 150x50px</p>
                </div>
            </div>
            <div className="profile-upload-section">
                <div className="profile-upload-box">
                    <span>Add Favicon</span>
                </div>
                <div className="profile-upload-actions">
                    <button className="btn-upload">Upload Favicon</button>
                    <p>Recommended size: 16x16px or 32x32px</p>
                </div>
            </div>
            <div className="settings-actions">
                <button className="btn-save">Save Changes</button>
            </div>
        </div>
    </>
);

export const CompanySettings = () => (
    <>
        <div className="settings-content-header">
            <h3>Company Settings</h3>
        </div>
        <div className="settings-content-body">
            <div className="settings-form-row">
                <div className="settings-form-group">
                    <label>Company Name <span className="required">*</span></label>
                    <input type="text" defaultValue="Dreamguys Technologies" />
                </div>
                <div className="settings-form-group">
                    <label>Company Email <span className="required">*</span></label>
                    <input type="email" defaultValue="info@dreamguys.co.in" />
                </div>
            </div>
            <div className="settings-form-row">
                <div className="settings-form-group">
                    <label>Company Phone <span className="required">*</span></label>
                    <input type="text" defaultValue="+1 234 567 890" />
                </div>
                <div className="settings-form-group">
                    <label>Website <span className="required">*</span></label>
                    <input type="text" defaultValue="www.example.com" />
                </div>
            </div>
            <div className="settings-form-group" style={{ marginBottom: '20px' }}>
                <label>Company Address <span className="required">*</span></label>
                <textarea rows="3" defaultValue="123 Street Name, City, Country"></textarea>
            </div>
            <div className="settings-actions">
                <button className="btn-save">Save Changes</button>
            </div>
        </div>
    </>
);

export const Localization = () => (
    <>
        <div className="settings-content-header">
            <h3>Localization</h3>
        </div>
        <div className="settings-content-body">
            <div className="settings-form-row">
                <div className="settings-form-group">
                    <label>Timezone</label>
                    <select><option>(UTC -5:00) Eastern Time</option><option>(UTC +5:30) Indian Standard Time</option></select>
                </div>
                <div className="settings-form-group">
                    <label>Date Format</label>
                    <select><option>DD/MM/YYYY</option><option>MM/DD/YYYY</option><option>YYYY-MM-DD</option></select>
                </div>
            </div>
            <div className="settings-form-row">
                <div className="settings-form-group">
                    <label>Time Format</label>
                    <select><option>12 Hours</option><option>24 Hours</option></select>
                </div>
                <div className="settings-form-group">
                    <label>Financial Year Start Month</label>
                    <select><option>January</option><option>April</option></select>
                </div>
            </div>
            <div className="settings-actions">
                <button className="btn-save">Save Changes</button>
            </div>
        </div>
    </>
);

export const Prefixes = () => (
    <>
        <div className="settings-content-header">
            <h3>Prefixes</h3>
        </div>
        <div className="settings-content-body">
            <div className="settings-form-row">
                <div className="settings-form-group">
                    <label>Product Prefix</label>
                    <input type="text" defaultValue="PROD-" />
                </div>
                <div className="settings-form-group">
                    <label>Purchase Prefix</label>
                    <input type="text" defaultValue="PUR-" />
                </div>
            </div>
            <div className="settings-form-row">
                <div className="settings-form-group">
                    <label>Sale Prefix</label>
                    <input type="text" defaultValue="SALE-" />
                </div>
                <div className="settings-form-group">
                    <label>Expense Prefix</label>
                    <input type="text" defaultValue="EXP-" />
                </div>
            </div>
            <div className="settings-actions">
                <button className="btn-save">Save Changes</button>
            </div>
        </div>
    </>
);

export const Preference = () => (
    <>
        <div className="settings-content-header">
            <h3>Preference</h3>
        </div>
        <div className="settings-content-body">
            <div className="security-item">
                <div className="security-item-content">
                    <h4>Maintenance Mode</h4>
                    <p>Enable maintenance mode to disable user access</p>
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
                    <h4>Enable Registration</h4>
                    <p>Allow new users to register</p>
                </div>
                <div className="security-item-action">
                    <label className="toggle-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="toggle-slider"></span>
                    </label>
                </div>
            </div>
        </div>
    </>
);

export const Appearance = () => (
    <>
        <div className="settings-content-header">
            <h3>Appearance</h3>
        </div>
        <div className="settings-content-body">
            <div className="settings-form-group">
                <label>Theme Layout</label>
                <select><option>Light</option><option>Dark</option></select>
            </div>
            <div className="settings-form-group">
                <label>Primary Color</label>
                <input type="color" defaultValue="#ff9f43" />
            </div>
            <div className="settings-actions">
                <button className="btn-save">Save Changes</button>
            </div>
        </div>
    </>
);

export const SocialAuthentication = () => (
    <>
        <div className="settings-content-header">
            <h3>Social Authentication</h3>
        </div>
        <div className="settings-content-body">
            <div className="security-item">
                <div className="security-item-content">
                    <h4>Google Login</h4>
                    <p>Enable login with Google</p>
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
                    <h4>Facebook Login</h4>
                    <p>Enable login with Facebook</p>
                </div>
                <div className="security-item-action">
                    <label className="toggle-switch">
                        <input type="checkbox" />
                        <span className="toggle-slider"></span>
                    </label>
                </div>
            </div>
        </div>
    </>
);

export const Language = () => (
    <>
        <div className="settings-content-header">
            <h3>Language</h3>
        </div>
        <div className="settings-content-body">
            <div className="settings-form-group">
                <label>Default Language</label>
                <select><option>English</option><option>Spanish</option><option>French</option><option>Arabic</option></select>
            </div>
            <div className="settings-actions">
                <button className="btn-save">Save Changes</button>
            </div>
        </div>
    </>
);
