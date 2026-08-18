import React, { useState, useEffect, useRef } from 'react';
import { X, Minus, Plus, Trash2, Search } from 'lucide-react';
import apiClient, { API, ENV } from '@/api/config';
import DeleteConfirmModal from '../../common/DeleteConfirmModal/DeleteConfirmModal';
import '../AddStockModal/add-stock-modal.css';

const EditStockModal = ({ isOpen, onClose, stock, onSuccess }) => {
    const [formData, setFormData] = useState({
        warehouse: '',
        store: '',
        person: '',
        quantity: 1
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Search specific states
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [activeProduct, setActiveProduct] = useState(null);
    const [warehouses, setWarehouses] = useState([]);
    const [stores, setStores] = useState([]);

    useEffect(() => {
        if (isOpen && stock) {
            setFormData({
                warehouse: stock.warehouse || '',
                store: stock.store || '',
                person: stock.responsiblePerson || '',
                quantity: stock.quantity || 1
            });
            setActiveProduct({
                id: stock.productId,
                productName: stock.productName,
                productSku: stock.productSku,
                productCategory: stock.productCategory,
                productImg: stock.productImg
            });
            setSearchQuery('');
            const fetchDropdowns = async () => {
                try {
                    const [whRes, stRes] = await Promise.all([
                        apiClient.get(`${ENV.API_BASE_URL}/warehouses`),
                        apiClient.get(`${ENV.API_BASE_URL}/stores`)
                    ]);
                    setWarehouses(Array.isArray(whRes.data) ? whRes.data : []);
                    setStores(Array.isArray(stRes.data) ? stRes.data : []);
                } catch (err) {
                    console.error('Failed to fetch dropdowns:', err);
                }
            };
            fetchDropdowns();
        }
    }, [isOpen, stock]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!isOpen || searchQuery.length < 1) {
            setSearchResults([]);
            setShowSuggestions(false);
            return;
        }

        const searchProducts = async () => {
            try {
                const response = await apiClient.get(`${ENV.API_BASE_URL}/products/search?q=${searchQuery}`);
                setSearchResults(response.data);
                setShowSuggestions(true);
            } catch (error) {
                console.error('Search error:', error);
            }
        };

        const timeoutId = setTimeout(searchProducts, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery, isOpen]);

    const handleSelectProduct = (product) => {
        setActiveProduct({
            id: product.id,
            productName: product.name,
            productSku: product.sku,
            productCategory: product.category || 'General',
            productImg: product.images ? product.images.split(',')[0].trim() : 'https://api.dicebear.com/7.x/shapes/svg?seed=' + product.name
        });
        setSearchQuery('');
        setShowSuggestions(false);
    };

    const handleSave = async () => {
        if (!formData.warehouse || !formData.store || !formData.person) {
            alert('Please fill all required fields.');
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                warehouse: formData.warehouse,
                store: formData.store,
                responsiblePerson: formData.person,
                quantity: formData.quantity,
                productId: activeProduct.id,
                productName: activeProduct.productName,
                productSku: activeProduct.productSku,
                productCategory: activeProduct.productCategory,
                productImg: activeProduct.productImg
            };

            await apiClient.put(`${ENV.API_BASE_URL}/stocks/${stock.id}`, payload);
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error('Error updating stock:', error);
            alert('Failed to update stock. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const triggerDelete = () => {
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        setShowDeleteConfirm(false);
        setIsSubmitting(true);
        try {
            await apiClient.delete(`${ENV.API_BASE_URL}/stocks/${stock.id}`);
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error('Error deleting stock:', error);
            alert('Failed to delete stock. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen || !stock) return null;

    return (
        <div className="stock-modal-overlay">
            <div className="stock-modal-content">
                <div className="stock-modal-header">
                    <h3>Edit Stock Entry</h3>
                    <button className="stock-modal-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="stock-modal-body">
                    {/* Product Search */}
                    <div className="stock-form-group" style={{ position: 'relative', marginBottom: '20px' }} ref={searchRef}>
                        <label>Product <span className="text-danger">*</span></label>
                        <div className="stock-search-container">
                            <Search className="stock-search-icon" size={18} />
                            <input 
                                type="text" 
                                className="stock-modal-input" 
                                placeholder="Select Product"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => searchQuery.length > 0 && setShowSuggestions(true)}
                            />
                        </div>

                        {/* Search Suggestions Dropdown */}
                        {showSuggestions && (
                            <div className="stock-suggestions-dropdown">
                                {searchResults.length > 0 ? (
                                    searchResults.map((product) => (
                                        <div 
                                            key={product.id} 
                                            className="stock-suggestion-item"
                                            onClick={() => handleSelectProduct(product)}
                                        >
                                            <div className="suggestion-img">
                                                <img src={product.images ? product.images.split(',')[0].trim() : 'https://api.dicebear.com/7.x/shapes/svg?seed=' + product.name} alt="" />
                                            </div>
                                            <div className="suggestion-info">
                                                <div className="suggestion-name">{product.name}</div>
                                                <div className="suggestion-sku">SKU: {product.sku}</div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-suggestions">No products found</div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="form-grid" style={{ marginBottom: '20px' }}>
                        <div className="stock-form-group">
                            <label>Warehouse <span className="text-danger">*</span></label>
                            <select 
                                className="stock-modal-select"
                                value={formData.warehouse}
                                onChange={(e) => setFormData({...formData, warehouse: e.target.value})}
                            >
                                <option value="" disabled hidden>Select</option>
                                {warehouses.filter(w => w.status !== false).map(w => (
                                    <option key={w.id} value={w.name}>{w.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="stock-form-group">
                            <label>Store <span className="text-danger">*</span></label>
                            <select 
                                className="stock-modal-select"
                                value={formData.store}
                                onChange={(e) => setFormData({...formData, store: e.target.value})}
                            >
                                <option value="" disabled hidden>Select</option>
                                {stores.filter(s => s.status !== false).map(s => (
                                    <option key={s.id} value={s.name}>{s.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="stock-form-group">
                            <label>Responsible Person <span className="text-danger">*</span></label>
                            <select 
                                className="stock-modal-select"
                                value={formData.person}
                                onChange={(e) => setFormData({...formData, person: e.target.value})}
                            >
                                <option value="" disabled hidden>Select</option>
                                <option value="">Select</option>
                                <option>James Kirwin</option>
                                <option>Francis Chang</option>
                            </select>
                        </div>
                    </div>

                    <div className="selected-products-container">
                        <div className="selected-products-table-wrapper">
                            <table className="selected-products-table">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>SKU</th>
                                        <th>Category</th>
                                        <th>Qty</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div className="product-info-cell">
                                                <img src={(activeProduct || stock).productImg || 'https://via.placeholder.com/50'} alt={(activeProduct || stock).productName} />
                                                <span>{(activeProduct || stock).productName}</span>
                                            </div>
                                        </td>
                                        <td>{(activeProduct || stock).productSku}</td>
                                        <td>{(activeProduct || stock).productCategory || 'N/A'}</td>
                                        <td>
                                            <div className="qty-control">
                                                <button className="qty-btn" onClick={() => setFormData({...formData, quantity: Math.max(1, formData.quantity - 1)})} disabled={isSubmitting}><Minus size={14} /></button>
                                                <span className="qty-value">{formData.quantity}</span>
                                                <button className="qty-btn" onClick={() => setFormData({...formData, quantity: formData.quantity + 1})} disabled={isSubmitting}><Plus size={14} /></button>
                                            </div>
                                        </td>
                                        <td>
                                            <button className="remove-item-btn" onClick={triggerDelete} disabled={isSubmitting} title="Delete Stock Entry">
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="table-indicator-line">
                                <div className="indicator-progress" style={{ width: '100%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="stock-modal-footer">
                    <button className="btn-stock-cancel" onClick={onClose} disabled={isSubmitting}>Cancel</button>
                    <button className="btn-stock-save" onClick={handleSave} disabled={isSubmitting}>
                        {isSubmitting ? 'Updating...' : 'Update Records'}
                    </button>
                </div>
            </div>

            <DeleteConfirmModal 
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={confirmDelete}
                title="Delete Stock Entry"
                message="Are you sure you want to delete this stock entry? This will reverse the stock quantity for this product."
            />
        </div>
    );
};

export default EditStockModal;
