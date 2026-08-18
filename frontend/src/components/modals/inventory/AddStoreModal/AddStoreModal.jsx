import React, { useState, useEffect } from 'react';
import { X, Plus, Loader, AlertCircle } from 'lucide-react';
import apiClient, { ENV } from '@/api/config';
import '../AddBrandModal/add-brand-modal.css';

const API_BASE = `${ENV.API_BASE_URL}/stores`;

const AddStoreModal = ({ isOpen, onClose, onStoreAdded, storeData }) => {
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        status: true
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const isEditMode = !!storeData;

    useEffect(() => {
        if (isOpen) {
            if (storeData) {
                setFormData({
                    name: storeData.name || '',
                    location: storeData.location || '',
                    status: storeData.status !== false,
                });
            } else {
                setFormData({
                    name: '',
                    location: '',
                    status: true
                });
            }
            setError(null);
        }
    }, [storeData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        
        try {
            const payload = {
                name: formData.name,
                location: formData.location,
                status: formData.status
            };

            if (isEditMode) {
                await apiClient.put(`${API_BASE}/${storeData.id}`, payload);
            } else {
                await apiClient.post(API_BASE, payload);
            }
            
            if (onStoreAdded) onStoreAdded();
            onClose();
        } catch (err) {
            setError(err.response?.data?.error || err.message || 'Failed to save store');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content add-brand-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="header-title-wrap">
                        <div className="header-icon">
                            <Plus size={20} />
                        </div>
                        <h4>{isEditMode ? 'Edit Store' : 'Add Store'}</h4>
                    </div>
                    <button className="close-btn" onClick={onClose} type="button">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        {error && (
                            <div className="alert-error-custom">
                                <AlertCircle size={18} />
                                {error}
                            </div>
                        )}
                        
                        <div className="form-grid">
                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label>Store Name <span className="required">*</span></label>
                                <input 
                                    type="text" 
                                    name="name"
                                    className="form-input-custom" 
                                    placeholder="e.g. Main Branch"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label>Location</label>
                                <textarea 
                                    name="location"
                                    className="form-textarea-custom" 
                                    placeholder="Store Address or Location Details..."
                                    value={formData.location}
                                    onChange={handleChange}
                                    rows="2"
                                />
                            </div>
                        </div>

                        <div className="status-toggle-row mt-4">
                            <div className="status-label">
                                <strong>Status</strong>
                                <span>Make this store active or inactive</span>
                            </div>
                            <label className="switch-custom">
                                <input 
                                    type="checkbox" 
                                    name="status"
                                    checked={formData.status}
                                    onChange={handleChange}
                                />
                                <span className="slider-custom"></span>
                            </label>
                        </div>
                    </div>

                    <div className="modal-footer-custom">
                        <button type="button" className="btn-cancel-custom" onClick={onClose} disabled={isSubmitting}>Cancel</button>
                        <button type="submit" className="btn-submit-custom" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <><Loader size={16} className="spin" style={{ marginRight: '8px' }} /> Saving...</>
                            ) : (
                                isEditMode ? 'Update Store' : 'Save Store'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddStoreModal;
