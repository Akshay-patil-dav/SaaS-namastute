import React, { useState } from 'react';
import { X } from 'lucide-react';

export const PaymentGateway = () => (
    <>
        <div className="settings-content-header">
            <h3>Payment Gateway</h3>
        </div>
        <div className="settings-content-body">
            <div className="security-item">
                <div className="security-item-content">
                    <h4>Stripe Integration</h4>
                    <p>Accept credit card payments via Stripe</p>
                </div>
                <div className="security-item-action">
                    <label className="toggle-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="toggle-slider"></span>
                    </label>
                </div>
            </div>
            <div className="settings-form-row mt-3">
                <div className="settings-form-group">
                    <label>Stripe Public Key</label>
                    <input type="text" />
                </div>
                <div className="settings-form-group">
                    <label>Stripe Secret Key</label>
                    <input type="password" />
                </div>
            </div>
            
            <div className="security-item mt-4">
                <div className="security-item-content">
                    <h4>PayPal Integration</h4>
                    <p>Accept payments via PayPal</p>
                </div>
                <div className="security-item-action">
                    <label className="toggle-switch">
                        <input type="checkbox" />
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

export const BankAccounts = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
    <>
        <div className="settings-content-header d-flex justify-content-between align-items-center">
            <h3>Bank Accounts</h3>
            <button className="btn-action orange" onClick={() => setIsModalOpen(true)}>+ Add Bank</button>
        </div>
        <div className="settings-content-body">
            <table className="table">
                <thead>
                    <tr>
                        <th>Bank Name</th>
                        <th>Account Name</th>
                        <th>Account Number</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Chase Bank</td>
                        <td>Company Main</td>
                        <td>**** 1234</td>
                        <td><button className="btn-action dark">Edit</button></td>
                    </tr>
                </tbody>
            </table>
        </div>

        {isModalOpen && (
            <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="modal-content" style={{ backgroundColor: '#fff', borderRadius: '8px', width: '500px', maxWidth: '90%', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    <div className="modal-header d-flex justify-content-between align-items-center" style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>
                        <h4 style={{ margin: 0, fontSize: '1.125rem' }}>Add Bank Account</h4>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }} onClick={() => setIsModalOpen(false)}>
                            <X size={20} />
                        </button>
                    </div>
                    <div className="modal-body" style={{ padding: '24px' }}>
                        <div className="settings-form-group mb-3">
                            <label>Bank Name <span className="required" style={{color: 'red'}}>*</span></label>
                            <input type="text" placeholder="Enter Bank Name" />
                        </div>
                        <div className="settings-form-group mb-3">
                            <label>Account Name <span className="required" style={{color: 'red'}}>*</span></label>
                            <input type="text" placeholder="Enter Account Name" />
                        </div>
                        <div className="settings-form-group mb-3">
                            <label>Account Number <span className="required" style={{color: 'red'}}>*</span></label>
                            <input type="text" placeholder="Enter Account Number" />
                        </div>
                        <div className="settings-form-group mb-3">
                            <label>Branch / IFSC <span className="required" style={{color: 'red'}}>*</span></label>
                            <input type="text" placeholder="Enter Branch or IFSC Code" />
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

export const TaxRates = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
    <>
        <div className="settings-content-header d-flex justify-content-between align-items-center">
            <h3>Tax Rates</h3>
            <button className="btn-action orange" onClick={() => setIsModalOpen(true)}>+ Add Tax</button>
        </div>
        <div className="settings-content-body">
            <table className="table">
                <thead>
                    <tr>
                        <th>Tax Name</th>
                        <th>Tax Rate (%)</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>VAT</td>
                        <td>5.00</td>
                        <td><span className="badge bg-success text-white px-2 py-1 rounded">Active</span></td>
                        <td><button className="btn-action dark">Edit</button></td>
                    </tr>
                </tbody>
            </table>
        </div>

        {isModalOpen && (
            <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="modal-content" style={{ backgroundColor: '#fff', borderRadius: '8px', width: '500px', maxWidth: '90%', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    <div className="modal-header d-flex justify-content-between align-items-center" style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>
                        <h4 style={{ margin: 0, fontSize: '1.125rem' }}>Add Tax Rate</h4>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }} onClick={() => setIsModalOpen(false)}>
                            <X size={20} />
                        </button>
                    </div>
                    <div className="modal-body" style={{ padding: '24px' }}>
                        <div className="settings-form-group mb-3">
                            <label>Tax Name <span className="required" style={{color: 'red'}}>*</span></label>
                            <input type="text" placeholder="e.g. VAT or GST" />
                        </div>
                        <div className="settings-form-group mb-3">
                            <label>Tax Rate (%) <span className="required" style={{color: 'red'}}>*</span></label>
                            <input type="number" placeholder="Enter Tax Rate" step="0.01" />
                        </div>
                        <div className="security-item">
                            <div className="security-item-content">
                                <h4>Status</h4>
                                <p>Enable or disable this tax rate</p>
                            </div>
                            <div className="security-item-action">
                                <label className="toggle-switch">
                                    <input type="checkbox" defaultChecked />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
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

export const Currencies = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
    <>
        <div className="settings-content-header d-flex justify-content-between align-items-center">
            <h3>Currencies</h3>
            <button className="btn-action orange" onClick={() => setIsModalOpen(true)}>+ Add Currency</button>
        </div>
        <div className="settings-content-body">
            <table className="table">
                <thead>
                    <tr>
                        <th>Currency Name</th>
                        <th>Code</th>
                        <th>Symbol</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>US Dollar</td>
                        <td>USD</td>
                        <td>$</td>
                        <td><button className="btn-action dark">Edit</button></td>
                    </tr>
                    <tr>
                        <td>Euro</td>
                        <td>EUR</td>
                        <td>€</td>
                        <td><button className="btn-action dark">Edit</button></td>
                    </tr>
                </tbody>
            </table>
        </div>

        {isModalOpen && (
            <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="modal-content" style={{ backgroundColor: '#fff', borderRadius: '8px', width: '500px', maxWidth: '90%', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    <div className="modal-header d-flex justify-content-between align-items-center" style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>
                        <h4 style={{ margin: 0, fontSize: '1.125rem' }}>Add Currency</h4>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }} onClick={() => setIsModalOpen(false)}>
                            <X size={20} />
                        </button>
                    </div>
                    <div className="modal-body" style={{ padding: '24px' }}>
                        <div className="settings-form-group mb-3">
                            <label>Currency Name <span className="required" style={{color: 'red'}}>*</span></label>
                            <input type="text" placeholder="e.g. US Dollar" />
                        </div>
                        <div className="settings-form-group mb-3">
                            <label>Currency Code <span className="required" style={{color: 'red'}}>*</span></label>
                            <input type="text" placeholder="e.g. USD" />
                        </div>
                        <div className="settings-form-group mb-3">
                            <label>Currency Symbol <span className="required" style={{color: 'red'}}>*</span></label>
                            <input type="text" placeholder="e.g. $" />
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
