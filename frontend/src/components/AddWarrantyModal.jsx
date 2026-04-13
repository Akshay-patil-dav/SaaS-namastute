import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Loader, AlertCircle } from 'lucide-react';
import axios from 'axios';
import './add-warranty-modal.css';

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/warranties`;

const AddWarrantyModal = ({ isOpen, onClose, onWarrantyAdded, warrantyData }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        durationValue: '',
        durationType: 'Month',
        status: true
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const isEditMode = !!warrantyData;

    useEffect(() => {
        if (isOpen) {
            if (warrantyData) {
                // Parse duration "6 Month" into value and type
                const durationParts = (warrantyData.duration || '').split(' ');
                setFormData({
                    name: warrantyData.name || '',
                    description: warrantyData.description || warrantyData.desc || '',
                    durationValue: durationParts[0] || '',
                    durationType: durationParts[1] || 'Month',
                    status: warrantyData.status === 'Active' || warrantyData.status === true
                });
            } else {
                setFormData({
                    name: '',
                    description: '',
                    durationValue: '',
                    durationType: 'Month',
                    status: true
                });
            }
            setError(null);
        }
    }, [warrantyData, isOpen]);

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
        
        if (!formData.durationValue || formData.durationValue <= 0) {
            setError('Please enter a valid duration value');
            return;
        }

        setIsSubmitting(true);
        
        try {
            const payload = {
                name: formData.name,
                description: formData.description,
                duration: `${formData.durationValue} ${formData.durationType}`,
                status: formData.status
            };

            if (isEditMode) {
                await axios.put(`${API_BASE}/${warrantyData.id}`, payload);
            } else {
                await axios.post(API_BASE, payload);
            }

            if (onWarrantyAdded) onWarrantyAdded();
            onClose();
        } catch (err) {
            console.error('Warranty API error:', err);
            let msg = 'Failed to save warranty';
            if (err.response) {
                msg = err.response.data?.error || err.response.data?.message || msg;
            } else if (err.request) {
                msg = 'Network Error: Backend is unreachable or request was blocked. Please ensure backend is running and you have restarted it.';
            }
            setError(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content add-warranty-modal">
                {/* Header */}
                <div className="modal-header">
                    <div className="header-title-wrap">
                        <div className="header-icon">
                            <ShieldCheck size={20} />
                        </div>
                        <h4>{isEditMode ? 'Edit Warranty' : 'Add Warranty'}</h4>
                    </div>
                    <button className="close-btn" onClick={onClose} type="button">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        {error && (
                            <div className="alert-error-custom">
                                <AlertCircle size={18} />
                                {error}
                            </div>
                        )}

                        <div className="form-grid">
                            <div className="form-group full-width">
                                <label>Warranty Name <span className="required">*</span></label>
                                <input 
                                    type="text" 
                                    name="name"
                                    className="form-input-custom" 
                                    placeholder="e.g. Standard Warranty, Premium Support"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Duration Value <span className="required">*</span></label>
                                <input 
                                    type="number" 
                                    name="durationValue"
                                    className="form-input-custom" 
                                    placeholder="e.g. 6, 1, 365"
                                    value={formData.durationValue}
                                    onChange={handleChange}
                                    required
                                    min="1"
                                />
                            </div>

                            <div className="form-group">
                                <label>Duration Type <span className="required">*</span></label>
                                <select 
                                    name="durationType"
                                    className="form-input-custom"
                                    value={formData.durationType}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="Day">Day(s)</option>
                                    <option value="Month">Month(s)</option>
                                    <option value="Year">Year(s)</option>
                                </select>
                            </div>

                            <div className="form-group full-width">
                                <label>Description</label>
                                <textarea 
                                    name="description"
                                    className="form-textarea-custom" 
                                    placeholder="Brief details about the warranty coverage..."
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="status-toggle-row">
                            <div className="status-label">
                                <strong>Status</strong>
                                <span>Activate this warranty for products</span>
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

                    {/* Footer Actions */}
                    <div className="modal-footer-custom">
                        <button type="button" className="btn-cancel-custom" onClick={onClose} disabled={isSubmitting}>Cancel</button>
                        <button type="submit" className="btn-submit-custom" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <><Loader size={16} className="spin" style={{ marginRight: '8px' }} /> Saving...</>
                            ) : (
                                isEditMode ? 'Update Warranty' : 'Save Warranty'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddWarrantyModal;
