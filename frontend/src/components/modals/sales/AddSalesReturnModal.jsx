import React, { useState, useEffect, useRef } from 'react';
import { X, Calendar, Barcode, Trash2 } from 'lucide-react';
import apiClient, { API, ENV } from '@/api/config';
import './add-sales-return-modal.css';

const BASE_URL = ENV.API_BASE_URL;

const EMPTY = {
    customerName: '',
    date: new Date().toISOString().split('T')[0],
    referenceNo: '',
    orderTax: 0,
    discount: 0,
    shipping: 0,
    status: 'Pending',
};

/* ── Helper: generate reference ── */
const genRef = () => 'SR' + Math.floor(100000 + Math.random() * 900000);

const AddSalesReturnModal = ({ isOpen, onClose, onSuccess }) => {
    const [form, setForm]             = useState({ ...EMPTY, referenceNo: genRef() });
    const [products, setProducts]     = useState([]);
    const [searchQ, setSearchQ]       = useState('');
    const [results, setResults]       = useState([]);
    const [showDrop, setShowDrop]     = useState(false);
    const [activeIdx, setActiveIdx]   = useState(-1);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError]           = useState('');
    const searchRef = useRef(null);

    /* reset on open */
    useEffect(() => {
        if (isOpen) {
            setForm({ ...EMPTY, referenceNo: genRef() });
            setProducts([]);
            setSearchQ('');
            setError('');
        }
    }, [isOpen]);

    /* close dropdown on outside click */
    useEffect(() => {
        const h = e => {
            if (searchRef.current && !searchRef.current.contains(e.target)) setShowDrop(false);
        };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    /* debounced product search */
    useEffect(() => {
        if (!isOpen) return;
        const id = setTimeout(async () => {
            try {
                const url = searchQ.trim()
                    ? `${BASE_URL}/products/search?q=${encodeURIComponent(searchQ)}`
                    : `${BASE_URL}/products`;
                const { data } = await apiClient.get(url);
                setResults(Array.isArray(data) ? (searchQ.trim() ? data : data.slice(0, 10)) : []);
            } catch { setResults([]); }
        }, 280);
        setActiveIdx(-1);
        return () => clearTimeout(id);
    }, [searchQ, isOpen]);

    /* ── product helpers ── */
    const selectProduct = p => {
        const existing = products.find(x => x.productId === p.id);
        if (existing) {
            setProducts(prev => prev.map(x =>
                x.productId === p.id ? { ...x, quantity: x.quantity + 1 } : x
            ));
        } else {
            setProducts(prev => [...prev, {
                productId:  p.id,
                name:       p.name,
                sku:        p.sku || '',
                img:        p.images ? p.images.split(',')[0].trim() : '',
                stock:      p.quantity ?? 0,
                quantity:   1,
                unitPrice:  parseFloat(p.price) || 0,
                discount:   0,
                taxPercent: 0,
            }]);
        }
        setSearchQ(''); setShowDrop(false);
    };

    const updateRow = (idx, field, raw) => {
        const val = field === 'quantity'
            ? Math.max(1, parseInt(raw) || 1)
            : parseFloat(raw) || 0;
        setProducts(prev => prev.map((p, i) => i === idx ? { ...p, [field]: val } : p));
    };

    const removeRow = idx => setProducts(prev => prev.filter((_, i) => i !== idx));

    /* ── totals ── */
    const lineSubtotal = p => {
        const base = p.unitPrice * p.quantity - p.discount;
        return Math.max(0, base + base * (p.taxPercent / 100));
    };
    const subtotal   = products.reduce((s, p) => s + lineSubtotal(p), 0);
    const grandTotal = Math.max(0, subtotal + +form.orderTax + +form.shipping - +form.discount);

    /* ── keyboard nav ── */
    const onKey = e => {
        if (!showDrop || !results.length) return;
        if (e.key === 'ArrowDown')  { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, results.length - 1)); }
        else if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)); }
        else if (e.key === 'Enter')     { e.preventDefault(); if (activeIdx >= 0) selectProduct(results[activeIdx]); }
        else if (e.key === 'Escape')    setShowDrop(false);
    };

    /* ── submit ── */
    const submit = async () => {
        if (!form.customerName.trim()) return setError('Customer name is required.');
        if (!products.length)          return setError('Add at least one product.');
        setError(''); setSubmitting(true);
        try {
            await apiClient.post(`${BASE_URL}/sales-returns`, {
                customerName:  form.customerName,
                date:          form.date,
                referenceNo:   form.referenceNo,
                status:        form.status,
                paymentStatus: 'Unpaid',
                orderTax:      +form.orderTax,
                discount:      +form.discount,
                shipping:      +form.shipping,
                paidAmount:    0,
                biller:        'Admin',
                products,
            });
            onSuccess?.();
            onClose();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create sales return.');
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="srm-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="srm-modal">

                {/* ── Header ── */}
                <div className="srm-header">
                    <h4>Add Sales Return</h4>
                    <button className="srm-close-btn" onClick={onClose} aria-label="Close">
                        <X size={14} />
                    </button>
                </div>

                {/* ── Body ── */}
                <div className="srm-body">

                    {/* ── Row 1: Customer | Date | Reference ── */}
                    <div className="srm-top-row">

                        {/* Customer Name */}
                        <div className="srm-form-group">
                            <span className="srm-label">Customer Name <span className="srm-required">*</span></span>
                            <input
                                className="srm-input"
                                type="text"
                                placeholder="Enter customer name"
                                value={form.customerName}
                                onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))}
                            />
                        </div>

                        {/* Date */}
                        <div className="srm-form-group">
                            <span className="srm-label">Date <span className="srm-required">*</span></span>
                            <div className="srm-date-wrap">
                                <input
                                    className="srm-input"
                                    type="date"
                                    value={form.date}
                                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                                />
                                <Calendar size={14} className="srm-date-icon" />
                            </div>
                        </div>

                        {/* Reference */}
                        <div className="srm-form-group">
                            <span className="srm-label">Reference <span className="srm-required">*</span></span>
                            <input
                                className="srm-input"
                                type="text"
                                value={form.referenceNo}
                                onChange={e => setForm(f => ({ ...f, referenceNo: e.target.value }))}
                            />
                        </div>
                    </div>

                    {/* ── Product search ── */}
                    <div ref={searchRef} className="srm-product-search-wrap">
                        <input
                            className="srm-product-search-input"
                            type="text"
                            placeholder="Please type product code and select"
                            value={searchQ}
                            onChange={e => { setSearchQ(e.target.value); setShowDrop(true); }}
                            onFocus={() => setShowDrop(true)}
                            onKeyDown={onKey}
                        />
                        <Barcode size={16} className="srm-barcode-icon" />

                        {showDrop && (
                            <div className="srm-suggestions">
                                {results.length > 0 ? (
                                    <ul className="srm-suggestion-list">
                                        {results.map((r, i) => (
                                            <li
                                                key={r.id}
                                                className={`srm-suggestion-item ${i === activeIdx ? 'active' : ''}`}
                                                onClick={() => selectProduct(r)}
                                            >
                                                <div className="srm-sug-img-wrap">
                                                    {r.images && r.images.split(',')[0]?.trim()
                                                        ? <img src={r.images.split(',')[0].trim()} alt="" />
                                                        : <div className="srm-sug-placeholder">{r.name.charAt(0)}</div>
                                                    }
                                                </div>
                                                <div>
                                                    <div className="srm-sug-name">{r.name}</div>
                                                    <div className="srm-sug-meta">SKU: {r.sku} · ${r.price}</div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="srm-suggestions-empty">No products found</div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ── Product table ── */}
                    <div className="srm-table-wrap">
                        <table className="srm-table">
                            <thead>
                                <tr>
                                    <th>Product Name</th>
                                    <th>Net Unit Price($)</th>
                                    <th>Stock</th>
                                    <th>QTY</th>
                                    <th>Discount($)</th>
                                    <th>Tax %</th>
                                    <th>Subtotal ($)</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.length > 0 ? products.map((p, idx) => (
                                    <tr key={idx}>
                                        <td>
                                            <div className="srm-table-prod-cell">
                                                {p.img
                                                    ? <img src={p.img} alt="" className="srm-table-prod-img" />
                                                    : <div className="srm-table-prod-placeholder">{p.name.charAt(0)}</div>
                                                }
                                                <span className="srm-table-prod-name">{p.name}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <input
                                                className="srm-table-input"
                                                type="number" min="0" step="0.01"
                                                value={p.unitPrice}
                                                onChange={e => updateRow(idx, 'unitPrice', e.target.value)}
                                            />
                                        </td>
                                        <td style={{ color: '#6c757d' }}>{p.stock ?? '—'}</td>
                                        <td>
                                            <input
                                                className="srm-table-input"
                                                type="number" min="1"
                                                value={p.quantity}
                                                onChange={e => updateRow(idx, 'quantity', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                className="srm-table-input"
                                                type="number" min="0" step="0.01"
                                                value={p.discount}
                                                onChange={e => updateRow(idx, 'discount', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                className="srm-table-input"
                                                type="number" min="0" step="0.01"
                                                value={p.taxPercent}
                                                onChange={e => updateRow(idx, 'taxPercent', e.target.value)}
                                            />
                                        </td>
                                        <td style={{ fontWeight: 600 }}>${lineSubtotal(p).toFixed(2)}</td>
                                        <td>
                                            <button className="srm-table-remove" onClick={() => removeRow(idx)}>
                                                <Trash2 size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="8" className="srm-table-empty">
                                            No products added yet — search above to add items
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* ── Summary (right-aligned) ── */}
                    <div className="srm-bottom-section">
                        <div className="srm-summary-table-wrap">
                            <table className="srm-summary-table">
                                <tbody>
                                    <tr><td>Order Tax</td>      <td>$ {(+form.orderTax).toFixed(2)}</td></tr>
                                    <tr><td>Discount</td>       <td>$ {(+form.discount).toFixed(2)}</td></tr>
                                    <tr><td>Shipping</td>       <td>$ {(+form.shipping).toFixed(2)}</td></tr>
                                    <tr className="srm-summary-grand"><td>Grand Total</td><td>$ {grandTotal.toFixed(2)}</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* ── Bottom fields: Order Tax | Discount | Shipping | Status ── */}
                    <div className="srm-fields-row">
                        <div className="srm-form-group">
                            <span className="srm-label">Order Tax <span className="srm-required">*</span></span>
                            <input
                                className="srm-input"
                                type="number" min="0" step="0.01"
                                value={form.orderTax}
                                onChange={e => setForm(f => ({ ...f, orderTax: e.target.value }))}
                            />
                        </div>
                        <div className="srm-form-group">
                            <span className="srm-label">Discount <span className="srm-required">*</span></span>
                            <input
                                className="srm-input"
                                type="number" min="0" step="0.01"
                                value={form.discount}
                                onChange={e => setForm(f => ({ ...f, discount: e.target.value }))}
                            />
                        </div>
                        <div className="srm-form-group">
                            <span className="srm-label">Shipping <span className="srm-required">*</span></span>
                            <input
                                className="srm-input"
                                type="number" min="0" step="0.01"
                                value={form.shipping}
                                onChange={e => setForm(f => ({ ...f, shipping: e.target.value }))}
                            />
                        </div>
                        <div className="srm-form-group">
                            <span className="srm-label">Status <span className="srm-required">*</span></span>
                            <select
                                className="srm-select"
                                value={form.status}
                                onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                            >
                                <option value="Pending">Pending</option>
                                <option value="Received">Received</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>

                    {error && <div className="srm-error">{error}</div>}
                </div>

                {/* ── Footer ── */}
                <div className="srm-footer">
                    <button className="srm-btn-cancel" onClick={onClose} disabled={submitting}>Cancel</button>
                    <button className="srm-btn-submit" onClick={submit} disabled={submitting}>
                        {submitting ? 'Saving…' : 'Submit'}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AddSalesReturnModal;
