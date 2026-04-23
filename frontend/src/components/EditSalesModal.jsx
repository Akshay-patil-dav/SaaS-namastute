import React, { useState, useEffect, useRef } from 'react';
import { X, Search, Trash2 } from 'lucide-react';
import axios from 'axios';
import './add-sales-modal.css';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EditSalesModal = ({ isOpen, order, onClose, onSuccess }) => {
    const [form, setForm]           = useState({});
    const [products, setProducts]   = useState([]);
    const [searchQ, setSearchQ]     = useState('');
    const [results, setResults]     = useState([]);
    const [showDrop, setShowDrop]   = useState(false);
    const [activeIdx, setActiveIdx] = useState(-1);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError]         = useState('');
    const searchRef = useRef(null);

    useEffect(() => {
        if (isOpen && order) {
            setForm({
                customerName: order.customerName || '',
                date:         order.date || new Date().toISOString().split('T')[0],
                status:       order.status || 'Pending',
                paymentStatus: order.paymentStatus || 'Unpaid',
                orderTax:     order.orderTax  || 0,
                discount:     order.discount  || 0,
                shipping:     order.shipping  || 0,
                paidAmount:   order.paidAmount || 0,
                biller:       order.biller || 'Admin',
                notes:        order.notes  || '',
            });
            try { setProducts(JSON.parse(order.productsJson || '[]').map(p => ({
                productId: p.productId, name: p.name||'', sku: p.sku||'', img: p.img||'',
                quantity: p.quantity||1, unitPrice: parseFloat(p.unitPrice)||0,
                discount: parseFloat(p.discount)||0, taxPercent: parseFloat(p.taxPercent)||0,
            }))); } catch { setProducts([]); }
            setSearchQ(''); setError('');
        }
    }, [isOpen, order]);

    useEffect(() => {
        const h = e => { if (searchRef.current && !searchRef.current.contains(e.target)) setShowDrop(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    useEffect(() => {
        if (!isOpen) return;
        const id = setTimeout(async () => {
            try {
                const url = searchQ.trim() ? `${BASE_URL}/products/search?q=${encodeURIComponent(searchQ)}` : `${BASE_URL}/products`;
                const { data } = await axios.get(url);
                setResults(Array.isArray(data) ? (searchQ.trim() ? data : data.slice(0, 10)) : []);
            } catch { setResults([]); }
        }, 280);
        setActiveIdx(-1);
        return () => clearTimeout(id);
    }, [searchQ, isOpen]);

    const selectProduct = p => {
        const existing = products.find(x => x.productId === p.id);
        if (existing) setProducts(prev => prev.map(x => x.productId===p.id ? {...x, quantity: x.quantity+1} : x));
        else setProducts(prev => [...prev, { productId:p.id, name:p.name, sku:p.sku||'', img: p.images?p.images.split(',')[0].trim():'', quantity:1, unitPrice:parseFloat(p.price)||0, discount:0, taxPercent:0 }]);
        setSearchQ(''); setShowDrop(false);
    };

    const updateField = (idx, field, raw) => {
        const val = field==='quantity' ? Math.max(1,parseInt(raw)||1) : parseFloat(raw)||0;
        setProducts(prev => prev.map((p,i) => i===idx ? {...p,[field]:val} : p));
    };

    const lineTotal = p => { const base = p.unitPrice*p.quantity - p.discount; return Math.max(0, base + base*(p.taxPercent/100)); };
    const subtotal   = products.reduce((s,p) => s+lineTotal(p), 0);
    const grandTotal = Math.max(0, subtotal + +form.orderTax + +form.shipping - +form.discount);
    const due        = Math.max(0, grandTotal - +form.paidAmount);

    const onKey = e => {
        if (!showDrop||!results.length) return;
        if (e.key==='ArrowDown') { e.preventDefault(); setActiveIdx(i=>Math.min(i+1,results.length-1)); }
        else if (e.key==='ArrowUp') { e.preventDefault(); setActiveIdx(i=>Math.max(i-1,0)); }
        else if (e.key==='Enter') { e.preventDefault(); if (activeIdx>=0) selectProduct(results[activeIdx]); }
        else if (e.key==='Escape') setShowDrop(false);
    };

    const submit = async () => {
        if (!form.customerName?.trim()) return setError('Customer name is required.');
        if (!products.length) return setError('Add at least one product.');
        setError(''); setSubmitting(true);
        try {
            await axios.put(`${BASE_URL}/sales/${order.id}`, { ...form, orderTax:+form.orderTax, discount:+form.discount, shipping:+form.shipping, paidAmount:+form.paidAmount, products });
            onSuccess?.(); onClose();
        } catch (err) { setError(err.response?.data?.error || 'Failed to update sale.'); }
        finally { setSubmitting(false); }
    };

    if (!isOpen) return null;

    return (
        <div className="sm-overlay" onClick={e => e.target===e.currentTarget && onClose()}>
            <div className="sm-modal">
                <div className="sm-header">
                    <div>
                        <h4>Edit Sale</h4>
                        {order?.referenceNo && <span className="sm-ref-tag">{order.referenceNo}</span>}
                    </div>
                    <button className="sm-close-btn" onClick={onClose}><X size={16}/></button>
                </div>
                <div className="sm-body">
                    {products.length > 0 && (
                        <div className="sm-prod-header">
                            <span>Product</span><span>Qty</span><span>Unit Price ($)</span>
                            <span>Discount ($)</span><span>Tax (%)</span><span>Total ($)</span><span></span>
                        </div>
                    )}
                    {products.length > 0 && (
                        <div className="sm-prod-rows">
                            {products.map((p,idx) => (
                                <div className="sm-prod-row" key={idx}>
                                    <div className="sm-prod-info">
                                        {p.img ? <img src={p.img} alt="" className="sm-prod-img"/> : <div className="sm-prod-placeholder">{(p.name||'?').charAt(0)}</div>}
                                        <div><div className="sm-prod-name-text">{p.name}</div><div className="sm-prod-sku">SKU: {p.sku}</div></div>
                                    </div>
                                    <input className="sm-prod-input" type="number" min="1" value={p.quantity} onChange={e=>updateField(idx,'quantity',e.target.value)}/>
                                    <input className="sm-prod-input" type="number" min="0" step="0.01" value={p.unitPrice} onChange={e=>updateField(idx,'unitPrice',e.target.value)}/>
                                    <input className="sm-prod-input" type="number" min="0" step="0.01" value={p.discount} onChange={e=>updateField(idx,'discount',e.target.value)}/>
                                    <input className="sm-prod-input" type="number" min="0" step="0.01" value={p.taxPercent} onChange={e=>updateField(idx,'taxPercent',e.target.value)}/>
                                    <div className="sm-prod-total">${lineTotal(p).toFixed(2)}</div>
                                    <button className="sm-prod-remove" onClick={()=>setProducts(prev=>prev.filter((_,i)=>i!==idx))}><Trash2 size={13}/></button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="sm-form-grid-3">
                        <div className="sm-form-group"><label>Customer Name <span className="sm-required">*</span></label>
                            <input className="sm-input" type="text" value={form.customerName||''} onChange={e=>setForm(f=>({...f,customerName:e.target.value}))}/>
                        </div>
                        <div className="sm-form-group"><label>Date</label>
                            <input className="sm-input" type="date" value={form.date||''} onChange={e=>setForm(f=>({...f,date:e.target.value}))}/>
                        </div>
                        <div className="sm-form-group"><label>Biller</label>
                            <input className="sm-input" type="text" value={form.biller||''} onChange={e=>setForm(f=>({...f,biller:e.target.value}))}/>
                        </div>
                    </div>

                    <div className="sm-form-group" ref={searchRef}>
                        <label>Add Product</label>
                        <div className="sm-search-wrap">
                            <Search className="sm-search-icon" size={14}/>
                            <input className="sm-input" style={{paddingLeft:'32px'}} type="text" placeholder="Search by name or SKU…"
                                value={searchQ} onChange={e=>{setSearchQ(e.target.value);setShowDrop(true);}}
                                onKeyDown={onKey} onFocus={()=>setShowDrop(true)}/>
                            {showDrop && (
                                <div className="sm-suggestions">
                                    {results.length > 0 ? (
                                        <ul className="sm-suggestion-list">
                                            {results.map((r,i) => (
                                                <li key={r.id} className={`sm-suggestion-item ${i===activeIdx?'active':''}`} onClick={()=>selectProduct(r)}>
                                                    <div className="sm-sug-img-wrap">
                                                        {r.images&&r.images.split(',')[0]?.trim() ? <img src={r.images.split(',')[0].trim()} alt=""/> : <div className="sm-sug-placeholder">{r.name.charAt(0)}</div>}
                                                    </div>
                                                    <div><div className="sm-sug-name">{r.name}</div><div className="sm-sug-meta">SKU: {r.sku} · ${r.price}</div></div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : <div className="sm-suggestions-empty">No products found</div>}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="sm-summary-row">
                        <div className="sm-summary-box">
                            <table className="sm-summary-table"><tbody>
                                <tr><td>Sub Total</td><td>${subtotal.toFixed(2)}</td></tr>
                                <tr><td>Order Tax</td><td>${(+form.orderTax).toFixed(2)}</td></tr>
                                <tr><td>Discount</td><td>${(+form.discount).toFixed(2)}</td></tr>
                                <tr><td>Shipping</td><td>${(+form.shipping).toFixed(2)}</td></tr>
                                <tr className="sm-summary-grand"><td>Grand Total</td><td>${grandTotal.toFixed(2)}</td></tr>
                                <tr><td>Paid</td><td>${(+form.paidAmount).toFixed(2)}</td></tr>
                                <tr className={due>0?'sm-summary-due-pos':'sm-summary-due-zero'}><td>Due</td><td>${due.toFixed(2)}</td></tr>
                            </tbody></table>
                        </div>
                    </div>

                    <div className="sm-form-grid-4">
                        <div className="sm-form-group"><label>Order Tax ($)</label><input className="sm-input" type="number" min="0" step="0.01" value={form.orderTax||0} onChange={e=>setForm(f=>({...f,orderTax:e.target.value}))}/></div>
                        <div className="sm-form-group"><label>Discount ($)</label><input className="sm-input" type="number" min="0" step="0.01" value={form.discount||0} onChange={e=>setForm(f=>({...f,discount:e.target.value}))}/></div>
                        <div className="sm-form-group"><label>Shipping ($)</label><input className="sm-input" type="number" min="0" step="0.01" value={form.shipping||0} onChange={e=>setForm(f=>({...f,shipping:e.target.value}))}/></div>
                        <div className="sm-form-group"><label>Paid Amount ($)</label><input className="sm-input" type="number" min="0" step="0.01" value={form.paidAmount||0} onChange={e=>setForm(f=>({...f,paidAmount:e.target.value}))}/></div>
                    </div>

                    <div className="sm-form-grid-3">
                        <div className="sm-form-group"><label>Order Status</label>
                            <select className="sm-select" value={form.status||'Pending'} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>
                                <option value="Pending">Pending</option><option value="Completed">Completed</option><option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div className="sm-form-group"><label>Payment Status</label>
                            <select className="sm-select" value={form.paymentStatus||'Unpaid'} onChange={e=>setForm(f=>({...f,paymentStatus:e.target.value}))}>
                                <option value="Unpaid">Unpaid</option><option value="Paid">Paid</option><option value="Overdue">Overdue</option>
                            </select>
                        </div>
                        <div className="sm-form-group"><label>Notes</label>
                            <input className="sm-input" type="text" placeholder="Optional…" value={form.notes||''} onChange={e=>setForm(f=>({...f,notes:e.target.value}))}/>
                        </div>
                    </div>

                    {error && <div className="sm-error">{error}</div>}
                </div>
                <div className="sm-footer">
                    <button className="sm-btn-cancel" onClick={onClose} disabled={submitting}>Cancel</button>
                    <button className="sm-btn-submit" onClick={submit} disabled={submitting}>{submitting?'Saving…':'Save Changes'}</button>
                </div>
            </div>
        </div>
    );
};

export default EditSalesModal;
