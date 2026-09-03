import React, { useState, useEffect } from 'react';
import { X, Edit2, Trash2 } from 'lucide-react';
import { useSettings } from '../../../hooks/useSettings';
import apiClient from '../../../api/config';

export const PaymentGateway = () => {
    const { settings, loading, saving, handleChange, saveSettings } = useSettings();

    if (loading) return <div style={{ padding: '20px' }}>Loading settings...</div>;

    return (
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
                            <input 
                                type="checkbox" 
                                checked={settings.enableStripe !== 'false'}
                                onChange={(e) => handleChange('enableStripe', e.target.checked ? 'true' : 'false')}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>
                </div>
                <div className="settings-form-row mt-3">
                    <div className="settings-form-group">
                        <label>Stripe Public Key</label>
                        <input 
                            type="text" 
                            value={settings.stripePublicKey || ''}
                            onChange={(e) => handleChange('stripePublicKey', e.target.value)}
                        />
                    </div>
                    <div className="settings-form-group">
                        <label>Stripe Secret Key</label>
                        <input 
                            type="password" 
                            value={settings.stripeSecretKey || ''}
                            onChange={(e) => handleChange('stripeSecretKey', e.target.value)}
                        />
                    </div>
                </div>
                
                <div className="security-item mt-4">
                    <div className="security-item-content">
                        <h4>PayPal Integration</h4>
                        <p>Accept payments via PayPal</p>
                    </div>
                    <div className="security-item-action">
                        <label className="toggle-switch">
                            <input 
                                type="checkbox" 
                                checked={settings.enablePayPal === 'true'}
                                onChange={(e) => handleChange('enablePayPal', e.target.checked ? 'true' : 'false')}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>
                </div>
                <div className="settings-actions">
                    <button 
                        className="btn-save"
                        onClick={() => saveSettings(['enableStripe', 'stripePublicKey', 'stripeSecretKey', 'enablePayPal'])}
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </>
    );
};

export const BankAccounts = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        bankName: '',
        accountName: '',
        accountNumber: '',
        branchIfsc: ''
    });

    const fetchAccounts = async () => {
        try {
            setLoading(true);
            const res = await apiClient.get('/bank-accounts');
            setAccounts(res.data);
        } catch (error) {
            console.error("Error fetching bank accounts:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const handleOpenModal = (account = null) => {
        if (account) {
            setEditingId(account.id);
            setFormData({
                bankName: account.bankName || '',
                accountName: account.accountName || '',
                accountNumber: account.accountNumber || '',
                branchIfsc: account.branchIfsc || ''
            });
        } else {
            setEditingId(null);
            setFormData({
                bankName: '',
                accountName: '',
                accountNumber: '',
                branchIfsc: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
    };

    const handleSave = async () => {
        if (!formData.bankName || !formData.accountName || !formData.accountNumber || !formData.branchIfsc) {
            alert('Please fill in all required fields');
            return;
        }
        
        try {
            if (editingId) {
                await apiClient.put(`/bank-accounts/${editingId}`, formData);
            } else {
                await apiClient.post('/bank-accounts', formData);
            }
            handleCloseModal();
            fetchAccounts();
        } catch (error) {
            console.error("Error saving bank account:", error);
            alert('Failed to save bank account');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this bank account?')) {
            try {
                await apiClient.delete(`/bank-accounts/${id}`);
                fetchAccounts();
            } catch (error) {
                console.error("Error deleting bank account:", error);
                alert('Failed to delete bank account');
            }
        }
    };

    return (
    <>
        <div className="settings-content-header d-flex justify-content-between align-items-center">
            <h3>Bank Accounts</h3>
            <button className="btn-action orange" onClick={() => handleOpenModal()}>+ Add Bank</button>
        </div>
        <div className="settings-content-body">
            {loading ? (
                <div style={{ padding: '20px' }}>Loading...</div>
            ) : (
                <table className="table">
                    <thead>
                        <tr>
                            <th>Bank Name</th>
                            <th>Account Name</th>
                            <th>Account Number</th>
                            <th>Branch/IFSC</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {accounts.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center py-4">No bank accounts added yet.</td>
                            </tr>
                        ) : (
                            accounts.map((acc) => (
                                <tr key={acc.id}>
                                    <td>{acc.bankName}</td>
                                    <td>{acc.accountName}</td>
                                    <td>{acc.accountNumber}</td>
                                    <td>{acc.branchIfsc}</td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <button className="btn-action dark" onClick={() => handleOpenModal(acc)}>
                                                <Edit2 size={16} /> Edit
                                            </button>
                                            <button className="btn-action dark text-danger" onClick={() => handleDelete(acc.id)} style={{ color: 'red' }}>
                                                <Trash2 size={16} /> Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            )}
        </div>

        {isModalOpen && (
            <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="modal-content" style={{ backgroundColor: '#fff', borderRadius: '8px', width: '500px', maxWidth: '90%', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    <div className="modal-header d-flex justify-content-between align-items-center" style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>
                        <h4 style={{ margin: 0, fontSize: '1.125rem' }}>{editingId ? 'Edit Bank Account' : 'Add Bank Account'}</h4>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }} onClick={handleCloseModal}>
                            <X size={20} />
                        </button>
                    </div>
                    <div className="modal-body" style={{ padding: '24px' }}>
                        <div className="settings-form-group mb-3">
                            <label>Bank Name <span className="required" style={{color: 'red'}}>*</span></label>
                            <input 
                                type="text" 
                                placeholder="Enter Bank Name" 
                                value={formData.bankName}
                                onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                            />
                        </div>
                        <div className="settings-form-group mb-3">
                            <label>Account Name <span className="required" style={{color: 'red'}}>*</span></label>
                            <input 
                                type="text" 
                                placeholder="Enter Account Name" 
                                value={formData.accountName}
                                onChange={(e) => setFormData({...formData, accountName: e.target.value})}
                            />
                        </div>
                        <div className="settings-form-group mb-3">
                            <label>Account Number <span className="required" style={{color: 'red'}}>*</span></label>
                            <input 
                                type="text" 
                                placeholder="Enter Account Number" 
                                value={formData.accountNumber}
                                onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                            />
                        </div>
                        <div className="settings-form-group mb-3">
                            <label>Branch / IFSC <span className="required" style={{color: 'red'}}>*</span></label>
                            <input 
                                type="text" 
                                placeholder="Enter Branch or IFSC Code" 
                                value={formData.branchIfsc}
                                onChange={(e) => setFormData({...formData, branchIfsc: e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="modal-footer" style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                        <button className="btn-cancel" onClick={handleCloseModal}>Cancel</button>
                        <button className="btn-save" onClick={handleSave}>Save</button>
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
                        <td>₹</td>
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
                            <input type="text" placeholder="e.g. ₹" />
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
