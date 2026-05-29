import React from 'react';
import { X, User, Calendar, Tag, CreditCard, FileText, Package } from 'lucide-react';
import './add-sales-modal.css';

const statusStyle = s => s==='Completed'
    ? { background:'#dcfce7', color:'#16a34a' }
    : s==='Cancelled'
    ? { background:'#fee2e2', color:'#dc2626' }
    : { background:'#e0f2fe', color:'#0284c7' };

const payStyle = p => p==='Paid'
    ? { background:'#dcfce7', color:'#16a34a' }
    : p==='Overdue'
    ? { background:'#fef3c7', color:'#d97706' }
    : { background:'#fee2e2', color:'#dc2626' };

const ViewSalesModal = ({ isOpen, order, onClose }) => {
    if (!isOpen || !order) return null;

    let prods = [];
    try { prods = JSON.parse(order.productsJson || '[]'); } catch {}

    const fmtMoney = v => `$${parseFloat(v||0).toFixed(2)}`;

    return (
        <div className="sm-overlay" onClick={e => e.target===e.currentTarget && onClose()}>
            <div className="sm-modal" style={{ maxWidth: '860px' }}>
                <div className="sm-header">
                    <div>
                        <h4>Sale Detail</h4>
                        {order.referenceNo && <span className="sm-ref-tag">{order.referenceNo}</span>}
                    </div>
                    <button className="sm-close-btn" onClick={onClose}><X size={16}/></button>
                </div>

                <div className="sm-body">
                    {/* Info cards */}
                    <div className="sm-view-info-grid">
                        <div className="sm-view-card">
                            <User size={15} className="sm-view-icon"/>
                            <div><div className="sm-view-label">Customer</div><div className="sm-view-value">{order.customerName||'—'}</div></div>
                        </div>
                        <div className="sm-view-card">
                            <Calendar size={15} className="sm-view-icon"/>
                            <div><div className="sm-view-label">Date</div><div className="sm-view-value">{order.formattedDate||order.date||'—'}</div></div>
                        </div>
                        <div className="sm-view-card">
                            <Tag size={15} className="sm-view-icon"/>
                            <div>
                                <div className="sm-view-label">Status</div>
                                <span className="sm-status-badge" style={statusStyle(order.status)}>{order.status}</span>
                            </div>
                        </div>
                        <div className="sm-view-card">
                            <CreditCard size={15} className="sm-view-icon"/>
                            <div>
                                <div className="sm-view-label">Payment</div>
                                <span className="sm-pay-badge" style={payStyle(order.paymentStatus)}>
                                    <span className="sm-dot"/>{order.paymentStatus}
                                </span>
                            </div>
                        </div>
                        <div className="sm-view-card">
                            <FileText size={15} className="sm-view-icon"/>
                            <div><div className="sm-view-label">Biller</div><div className="sm-view-value">{order.biller||'Admin'}</div></div>
                        </div>
                        {order.notes && (
                            <div className="sm-view-card" style={{gridColumn:'span 1'}}>
                                <FileText size={15} className="sm-view-icon"/>
                                <div><div className="sm-view-label">Notes</div><div className="sm-view-value">{order.notes}</div></div>
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
                                            <th>Product</th><th>SKU</th><th>Qty</th>
                                            <th>Unit Price</th><th>Discount</th><th>Tax %</th><th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {prods.map((p,i) => {
                                            const base = (parseFloat(p.unitPrice)||0)*(parseInt(p.quantity)||0) - (parseFloat(p.discount)||0);
                                            const total = Math.max(0, base + base*((parseFloat(p.taxPercent)||0)/100));
                                            return (
                                                <tr key={i}>
                                                    <td>
                                                        <div className="sm-view-prod-cell">
                                                            {p.img ? <img src={p.img} alt="" className="sm-view-prod-img"/> : <div className="sm-view-prod-placeholder">{(p.name||'?').charAt(0)}</div>}
                                                            <span>{p.name}</span>
                                                        </div>
                                                    </td>
                                                    <td>{p.sku||'—'}</td>
                                                    <td>{p.quantity}</td>
                                                    <td>{fmtMoney(p.unitPrice)}</td>
                                                    <td>{fmtMoney(p.discount)}</td>
                                                    <td>{parseFloat(p.taxPercent||0).toFixed(1)}%</td>
                                                    <td style={{fontWeight:700,color:'#1b2850'}}>{fmtMoney(total)}</td>
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
                                <tr><td>Order Tax</td><td>{fmtMoney(order.orderTax)}</td></tr>
                                <tr><td>Discount</td><td>{fmtMoney(order.discount)}</td></tr>
                                <tr><td>Shipping</td><td>{fmtMoney(order.shipping)}</td></tr>
                                <tr className="sm-summary-grand"><td>Grand Total</td><td>{fmtMoney(order.grandTotal)}</td></tr>
                                <tr><td>Paid</td><td>{fmtMoney(order.paidAmount)}</td></tr>
                                <tr className={parseFloat(order.dueAmount)>0?'sm-summary-due-pos':'sm-summary-due-zero'}>
                                    <td>Due</td><td>{fmtMoney(order.dueAmount)}</td>
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

export default ViewSalesModal;
