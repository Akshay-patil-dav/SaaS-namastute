import React, { useState, useEffect } from 'react';
import { X, Loader, Tag, FolderPlus } from 'lucide-react';
import apiClient, { ENV } from '@/api/config';
import './add-category-modal.css';

const API_BASE = `${ENV.API_BASE_URL}/categories`;

const AddCategoryModal = ({ isOpen, onClose, onCategoryAdded, categoryData }) => {
    const [categoryName, setCategoryName] = useState('');
    const [categorySlug, setCategorySlug] = useState('');
    const [status, setStatus] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const isEditMode = !!categoryData;

    useEffect(() => {
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

    // Auto-slug generation
    const handleNameChange = (e) => {
        const val = e.target.value;
        setCategoryName(val);
        if (!isEditMode) {
            setCategorySlug(
                val.toLowerCase()
                   .trim()
                   .replace(/[^a-z0-9 -]/g, '')
                   .replace(/\s+/g, '-')
                   .replace(/-+/g, '-')
            );
        }
    };

    if (!isOpen) return null;

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
            
            setCategoryName('');
            setCategorySlug('');
            setStatus(true);
            
            if (onCategoryAdded) onCategoryAdded();
            onClose();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to save category');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="acm-overlay" onClick={onClose}>
            <div className="acm-modal" onClick={(e) => e.stopPropagation()}>
                
                {/* Header */}
                <div className="acm-header">
                    <div className="acm-title">
                        <FolderPlus size={20} className="acm-title-icon" />
                        <span>{isEditMode ? 'Edit Category' : 'Add Category'}</span>
                    </div>
                    <button className="acm-close-btn" onClick={onClose} type="button" aria-label="Close">
                        <X size={18} />
                    </button>
                </div>

                {/* Body Form */}
                <form onSubmit={handleSubmit}>
                    <div className="acm-body">
                        {error && (
                            <div className="acm-error-alert">
                                <span>{error}</span>
                            </div>
                        )}
                        
                        <div className="acm-field">
                            <label className="acm-label">
                                Category Name <span className="acm-required">*</span>
                            </label>
                            <input 
                                type="text" 
                                className="acm-input" 
                                placeholder="Enter category name"
                                value={categoryName}
                                onChange={handleNameChange}
                                required
                            />
                        </div>

                        <div className="acm-field">
                            <label className="acm-label">
                                Category Slug <span className="acm-required">*</span>
                            </label>
                            <input 
                                type="text" 
                                className="acm-input" 
                                placeholder="Enter category slug"
                                value={categorySlug}
                                onChange={(e) => setCategorySlug(e.target.value)}
                                required
                            />
                        </div>

                        <div className="acm-status-row">
                            <label className="acm-status-label">
                                Status <span className="acm-required">*</span>
                            </label>
                            <label className="acm-switch">
                                <input 
                                    type="checkbox" 
                                    checked={status}
                                    onChange={(e) => setStatus(e.target.checked)}
                                />
                                <span className="acm-slider"></span>
                            </label>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="acm-footer">
                        <button type="button" className="acm-btn-cancel" onClick={onClose} disabled={isSubmitting}>
                            Cancel
                        </button>
                        <button type="submit" className="acm-btn-submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <><Loader size={16} className="acm-spin" /> {isEditMode ? 'Updating...' : 'Adding...'}</>
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
