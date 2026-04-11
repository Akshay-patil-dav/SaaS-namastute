import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Loader, Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';
import axios from 'axios';
import './add-brand-modal.css';

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/brands`;

const AddBrandModal = ({ isOpen, onClose, onBrandAdded, brandData }) => {
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        name: '',
        desc: '',
        status: true,
        img: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const isEditMode = !!brandData;

    useEffect(() => {
        if (isOpen) {
            if (brandData) {
                setFormData({
                    name: brandData.name || '',
                    desc: brandData.desc || '',
                    status: brandData.status !== false,
                    // Status is coming as a string 'Active', so we verify logic based on actual data
                    img: brandData.img || null
                });
                setImagePreview(brandData.img || null);
            } else {
                setFormData({
                    name: '',
                    desc: '',
                    status: true,
                    img: null
                });
                setImagePreview(null);
            }
            setError(null);
        }
    }, [brandData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setError('Image size should be less than 2MB');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                // For a locally mocked component, keeping data URL is okay.
                setFormData(prev => ({ ...prev, img: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        
        try {
            const payload = {
                name: formData.name,
                desc: formData.desc,
                status: formData.status,
                img: formData.img
            };

            if (isEditMode) {
                await axios.put(`${API_BASE}/${brandData.id}`, payload);
            } else {
                await axios.post(API_BASE, payload);
            }
            
            if (onBrandAdded) onBrandAdded();
            onClose();
        } catch (err) {
            setError(err.response?.data?.error || err.message || 'Failed to save brand');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content add-brand-modal">
                {/* Header */}
                <div className="modal-header">
                    <div className="header-title-wrap">
                        <div className="header-icon">
                            <Plus size={20} />
                        </div>
                        <h4>{isEditMode ? 'Edit Brand' : 'Add Brand'}</h4>
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
                        
                        {/* Image Upload Area */}
                        <div className="modal-section-title">Brand Logo</div>
                        <div className="image-upload-wrapper">
                            <div className="image-preview-box" onClick={triggerFileInput}>
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" />
                                ) : (
                                    <div className="upload-placeholder">
                                        <ImageIcon size={32} />
                                        <span>Click to upload</span>
                                    </div>
                                )}
                                <input 
                                    type="file" 
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    style={{ display: 'none' }}
                                    accept="image/*"
                                />
                            </div>
                            <div className="upload-details">
                                <button type="button" className="btn-browse" onClick={triggerFileInput}>
                                    <Upload size={14} /> Browse Logo
                                </button>
                                <p className="upload-limit">JPEG, PNG or SVG. Max size of 2MB</p>
                            </div>
                        </div>

                        {/* Form Fields Grid */}
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Brand Name <span className="required">*</span></label>
                                <input 
                                    type="text" 
                                    name="name"
                                    className="form-input-custom" 
                                    placeholder="e.g. Nike, Apple"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea 
                                    name="desc"
                                    className="form-textarea-custom" 
                                    placeholder="Brief description of the brand..."
                                    value={formData.desc}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="status-toggle-row">
                            <div className="status-label">
                                <strong>Status</strong>
                                <span>Make this brand active or inactive</span>
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
                                isEditMode ? 'Update Brand' : 'Save Brand'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddBrandModal;
