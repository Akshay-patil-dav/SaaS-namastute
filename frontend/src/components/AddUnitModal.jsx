import React, { useState } from 'react';
import { X, Loader, Ruler, AlertCircle } from 'lucide-react';
import apiClient, { API, ENV } from '@/api/config';
import './modal-common.css';
import './add-unit-modal.css';

const API_BASE = `${ENV.API_BASE_URL}/units`;

const AddUnitModal = ({ isOpen, onClose, onUnitAdded, unitData }) => {
    const [unitName, setUnitName] = useState('');
    const [shortName, setShortName] = useState('');
    const [status, setStatus] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const isEditMode = !!unitData;

    React.useEffect(() => {
        if (unitData) {
            setUnitName(unitData.name || '');
            setShortName(unitData.shortName || '');
            setStatus(unitData.status !== false);
        } else {
            setUnitName('');
            setShortName('');
            setStatus(true);
        }
        setError(null);
    }, [unitData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        
        try {
            const payload = {
                name: unitName,
                shortName: shortName,
                status: status
            };

            if (isEditMode) {
                await apiClient.put(`${API_BASE}/${unitData.id}`, payload);
            } else {
                await apiClient.post(API_BASE, payload);
            }
            
            if (onUnitAdded) onUnitAdded();
            onClose();
        } catch (err) {
            console.error('Unit error:', err);
            const msg = err.response?.data?.error || err.response?.data?.message || 'Failed to save unit';
            setError(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content add-unit-modal">
                {/* Header */}
                <div className="modal-header">
                    <div className="header-title-wrap">
                        <div className="header-icon">
                            <Ruler size={18} />
                        </div>
                        <div>
                            <h4>{isEditMode ? 'Edit Unit' : 'Add Unit'}</h4>
                            <span className="modal-subtitle">
                                {isEditMode ? 'Update measurement unit' : 'Add a new measurement unit'}
                            </span>
                        </div>
                    </div>
                    <button className="close-btn" type="button" onClick={onClose} title="Close">
                        <X size={16} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        {error && (
                            <div className="alert-error-custom">
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}
                        
                        <div className="form-grid form-grid-1">
                            <div className="form-group">
                                <label>Unit Name <span className="required">*</span></label>
                                <input 
                                    type="text" 
                                    className="form-input-custom"
                                    placeholder="e.g. Kilogram, Litre, Piece"
                                    value={unitName}
                                    onChange={(e) => setUnitName(e.target.value)}
                                    required
                                    autoFocus
                                />
                            </div>

                            <div className="form-group">
                                <label>Short Name <span className="required">*</span></label>
                                <input 
                                    type="text" 
                                    className="form-input-custom"
                                    placeholder="e.g. kg, L, pcs"
                                    value={shortName}
                                    onChange={(e) => setShortName(e.target.value)}
                                    required
                                />
                                <p className="input-help-text">Abbreviated label shown on invoices and POS.</p>
                            </div>
                        </div>

                        <div className="status-toggle-row">
                            <div className="status-label">
                                <strong>Status</strong>
                                <span>Active units can be assigned to products</span>
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
                        <button type="button" className="btn-cancel-custom" onClick={onClose} disabled={isSubmitting}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-submit-custom" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <><Loader size={15} className="spin" /> {isEditMode ? 'Updating...' : 'Adding...'}</>
                            ) : (
                                isEditMode ? 'Update Unit' : 'Add Unit'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUnitModal;
