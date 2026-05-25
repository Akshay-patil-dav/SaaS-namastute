import React, { useState, useEffect, useRef } from 'react';
import { X, UploadCloud } from 'lucide-react';
import apiClient, { API, ENV } from '@/api/config';
import './import-transfer-modal.css';

// Combined list of all possible warehouses
const ALL_WAREHOUSES = [
    'Lobar Handy',
    'Lavish Warehouse',
    'Quaint Warehouse',
    'Selosy',
    'North Zone Warehouse',
    'Nova Storage Hub',
];

const ImportTransferModal = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        from: '',
        to: '',
        status: '',
        shipping: '',
        description: ''
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [csvFile, setCsvFile] = useState(null);
    const fileInputRef = useRef(null);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setFormData({ from: '', to: '', status: '', shipping: '', description: '' });
            setCsvFile(null);
            setIsSubmitting(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleDownloadSample = () => {
        const csvContent = "productId,name,sku,category,quantity\n1,Nike Jordan,PT002,Nike,2\n2,Apple Watch,PT003,Apple,5";
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "transfer_sample.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setCsvFile(file);
    };

    const handleSave = async () => {
        if (!formData.from || !formData.to || !formData.status || !formData.shipping) {
            alert('Please fill all required fields (*).');
            return;
        }

        if (!csvFile) {
            alert('Please upload a valid CSV file.');
            return;
        }
        
        setIsSubmitting(true);
        try {
            const formDataPayload = new FormData();
            formDataPayload.append('file', csvFile);
            formDataPayload.append('warehouseFrom', formData.from);
            formDataPayload.append('warehouseTo', formData.to);
            formDataPayload.append('status', formData.status);
            formDataPayload.append('shipping', formData.shipping);
            formDataPayload.append('description', formData.description);

            await apiClient.post(`${ENV.API_BASE_URL}/transfers/import`, formDataPayload, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error('Error importing transfer:', error);
            alert('Failed to import transfer. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="import-modal-overlay">
            <div className="import-modal-content">
                <div className="import-modal-header">
                    <h3>Import Transfer</h3>
                    <button className="import-modal-close" onClick={onClose}>
                        <X size={16} strokeWidth={3} />
                    </button>
                </div>

                <div className="import-modal-body">
                    <div className="import-form-grid-3">
                        <div className="import-form-group">
                            <label>From <span className="text-danger">*</span></label>
                            <select 
                                className="import-modal-select"
                                value={formData.from}
                                onChange={(e) => setFormData({...formData, from: e.target.value})}
                            >
                                <option value="" disabled hidden>select</option>
                                {ALL_WAREHOUSES.map(w => (
                                    <option key={w} value={w}>{w}</option>
                                ))}
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
                                {ALL_WAREHOUSES.map(w => (
                                    <option key={w} value={w}>{w}</option>
                                ))}
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

                    <div className="download-sample-wrapper">
                        <button className="btn-download-sample" onClick={handleDownloadSample}>Download Sample File</button>
                    </div>

                    <div className="import-form-group">
                        <label>Upload CSV File</label>
                        <div 
                            className="file-upload-area" 
                            onClick={() => fileInputRef.current && fileInputRef.current.click()}
                            style={{ cursor: 'pointer' }}
                        >
                            <input 
                                type="file" 
                                accept=".csv" 
                                style={{ display: 'none' }} 
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                            />
                            <UploadCloud className="file-upload-icon" color="#ff9f43" size={64} />
                            <div className="file-upload-text">
                                {csvFile ? (
                                    <span>Selected file: <strong>{csvFile.name}</strong></span>
                                ) : (
                                    <>Drag and drop a <span>file to upload</span> or click here</>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="import-form-group">
                        <label>Shipping <span className="text-danger">*</span></label>
                        <input 
                            type="text" 
                            className="import-modal-input" 
                            value={formData.shipping}
                            onChange={(e) => setFormData({...formData, shipping: e.target.value})}
                        />
                    </div>

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
