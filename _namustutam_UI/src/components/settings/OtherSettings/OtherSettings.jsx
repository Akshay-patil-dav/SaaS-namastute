import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useSettings } from '../../../hooks/useSettings';

export const Storage = () => {
    const { settings, loading, saving, handleChange, saveSettings } = useSettings();

    if (loading) return <div style={{ padding: '20px' }}>Loading settings...</div>;

    return (
        <>
            <div className="settings-content-header">
                <h3>Storage Settings</h3>
            </div>
            <div className="settings-content-body">
                <div className="settings-form-group">
                    <label>Default Storage Provider</label>
                    <select
                        value={settings.storageProvider || 'Local Storage'}
                        onChange={(e) => handleChange('storageProvider', e.target.value)}
                    >
                        <option value="Local Storage">Local Storage</option>
                        <option value="AWS S3">AWS S3</option>
                    </select>
                </div>
                <div className="settings-form-row">
                    <div className="settings-form-group">
                        <label>AWS Access Key</label>
                        <input 
                            type="text" 
                            value={settings.awsAccessKey || ''}
                            onChange={(e) => handleChange('awsAccessKey', e.target.value)}
                        />
                    </div>
                    <div className="settings-form-group">
                        <label>AWS Secret Key</label>
                        <input 
                            type="password" 
                            value={settings.awsSecretKey || ''}
                            onChange={(e) => handleChange('awsSecretKey', e.target.value)}
                        />
                    </div>
                </div>
                <div className="settings-form-row">
                    <div className="settings-form-group">
                        <label>AWS Region</label>
                        <input 
                            type="text" 
                            value={settings.awsRegion || 'us-east-1'}
                            onChange={(e) => handleChange('awsRegion', e.target.value)}
                        />
                    </div>
                    <div className="settings-form-group">
                        <label>AWS Bucket Name</label>
                        <input 
                            type="text" 
                            value={settings.awsBucketName || ''}
                            onChange={(e) => handleChange('awsBucketName', e.target.value)}
                        />
                    </div>
                </div>
                <div className="settings-actions">
                    <button 
                        className="btn-save"
                        onClick={() => saveSettings(['storageProvider', 'awsAccessKey', 'awsSecretKey', 'awsRegion', 'awsBucketName'])}
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </>
    );
};

export const BanIp = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
    <>
        <div className="settings-content-header d-flex justify-content-between align-items-center">
            <h3>Ban IP Address</h3>
            <button className="btn-action orange" onClick={() => setIsModalOpen(true)}>+ Add IP</button>
        </div>
        <div className="settings-content-body">
            <table className="table">
                <thead>
                    <tr>
                        <th>IP Address</th>
                        <th>Reason</th>
                        <th>Date Banned</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>192.168.0.100</td>
                        <td>Suspicious Activity</td>
                        <td>01 Jan 2026</td>
                        <td><button className="btn-action red">Remove</button></td>
                    </tr>
                </tbody>
            </table>
        </div>

        {isModalOpen && (
            <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="modal-content" style={{ backgroundColor: '#fff', borderRadius: '8px', width: '500px', maxWidth: '90%', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    <div className="modal-header d-flex justify-content-between align-items-center" style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>
                        <h4 style={{ margin: 0, fontSize: '1.125rem' }}>Add IP Address</h4>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }} onClick={() => setIsModalOpen(false)}>
                            <X size={20} />
                        </button>
                    </div>
                    <div className="modal-body" style={{ padding: '24px' }}>
                        <div className="settings-form-group mb-3">
                            <label>IP Address <span className="required" style={{color: 'red'}}>*</span></label>
                            <input type="text" placeholder="e.g. 192.168.1.1" />
                        </div>
                        <div className="settings-form-group mb-3">
                            <label>Reason for Ban</label>
                            <textarea rows="3" placeholder="Enter reason..."></textarea>
                        </div>
                    </div>
                    <div className="modal-footer" style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                        <button className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                        <button className="btn-save" onClick={() => setIsModalOpen(false)}>Save</button>
                    </div>
                </div>
            </div>
        )}
    </>
    );
};
