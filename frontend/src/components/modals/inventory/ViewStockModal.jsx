import React from 'react';
import { X, Calendar, Package, MapPin, Store, User, Hash, Layers } from 'lucide-react';
import './add-stock-modal.css';

const ViewStockModal = ({ isOpen, onClose, stock }) => {
    if (!isOpen || !stock) return null;

    return (
        <div className="stock-modal-overlay" onClick={onClose}>
            <div className="stock-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                <div className="stock-modal-header">
                    <h3>Stock Details</h3>
                    <button className="stock-modal-close" onClick={onClose}>
                        <X size={16} />
                    </button>
                </div>

                <div className="stock-modal-body">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', paddingBottom: '15px', borderBottom: '1px solid #f0f0f0' }}>
                            <img 
                                src={stock.productImg || 'https://via.placeholder.com/60'} 
                                alt={stock.productName} 
                                style={{ width: '60px', height: '60px', borderRadius: '10px', objectFit: 'cover' }}
                            />
                            <div>
                                <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#1e293b' }}>{stock.productName}</h4>
                                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>SKU: {stock.productSku}</span>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="detail-item">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>
                                    <Hash size={14} /> Total Quantity
                                </label>
                                <div style={{ fontSize: '1rem', fontWeight: '600', color: '#1e293b' }}>{stock.quantity}</div>
                            </div>
                            <div className="detail-item">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>
                                    <Calendar size={14} /> Entry Date
                                </label>
                                <div style={{ fontSize: '1rem', fontWeight: '600', color: '#1e293b' }}>{stock.date}</div>
                            </div>
                            <div className="detail-item">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>
                                    <Layers size={14} /> Category
                                </label>
                                <div style={{ fontSize: '1rem', fontWeight: '600', color: '#1e293b' }}>{stock.productCategory || 'N/A'}</div>
                            </div>
                            <div className="detail-item">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>
                                    <MapPin size={14} /> Warehouse
                                </label>
                                <div style={{ fontSize: '1rem', fontWeight: '600', color: '#1e293b' }}>{stock.warehouse}</div>
                            </div>
                            <div className="detail-item">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>
                                    <Store size={14} /> Store
                                </label>
                                <div style={{ fontSize: '1rem', fontWeight: '600', color: '#1e293b' }}>{stock.store}</div>
                            </div>
                            <div className="detail-item">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>
                                    <User size={14} /> Responsible Person
                                </label>
                                <div style={{ fontSize: '1rem', fontWeight: '600', color: '#1e293b' }}>{stock.responsiblePerson}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="stock-modal-footer">
                    <button className="btn-stock-cancel" onClick={onClose}>Close</button>
                    <button className="btn-stock-save" onClick={() => window.print()}>Print Info</button>
                </div>
            </div>
        </div>
    );
};

export default ViewStockModal;
