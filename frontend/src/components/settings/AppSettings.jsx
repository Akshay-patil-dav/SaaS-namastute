import React, { useState } from 'react';
import { X } from 'lucide-react';

export const InvoiceSettings = () => (
    <>
        <div className="settings-content-header">
            <h3>Invoice Settings</h3>
        </div>
        <div className="settings-content-body">
            <div className="profile-upload-section">
                <div className="profile-upload-box">
                    <span>Add Invoice Logo</span>
                </div>
                <div className="profile-upload-actions">
                    <button className="btn-upload">Upload Logo</button>
                    <p>Recommended size: 150x50px</p>
                </div>
            </div>
            <div className="settings-form-row">
                <div className="settings-form-group">
                    <label>Invoice Prefix</label>
                    <input type="text" defaultValue="INV-" />
                </div>
                <div className="settings-form-group">
                    <label>Invoice Due</label>
                    <select><option>Due on Receipt</option><option>15 Days</option><option>30 Days</option></select>
                </div>
            </div>
            <div className="settings-form-group">
                <label>Invoice Notes</label>
                <textarea rows="3" defaultValue="Thank you for your business."></textarea>
            </div>
            <div className="settings-actions">
                <button className="btn-save">Save Changes</button>
            </div>
        </div>
    </>
);

export const InvoiceTemplate = () => (
    <>
        <div className="settings-content-header">
            <h3>Invoice Template</h3>
        </div>
        <div className="settings-content-body">
            <div className="settings-form-group">
                <label>Select Template</label>
                <select><option>Classic</option><option>Modern</option><option>Professional</option></select>
            </div>
            <div className="settings-actions">
                <button className="btn-save">Save Changes</button>
            </div>
        </div>
    </>
);

export const Printer = () => (
    <>
        <div className="settings-content-header">
            <h3>Printer Settings</h3>
        </div>
        <div className="settings-content-body">
            <div className="settings-form-row">
                <div className="settings-form-group">
                    <label>Printer Name <span className="required">*</span></label>
                    <input type="text" defaultValue="Receipt Printer 1" />
                </div>
                <div className="settings-form-group">
                    <label>Connection Type <span className="required">*</span></label>
                    <select><option>Network</option><option>USB</option><option>Bluetooth</option></select>
                </div>
            </div>
            <div className="settings-form-row">
                <div className="settings-form-group">
                    <label>IP Address</label>
                    <input type="text" defaultValue="192.168.1.100" />
                </div>
                <div className="settings-form-group">
                    <label>Port</label>
                    <input type="text" defaultValue="9100" />
                </div>
            </div>
            <div className="settings-actions">
                <button className="btn-save">Save Changes</button>
            </div>
        </div>
    </>
);

export const PosSettings = () => (
    <>
        <div className="settings-content-header">
            <h3>POS Settings</h3>
        </div>
        <div className="settings-content-body">
            <div className="settings-form-row">
                <div className="settings-form-group">
                    <label>Default Customer</label>
                    <select><option>Walk-in Customer</option></select>
                </div>
                <div className="settings-form-group">
                    <label>Default Biller</label>
                    <select><option>Admin</option></select>
                </div>
            </div>
            <div className="security-item">
                <div className="security-item-content">
                    <h4>Display Keyboard</h4>
                    <p>Show virtual keyboard in POS screen</p>
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

export const CustomFields = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
    <>
        <div className="settings-content-header d-flex justify-content-between align-items-center">
            <h3>Custom Fields</h3>
            <button className="btn-action orange" onClick={() => setIsModalOpen(true)}>+ Add New</button>
        </div>
        <div className="settings-content-body">
            <table className="table">
                <thead>
                    <tr>
                        <th>Field Name</th>
                        <th>Type</th>
                        <th>Module</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Tax ID</td>
                        <td>Text</td>
                        <td>Customer</td>
                        <td><button className="btn-action dark">Edit</button></td>
                    </tr>
                </tbody>
            </table>
        </div>

        {isModalOpen && (
            <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="modal-content" style={{ backgroundColor: '#fff', borderRadius: '8px', width: '500px', maxWidth: '90%', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    <div className="modal-header d-flex justify-content-between align-items-center" style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>
                        <h4 style={{ margin: 0, fontSize: '1.125rem' }}>Add Custom Field</h4>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }} onClick={() => setIsModalOpen(false)}>
                            <X size={20} />
                        </button>
                    </div>
                    <div className="modal-body" style={{ padding: '24px' }}>
                        <div className="settings-form-group mb-3">
                            <label>Custom Field For <span className="required" style={{color: 'red'}}>*</span></label>
                            <select>
                                <option>Select Module</option>
                                <option>Customer</option>
                                <option>Product</option>
                                <option>Sale</option>
                            </select>
                        </div>
                        <div className="settings-form-group mb-3">
                            <label>Field Name <span className="required" style={{color: 'red'}}>*</span></label>
                            <input type="text" placeholder="Enter Field Name" />
                        </div>
                        <div className="settings-form-group mb-3">
                            <label>Field Type <span className="required" style={{color: 'red'}}>*</span></label>
                            <select>
                                <option>Text</option>
                                <option>Number</option>
                                <option>Date</option>
                            </select>
                        </div>
                        <div className="settings-form-group mb-3">
                            <label>Default Value</label>
                            <input type="text" />
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
