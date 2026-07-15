import React from 'react';
import { useSettings } from '../../../hooks/useSettings';

export const EmailSettings = () => {
    const { settings, loading, saving, handleChange, saveSettings } = useSettings();

    if (loading) return <div style={{ padding: '20px' }}>Loading settings...</div>;

    return (
        <>
            <div className="settings-content-header">
                <h3>Email Settings</h3>
            </div>
            <div className="settings-content-body">
                <div className="settings-form-row">
                    <div className="settings-form-group">
                        <label>Email Provider</label>
                        <select 
                            value={settings.emailProvider || 'SMTP'} 
                            onChange={(e) => handleChange('emailProvider', e.target.value)}
                        >
                            <option value="SMTP">SMTP</option>
                            <option value="Mailgun">Mailgun</option>
                            <option value="SendGrid">SendGrid</option>
                        </select>
                    </div>
                </div>
                <div className="settings-form-row">
                    <div className="settings-form-group">
                        <label>SMTP Host <span className="required">*</span></label>
                        <input 
                            type="text" 
                            value={settings.smtpHost || ''} 
                            onChange={(e) => handleChange('smtpHost', e.target.value)}
                            placeholder="smtp.example.com" 
                        />
                    </div>
                    <div className="settings-form-group">
                        <label>SMTP Port <span className="required">*</span></label>
                        <input 
                            type="text" 
                            value={settings.smtpPort || ''} 
                            onChange={(e) => handleChange('smtpPort', e.target.value)}
                            placeholder="587" 
                        />
                    </div>
                </div>
                <div className="settings-form-row">
                    <div className="settings-form-group">
                        <label>SMTP User <span className="required">*</span></label>
                        <input 
                            type="text" 
                            value={settings.smtpUser || ''} 
                            onChange={(e) => handleChange('smtpUser', e.target.value)}
                            placeholder="user@example.com" 
                        />
                    </div>
                    <div className="settings-form-group">
                        <label>SMTP Password <span className="required">*</span></label>
                        <input 
                            type="password" 
                            value={settings.smtpPassword || ''} 
                            onChange={(e) => handleChange('smtpPassword', e.target.value)}
                        />
                    </div>
                </div>
                <div className="settings-actions">
                    <button 
                        className="btn-save" 
                        onClick={() => saveSettings(['emailProvider', 'smtpHost', 'smtpPort', 'smtpUser', 'smtpPassword'])}
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </>
    );
};

export const EmailTemplate = () => {
    const { settings, loading, saving, handleChange, saveSettings } = useSettings();

    if (loading) return <div style={{ padding: '20px' }}>Loading settings...</div>;

    return (
        <>
            <div className="settings-content-header">
                <h3>Email Templates</h3>
            </div>
            <div className="settings-content-body">
                <div className="settings-form-group">
                    <label>Select Template to Edit</label>
                    <select
                        value={settings.selectedEmailTemplate || 'Welcome Email'}
                        onChange={(e) => handleChange('selectedEmailTemplate', e.target.value)}
                    >
                        <option value="Welcome Email">Welcome Email</option>
                        <option value="Order Confirmation">Order Confirmation</option>
                        <option value="Password Reset">Password Reset</option>
                    </select>
                </div>
                <div className="settings-form-group">
                    <label>Email Subject</label>
                    <input 
                        type="text" 
                        value={settings.emailTemplateSubject || ''} 
                        onChange={(e) => handleChange('emailTemplateSubject', e.target.value)}
                        placeholder="Welcome to our platform!" 
                    />
                </div>
                <div className="settings-form-group">
                    <label>Email Body</label>
                    <textarea 
                        rows="6" 
                        value={settings.emailTemplateBody || ''} 
                        onChange={(e) => handleChange('emailTemplateBody', e.target.value)}
                        placeholder="Hello {name}, Welcome to our system..."
                    ></textarea>
                </div>
                <div className="settings-actions">
                    <button 
                        className="btn-save"
                        onClick={() => saveSettings(['selectedEmailTemplate', 'emailTemplateSubject', 'emailTemplateBody'])}
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </>
    );
};

