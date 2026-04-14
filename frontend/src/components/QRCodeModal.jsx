import React from 'react';
import { X, Printer } from 'lucide-react';
import './qrcode-modal.css';
import './add-sales-modal.css'; // Reuse modal-overlay

const QRCodeModal = ({ isOpen, onClose, products = [], pageSize = '36mm' }) => {
    if (!isOpen) return null;

    // Use default products if none provided (matching the user image for demonstration)
    const displayProducts = products.length > 0 ? products : [
        { name: 'Nike Jordan', sku: '32RRR554' }
    ];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="qrcode-modal-content" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="qrcode-modal-header">
                    <h4>QR Code</h4>
                    <button className="close-btn-red" onClick={onClose}>
                        <X size={16} />
                    </button>
                </div>

                {/* Body */}
                <div className="qrcode-modal-body">
                    {/* Top Print Button */}
                    <div className="print-actions-top">
                        <button className="btn-print-qrcode" onClick={() => window.print()}>
                            <Printer size={18} />
                            Print QR Code
                        </button>
                    </div>

                    {/* Product Sections */}
                    <div className={`qrcode-print-area ${pageSize.replace(/[\(\)]/g, '').replace(/\s+/g, '-').toLowerCase()}`}>
                        {displayProducts.map((product, pIndex) => (
                            <div key={pIndex} className="qrcode-product-group">
                                <h5 className="qrcode-product-group-title">{product.name}</h5>
                                
                                <div className="qrcode-grid">
                                    {Array.from({ length: product.count || 1 }).map((_, i) => (
                                        <div key={i} className="qrcode-card">
                                            <div className="qrcode-image-container">
                                                <img 
                                                    src={`https://bwipjs-api.metafloor.com/?bcid=qrcode&text=${encodeURIComponent(product.sku || product.itemBarcode || 'N/A')}&scale=4`} 
                                                    alt={`QR Code for ${product.sku}`}
                                                    className="qrcode-image"
                                                />
                                            </div>
                                            <div className="qrcode-ref-text">
                                                Ref No :{product.sku || product.itemBarcode || 'N/A'}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QRCodeModal;
