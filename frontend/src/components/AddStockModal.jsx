import React, { useState, useEffect, useRef } from 'react';
import { X, Search, Minus, Plus, Trash2 } from 'lucide-react';
import axios from 'axios';
import './add-stock-modal.css';

const AddStockModal = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        warehouse: '',
        store: '',
        person: '',
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const searchRef = useRef(null);

    // Reset state when modal opens/closes and handle click outside
    useEffect(() => {
        if (isOpen) {
            setSelectedProducts([]);
            setSearchQuery('');
        }

        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    // Product search logic
    useEffect(() => {
        if (!isOpen || searchQuery.length < 1) {
            setSearchResults([]);
            setShowSuggestions(false);
            return;
        }

        const searchProducts = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/products/search?q=${searchQuery}`);
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
        const existing = selectedProducts.find(p => p.id === product.id);
        if (existing) {
            setSelectedProducts(selectedProducts.map(p => 
                p.id === product.id ? { ...p, qty: p.qty + 1 } : p
            ));
        } else {
            setSelectedProducts([...selectedProducts, { 
                id: product.id, 
                name: product.name, 
                sku: product.sku, 
                category: product.category || 'General', 
                qty: 1,
                img: product.images ? product.images.split(',')[0].trim() : 'https://api.dicebear.com/7.x/shapes/svg?seed=' + product.name
            }]);
        }
        setSearchQuery('');
        setShowSuggestions(false);
    };

    const updateQty = (id, delta) => {
        setSelectedProducts(prev => prev.map(p => 
            p.id === id ? { ...p, qty: Math.max(1, p.qty + delta) } : p
        ));
    };

    const removeProduct = (id) => {
        setSelectedProducts(prev => prev.filter(p => p.id !== id));
    };

    const handleSave = async () => {
        if (!formData.warehouse || !formData.store || !formData.person || selectedProducts.length === 0) {
            alert('Please fill all required fields and add at least one product.');
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                warehouse: formData.warehouse,
                store: formData.store,
                responsiblePerson: formData.person,
                products: selectedProducts.map(p => ({
                    productId: p.id,
                    quantity: p.qty
                }))
            };

            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/stocks`, payload);
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error('Error saving stock:', error);
            alert('Failed to save stock. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="stock-modal-overlay">
            <div className="stock-modal-content">
                {/* Modal Header */}
                <div className="stock-modal-header">
                    <h3>Add Stock</h3>
                    <button className="stock-modal-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="stock-modal-body">
                    <div className="form-grid">
                        {/* Warehouse Select */}
                        <div className="stock-form-group">
                            <label>Warehouse <span className="text-danger">*</span></label>
                            <select 
                                className="stock-modal-select"
                                value={formData.warehouse}
                                onChange={(e) => setFormData({...formData, warehouse: e.target.value})}
                            >
                                <option value="" disabled hidden>Select</option>
                                <option value="">Select</option>
                                <option>Lavish Warehouse</option>
                                <option>Quaint Warehouse</option>
                            </select>
                        </div>

                        {/* Store Select */}
                        <div className="stock-form-group">
                            <label>Store <span className="text-danger">*</span></label>
                            <select 
                                className="stock-modal-select"
                                value={formData.store}
                                onChange={(e) => setFormData({...formData, store: e.target.value})}
                            >
                                <option value="" disabled hidden>Select</option>
                                <option value="">Select</option>
                                <option>Electro Mart</option>
                                <option>Quantum Gadgets</option>
                            </select>
                        </div>

                        {/* Responsible Person Select */}
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

                    {/* Product Search */}
                    <div className="stock-form-group" style={{ position: 'relative' }} ref={searchRef}>
                        <label>Product <span className="text-danger">*</span></label>
                        <div className="stock-search-container">
                            <Search className="stock-search-icon" size={18} />
                            <input 
                                type="text" 
                                className="stock-modal-input" 
                                placeholder="Search Product by name or SKU"
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

                    {/* Selected Products Table Area */}
                    <div className="selected-products-container">
                        {selectedProducts.length > 0 ? (
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
                                        {selectedProducts.map((product) => (
                                            <tr key={product.id}>
                                                <td>
                                                    <div className="product-info-cell">
                                                        <img src={product.img} alt={product.name} />
                                                        <span>{product.name}</span>
                                                    </div>
                                                </td>
                                                <td>{product.sku}</td>
                                                <td>{product.category}</td>
                                                <td>
                                                    <div className="qty-control">
                                                        <button className="qty-btn" onClick={() => updateQty(product.id, -1)}><Minus size={14} /></button>
                                                        <span className="qty-value">{product.qty}</span>
                                                        <button className="qty-btn" onClick={() => updateQty(product.id, 1)}><Plus size={14} /></button>
                                                    </div>
                                                </td>
                                                <td>
                                                    <button className="remove-item-btn" onClick={() => removeProduct(product.id)}>
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="table-indicator-line">
                                    <div className="indicator-progress"></div>
                                </div>
                            </div>
                        ) : (
                            <div className="empty-stock-placeholder">
                                No products added. Use the search above to add products to stock.
                            </div>
                        )}
                    </div>
                </div>

                <div className="stock-modal-footer">
                    <button className="btn-stock-cancel" onClick={onClose} disabled={isSubmitting}>Cancel</button>
                    <button 
                        className="btn-stock-save" 
                        onClick={handleSave}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddStockModal;
