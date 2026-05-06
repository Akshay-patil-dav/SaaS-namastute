import React from 'react';

export const EmailSettings = () => (
    <>
        <div className="settings-content-header">
            <h3>Email Settings</h3>
        </div>
        <div className="settings-content-body">
            <div className="settings-form-row">
                <div className="settings-form-group">
                    <label>Email Provider</label>
                    <select><option>SMTP</option><option>Mailgun</option><option>SendGrid</option></select>
                </div>
            </div>
            <div className="settings-form-row">
                <div className="settings-form-group">
                    <label>SMTP Host <span className="required">*</span></label>
                    <input type="text" defaultValue="smtp.example.com" />
                </div>
                <div className="settings-form-group">
                    <label>SMTP Port <span className="required">*</span></label>
                    <input type="text" defaultValue="587" />
                </div>
            </div>
            <div className="settings-form-row">
                <div className="settings-form-group">
                    <label>SMTP User <span className="required">*</span></label>
                    <input type="text" defaultValue="user@example.com" />
                </div>
                <div className="settings-form-group">
                    <label>SMTP Password <span className="required">*</span></label>
                    <input type="password" defaultValue="password" />
                </div>
            </div>
            <div className="settings-actions">
                <button className="btn-save">Save Changes</button>
            </div>
        </div>
    </>
);

export const EmailTemplate = () => (
    <>
        <div className="settings-content-header">
            <h3>Email Templates</h3>
        </div>
        <div className="settings-content-body">
            <div className="settings-form-group">
                <label>Select Template to Edit</label>
                <select><option>Welcome Email</option><option>Order Confirmation</option><option>Password Reset</option></select>
            </div>
            <div className="settings-form-group">
                <label>Email Subject</label>
                <input type="text" defaultValue="Welcome to our platform!" />
            </div>
            <div className="settings-form-group">
                <label>Email Body</label>
                <textarea rows="6" defaultValue="Hello {name}, Welcome to our system..."></textarea>
            </div>
            <div className="settings-actions">
                <button className="btn-save">Save Changes</button>
            </div>
        </div>
    </>
);

export const SmsSettings = () => (
    <>
        <div className="settings-content-header">
            <h3>SMS Settings</h3>
        </div>
        <div className="settings-content-body">
            <div className="settings-form-row">
                <div className="settings-form-group">
                    <label>SMS Provider</label>
                    <select><option>Twilio</option><option>Nexmo</option></select>
                </div>
            </div>
            <div className="settings-form-row">
                <div className="settings-form-group">
                    <label>Account SID / Key</label>
                    <input type="text" />
                </div>
                <div className="settings-form-group">
                    <label>Auth Token / Secret</label>
                    <input type="password" />
                </div>
            </div>
            <div className="settings-form-group">
                <label>Sender Number</label>
                <input type="text" />
            </div>
            <div className="settings-actions">
                <button className="btn-save">Save Changes</button>
            </div>
        </div>
    </>
);

export const SmsTemplate = () => (
    <>
        <div className="settings-content-header">
            <h3>SMS Templates</h3>
        </div>
        <div className="settings-content-body">
            <div className="settings-form-group">
                <label>Select Template</label>
                <select><option>OTP Verification</option><option>Order Shipped</option></select>
            </div>
            <div className="settings-form-group">
                <label>Message Content</label>
                <textarea rows="3" defaultValue="Your OTP is {otp}. Valid for 5 mins."></textarea>
            </div>
            <div className="settings-actions">
                <button className="btn-save">Save Changes</button>
            </div>
        </div>
    </>
);

export const OtpSettings = () => (
    <>
        <div className="settings-content-header">
            <h3>OTP Settings</h3>
        </div>
        <div className="settings-content-body">
            <div className="settings-form-row">
                <div className="settings-form-group">
                    <label>OTP Type</label>
                    <select><option>Numeric</option><option>Alphanumeric</option></select>
                </div>
                <div className="settings-form-group">
                    <label>OTP Length</label>
                    <select><option>4 Digits</option><option>6 Digits</option></select>
                </div>
            </div>
            <div className="settings-form-group">
                <label>OTP Expiry (Minutes)</label>
                <input type="number" defaultValue="5" />
            </div>
            <div className="settings-actions">
                <button className="btn-save">Save Changes</button>
            </div>
        </div>
    </>
);

export const GdprCookies = () => (
    <>
        <div className="settings-content-header">
            <h3>GDPR Cookies</h3>
        </div>
        <div className="settings-content-body">
            <div className="security-item">
                <div className="security-item-content">
                    <h4>Enable Cookie Banner</h4>
                    <p>Show cookie consent banner to visitors</p>
                </div>
                <div className="security-item-action">
                    <label className="toggle-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="toggle-slider"></span>
                    </label>
                </div>
            </div>
            <div className="settings-form-group" style={{ marginTop: '20px' }}>
                <label>Banner Message</label>
                <textarea rows="3" defaultValue="We use cookies to enhance your browsing experience."></textarea>
            </div>
            <div className="settings-actions">
                <button className="btn-save">Save Changes</button>
            </div>
        </div>
    </>
);
