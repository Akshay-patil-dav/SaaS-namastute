import React, { useState, useEffect, useRef } from 'react';
import { X, Search, Minus, Plus, Trash2 } from 'lucide-react';
import axios from 'axios';
import './add-transfer-modal.css';

const EditTransferModal = ({ isOpen, onClose, onSuccess, initialData, isView = false }) => {
    const [formData, setFormData] = useState({
        warehouseFrom: '',
        warehouseTo: '',
        referenceNo: '',
        notes: ''
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const searchRef = useRef(null);

    // Initialize data when modal opens
    useEffect(() => {
        if (isOpen && initialData) {
            setFormData({
                warehouseFrom: initialData.fromWarehouse || '',
                warehouseTo: initialData.toWarehouse || '',
                referenceNo: initialData.referenceNo || '',
                notes: initialData.notes || ''
            });

            if (initialData.productsJson) {
                try {
                    const parsedProducts = JSON.parse(initialData.productsJson);
                    setSelectedProducts(parsedProducts);
                } catch (e) {
                    console.error("Failed to parse products json", e);
                    setSelectedProducts([]);
                }
            } else {
                setSelectedProducts([]);
            }
            setSearchQuery('');
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
        if (!isOpen || searchQuery.length < 1 || isView) {
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
                setSearchResults([
                    { id: 1, name: 'Nike Jordan', sku: 'PT002', categoryName: 'Nike', images: '' }
                ]);
                setShowSuggestions(true);
            }
        };

        const timeoutId = setTimeout(searchProducts, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery, isOpen, isView]);

    const handleSelectProduct = (product) => {
        if (isView) return;
        const existing = selectedProducts.find(p => p.id === product.id || p.productId === product.id);
        if (existing) {
            setSelectedProducts(selectedProducts.map(p => 
                (p.id === product.id || p.productId === product.id) ? { ...p, quantity: (p.quantity || p.qty || 1) + 1, qty: (p.quantity || p.qty || 1) + 1 } : p
            ));
        } else {
            setSelectedProducts([...selectedProducts, { 
                productId: product.id, 
                name: product.name, 
                sku: product.sku, 
                category: product.categoryName || 'General', 
                quantity: 1,
                qty: 1,
                img: product.images ? product.images.split(',')[0].trim() : 'https://api.dicebear.com/7.x/shapes/svg?seed=' + product.name
            }]);
        }
        setSearchQuery('');
        setShowSuggestions(false);
    };

    const updateQty = (id, delta) => {
        if (isView) return;
        setSelectedProducts(prev => prev.map(p => 
            (p.id === id || p.productId === id) ? { ...p, quantity: Math.max(1, (p.quantity || p.qty || 1) + delta), qty: Math.max(1, (p.quantity || p.qty || 1) + delta) } : p
        ));
    };

    const removeProduct = (id) => {
        if (isView) return;
        setSelectedProducts(prev => prev.filter(p => p.id !== id && p.productId !== id));
    };

    const handleSave = async () => {
        if (isView) return;

        if (!formData.warehouseFrom || !formData.warehouseTo || !formData.referenceNo || !formData.notes || selectedProducts.length === 0) {
            alert('Please fill all required fields and add at least one product.');
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                warehouseFrom: formData.warehouseFrom,
                warehouseTo: formData.warehouseTo,
                referenceNo: formData.referenceNo,
                notes: formData.notes,
                products: selectedProducts.map(p => ({
                    productId: p.productId || p.id,
                    name: p.name,
                    sku: p.sku,
                    category: p.category,
                    img: p.img,
                    quantity: p.quantity || p.qty
                }))
            };

            await axios.put(`${import.meta.env.VITE_API_BASE_URL}/transfers/${initialData.id}`, payload);
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error('Error saving transfer:', error);
            alert('Failed to save transfer. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="stock-modal-overlay">
            <div className="stock-modal-content">
                <div className="stock-modal-header">
                    <h3>{isView ? 'View Transfer' : 'Edit Transfer'}</h3>
                    <button className="stock-modal-close" onClick={onClose}>
                        <X size={16} strokeWidth={3} />
                    </button>
                </div>

                <div className="stock-modal-body">
                    <div className="form-grid">
                        <div className="stock-form-group">
                            <label>Warehouse From {(!isView) && <span className="text-danger">*</span>}</label>
                            <select 
                                className="stock-modal-select"
                                value={formData.warehouseFrom}
                                onChange={(e) => setFormData({...formData, warehouseFrom: e.target.value})}
                                disabled={isView}
                            >
                                <option value="" disabled hidden>Select</option>
                                <option>Lobar Handy</option>
                                <option>Lavish Warehouse</option>
                                <option>Quaint Warehouse</option>
                            </select>
                        </div>

                        <div className="stock-form-group">
                            <label>Warehouse To {(!isView) && <span className="text-danger">*</span>}</label>
                            <select 
                                className="stock-modal-select"
                                value={formData.warehouseTo}
                                onChange={(e) => setFormData({...formData, warehouseTo: e.target.value})}
                                disabled={isView}
                            >
                                <option value="" disabled hidden>Select</option>
                                <option>Selosy</option>
                                <option>North Zone Warehouse</option>
                                <option>Nova Storage Hub</option>
                            </select>
                        </div>
                    </div>

                    <div className="stock-form-group">
                        <label>Reference No {(!isView) && <span className="text-danger">*</span>}</label>
                        <input 
                            type="text" 
                            className="stock-modal-input" 
                            placeholder="Enter Reference No"
                            value={formData.referenceNo}
                            onChange={(e) => setFormData({...formData, referenceNo: e.target.value})}
                            style={{ paddingLeft: '16px' }}
                            readOnly={isView}
                        />
                    </div>

                    {!isView && (
                        <div className="stock-form-group" style={{ position: 'relative' }} ref={searchRef}>
                            <label>Product <span className="text-danger">*</span></label>
                            <div className="stock-search-container">
                                <Search className="stock-search-icon" size={18} />
                                <input 
                                    type="text" 
                                    className="stock-modal-input search-product-input" 
                                    placeholder="Search Product..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => searchQuery.length > 0 && setShowSuggestions(true)}
                                />
                            </div>

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
                    )}

                    <div className="selected-products-container" style={{ display: selectedProducts.length > 0 ? 'block' : 'none' }}>
                        <div className="selected-products-table-wrapper">
                            <table className="selected-products-table">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>SKU</th>
                                        <th>Category</th>
                                        <th>Qty</th>
                                        {(!isView) && <th></th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedProducts.map((product, idx) => (
                                        <tr key={idx}>
                                            <td>
                                                <div className="product-info-cell">
                                                    <img src={product.img || ('https://api.dicebear.com/7.x/shapes/svg?seed=' + product.name)} alt={product.name} />
                                                    <span>{product.name}</span>
                                                </div>
                                            </td>
                                            <td>{product.sku}</td>
                                            <td>{product.category}</td>
                                            <td>
                                                <div className="qty-control">
                                                    {!isView && <button className="qty-btn" onClick={() => updateQty(product.id || product.productId, -1)}><Minus size={14} /></button>}
                                                    <span className="qty-value">{product.quantity || product.qty}</span>
                                                    {!isView && <button className="qty-btn" onClick={() => updateQty(product.id || product.productId, 1)}><Plus size={14} /></button>}
                                                </div>
                                            </td>
                                            {!isView && (
                                                <td>
                                                    <button className="remove-item-btn" onClick={() => removeProduct(product.id || product.productId)}>
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="table-indicator-line">
                                <div className="indicator-progress"></div>
                            </div>
                        </div>
                    </div>

                    <div className="stock-form-group" style={{ marginTop: '20px' }}>
                        <label>Notes {(!isView) && <span className="text-danger">*</span>}</label>
                        <textarea 
                            className="stock-modal-input" 
                            placeholder="Enter Notes"
                            rows={3}
                            value={formData.notes}
                            onChange={(e) => setFormData({...formData, notes: e.target.value})}
                            style={{ paddingLeft: '16px', resize: 'vertical' }}
                            readOnly={isView}
                        ></textarea>
                    </div>
                </div>

                <div className="stock-modal-footer">
                    <button className="btn-stock-cancel" onClick={onClose} disabled={isSubmitting}>
                        {isView ? 'Close' : 'Cancel'}
                    </button>
                    {!isView && (
                        <button 
                            className="btn-stock-save" 
                            onClick={handleSave}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditTransferModal;
