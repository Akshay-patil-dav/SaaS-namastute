import React from 'react';
import { X, User, Calendar, Tag, CreditCard, FileText, Package } from 'lucide-react';
import './add-sales-modal.css'; // Reusing the same css as view sales modal for consistency

const statusStyle = s => {
    switch(s?.toLowerCase()) {
        case 'received': return { background:'#dcfce7', color:'#16a34a' };
        case 'ordered': return { background:'#ffedd5', color:'#ea580c' };
        case 'pending': return { background:'#e0f2fe', color:'#0284c7' };
        default: return { background:'#f1f5f9', color:'#64748b' };
    }
};

const payStyle = p => {
    switch(p?.toLowerCase()) {
        case 'paid': return { background:'#dcfce7', color:'#16a34a' };
        case 'overdue': return { background:'#fee2e2', color:'#dc2626' };
        case 'unpaid': return { background:'#fef3c7', color:'#d97706' };
        default: return { background:'#f1f5f9', color:'#64748b' };
    }
};

const ViewPurchaseModal = ({ isOpen, purchase, onClose }) => {
    if (!isOpen || !purchase) return null;

    let prods = [];
    try { prods = JSON.parse(purchase.productsJson || '[]'); } catch {}

    const fmtMoney = v => `$${parseFloat(v||0).toFixed(2)}`;

    return (
        <div className="sm-overlay" onClick={e => e.target===e.currentTarget && onClose()}>
            <div className="sm-modal" style={{ maxWidth: '860px' }}>
                <div className="sm-header">
                    <div>
                        <h4>Purchase Detail</h4>
                        {purchase.reference && <span className="sm-ref-tag">{purchase.reference}</span>}
                    </div>
                    <button className="sm-close-btn" onClick={onClose}><X size={16}/></button>
                </div>

                <div className="sm-body">
                    {/* Info cards */}
                    <div className="sm-view-info-grid">
                        <div className="sm-view-card">
                            <User size={15} className="sm-view-icon"/>
                            <div><div className="sm-view-label">Supplier</div><div className="sm-view-value">{purchase.supplier||'—'}</div></div>
                        </div>
                        <div className="sm-view-card">
                            <Calendar size={15} className="sm-view-icon"/>
                            <div><div className="sm-view-label">Date</div><div className="sm-view-value">{purchase.formattedDate||purchase.date||'—'}</div></div>
                        </div>
                        <div className="sm-view-card">
                            <Tag size={15} className="sm-view-icon"/>
                            <div>
                                <div className="sm-view-label">Status</div>
                                <span className="sm-status-badge" style={statusStyle(purchase.status)}>{purchase.status}</span>
                            </div>
                        </div>
                        <div className="sm-view-card">
                            <CreditCard size={15} className="sm-view-icon"/>
                            <div>
                                <div className="sm-view-label">Payment</div>
                                <span className="sm-pay-badge" style={payStyle(purchase.paymentStatus)}>
                                    <span className="sm-dot"/>{purchase.paymentStatus}
                                </span>
                            </div>
                        </div>
                        {purchase.notes && (
                            <div className="sm-view-card" style={{gridColumn:'span 1'}}>
                                <FileText size={15} className="sm-view-icon"/>
                                <div><div className="sm-view-label">Notes</div><div className="sm-view-value">{purchase.notes}</div></div>
                            </div>
                        )}
                    </div>

                    {/* Products table */}
                    {prods.length > 0 && (
                        <>
                            <div className="sm-section-title"><Package size={13}/> Products ({prods.length})</div>
                            <div className="sm-view-table-wrap">
                                <table className="sm-view-table">
                                    <thead>
                                        <tr>
                                            <th>Product</th><th>Barcode</th><th>Qty</th>
                                            <th>Unit Price</th><th>Discount</th><th>Tax %</th><th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {prods.map((p,i) => {
                                            return (
                                                <tr key={i}>
                                                    <td>
                                                        <div className="sm-view-prod-cell">
                                                            {p.image ? <img src={p.image} alt="" className="sm-view-prod-img"/> : <div className="sm-view-prod-placeholder">{(p.name||'?').charAt(0)}</div>}
                                                            <span>{p.name}</span>
                                                        </div>
                                                    </td>
                                                    <td>{p.barcode||'—'}</td>
                                                    <td>{p.qty}</td>
                                                    <td>{fmtMoney(p.price)}</td>
                                                    <td>{fmtMoney(p.discount)}</td>
                                                    <td>{parseFloat(p.taxRate||0).toFixed(1)}%</td>
                                                    <td style={{fontWeight:700,color:'#1b2850'}}>{fmtMoney(p.totalCost)}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}

                    {/* Totals */}
                    <div className="sm-summary-row" style={{marginTop:'20px'}}>
                        <div className="sm-summary-box">
                            <table className="sm-summary-table"><tbody>
                                <tr><td>Order Tax</td><td>{fmtMoney(purchase.orderTax)}</td></tr>
                                <tr><td>Discount</td><td>{fmtMoney(purchase.discount)}</td></tr>
                                <tr><td>Shipping</td><td>{fmtMoney(purchase.shipping)}</td></tr>
                                <tr className="sm-summary-grand"><td>Grand Total</td><td>{fmtMoney(purchase.total)}</td></tr>
                                <tr><td>Paid</td><td>{fmtMoney(purchase.paid)}</td></tr>
                                <tr className={parseFloat(purchase.due)>0?'sm-summary-due-pos':'sm-summary-due-zero'}>
                                    <td>Due</td><td>{fmtMoney(purchase.due)}</td>
                                </tr>
                            </tbody></table>
                        </div>
                    </div>
                </div>

                <div className="sm-footer">
                    <button className="sm-btn-cancel" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default ViewPurchaseModal;
