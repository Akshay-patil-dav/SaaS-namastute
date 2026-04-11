import React, { useState } from 'react';
import { X, Loader } from 'lucide-react';
import axios from 'axios';
import './add-sales-modal.css';
import './add-category-modal.css';

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/categories`;

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        
        try {
            if (isEditMode) {
                await axios.put(`${API_BASE}/${categoryData.id}`, {
                    name: categoryName,
                    slug: categorySlug,
                    status: status
                });
            } else {
                await axios.post(API_BASE, {
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
            setError(err.response?.data?.error || 'Failed to add category');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content add-sales-modal add-category-modal">
                {/* Header */}
                <div className="modal-header">
                    <h4>{isEditMode ? 'Edit Category' : 'Add Category'}</h4>
                    <button className="close-btn-red" onClick={onClose}>
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
                            <label>Category <span className="required">*</span></label>
                            <input 
                                type="text" 
                                className="form-input" 
                                placeholder="Enter category name"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group mb-3">
                            <label>Category Slug <span className="required">*</span></label>
                            <input 
                                type="text" 
                                className="form-input" 
                                placeholder="Enter category slug"
                                value={categorySlug}
                                onChange={(e) => setCategorySlug(e.target.value)}
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
                        <button type="submit" className="btn-add-category" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <><Loader size={16} className="spin" style={{marginRight: '8px'}} /> {isEditMode ? 'Updating...' : 'Adding...'}</>
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
