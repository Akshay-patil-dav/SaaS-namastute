import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Loader, Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';
import axios from 'axios';
import './add-sub-category-modal.css';

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/subcategories`;
const CATEGORIES_API = `${import.meta.env.VITE_API_BASE_URL}/categories`;

const AddSubCategoryModal = ({ isOpen, onClose, onSubCategoryAdded, subCategoryData }) => {
    const fileInputRef = useRef(null);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        categoryId: '',
        categoryCode: '',
        description: '',
        status: true,
        image: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const isEditMode = !!subCategoryData;

    useEffect(() => {
        if (isOpen) {
            fetchCategories();
            if (subCategoryData) {
                setFormData({
                    name: subCategoryData.name || '',
                    categoryId: subCategoryData.category?.id || '',
                    categoryCode: subCategoryData.categoryCode || '',
                    description: subCategoryData.description || '',
                    status: subCategoryData.status !== false,
                    image: subCategoryData.image || null
                });
                setImagePreview(subCategoryData.image || null);
            } else {
                setFormData({
                    name: '',
                    categoryId: '',
                    categoryCode: '',
                    description: '',
                    status: true,
                    image: null
                });
                setImagePreview(null);
            }
            setError(null);
        }
    }, [subCategoryData, isOpen]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(CATEGORIES_API);
            setCategories(response.data);
        } catch (err) {
            console.error('Failed to fetch categories:', err);
        }
    };

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
                // In a real app, you might send the file or base64
                setFormData(prev => ({ ...prev, image: reader.result }));
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
            if (isEditMode) {
                await axios.put(`${API_BASE}/${subCategoryData.id}`, formData);
            } else {
                await axios.post(API_BASE, formData);
            }
            
            if (onSubCategoryAdded) onSubCategoryAdded();
            onClose();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to save sub category');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content add-sub-category-modal">
                {/* Header */}
                <div className="modal-header">
                    <div className="header-title-wrap">
                        <div className="header-icon">
                            <Plus size={20} />
                        </div>
                        <h4>{isEditMode ? 'Edit Sub Category' : 'Add Sub Category'}</h4>
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
                        
                        {/* Image Upload Area */}
                        <div className="modal-section-title">Sub Category Image</div>
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
                                    <Upload size={14} /> Browse Image
                                </button>
                                <p className="upload-limit">JPEG, PNG or SVG. Max size of 2MB</p>
                            </div>
                        </div>

                        {/* Form Fields Grid */}
                        <div className="form-grid">
                            <div className="form-group full-width">
                                <label>Parent Category <span className="required">*</span></label>
                                <select 
                                    name="categoryId"
                                    className="form-select-custom" 
                                    value={formData.categoryId}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Sub Category Name <span className="required">*</span></label>
                                <input 
                                    type="text" 
                                    name="name"
                                    className="form-input-custom" 
                                    placeholder="e.g. Laptops"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Category Code <span className="required">*</span></label>
                                <input 
                                    type="text" 
                                    name="categoryCode"
                                    className="form-input-custom" 
                                    placeholder="e.g. CAT001"
                                    value={formData.categoryCode}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group full-width">
                                <label>Description</label>
                                <textarea 
                                    name="description"
                                    className="form-textarea-custom" 
                                    placeholder="Brief description of the sub category..."
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="status-toggle-row">
                            <div className="status-label">
                                <strong>Status</strong>
                                <span>Make this sub-category active or inactive</span>
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
                                <><Loader size={16} className="spin mr-2" /> Saving...</>
                            ) : (
                                isEditMode ? 'Update Sub Category' : 'Save Sub Category'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddSubCategoryModal;
