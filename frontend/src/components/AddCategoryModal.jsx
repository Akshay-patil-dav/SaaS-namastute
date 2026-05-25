import React, { useState } from 'react';
import { X, Loader, Tag, AlertCircle } from 'lucide-react';
import apiClient, { API, ENV } from '@/api/config';
import './modal-common.css';
import './add-category-modal.css';

const API_BASE = `${ENV.API_BASE_URL}/categories`;

const AddCategoryModal = ({ isOpen, onClose, onCategoryAdded, categoryData }) => {
    const [categoryName, setCategoryName] = useState('');
    const [categorySlug, setCategorySlug] = useState('');
    const [status, setStatus] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const isEditMode = !!categoryData;

    React.useEffect(() => {
        if (categoryData) {
            setCategoryName(categoryData.name || '');
            setCategorySlug(categoryData.slug || '');
            setStatus(categoryData.status !== false);
        } else {
            setCategoryName('');
            setCategorySlug('');
            setStatus(true);
        }
        setError(null);
    }, [categoryData, isOpen]);

    if (!isOpen) return null;

    const handleNameChange = (e) => {
        const val = e.target.value;
        setCategoryName(val);
        // Auto-generate slug from name if not in edit mode
        if (!isEditMode) {
            setCategorySlug(val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        
        try {
            if (isEditMode) {
                await apiClient.put(`${API_BASE}/${categoryData.id}`, {
                    name: categoryName,
                    slug: categorySlug,
                    status: status
                });
            } else {
                await apiClient.post(API_BASE, {
                    name: categoryName,
                    slug: categorySlug,
                    status: status
                });
            }
            
            // Reset form
            setCategoryName('');
            setCategorySlug('');
            setStatus(true);
            
            if (onCategoryAdded) onCategoryAdded();
            onClose();
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.message || 'Failed to save category');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content add-category-modal">
                {/* Header */}
                <div className="modal-header">
                    <div className="header-title-wrap">
                        <div className="header-icon">
                            <Tag size={18} />
                        </div>
                        <div>
                            <h4>{isEditMode ? 'Edit Category' : 'Add Category'}</h4>
                            <span className="modal-subtitle">
                                {isEditMode ? 'Update category details' : 'Create a new product category'}
                            </span>
                        </div>
                    </div>
                    <button className="close-btn" onClick={onClose} type="button" title="Close">
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
                                <label>Category Name <span className="required">*</span></label>
                                <input 
                                    type="text" 
                                    className="form-input-custom" 
                                    placeholder="e.g. Electronics, Clothing"
                                    value={categoryName}
                                    onChange={handleNameChange}
                                    required
                                    autoFocus
                                />
                            </div>

                            <div className="form-group">
                                <label>Category Slug <span className="required">*</span></label>
                                <input 
                                    type="text" 
                                    className="form-input-custom" 
                                    placeholder="e.g. electronics, clothing"
                                    value={categorySlug}
                                    onChange={(e) => setCategorySlug(e.target.value)}
                                    required
                                />
                                <p className="input-help-text">URL-friendly identifier. Auto-generated from name.</p>
                            </div>
                        </div>

                        <div className="status-toggle-row">
                            <div className="status-label">
                                <strong>Status</strong>
                                <span>Make this category visible in your storefront</span>
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
                                isEditMode ? 'Update Category' : 'Add Category'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCategoryModal;
