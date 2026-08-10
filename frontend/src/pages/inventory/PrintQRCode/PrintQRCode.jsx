import React, { useState, useEffect } from 'react';
import '../Brands/Products.css';
import apiClient, { ENV } from '@/api/config';
import QRCodeModal from '../../../components/modals/inventory/QRCodeModal/QRCodeModal';
import { 
    RefreshCw, 
    ChevronUp,
    Trash2,
    Eye,
    Power,
    Printer,
    Minus,
    Plus,
    Search
} from 'lucide-react';

const PrintQRCode = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([
        { id: 1, name: 'Nike Jordan', sku: '32RRR554', barcode: '8901234567890', price: '150.00', count: 4 }
    ]);
    const [pageSize, setPageSize] = useState('36mm');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        apiClient.get(`${ENV.API_BASE_URL}/products`)
            .then(res => setProducts(res.data || []))
            .catch(() => {});
    }, []);

    const handleAddProduct = (prod) => {
        if (!selectedProducts.find(p => p.id === prod.id)) {
            setSelectedProducts(prev => [...prev, { ...prod, count: 1 }]);
        }
    };

    const handleUpdateQty = (idx, delta) => {
        setSelectedProducts(prev => {
            const next = [...prev];
            const newCount = (next[idx].count || 1) + delta;
            if (newCount > 0) next[idx].count = newCount;
            return next;
        });
    };

    const handleRemoveProduct = (idx) => {
        setSelectedProducts(prev => prev.filter((_, i) => i !== idx));
    };

    const handleReset = () => {
        setSelectedProducts([]);
        setSearchTerm('');
    };

    return (
        <div className="product-page-container">
            {/* Header Section */}
            <div className="product-page-header">
                <div className="product-page-title">
                    <h4>Print QR Code</h4>
                    <p>Generate and print real ISO scannable product QR codes</p>
                </div>
                
                <div className="page-actions">
                    <button className="btn-icon-action" title="Reset selection" onClick={handleReset}>
                        <RefreshCw size={18} />
                    </button>
                </div>
            </div>

            {/* Main Form Area */}
            <div className="product-table-card form-layout-wrapper p-4">
                
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="form-group mb-0">
                            <label className="form-label" style={{fontSize: '13px', fontWeight: '600', color: '#0f172a'}}>Search &amp; Add Product <span className="text-danger">*</span></label>
                            <div className="search-box w-100 m-0" style={{ maxWidth: 'none', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '6px 12px' }}>
                                <Search size={18} color="#94a3b8" />
                                <input 
                                    type="text" 
                                    className="border-0 bg-transparent"
                                    placeholder="Search Product by Name or SKU..." 
                                    style={{flex: 1, outline: 'none', paddingLeft: '10px', fontSize: '14px'}}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            {searchTerm && (
                                <div className="border rounded bg-white mt-1 shadow-sm" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                    {products.filter(p => (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (p.sku || '').toLowerCase().includes(searchTerm.toLowerCase())).map(p => (
                                        <div 
                                            key={p.id} 
                                            className="p-2 border-bottom hover-bg-light cursor-pointer d-flex justify-content-between align-items-center"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => { handleAddProduct(p); setSearchTerm(''); }}
                                        >
                                            <span className="fw-semibold text-dark">{p.name} ({p.sku || 'No SKU'})</span>
                                            <span className="badge bg-warning text-dark">+ Add</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Print Options Table */}
                <div className="table-responsive mb-4 border rounded bg-white">
                    <table className="table align-middle mb-0" style={{ minWidth: '800px' }}>
                        <thead style={{ backgroundColor: '#f8fafc' }}>
                            <tr>
                                <th style={{ padding: '12px 16px', color: '#475569', fontWeight: '600' }}>Product</th>
                                <th style={{ padding: '12px 16px', color: '#475569', fontWeight: '600' }}>SKU</th>
                                <th style={{ padding: '12px 16px', color: '#475569', fontWeight: '600' }}>Barcode</th>
                                <th style={{ padding: '12px 16px', color: '#475569', fontWeight: '600' }}>Price</th>
                                <th style={{ padding: '12px 16px', color: '#475569', fontWeight: '600' }}>Qty</th>
                                <th style={{ padding: '12px 16px', width: '60px', textAlign: 'center' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-4 text-muted">
                                        No products selected. Search and add products above to generate QR codes.
                                    </td>
                                </tr>
                            ) : (
                                selectedProducts.map((product, idx) => (
                                    <tr key={idx}>
                                        <td style={{ padding: '12px 16px' }}>
                                            <span className="fw-bold text-dark">{product.name}</span>
                                        </td>
                                        <td style={{ padding: '12px 16px', color: '#64748b' }}>
                                            {product.sku || 'N/A'}
                                        </td>
                                        <td style={{ padding: '12px 16px', color: '#64748b' }}>
                                            {product.itemBarcode || product.barcode || 'N/A'}
                                        </td>
                                        <td style={{ padding: '12px 16px', color: '#0f172a', fontWeight: '600' }}>
                                            ₹{product.price || '0.00'}
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <div className="d-inline-flex border rounded align-items-center" style={{ width: '100px', height: '34px', justifyContent: 'space-between' }}>
                                                <button className="btn btn-sm border-0 d-flex align-items-center justify-content-center text-secondary" onClick={() => handleUpdateQty(idx, -1)}>
                                                    <Minus size={14}/>
                                                </button>
                                                <span style={{fontSize: '14px', fontWeight: '600'}}>{product.count || 1}</span>
                                                <button className="btn btn-sm border-0 d-flex align-items-center justify-content-center text-secondary" onClick={() => handleUpdateQty(idx, 1)}>
                                                    <Plus size={14}/>
                                                </button>
                                            </div>
                                        </td>
                                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleRemoveProduct(idx)}>
                                                <Trash2 size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Configuration Options */}
                <div className="row align-items-center flex-wrap mb-4">
                    <div className="col-md-6 mb-3 mb-md-0">
                        <div className="form-group mb-0">
                            <label className="form-label" style={{fontSize: '13px', fontWeight: '600', color: '#0f172a'}}>Label Paper Size <span className="text-danger">*</span></label>
                            <select className="form-select custom-input" value={pageSize} onChange={(e) => setPageSize(e.target.value)}>
                                <option value="36mm">36mm Standard Thermal</option>
                                <option value="24mm">24mm Compact Label</option>
                                <option value="A4">A4 Sheet (40 per page)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="d-flex justify-content-end gap-3 pt-4" style={{borderTop: '1px solid #e2e8f0'}}>
                    <button 
                        className="btn text-white fw-bold d-flex align-items-center gap-2" 
                        style={{ height: '42px', padding: '0 24px', borderRadius: '8px', backgroundColor: '#ff9b29', border: 'none' }}
                        onClick={() => setIsModalOpen(true)}
                        disabled={selectedProducts.length === 0}
                    >
                        <Eye size={16} /> Generate Real QR Code
                    </button>
                    <button 
                        className="btn btn-dark text-white fw-bold d-flex align-items-center gap-2" 
                        style={{ height: '42px', padding: '0 20px', borderRadius: '8px' }}
                        onClick={handleReset}
                    >
                        <Power size={16} /> Reset
                    </button>
                    <button 
                        className="btn btn-danger text-white fw-bold d-flex align-items-center gap-2" 
                        style={{ height: '42px', padding: '0 24px', borderRadius: '8px' }}
                        onClick={() => setIsModalOpen(true)}
                        disabled={selectedProducts.length === 0}
                    >
                        <Printer size={16} /> Print QR Code
                    </button>
                </div>

            </div>

            {/* QR Code Printable Modal */}
            {isModalOpen && (
                <QRCodeModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    products={selectedProducts}
                    pageSize={pageSize}
                    showStoreName={true}
                    showProductName={true}
                    showPrice={true}
                />
            )}
        </div>
    );
};

export default PrintQRCode;
