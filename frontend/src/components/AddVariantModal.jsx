import React, { useState, useEffect } from 'react';
import { X, Loader, Plus, AlertCircle } from 'lucide-react';
import './add-variant-modal.css';

const AddVariantModal = ({ isOpen, onClose, onVariantSaved, variantData }) => {
    const [variantName, setVariantName] = useState('');
    const [variantValues, setVariantValues] = useState('');
    const [status, setStatus] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const isEditMode = !!variantData;

    useEffect(() => {
        if (isOpen) {
            if (variantData) {
                setVariantName(variantData.variant || '');
                setVariantValues(variantData.values || '');
                setStatus(variantData.status !== 'Inactive');
            } else {
                setVariantName('');
                setVariantValues('');
                setStatus(true);
            }
            setError(null);
        }
    }, [variantData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        
        if (!variantName.trim()) {
            setError('Variant name is required');
            return;
        }
        if (!variantValues.trim()) {
            setError('At least one value is required');
            return;
        }

        setIsSubmitting(true);
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 800));
            
            const payload = {
                id: variantData?.id || Date.now(),
                variant: variantName,
                values: variantValues,
                status: status ? 'Active' : 'Inactive',
                date: variantData?.date || new Date().toLocaleDateString('en-GB')
            };

            if (onVariantSaved) onVariantSaved(payload);
            onClose();
        } catch (err) {
            setError('Failed to save variant attribute');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content add-variant-modal">
                {/* Header */}
                <div className="modal-header">
                    <div className="header-title-wrap">
                        <div className="header-icon">
                            <Plus size={20} />
                        </div>
                        <h4>{isEditMode ? 'Edit Variant' : 'Add Variant'}</h4>
                    </div>
                    <button className="close-btn" onClick={onClose}>
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
                        
                        <div className="form-group custom-margin">
                            <label>Variant Name <span className="required">*</span></label>
                            <input 
                                type="text" 
                                className="form-input-custom" 
                                placeholder="e.g. Color, Size"
                                value={variantName}
                                onChange={(e) => setVariantName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group custom-margin">
                            <label>Variant Values <span className="required">*</span></label>
                            <textarea 
                                className="form-textarea-custom" 
                                placeholder="Enter values separated by commas (e.g. Red, Blue, Green)"
                                value={variantValues}
                                onChange={(e) => setVariantValues(e.target.value)}
                                required
                                rows="3"
                            />
                            <p className="input-help-text">Separate each value with a comma</p>
                        </div>

                        <div className="status-toggle-row">
                            <div className="status-label">
                                <strong>Status</strong>
                                <span>Active variants will be available for products</span>
                            </div>
                            <label className="switch-custom">
                                <input 
                                    type="checkbox" 
                                    checked={status}
                                    onChange={(e) => setStatus(e.target.checked)}
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
                                <><Loader size={16} className="spin mr-2" /> Saving...</>
                            ) : (
                                isEditMode ? 'Update Variant' : 'Save Variant'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddVariantModal;
