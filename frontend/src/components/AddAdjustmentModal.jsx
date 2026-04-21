import React, { useState, useEffect, useRef } from 'react';
import { X, Search, Minus, Plus, Trash2 } from 'lucide-react';
import axios from 'axios';
import './add-adjustment-modal.css';

const AddAdjustmentModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
    const isEditMode = !!initialData;
    const [formData, setFormData] = useState({
        warehouse: '',
        referenceNumber: '',
        store: '',
        person: '',
        notes: ''
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const searchRef = useRef(null);

    // Initial load and Reset state when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setSearchQuery('');
            if (initialData) {
                setFormData({
                    warehouse: initialData.warehouse || '',
                    referenceNumber: initialData.referenceNumber || '',
                    store: initialData.store || '',
                    person: initialData.person || '',
                    notes: initialData.notes || ''
                });
                if (initialData.products) {
                    setSelectedProducts(initialData.products);
                } else if (initialData.product) {
                    // Connect with actual real backend data structure
                    setSelectedProducts([{
                        id: initialData.original ? initialData.original.productId : initialData.id,
                        name: initialData.product,
                        sku: initialData.original ? (initialData.original.productSku || '') : ('PT' + String(initialData.id).padStart(3, '0')),
                        category: initialData.original ? (initialData.original.productCategory || 'General') : 'General',
                        qty: initialData.qty || 1,
                        img: initialData.productImg || ('https://api.dicebear.com/7.x/shapes/svg?seed=' + initialData.product)
                    }]);
                }
            } else {
                setFormData({
                    warehouse: '',
                    referenceNumber: '',
                    store: '',
                    person: '',
                    notes: ''
                });
                setSelectedProducts([]);
            }
        }

        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, initialData]);

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
                category: product.categoryName || 'General', 
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
        if (!formData.warehouse || !formData.referenceNumber || !formData.store || !formData.person || selectedProducts.length === 0) {
            alert('Please fill all required fields and add at least one product.');
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                ...formData,
                products: selectedProducts.map(p => ({
                    productId: p.id,
                    quantity: p.qty,
                    name: p.name,
                    img: p.img
                }))
            };

            // In local frontend this may not exist yet, simulate or pass back
            if (onSuccess) {
                onSuccess(payload);
            }
            onClose();
        } catch (error) {
            console.error('Error saving adjustment:', error);
            alert('Failed to save adjustment. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="adjustment-modal-overlay">
            <div className="adjustment-modal-content">
                {/* Modal Header */}
                <div className="adjustment-modal-header">
                    <h3>{isEditMode ? 'Edit Adjustment' : 'Add Adjustment'}</h3>
                    <button className="adjustment-modal-close" onClick={onClose} aria-label="Close">
                        <X size={20} color="white" />
                    </button>
                </div>

                <div className="adjustment-modal-body">
                    {/* Product Search */}
                    <div className="adjustment-form-group" style={{ position: 'relative' }} ref={searchRef}>
                        <label>Product <span className="text-danger">*</span></label>
                        <div className="adjustment-search-container">
                            <Search className="adjustment-search-icon" size={18} />
                            <input 
                                type="text" 
                                className="adjustment-modal-input search-padding" 
                                placeholder="Search by product name or SKU"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => searchQuery.length > 0 && setShowSuggestions(true)}
                            />
                        </div>

                        {/* Search Suggestions Dropdown */}
                        {showSuggestions && (
                            <div className="adjustment-suggestions-dropdown">
                                {searchResults.length > 0 ? (
                                    searchResults.map((product) => (
                                        <div 
                                            key={product.id} 
                                            className="adjustment-suggestion-item"
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

                    {/* Warehouse and Reference Number */}
                    <div className="form-grid-2 mt-2">
                        <div className="adjustment-form-group">
                            <label>Warehouse <span className="text-danger">*</span></label>
                            <select 
                                className="adjustment-modal-select"
                                value={formData.warehouse}
                                onChange={(e) => setFormData({...formData, warehouse: e.target.value})}
                            >
                                <option value="" disabled hidden>Select</option>
                                <option value="Lavish Warehouse">Lavish Warehouse</option>
                                <option value="Quaint Warehouse">Quaint Warehouse</option>
                                <option value="Overflow Warehouse">Overflow Warehouse</option>
                                <option value="Traditional Warehouse">Traditional Warehouse</option>
                            </select>
                        </div>
                        <div className="adjustment-form-group">
                            <label>Reference Number <span className="text-danger">*</span></label>
                            <input 
                                type="text"
                                className="adjustment-modal-input"
                                value={formData.referenceNumber}
                                onChange={(e) => setFormData({...formData, referenceNumber: e.target.value})}
                                placeholder="PT003"
                            />
                        </div>
                    </div>

                    {/* Selected Products Table Area */}
                    <div className="adjustment-selected-products-container">
                        <div className="adjustment-selected-products-table-wrapper">
                            <table className="adjustment-selected-products-table">
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
                    </div>

                    {/* Store and Responsible Person */}
                    <div className="adjustment-form-group mt-3">
                        <label>Store <span className="text-danger">*</span></label>
                        <select 
                            className="adjustment-modal-select"
                            value={formData.store}
                            onChange={(e) => setFormData({...formData, store: e.target.value})}
                        >
                            <option value="" disabled hidden>Select</option>
                            <option value="Electro Mart">Electro Mart</option>
                            <option value="Quantum Gadgets">Quantum Gadgets</option>
                            <option value="Prime Bazaar">Prime Bazaar</option>
                            <option value="Gadget World">Gadget World</option>
                        </select>
                    </div>

                    <div className="adjustment-form-group mt-3">
                        <label>Responsible Person <span className="text-danger">*</span></label>
                        <select 
                            className="adjustment-modal-select"
                            value={formData.person}
                            onChange={(e) => setFormData({...formData, person: e.target.value})}
                        >
                            <option value="" disabled hidden>Select</option>
                            <option value="James Kirwin">James Kirwin</option>
                            <option value="Francis Chang">Francis Chang</option>
                            <option value="Antonio Engle">Antonio Engle</option>
                            <option value="Leo Kelly">Leo Kelly</option>
                        </select>
                    </div>

                    {/* Notes */}
                    <div className="adjustment-form-group mt-3">
                        <label>Notes <span className="text-danger">*</span></label>
                        <textarea 
                            className="adjustment-modal-textarea"
                            value={formData.notes}
                            onChange={(e) => setFormData({...formData, notes: e.target.value})}
                            placeholder="Enter details here..."
                        ></textarea>
                    </div>
                </div>

                <div className="adjustment-modal-footer">
                    <button className="btn-adjustment-cancel" onClick={onClose} disabled={isSubmitting}>Cancel</button>
                    <button 
                        className="btn-adjustment-save" 
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

export default AddAdjustmentModal;
