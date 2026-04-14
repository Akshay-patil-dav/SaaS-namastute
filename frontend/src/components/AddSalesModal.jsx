import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Calendar, Search, Maximize, Minus } from 'lucide-react';
import axios from 'axios';
import './add-sales-modal.css';

const AddSalesModal = ({ isOpen, onClose }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const searchRef = useRef(null);

    // Handle clicks outside search results to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Search logic with simple debouncing effect
    useEffect(() => {
        if (!isOpen) return;
        
        const searchProducts = async () => {
            let url = searchQuery.length > 0 
                ? `${import.meta.env.VITE_API_BASE_URL}/products/search?q=${searchQuery}`
                : `${import.meta.env.VITE_API_BASE_URL}/products`;

            try {
                const response = await axios.get(url);
                setSearchResults(searchQuery.length > 0 ? response.data : response.data.slice(0, 10));
                if (searchQuery.length > 0 || searchQuery === '') {
                    // Logic to show suggestions
                }
            } catch (error) {
                console.error('Search error:', error);
            }
        };

        const timeoutId = setTimeout(searchProducts, 300);
        setActiveSuggestionIndex(-1);
        return () => clearTimeout(timeoutId);
    }, [searchQuery, isOpen]);

    const handleSelectProduct = (product) => {
        const existing = selectedProducts.find(p => p.id === product.id);
        if (existing) {
            setSelectedProducts(selectedProducts.map(p => 
                p.id === product.id ? { ...p, count: (p.count || 0) + 1 } : p
            ));
        } else {
            setSelectedProducts([...selectedProducts, { ...product, count: 1 }]);
        }
        setSearchQuery('');
        setShowSuggestions(false);
    };

    const handleKeyDown = (e) => {
        if (showSuggestions && searchResults.length > 0) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActiveSuggestionIndex(prev => (prev < searchResults.length - 1 ? prev + 1 : prev));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActiveSuggestionIndex(prev => (prev > 0 ? prev - 1 : 0));
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (activeSuggestionIndex >= 0 && activeSuggestionIndex < searchResults.length) {
                    handleSelectProduct(searchResults[activeSuggestionIndex]);
                }
            } else if (e.key === 'Escape') {
                setShowSuggestions(false);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content add-sales-modal">
                {/* Header */}
                <div className="modal-header">
                    <h4>Add Sales</h4>
                    <button className="close-btn-red" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="modal-body">
                    {/* Top Stats Header */}
                    <div className="modal-table-header">
                        <div className="header-item">Product</div>
                        <div className="header-item">Qty</div>
                        <div className="header-item">Purchase Price($)</div>
                        <div className="header-item">Discount($)</div>
                        <div className="header-item">Tax(%)</div>
                        <div className="header-item">Tax Amount($)</div>
                        <div className="header-item">Unit Cost($)</div>
                        <div className="header-item">Total Cost(%)</div>
                    </div>

                    {/* Form Fields Row 1 */}
                    <div className="form-row-grid">
                        <div className="form-group">
                            <label>Customer Name <span className="required">*</span></label>
                            <div className="input-with-action">
                                <select className="form-select">
                                    <option>Select</option>
                                </select>
                                <button className="btn-plus-blue">
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Date <span className="required">*</span></label>
                            <div className="input-icon-wrapper">
                                <input type="text" placeholder="Choose" className="form-input" />
                                <Calendar className="input-icon-right" size={16} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Supplier <span className="required">*</span></label>
                            <select className="form-select">
                                <option>Select</option>
                            </select>
                        </div>
                    </div>

                    {/* Product Search */}
                    <div className="form-group mt-3 position-relative" ref={searchRef}>
                        <label>Product <span className="required">*</span></label>
                        <div className="input-icon-wrapper">
                            <input 
                                type="text" 
                                placeholder="Search by name or Item Code (e.g. 6633445943263)" 
                                className="form-input" 
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setShowSuggestions(true);
                                }}
                                onKeyDown={handleKeyDown}
                                onFocus={() => setShowSuggestions(true)}
                            />
                            <Maximize className="input-icon-right gray-icon" size={16} />
                        </div>

                        {showSuggestions && (
                            <div className="search-suggestions-container border rounded shadow-sm position-absolute bg-white" 
                                style={{ zIndex: 1050, width: '100%', marginTop: '2px', maxHeight: '250px', overflowY: 'auto', left: 0 }}>
                                {searchResults.length > 0 ? (
                                    <ul className="list-unstyled mb-0">
                                        {searchResults.map((product, index) => (
                                            <li 
                                                key={product.id} 
                                                className={`suggestion-item ${index === activeSuggestionIndex ? 'active' : ''}`}
                                                style={{ padding: '10px 15px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }}
                                                onClick={() => handleSelectProduct(product)}
                                            >
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="suggestion-img-wrapper" style={{ width: '32px', height: '32px' }}>
                                                        {product.images && product.images.split(',')[0]?.trim() ? (
                                                            <img src={product.images.split(',')[0].trim()} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
                                                        ) : (
                                                            <div style={{ width: '100%', height: '100%', background: '#f1f5f9', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#64748b' }}>
                                                                {product.name.charAt(0).toUpperCase()}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <div style={{ fontWeight: '600', fontSize: '13px' }}>{product.name}</div>
                                                        <div style={{ fontSize: '11px', color: '#64748b' }}>SKU: {product.sku} | Price: ${product.price}</div>
                                                    </div>
                                                    <div style={{ fontSize: '10px', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>
                                                        {product.itemBarcode}
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="p-3 text-muted text-center" style={{ fontSize: '13px' }}>No products found</div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Middle Section: Summary Table */}
                    <div className="summary-section-flex">
                        <div className="left-spacer"></div>
                        <div className="summary-table-container">
                            <table className="summary-mini-table">
                                <tbody>
                                    <tr>
                                        <td>Order Tax</td>
                                        <td>$ 0.00</td>
                                    </tr>
                                    <tr>
                                        <td>Discount</td>
                                        <td>$ 0.00</td>
                                    </tr>
                                    <tr>
                                        <td>Shipping</td>
                                        <td>$ 0.00</td>
                                    </tr>
                                    <tr className="grand-total-row">
                                        <td>Grand Total</td>
                                        <td>$ 0.00</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Bottom Form Fields */}
                    <div className="form-row-grid four-cols">
                        <div className="form-group">
                            <label>Order Tax <span className="required">*</span></label>
                            <input type="number" defaultValue="0" className="form-input" />
                        </div>
                        <div className="form-group">
                            <label>Discount <span className="required">*</span></label>
                            <input type="number" defaultValue="0" className="form-input" />
                        </div>
                        <div className="form-group">
                            <label>Shipping <span className="required">*</span></label>
                            <input type="number" defaultValue="0" className="form-input" />
                        </div>
                        <div className="form-group">
                            <label>Status <span className="required">*</span></label>
                            <select className="form-select">
                                <option>Select</option>
                                <option>Received</option>
                                <option>Pending</option>
                                <option>Ordered</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="modal-footer">
                    <button className="btn-cancel" onClick={onClose}>Cancel</button>
                    <button className="btn-submit">Submit</button>
                </div>
            </div>
        </div>
    );
};

export default AddSalesModal;