export const SmsSettings = () => {
    const { settings, loading, saving, handleChange, saveSettings } = useSettings();

    if (loading) return <div style={{ padding: '20px' }}>Loading settings...</div>;

    return (
        <>
            <div className="settings-content-header">
                <h3>SMS Settings</h3>
            </div>
            <div className="settings-content-body">
                <div className="settings-form-row">
                    <div className="settings-form-group">
                        <label>SMS Provider</label>
                        <select
                            value={settings.smsProvider || 'Twilio'}
                            onChange={(e) => handleChange('smsProvider', e.target.value)}
                        >
                            <option value="Twilio">Twilio</option>
                            <option value="Nexmo">Nexmo</option>
                        </select>
                    </div>
                </div>
                <div className="settings-form-row">
                    <div className="settings-form-group">
                        <label>Account SID / Key</label>
                        <input 
                            type="text" 
                            value={settings.smsAccountSid || ''}
                            onChange={(e) => handleChange('smsAccountSid', e.target.value)}
                        />
                    </div>
                    <div className="settings-form-group">
                        <label>Auth Token / Secret</label>
                        <input 
                            type="password" 
                            value={settings.smsAuthToken || ''}
                            onChange={(e) => handleChange('smsAuthToken', e.target.value)}
                        />
                    </div>
                </div>
                <div className="settings-form-group">
                    <label>Sender Number</label>
                    <input 
                        type="text" 
                        value={settings.smsSenderNumber || ''}
                        onChange={(e) => handleChange('smsSenderNumber', e.target.value)}
                    />
                </div>
                <div className="settings-actions">
                    <button 
                        className="btn-save"
                        onClick={() => saveSettings(['smsProvider', 'smsAccountSid', 'smsAuthToken', 'smsSenderNumber'])}
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </>
    );
};

export const SmsTemplate = () => {
    const { settings, loading, saving, handleChange, saveSettings } = useSettings();

    if (loading) return <div style={{ padding: '20px' }}>Loading settings...</div>;

    return (
        <>
            <div className="settings-content-header">
                <h3>SMS Templates</h3>
            </div>
            <div className="settings-content-body">
                <div className="settings-form-group">
                    <label>Select Template</label>
                    <select
                        value={settings.selectedSmsTemplate || 'OTP Verification'}
                        onChange={(e) => handleChange('selectedSmsTemplate', e.target.value)}
                    >
                        <option value="OTP Verification">OTP Verification</option>
                        <option value="Order Shipped">Order Shipped</option>
                    </select>
                </div>
                <div className="settings-form-group">
                    <label>Message Content</label>
                    <textarea 
                        rows="3" 
                        value={settings.smsTemplateContent || ''}
                        onChange={(e) => handleChange('smsTemplateContent', e.target.value)}
                        placeholder="Your OTP is {otp}. Valid for 5 mins."
                    ></textarea>
                </div>
                <div className="settings-actions">
                    <button 
                        className="btn-save"
                        onClick={() => saveSettings(['selectedSmsTemplate', 'smsTemplateContent'])}
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </>
    );
};

export const OtpSettings = () => {
    const { settings, loading, saving, handleChange, saveSettings } = useSettings();

    if (loading) return <div style={{ padding: '20px' }}>Loading settings...</div>;

    return (
        <>
            <div className="settings-content-header">
                <h3>OTP Settings</h3>
            </div>
            <div className="settings-content-body">
                <div className="settings-form-row">
                    <div className="settings-form-group">
                        <label>OTP Type</label>
                        <select
                            value={settings.otpType || 'Numeric'}
                            onChange={(e) => handleChange('otpType', e.target.value)}
                        >
                            <option value="Numeric">Numeric</option>
                            <option value="Alphanumeric">Alphanumeric</option>
                        </select>
                    </div>
                    <div className="settings-form-group">
                        <label>OTP Length</label>
                        <select
                            value={settings.otpLength || '4 Digits'}
                            onChange={(e) => handleChange('otpLength', e.target.value)}
                        >
                            <option value="4 Digits">4 Digits</option>
                            <option value="6 Digits">6 Digits</option>
                        </select>
                    </div>
                </div>
                <div className="settings-form-group">
                    <label>OTP Expiry (Minutes)</label>
                    <input 
                        type="number" 
                        value={settings.otpExpiry || '5'}
                        onChange={(e) => handleChange('otpExpiry', e.target.value)}
                    />
                </div>
                <div className="settings-actions">
                    <button 
                        className="btn-save"
                        onClick={() => saveSettings(['otpType', 'otpLength', 'otpExpiry'])}
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </>
    );
};

export const GdprCookies = () => {
    const { settings, loading, saving, handleChange, saveSettings } = useSettings();

    if (loading) return <div style={{ padding: '20px' }}>Loading settings...</div>;

    return (
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
                            <input 
                                type="checkbox" 
                                checked={settings.enableCookieBanner === 'true'}
                                onChange={(e) => handleChange('enableCookieBanner', e.target.checked ? 'true' : 'false')}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>
                </div>
                <div className="settings-form-group" style={{ marginTop: '20px' }}>
                    <label>Banner Message</label>
                    <textarea 
                        rows="3" 
                        value={settings.cookieBannerMessage || ''}
                        onChange={(e) => handleChange('cookieBannerMessage', e.target.value)}
                        placeholder="We use cookies to enhance your browsing experience."
                    ></textarea>
                </div>
                <div className="settings-actions">
                    <button 
                        className="btn-save"
                        onClick={() => saveSettings(['enableCookieBanner', 'cookieBannerMessage'])}
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </>
    );
};
