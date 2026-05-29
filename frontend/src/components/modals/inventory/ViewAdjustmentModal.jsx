import React from 'react';
import { X, Calendar, Package, MapPin, Store, User, Hash, FileText } from 'lucide-react';
import './add-adjustment-modal.css';

const ViewAdjustmentModal = ({ isOpen, onClose, adjustment }) => {
    if (!isOpen || !adjustment) return null;

    return (
        <div className="adjustment-modal-overlay" onClick={onClose}>
            <div className="adjustment-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                <div className="adjustment-modal-header">
                    <h3>Adjustment Details</h3>
                    <button className="adjustment-modal-close" onClick={onClose}>
                        <X size={16} color="white" />
                    </button>
                </div>

                <div className="adjustment-modal-body">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', paddingBottom: '15px', borderBottom: '1px solid #f0f0f0' }}>
                            <img 
                                src={adjustment.productImg || 'https://via.placeholder.com/60'} 
                                alt={adjustment.product} 
                                style={{ width: '60px', height: '60px', borderRadius: '10px', objectFit: 'cover' }}
                            />
                            <div>
                                <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#1e293b' }}>{adjustment.product}</h4>
                                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Ref: {adjustment.referenceNumber || 'N/A'}</span>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>
                                    <Hash size={14} /> Total Quantity
                                </label>
                                <div style={{ fontSize: '1rem', fontWeight: '600', color: '#1e293b' }}>{adjustment.qty}</div>
                            </div>
                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>
                                    <Calendar size={14} /> Date
                                </label>
                                <div style={{ fontSize: '1rem', fontWeight: '600', color: '#1e293b' }}>{adjustment.date}</div>
                            </div>
                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>
                                    <MapPin size={14} /> Warehouse
                                </label>
                                <div style={{ fontSize: '1rem', fontWeight: '600', color: '#1e293b' }}>{adjustment.warehouse}</div>
                            </div>
                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>
                                    <Store size={14} /> Store
                                </label>
                                <div style={{ fontSize: '1rem', fontWeight: '600', color: '#1e293b' }}>{adjustment.store}</div>
                            </div>
                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>
                                    <User size={14} /> Responsible Person
                                </label>
                                <div style={{ fontSize: '1rem', fontWeight: '600', color: '#1e293b' }}>{adjustment.person}</div>
                            </div>
                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>
                                    <FileText size={14} /> Notes
                                </label>
                                <div style={{ fontSize: '1rem', fontWeight: '600', color: '#1e293b' }}>{adjustment.notes || 'No notes available'}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="adjustment-modal-footer">
                    <button className="btn-adjustment-cancel" onClick={onClose}>Close</button>
                    <button className="btn-adjustment-save" onClick={() => window.print()}>Print Info</button>
                </div>
            </div>
        </div>
    );
};

export default ViewAdjustmentModal;
