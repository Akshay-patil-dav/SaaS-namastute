import React, { useState, useEffect, useRef } from 'react';
import { X, Search, Minus, Plus, Trash2 } from 'lucide-react';
import apiClient, { API, ENV } from '@/api/config';
import './add-transfer-modal.css';

// Combined list of all possible warehouses
const ALL_WAREHOUSES = [
    'Lobar Handy',
    'Lavish Warehouse',
    'Quaint Warehouse',
    'Selosy',
    'North Zone Warehouse',
    'Nova Storage Hub',
];

const EditTransferModal = ({ isOpen, onClose, onSuccess, initialData, isView = false }) => {
    const [formData, setFormData] = useState({
        warehouseFrom: '',
        warehouseTo: '',
        referenceNo: '',
        status: 'Pending',
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
                status: initialData.status || 'Pending',
                notes: initialData.notes || ''
            });

            if (initialData.productsJson) {
                try {
                    const parsedProducts = JSON.parse(initialData.productsJson);
                    setSelectedProducts(Array.isArray(parsedProducts) ? parsedProducts : []);
                } catch (e) {
                    console.error('Failed to parse products json', e);
                    setSelectedProducts([]);
                }
            } else {
                setSelectedProducts([]);
            }
            setSearchQuery('');
            setSearchResults([]);
            setShowSuggestions(false);
        } else if (!isOpen) {
            // Reset on close
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
                const response = await apiClient.get(`${ENV.API_BASE_URL}/products/search?q=${searchQuery}`);
                setSearchResults(Array.isArray(response.data) ? response.data : []);
                setShowSuggestions(true);
            } catch (error) {
                console.error('Search error:', error);
                setSearchResults([]);
                setShowSuggestions(false);
            }
        };

        const timeoutId = setTimeout(searchProducts, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery, isOpen, isView]);

    const handleSelectProduct = (product) => {
        if (isView) return;
        const existing = selectedProducts.find(p => p.productId === product.id || p.id === product.id);
        if (existing) {
            setSelectedProducts(prev => prev.map(p =>
                (p.productId === product.id || p.id === product.id)
                    ? { ...p, quantity: (p.quantity || 1) + 1 }
                    : p
            ));
        } else {
            setSelectedProducts(prev => [...prev, {
                productId: product.id,
                name: product.name,
                sku: product.sku,
                category: product.categoryName || 'General',
                quantity: 1,
                img: product.images
                    ? product.images.split(',')[0].trim()
                    : `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(product.name)}`
            }]);
        }
        setSearchQuery('');
        setShowSuggestions(false);
    };

    const getProductKey = (p) => p.productId || p.id;

    const updateQty = (key, delta) => {
        if (isView) return;
        setSelectedProducts(prev => prev.map(p =>
            getProductKey(p) === key
                ? { ...p, quantity: Math.max(1, (p.quantity || 1) + delta) }
                : p
        ));
    };

    const removeProduct = (key) => {
        if (isView) return;
        setSelectedProducts(prev => prev.filter(p => getProductKey(p) !== key));
    };

    const handleSave = async () => {
        if (isView) return;

        if (!formData.warehouseFrom || !formData.warehouseTo || !formData.referenceNo) {
            alert('Please fill all required fields: Warehouse From, Warehouse To, and Reference No.');
            return;
        }
        if (selectedProducts.length === 0) {
            alert('Please add at least one product.');
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                warehouseFrom: formData.warehouseFrom,
                warehouseTo: formData.warehouseTo,
                referenceNo: formData.referenceNo,
                status: formData.status,
                notes: formData.notes,
                products: selectedProducts.map(p => ({
                    productId: p.productId || p.id,
                    name: p.name,
                    sku: p.sku,
                    category: p.category,
                    img: p.img || '',
                    quantity: p.quantity || 1
                }))
            };

            await apiClient.put(`${ENV.API_BASE_URL}/transfers/${initialData.id}`, payload);
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
                        {/* Warehouse From */}
                        <div className="stock-form-group">
                            <label>Warehouse From {!isView && <span className="text-danger">*</span>}</label>
                            <select
                                className="stock-modal-select"
                                value={formData.warehouseFrom}
                                onChange={(e) => setFormData({ ...formData, warehouseFrom: e.target.value })}
                                disabled={isView}
                            >
                                <option value="" disabled hidden>Select</option>
                                {ALL_WAREHOUSES.map(w => (
                                    <option key={w} value={w}>{w}</option>
                                ))}
                                {/* Show current value even if not in list */}
                                {formData.warehouseFrom && !ALL_WAREHOUSES.includes(formData.warehouseFrom) && (
                                    <option value={formData.warehouseFrom}>{formData.warehouseFrom}</option>
                                )}
                            </select>
                        </div>

                        {/* Warehouse To */}
                        <div className="stock-form-group">
                            <label>Warehouse To {!isView && <span className="text-danger">*</span>}</label>
                            <select
                                className="stock-modal-select"
                                value={formData.warehouseTo}
                                onChange={(e) => setFormData({ ...formData, warehouseTo: e.target.value })}
                                disabled={isView}
                            >
                                <option value="" disabled hidden>Select</option>
                                {ALL_WAREHOUSES.map(w => (
                                    <option key={w} value={w}>{w}</option>
                                ))}
                                {/* Show current value even if not in list */}
                                {formData.warehouseTo && !ALL_WAREHOUSES.includes(formData.warehouseTo) && (
                                    <option value={formData.warehouseTo}>{formData.warehouseTo}</option>
                                )}
                            </select>
                        </div>
                    </div>

                    {/* Reference No */}
                    <div className="stock-form-group">
                        <label>Reference No {!isView && <span className="text-danger">*</span>}</label>
                        <input
                            type="text"
                            className="stock-modal-input"
                            placeholder="Enter Reference No"
                            value={formData.referenceNo}
                            onChange={(e) => setFormData({ ...formData, referenceNo: e.target.value })}
                            style={{ paddingLeft: '16px' }}
                            readOnly={isView}
                        />
                    </div>

                    {/* Status */}
                    <div className="stock-form-group">
                        <label>Status</label>
                        <select
                            className="stock-modal-select"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            disabled={isView}
                        >
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>

                    {/* Product Search — only in edit mode */}
                    {!isView && (
                        <div className="stock-form-group" style={{ position: 'relative' }} ref={searchRef}>
                            <label>Add Product</label>
                            <div className="stock-search-container">
                                <Search className="stock-search-icon" size={18} />
                                <input
                                    type="text"
                                    className="stock-modal-input search-product-input"
                                    placeholder="Search Product…"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => searchQuery.length > 0 && setShowSuggestions(true)}
                                />
                            </div>

                            {showSuggestions && searchResults.length > 0 && (
                                <div className="stock-suggestions-dropdown">
                                    {searchResults.map((product) => (
                                        <div
                                            key={product.id}
                                            className="stock-suggestion-item"
                                            onClick={() => handleSelectProduct(product)}
                                        >
                                            <div className="suggestion-img">
                                                <img
                                                    src={product.images
                                                        ? product.images.split(',')[0].trim()
                                                        : `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(product.name)}`}
                                                    alt=""
                                                />
                                            </div>
                                            <div className="suggestion-info">
                                                <div className="suggestion-name">{product.name}</div>
                                                <div className="suggestion-sku">SKU: {product.sku}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {showSuggestions && searchResults.length === 0 && (
                                <div className="stock-suggestions-dropdown">
                                    <div className="no-suggestions">No products found</div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Products Table */}
                    <div className="selected-products-container" style={{ display: selectedProducts.length > 0 ? 'block' : 'none' }}>
                        <div className="selected-products-table-wrapper">
                            <table className="selected-products-table">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>SKU</th>
                                        <th>Category</th>
                                        <th>Qty</th>
                                        {!isView && <th></th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedProducts.map((product, idx) => {
                                        const key = getProductKey(product) || idx;
                                        return (
                                            <tr key={key}>
                                                <td>
                                                    <div className="product-info-cell">
                                                        <img
                                                            src={product.img || `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(product.name || 'product')}`}
                                                            alt={product.name}
                                                        />
                                                        <span>{product.name}</span>
                                                    </div>
                                                </td>
                                                <td>{product.sku || '—'}</td>
                                                <td>{product.category || '—'}</td>
                                                <td>
                                                    <div className="qty-control">
                                                        {!isView && (
                                                            <button className="qty-btn" onClick={() => updateQty(key, -1)}>
                                                                <Minus size={14} />
                                                            </button>
                                                        )}
                                                        <span className="qty-value">{product.quantity || 1}</span>
                                                        {!isView && (
                                                            <button className="qty-btn" onClick={() => updateQty(key, 1)}>
                                                                <Plus size={14} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                                {!isView && (
                                                    <td>
                                                        <button className="remove-item-btn" onClick={() => removeProduct(key)}>
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </td>
                                                )}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            <div className="table-indicator-line">
                                <div className="indicator-progress"></div>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="stock-form-group" style={{ marginTop: '20px' }}>
                        <label>Notes</label>
                        <textarea
                            className="stock-modal-input"
                            placeholder="Enter Notes"
                            rows={3}
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
                            {isSubmitting ? 'Saving…' : 'Save Changes'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditTransferModal;
