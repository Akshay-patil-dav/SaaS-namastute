import React, { useState } from 'react';
import { X, Loader } from 'lucide-react';
import axios from 'axios';
import './add-sales-modal.css';
import './add-unit-modal.css';

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/units`;

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
                await axios.put(`${API_BASE}/${unitData.id}`, payload);
            } else {
                await axios.post(API_BASE, payload);
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
            <div className="modal-content add-sales-modal add-unit-modal">
                {/* Header */}
                <div className="modal-header">
                    <h4>{isEditMode ? 'Edit Unit' : 'Add Unit'}</h4>
                    <button className="close-btn-red" type="button" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        {error && (
                            <div className="alert alert-danger" style={{ fontSize: '13px', padding: '10px', marginBottom: '15px', borderRadius: '6px' }}>
                                {error}
                            </div>
                        )}
                        
                        <div className="form-group mb-3">
                            <label>Unit Name <span className="required">*</span></label>
                            <input 
                                type="text" 
                                className="form-input" 
                                placeholder="Enter unit name"
                                value={unitName}
                                onChange={(e) => setUnitName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group mb-3">
                            <label>Short Name <span className="required">*</span></label>
                            <input 
                                type="text" 
                                className="form-input" 
                                placeholder="Enter short name"
                                value={shortName}
                                onChange={(e) => setShortName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="status-toggle-container">
                            <label>Status <span className="required">*</span></label>
                            <label className="switch">
                                <input 
                                    type="checkbox" 
                                    checked={status}
                                    onChange={(e) => setStatus(e.target.checked)}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="modal-footer">
                        <button type="button" className="btn-cancel-dark" onClick={onClose} disabled={isSubmitting}>Cancel</button>
                        <button type="submit" className="btn-add-unit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <><Loader size={16} className="spin" style={{marginRight: '8px'}} /> {isEditMode ? 'Updating...' : 'Adding...'}</>
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
