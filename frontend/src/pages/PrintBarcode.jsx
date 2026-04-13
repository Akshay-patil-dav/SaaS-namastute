import React, { useState, useEffect, useRef } from 'react';
import BarcodeModal from '../components/BarcodeModal';
import axios from 'axios';


import './Products.css';
import { 
    RefreshCw, 
    ChevronUp,
    Trash2,
    Eye,
    Power,
    Printer,
    MinusSquare,
    PlusSquare,
    Minus,
    Plus
} from 'lucide-react';

const PrintBarcode = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
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
        const searchProducts = async () => {
            if (searchQuery.length < 2) {
                setSearchResults([]);
                setShowSuggestions(false);
                return;
            }

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
    }, [searchQuery]);

    const handleSelectProduct = (product) => {
        const existing = selectedProducts.find(p => p.id === product.id);
        if (existing) {
            setSelectedProducts(selectedProducts.map(p => 
                p.id === product.id ? { ...p, count: (p.count || 0) + 1 } : p
            ));
        } else {
            setSelectedProducts([...selectedProducts, { 
                ...product, 
                count: 1,
                // Ensure field names match what the modal expects or the table shows
                //sku: product.sku || product.itemBarcode
            }]);
        }
        setSearchQuery('');
        setShowSuggestions(false);
    };

    const updateQuantity = (id, delta) => {
        setSelectedProducts(selectedProducts.map(p => {
            if (p.id === id) {
                const newCount = (p.count || 0) + delta;
                return { ...p, count: newCount > 0 ? newCount : 1 };
            }
            return p;
        }));
    };

    const removeProduct = (id) => {
        setSelectedProducts(selectedProducts.filter(p => p.id !== id));
    };

    const handleGenerateBarcode = () => {
        if (selectedProducts.length === 0) {
            alert('Please add at least one product to the table.');
            return;
        }
        setIsModalOpen(true);
    };

    const handleReset = () => {
        setSelectedProducts([]);
        setSearchQuery('');
    };


    return (
        <div className="product-page-container">
            {/* Header Section */}
            <div className="product-page-header">
                <div className="product-page-title">
                    <h4>Print Barcode</h4>
                    <p>Print product barcodes</p>
                </div>
                
                <div className="page-actions">
                    <button className="btn-icon-action" title="Refresh">
                        <RefreshCw size={18} />
                    </button>
                    <button className="btn-icon-action" title="Collapse">
                        <ChevronUp size={18} />
                    </button>
                </div>
            </div>

            {/* Main Form Area */}
            <div className="product-table-card form-layout-wrapper p-4">
                
                <div className="row mb-4">
                    <div className="col-md-6">
                        <div className="form-group mb-0">
                            <label className="form-label" style={{fontSize: '13px', fontWeight: '500'}}>Warehouse</label>
                            <select className="form-select custom-input">
                                <option>Select</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group mb-0">
                            <label className="form-label" style={{fontSize: '13px', fontWeight: '500'}}>Store <span className="text-danger">*</span></label>
                            <select className="form-select custom-input">
                                <option>Select</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="row mb-4">
                    <div className="col-12 position-relative" ref={searchRef}>
                        <input 
                            type="text" 
                            className="form-control custom-input" 
                            placeholder="Search Product by Name or Barcode Number" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                        />
                        
                        {showSuggestions && (
                            <div className="search-suggestions-container border rounded shadow-sm position-absolute bg-white" style={{ zIndex: 1000, width: 'calc(100% - 24px)', marginTop: '2px', maxHeight: '300px', overflowY: 'auto' }}>
                                {searchResults.length > 0 ? (
                                    <ul className="list-unstyled mb-0">
                                        {searchResults.map(product => (
                                            <li 
                                                key={product.id} 
                                                className="p-3 border-bottom suggestion-item" 
                                                style={{ cursor: 'pointer', transition: 'background 0.2s' }}
                                                onClick={() => handleSelectProduct(product)}
                                                onMouseEnter={(e) => e.target.style.backgroundColor = '#f8fafc'}
                                                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                            >
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <div style={{ fontWeight: '600', color: '#1e293b' }}>{product.name}</div>
                                                        <div style={{ fontSize: '12px', color: '#64748b' }}>SKU: {product.sku} | Price: ${product.price}</div>
                                                    </div>
                                                    <div style={{ fontSize: '11px', background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', color: '#475569' }}>
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
                </div>


                {/* Print Options Table */}
                <div className="table-responsive mb-5 border rounded">
                    <table className="table mb-0" style={{ minWidth: '700px' }}>
                        <thead style={{ backgroundColor: '#e9ecef' }}>
                            <tr>
                                <th style={{ backgroundColor: 'transparent', borderBottom: 'none', color: '#4b5563', fontWeight: '500', padding: '12px 16px' }}>Product</th>
                                <th style={{ backgroundColor: 'transparent', borderBottom: 'none', color: '#4b5563', fontWeight: '500', padding: '12px 16px' }}>SKU</th>
                                <th style={{ backgroundColor: 'transparent', borderBottom: 'none', color: '#4b5563', fontWeight: '500', padding: '12px 16px' }}>Code</th>
                                <th style={{ backgroundColor: 'transparent', borderBottom: 'none', color: '#4b5563', fontWeight: '500', padding: '12px 16px' }}>Qty</th>
                                <th style={{ backgroundColor: 'transparent', borderBottom: 'none', padding: '12px 16px', width: '60px' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedProducts.length > 0 ? (
                                selectedProducts.map(product => (
                                    <tr key={product.id}>
                                        <td style={{ padding: '16px', verticalAlign: 'middle' }}>{product.name}</td>
                                        <td style={{ padding: '16px', verticalAlign: 'middle', color: '#6b7280' }}>{product.sku}</td>
                                        <td style={{ padding: '16px', verticalAlign: 'middle', color: '#6b7280' }}>{product.itemBarcode || 'N/A'}</td>
                                        <td style={{ padding: '16px', verticalAlign: 'middle' }}>
                                            <div className="d-inline-flex border rounded align-items-center" style={{ width: '100px', height: '36px', justifyContent: 'space-between' }}>
                                                <button 
                                                    className="btn btn-sm border-0 d-flex align-items-center justify-content-center text-secondary" 
                                                    style={{height: '100%', width: '30px'}}
                                                    onClick={() => updateQuantity(product.id, -1)}
                                                >
                                                    <Minus size={14}/>
                                                </button>
                                                <span style={{fontSize: '14px', fontWeight: '500'}}>{product.count}</span>
                                                <button 
                                                    className="btn btn-sm border-0 d-flex align-items-center justify-content-center text-secondary" 
                                                    style={{height: '100%', width: '30px'}}
                                                    onClick={() => updateQuantity(product.id, 1)}
                                                >
                                                    <Plus size={14}/>
                                                </button>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px', verticalAlign: 'middle', textAlign: 'center' }}>
                                            <button 
                                                className="btn btn-sm btn-outline-light border text-danger d-flex align-items-center justify-content-center" 
                                                style={{ width: '32px', height: '32px' }}
                                                onClick={() => removeProduct(product.id)}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center p-5 text-muted">
                                        No products added. Use the search bar above to add products.
                                    </td>
                                </tr>
                            )}
                        </tbody>

                    </table>
                </div>

                {/* Configuration Options */}
                <div className="row align-items-center mb-5">
                    <div className="col-md-5">
                        <select className="form-select custom-input" defaultValue="36mm (1.4 inch)">
                            <option value="36mm (1.4 inch)">36mm (1.4 inch)</option>
                            <option value="12mm (0.47 inch)">12mm (0.47 inch)</option>
                        </select>
                    </div>
                    <div className="col-md-7 d-flex justify-content-end align-items-center gap-5">
                        <div className="d-flex flex-column align-items-center">
                            <span className="mb-2" style={{fontSize: '13px', fontWeight: '600', color: '#4b5563'}}>Show Store Name</span>
                            <label className="switch mb-0">
                                <input type="checkbox" defaultChecked />
                                <span className="slider round"></span>
                            </label>
                        </div>
                        <div className="d-flex flex-column align-items-center">
                            <span className="mb-2" style={{fontSize: '13px', fontWeight: '600', color: '#4b5563'}}>Show Product Name</span>
                            <label className="switch mb-0">
                                <input type="checkbox" defaultChecked />
                                <span className="slider round"></span>
                            </label>
                        </div>
                        <div className="d-flex flex-column align-items-center">
                            <span className="mb-2" style={{fontSize: '13px', fontWeight: '600', color: '#4b5563'}}>Show Price</span>
                            <label className="switch mb-0">
                                <input type="checkbox" defaultChecked />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="d-flex justify-content-end gap-3 pt-4" style={{borderTop: '1px solid #e2e8f0'}}>
                    <button 
                        className="btn-orange text-white d-flex align-items-center justify-content-center gap-2" 
                        style={{ height: '40px', padding: '0 20px', borderRadius: '4px', border: 'none', fontWeight: '500', fontSize: '14px' }}
                        onClick={handleGenerateBarcode}
                    >
                        <Eye size={16} /> Generate Barcode
                    </button>

                    <button 
                        className="btn d-flex align-items-center justify-content-center gap-2" 
                        style={{ height: '40px', padding: '0 20px', borderRadius: '4px', border: 'none', backgroundColor: '#0f172a', color: 'white', fontWeight: '500', fontSize: '14px' }}
                        onClick={handleReset}
                    >
                        <Power size={16} /> Reset Barcode
                    </button>

                    <button className="btn d-flex align-items-center justify-content-center gap-2" style={{ height: '40px', padding: '0 20px', borderRadius: '4px', border: 'none', backgroundColor: '#ef4444', color: 'white', fontWeight: '500', fontSize: '14px' }}>
                        <Printer size={16} /> Print Barcode
                    </button>
                </div>

            </div>

            {/* Barcode Preview Modal */}
            <BarcodeModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                products={selectedProducts}
            />

        </div>

    );
};

export default PrintBarcode;
