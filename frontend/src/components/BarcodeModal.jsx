import React from 'react';
import { X, Printer } from 'lucide-react';
import './barcode-modal.css';
import './add-sales-modal.css'; // Reuse modal-overlay

const BarcodeModal = ({ isOpen, onClose, products = [] }) => {
    if (!isOpen) return null;

    // Use default products if none provided (matching the user image for demonstration)
    const displayProducts = products.length > 0 ? products : [
        { name: 'Nike Jordan', price: '$400', sku: 'HG3FKH8', count: 3 },
        { name: 'Apple Series 5 Watch', price: '$300', sku: 'TEUIU10', count: 1 }
    ];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="barcode-modal-content" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="barcode-modal-header">
                    <h4>Barcode</h4>
                    <button className="close-btn-red" onClick={onClose}>
                        <X size={16} />
                    </button>
                </div>

                {/* Body */}
                <div className="barcode-modal-body">
                    {/* Top Print Button */}
                    <div className="print-actions-top">
                        <button className="btn-print-barcode">
                            <Printer size={18} />
                            Print Barcode
                        </button>
                    </div>

                    {/* Product Groups */}
                    {displayProducts.map((product, pIndex) => (
                        <div key={pIndex} className="product-group">
                            <h5 className="product-group-title">{product.name}</h5>
                            <div className="barcode-grid">
                                {Array.from({ length: product.count || 1 }).map((_, i) => (
                                    <div key={i} className="barcode-card">
                                        <div className="store-name">Grocery Alpha</div>
                                        <div className="product-name">{product.name}</div>
                                        <div className="product-price">Price: {product.price}</div>
                                        
                                        <div className="barcode-image-container">
                                            <img 
                                                src={`https://bwipjs-api.metafloor.com/?bcid=code128&text=${encodeURIComponent(product.sku)}&scale=2&rotate=N`} 
                                                alt={`Barcode for ${product.sku}`}
                                                className="barcode-image"
                                            />
                                        </div>

                                        
                                        <div className="barcode-sku">{product.sku}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BarcodeModal;
