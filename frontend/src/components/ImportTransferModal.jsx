import React, { useState } from 'react';
import { X, UploadCloud } from 'lucide-react';
import './import-transfer-modal.css';

const ImportTransferModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        from: '',
        to: '',
        status: '',
        shipping: '',
        description: ''
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSave = async () => {
        if (!formData.from || !formData.to || !formData.status || !formData.shipping) {
            alert('Please fill all required fields (*).');
            return;
        }
        
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            onClose();
        }, 1000);
    };

    return (
        <div className="import-modal-overlay">
            <div className="import-modal-content">
                {/* Modal Header */}
                <div className="import-modal-header">
                    <h3>Import Transfer</h3>
                    <button className="import-modal-close" onClick={onClose}>
                        <X size={16} strokeWidth={3} />
                    </button>
                </div>

                <div className="import-modal-body">
                    {/* Top Selects */}
                    <div className="import-form-grid-3">
                        <div className="import-form-group">
                            <label>From <span className="text-danger">*</span></label>
                            <select 
                                className="import-modal-select"
                                value={formData.from}
                                onChange={(e) => setFormData({...formData, from: e.target.value})}
                            >
                                <option value="" disabled hidden>select</option>
                                <option>Lobar Handy</option>
                                <option>Lavish Warehouse</option>
                            </select>
                        </div>
                        <div className="import-form-group">
                            <label>To <span className="text-danger">*</span></label>
                            <select 
                                className="import-modal-select"
                                value={formData.to}
                                onChange={(e) => setFormData({...formData, to: e.target.value})}
                            >
                                <option value="" disabled hidden>Select</option>
                                <option>Selosy</option>
                                <option>North Zone Warehouse</option>
                            </select>
                        </div>
                        <div className="import-form-group">
                            <label>Status <span className="text-danger">*</span></label>
                            <select 
                                className="import-modal-select"
                                value={formData.status}
                                onChange={(e) => setFormData({...formData, status: e.target.value})}
                            >
                                <option value="" disabled hidden>Select</option>
                                <option>Pending</option>
                                <option>Completed</option>
                            </select>
                        </div>
                    </div>

                    {/* Download Sample */}
                    <div className="download-sample-wrapper">
                        <button className="btn-download-sample">Download Sample File</button>
                    </div>

                    {/* Upload Area */}
                    <div className="import-form-group">
                        <label>Upload CSV File</label>
                        <div className="file-upload-area">
                            <UploadCloud className="file-upload-icon" color="#ff9f43" size={64} />
                            <div className="file-upload-text">
                                Drag and drop a <span>file to upload</span>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Field */}
                    <div className="import-form-group">
                        <label>Shipping <span className="text-danger">*</span></label>
                        <input 
                            type="text" 
                            className="import-modal-input" 
                            value={formData.shipping}
                            onChange={(e) => setFormData({...formData, shipping: e.target.value})}
                        />
                    </div>

                    {/* Description Field */}
                    <div className="import-form-group">
                        <label>Description</label>
                        <textarea 
                            className="import-modal-input" 
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            style={{ resize: 'vertical' }}
                        ></textarea>
                    </div>
                </div>

                <div className="import-modal-footer">
                    <button className="btn-import-cancel" onClick={onClose} disabled={isSubmitting}>Cancel</button>
                    <button 
                        className="btn-import-submit" 
                        onClick={handleSave}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImportTransferModal;
