import React, { useState, useRef, useEffect } from 'react';
import { X, UploadCloud, Plus, ChevronDown, Bold, Italic, Underline, Link as LinkIcon, ListOrdered, List, Type } from 'lucide-react';
import apiClient, { API, ENV } from '@/api/config';
import './import-transfer-modal.css'; // Reusing this CSS as it has the same base layout
import '../pages/CreateProduct.css'; // For the rich text toolbar styles used in Description

const SUPPLIERS = [
    'Electro Mart',
    'Quantum Gadgets',
    'Prime Bazaar'
];

const ImportPurchaseModal = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        supplier: '',
        status: '',
        orderTax: '',
        discount: '',
        shipping: '',
        description: ''
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [csvFile, setCsvFile] = useState(null);
    const fileInputRef = useRef(null);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setFormData({ supplier: '', status: '', orderTax: '', discount: '', shipping: '', description: '' });
            setCsvFile(null);
            setIsSubmitting(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleDownloadSample = () => {
        const csvContent = "productId,name,barcode,qty,price,discount,taxRate\n1,Nike Jordan,123456789,2,100,5,10\n2,Apple Watch,987654321,5,250,10,18";
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "purchase_sample.csv");
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
        if (!formData.supplier || !formData.status || !formData.orderTax || !formData.discount || !formData.shipping) {
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
            formDataPayload.append('supplier', formData.supplier);
            formDataPayload.append('status', formData.status);
            formDataPayload.append('orderTax', formData.orderTax);
            formDataPayload.append('discount', formData.discount);
            formDataPayload.append('shipping', formData.shipping);
            formDataPayload.append('notes', formData.description);

            // Assuming a backend endpoint exists, if not, this will gracefully fail with alert
            await apiClient.post(`${ENV.API_BASE_URL}/purchases/import`, formDataPayload, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error('Error importing purchase:', error);
            alert('Failed to import purchase. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="import-modal-overlay" style={{ zIndex: 1050 }}>
            <div className="import-modal-content" style={{ maxWidth: '650px' }}>
                <div className="import-modal-header">
                    <h3>Import Purchase</h3>
                    <button className="import-modal-close" onClick={onClose} style={{ background: '#ea5455', color: '#fff', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <X size={14} strokeWidth={3} />
                    </button>
                </div>

                <div className="import-modal-body">
                    <div className="row mb-3">
                        <div className="col-md-6 mb-3">
                            <label style={{ fontSize: '13px', color: '#5e5873', marginBottom: '8px' }}>Supplier Name <span className="text-danger">*</span></label>
                            <div className="d-flex gap-2 align-items-center">
                                <select 
                                    className="import-modal-select flex-grow-1 m-0"
                                    value={formData.supplier}
                                    onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                                >
                                    <option value="" disabled hidden>Select</option>
                                    {SUPPLIERS.map(w => (
                                        <option key={w} value={w}>{w}</option>
                                    ))}
                                </select>
                                <button type="button" style={{ background: '#1b2850', color: '#fff', border: 'none', borderRadius: '4px', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label style={{ fontSize: '13px', color: '#5e5873', marginBottom: '8px' }}>Status <span className="text-danger">*</span></label>
                            <select 
                                className="import-modal-select m-0"
                                value={formData.status}
                                onChange={(e) => setFormData({...formData, status: e.target.value})}
                            >
                                <option value="" disabled hidden>Select</option>
                                <option>Pending</option>
                                <option>Received</option>
                                <option>Ordered</option>
                            </select>
                        </div>
                    </div>

                    <div className="d-flex justify-content-end mb-3">
                        <button className="btn-download-sample" onClick={handleDownloadSample}>Download Sample File</button>
                    </div>

                    <div className="import-form-group">
                        <label>Upload CSV File</label>
                        <div 
                            className="file-upload-area" 
                            onClick={() => fileInputRef.current && fileInputRef.current.click()}
                            style={{ cursor: 'pointer', borderColor: '#d8d6de', borderStyle: 'dashed', borderRadius: '6px', padding: '30px', textAlign: 'center', background: '#fff' }}
                        >
                            <input 
                                type="file" 
                                accept=".csv" 
                                style={{ display: 'none' }} 
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                            />
                            <UploadCloud className="file-upload-icon mx-auto mb-2" color="#ff9f43" size={48} />
                            <div className="file-upload-text" style={{ color: '#b9b9c3', fontSize: '14px' }}>
                                {csvFile ? (
                                    <span style={{ color: '#5e5873' }}>Selected file: <strong>{csvFile.name}</strong></span>
                                ) : (
                                    <>Drag and drop a <span style={{ color: '#ff9f43' }}>file to upload</span></>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-4">
                            <label style={{ fontSize: '13px', color: '#5e5873', marginBottom: '8px' }}>Order Tax <span className="text-danger">*</span></label>
                            <input 
                                type="text" 
                                className="import-modal-input m-0" 
                                value={formData.orderTax}
                                onChange={(e) => setFormData({...formData, orderTax: e.target.value})}
                            />
                        </div>
                        <div className="col-md-4">
                            <label style={{ fontSize: '13px', color: '#5e5873', marginBottom: '8px' }}>Discount <span className="text-danger">*</span></label>
                            <input 
                                type="text" 
                                className="import-modal-input m-0" 
                                value={formData.discount}
                                onChange={(e) => setFormData({...formData, discount: e.target.value})}
                            />
                        </div>
                        <div className="col-md-4">
                            <label style={{ fontSize: '13px', color: '#5e5873', marginBottom: '8px' }}>Shipping <span className="text-danger">*</span></label>
                            <input 
                                type="text" 
                                className="import-modal-input m-0" 
                                value={formData.shipping}
                                onChange={(e) => setFormData({...formData, shipping: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="import-form-group mb-0">
                        <label>Description</label>
                        <div className="rt-editor" style={{ border: '1px solid #d8d6de', borderRadius: '4px', overflow: 'hidden' }}>
                            <div className="rt-toolbar" style={{ background: '#fff', borderBottom: '1px solid #d8d6de', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ fontSize: '13px', color: '#5e5873' }}><span>Normal</span> <ChevronDown size={14} style={{ marginLeft: '4px' }} /></div>
                                <div className="vr mx-1" style={{ height: '14px', width: '1px', background: '#d8d6de' }}></div>
                                <Bold size={14} color="#5e5873" /> <Italic size={14} color="#5e5873" /> <Underline size={14} color="#5e5873" /> <LinkIcon size={14} color="#5e5873" />
                                <div className="vr mx-1" style={{ height: '14px', width: '1px', background: '#d8d6de' }}></div>
                                <ListOrdered size={14} color="#5e5873" /> <List size={14} color="#5e5873" />
                                <div className="vr mx-1" style={{ height: '14px', width: '1px', background: '#d8d6de' }}></div>
                                <Type size={14} color="#5e5873" />
                            </div>
                            <textarea 
                                className="rt-textarea" 
                                placeholder="Maximum 60 Characters"
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                style={{ width: '100%', border: 'none', padding: '12px', minHeight: '80px', outline: 'none', resize: 'none', fontSize: '13px', color: '#5e5873' }}
                                maxLength={60}
                            ></textarea>
                        </div>
                    </div>
                </div>

                <div className="import-modal-footer" style={{ borderTop: '1px solid #ebe9f1', padding: '15px 20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button className="btn-import-cancel" onClick={onClose} disabled={isSubmitting} style={{ background: '#1b2850', color: '#fff', border: 'none', borderRadius: '4px', padding: '8px 20px', fontWeight: '500' }}>Cancel</button>
                    <button 
                        className="btn-import-submit" 
                        onClick={handleSave}
                        disabled={isSubmitting}
                        style={{ background: '#ff9f43', color: '#fff', border: 'none', borderRadius: '4px', padding: '8px 20px', fontWeight: '500' }}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImportPurchaseModal;
