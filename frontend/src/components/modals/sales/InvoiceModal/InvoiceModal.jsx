import React, { useRef, useState, useEffect } from 'react';
import { X, Printer, Download, ArrowLeft, FileText } from 'lucide-react';
import './invoice-modal.css';
import { useCurrency } from '../../../../hooks/useCurrency';
import { useCompany } from '../../../../context/CompanyContext';
import apiClient from '../../../../api/config';
function payBadgeClass(status) {
    if (status === 'Paid')    return 'inv-pay-badge inv-pay-paid';
    if (status === 'Overdue') return 'inv-pay-badge inv-pay-overdue';
    return 'inv-pay-badge inv-pay-unpaid';
}

function numToWords(amount) {
    const num = Math.floor(parseFloat(amount) || 0);
    if (num === 0) return 'Zero';
    
    const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 
        'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const convert = (n) => {
        if (n < 20) return units[n];
        if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + units[n % 10] : '');
        if (n < 1000) return units[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convert(n % 100) : '');
        if (n < 1000000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + convert(n % 1000) : '');
        return convert(Math.floor(n / 1000000)) + ' Million' + (n % 1000000 ? ' ' + convert(n % 1000000) : '');
    };

    return convert(num);
}

/* ── Direct UPI Scan & Pay QR Code Component ─────────────────── */
function RealQRCode({ invoiceNo, amount, storeName = 'Namastute Store', upiId = 'namastute.pay@upi', bankAccount = null }) {
    const numericAmount = parseFloat(amount || 0).toFixed(2);
    const cleanInvoiceNo = invoiceNo || 'INV-SALES-BILLING';
    
    // Standard UPI Payment URI recognized by GPay, PhonePe, Paytm, BHIM & All UPI Banking Apps
    const upiUri = bankAccount 
        ? `upi://pay?pa=${bankAccount.accountNumber}@${bankAccount.branchIfsc}.ifsc.npci&pn=${encodeURIComponent(storeName)}&am=${numericAmount}&cu=INR&tn=${encodeURIComponent(`Bill Payment ${cleanInvoiceNo}`)}`
        : `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(storeName)}&am=${numericAmount}&cu=INR&tn=${encodeURIComponent(`Bill Payment ${cleanInvoiceNo}`)}`;
    
    const qrData = encodeURIComponent(upiUri);
    const primaryQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${qrData}&margin=1`;
    const fallbackQrUrl = `https://bwipjs-api.metafloor.com/?bcid=qrcode&text=${qrData}&scale=4`;

    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{
                width: '74px',
                height: '74px',
                background: '#ffffff',
                padding: '3px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto'
            }}>
                <img
                    src={primaryQrUrl}
                    alt={`Scan to Pay ₹${numericAmount} for ${cleanInvoiceNo}`}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    onError={(e) => {
                        e.target.src = fallbackQrUrl;
                    }}
                />
            </div>
            <div style={{ fontSize: '8.5px', fontWeight: '700', color: '#16a34a', marginTop: '3px', lineHeight: '1.1' }}>
                Scan &amp; Pay Bill (UPI)
            </div>
        </div>
    );
}

/* ════════════════════════════════════════════════════════════
   InvoiceModal
════════════════════════════════════════════════════════════ */
const InvoiceModal = ({ isOpen, order, onClose, orderType = 'ONLINE' }) => {
    const { currencySymbol } = useCurrency();
    const { companyInfo } = useCompany();
    const printRef = useRef(null);
    const [bankAccounts, setBankAccounts] = useState([]);

    useEffect(() => {
        if (isOpen) {
            apiClient.get('/bank-accounts').then(res => setBankAccounts(res.data)).catch(console.error);
        }
    }, [isOpen]);

    if (!isOpen || !order) return null;

    const fmtMoney = (val) => {
        const num = parseFloat(val);
        return isNaN(num) ? `${currencySymbol || '$'}0.00` : `${currencySymbol || '$'}${num.toFixed(2)}`;
    };

    /* parse products */
    let products = [];
    if (Array.isArray(order.products)) {
        products = order.products;
    } else if (order.productsJson) {
        try { products = JSON.parse(order.productsJson || '[]'); } catch {}
    }

    /* totals */
    const subtotal   = products.reduce((s, p) => {
        const base = (parseFloat(p.unitPrice) || 0) * (parseInt(p.quantity) || 0)
                     - (parseFloat(p.discount) || 0);
        return s + Math.max(0, base + base * ((parseFloat(p.taxPercent) || 0) / 100));
    }, 0);
    const grandTotal = parseFloat(order.grandTotal) || 0;
    const discount   = parseFloat(order.discount)   || 0;
    const orderTax   = parseFloat(order.orderTax)   || 0;
    const shipping   = parseFloat(order.shipping)   || 0;
    const paid       = parseFloat(order.paidAmount) || 0;
    const due        = parseFloat(order.dueAmount)  || 0;

    /* invoice number */
    const invoiceNo = `#${order.referenceNo || 'INV0001'}`;

    /* print handler */
    const handlePrint = () => {
        const content = printRef.current.innerHTML;
        const w = window.open('', '_blank', 'width=900,height=700');
        w.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Invoice ${invoiceNo}</title>
                <style>
                    * { box-sizing: border-box; margin: 0; padding: 0; }
                    body { font-family: Inter, -apple-system, sans-serif; color: #374151; font-size: 13px; padding: 24px; }
                    .inv-head { display: flex; justify-content: space-between; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid #e2e8f0; }
                    .inv-logo-mark { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
                    .inv-logo-icon { width: 28px; height: 28px; background: #ff9f43; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 900; font-size: 13px; }
                    .inv-company-name { font-size: 18px; font-weight: 800; color: #1b2850; }
                    .inv-company-addr { font-size: 11px; color: #64748b; line-height: 1.5; }
                    .inv-meta { text-align: right; font-size: 12px; color: #64748b; }
                    .inv-number { font-size: 15px; font-weight: 800; color: #ff9f43; margin-bottom: 4px; }
                    .inv-parties { display: grid; grid-template-columns: 1fr 1fr 140px; gap: 20px; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid #e2e8f0; }
                    .inv-party-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.6px; color: #94a3b8; font-weight: 600; margin-bottom: 5px; }
                    .inv-party-name { font-size: 15px; font-weight: 700; color: #1b2850; margin-bottom: 4px; }
                    .inv-party-detail { font-size: 11px; color: #64748b; line-height: 1.7; }
                    .inv-pay-badge { display: inline-block; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; }
                    .inv-pay-paid { background: #dcfce7; color: #16a34a; }
                    .inv-pay-unpaid { background: #fee2e2; color: #dc2626; }
                    .inv-pay-overdue { background: #fef3c7; color: #d97706; }
                    .inv-table-wrap { border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden; margin-bottom: 20px; }
                    table { width: 100%; border-collapse: collapse; }
                    th { background: #f8fafc; padding: 10px 14px; text-align: left; font-size: 11px; font-weight: 700; border-bottom: 1px solid #e2e8f0; }
                    th:last-child { text-align: right; }
                    td { padding: 10px 14px; font-size: 12px; color: #4b5563; border-bottom: 1px solid #f1f5f9; }
                    td:last-child { text-align: right; font-weight: 600; color: #1b2850; }
                    tr:last-child td { border-bottom: none; }
                    .inv-totals-row { display: flex; justify-content: flex-end; margin-bottom: 20px; }
                    .inv-totals-box { width: 280px; }
                    .inv-totals-line { display: flex; justify-content: space-between; padding: 6px 0; font-size: 12px; color: #64748b; border-bottom: 1px solid #f1f5f9; }
                    .inv-totals-grand { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; font-weight: 800; color: #1b2850; border-top: 2px solid #1b2850; }
                    .inv-amount-words { font-size: 10px; color: #94a3b8; margin-top: 6px; font-style: italic; }
                    .inv-bottom { display: flex; justify-content: space-between; padding-top: 16px; border-top: 1px solid #f1f5f9; margin-bottom: 20px; }
                    .inv-terms-label, .inv-notes-label { font-size: 12px; font-weight: 700; color: #1b2850; margin-bottom: 4px; }
                    .inv-terms-text { font-size: 11px; color: #64748b; line-height: 1.5; max-width: 350px; }
                    .inv-sig-line { width: 110px; border-top: 1.5px solid #374151; margin-bottom: 5px; margin-left: auto; }
                    .inv-sig-name { font-size: 12px; font-weight: 700; color: #1b2850; text-align: right; }
                    .inv-sig-role { font-size: 10px; color: #94a3b8; text-align: right; }
                    .inv-footer-strip { text-align: center; padding: 16px 0 0; border-top: 1px solid #f1f5f9; }
                    .inv-footer-logo { display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 6px; font-size: 16px; font-weight: 800; color: #1b2850; }
                    .inv-footer-pay { font-size: 11px; color: #64748b; margin-bottom: 3px; }
                    .inv-footer-bank { font-size: 10px; color: #94a3b8; }
                </style>
            </head>
            <body>${content}</body>
            </html>
        `);
        w.document.close();
        setTimeout(() => { w.focus(); w.print(); w.close(); }, 400);
    };

    const isPOS = orderType === 'POS';

    return (
        <div className="inv-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="inv-wrapper">

                {/* ── Top bar ─────────────────────────────── */}
                <div className="inv-topbar">
                    <span className="inv-topbar-title">Invoice Details</span>
                    <div className="inv-topbar-actions">
                        <button className="inv-icon-btn pdf"   title="PDF"   onClick={handlePrint}><FileText size={14} /></button>
                        <button className="inv-icon-btn print" title="Print" onClick={handlePrint}><Printer  size={14} /></button>
                        <button className="inv-icon-btn"       title="Close" onClick={onClose}><X size={14} /></button>
                        <button className="inv-back-btn" onClick={onClose}>
                            <ArrowLeft size={14} /> Back to {isPOS ? 'POS Orders' : 'Online Orders'}
                        </button>
                    </div>
                </div>

                {/* ── Invoice document ─────────────────────── */}
                <div className="inv-doc" ref={printRef}>

                    {/* Head */}
                    <div className="inv-head">
                        <div className="inv-logo-area">
                            <div className="inv-logo-mark">
                                {companyInfo.logo ? (
                                    <img src={companyInfo.logo} alt="Logo" style={{ height: '36px', objectFit: 'contain' }} />
                                ) : (
                                    <div className="inv-logo-icon">{companyInfo.name ? companyInfo.name.charAt(0).toUpperCase() : 'N'}</div>
                                )}
                                {!companyInfo.logo && <span className="inv-company-name">{companyInfo.name || 'Namustutam'}</span>}
                            </div>
                            <div className="inv-company-addr">
                                {companyInfo.address || '123 Business Park, Pune, MH 411001'}<br />
                                {companyInfo.phone && <>phone: {companyInfo.phone}<br /></>}
                                {companyInfo.vat && <>VAT/GSTIN: {companyInfo.vat}</>}
                            </div>
                        </div>
                        <div className="inv-meta">
                            <div className="inv-number">{invoiceNo}</div>
                            <div className="inv-meta-row">
                                Created Date : <strong>{order.formattedDate || order.date || '—'}</strong>
                            </div>
                            <div className="inv-meta-row">
                                Type : <strong>{isPOS ? 'POS Sale' : 'Online Sale'}</strong>
                            </div>
                            <div className="inv-meta-row">
                                Biller : <strong>{order.biller || 'Admin'}</strong>
                            </div>
                        </div>
                    </div>

                    {/* Parties */}
                    <div className="inv-parties">
                        {/* From */}
                        <div>
                            <div className="inv-party-label">From</div>
                            <div className="inv-party-name">{order.biller || companyInfo.name || 'Namustutam Admin'}</div>
                            <div className="inv-party-detail">
                                {companyInfo.address || '123 Business Park, Pune, MH 411001'}<br />
                                Email : <a href={`mailto:${companyInfo.email || 'admin@namustutam.com'}`}>{companyInfo.email || 'admin@namustutam.com'}</a><br />
                                Phone : {companyInfo.phone || '+91 98765 43210'}
                            </div>
                        </div>

                        {/* To */}
                        <div>
                            <div className="inv-party-label">To</div>
                            <div className="inv-party-name">{order.customerName || '—'}</div>
                            <div className="inv-party-detail">
                                {order.notes || 'Customer Address'}<br />
                                Email : customer@example.com
                            </div>
                        </div>

                        {/* Payment + QR */}
                        <div className="inv-pay-status-area">
                            <div>
                                <div className="inv-party-label">Payment Status</div>
                                <span className={payBadgeClass(order.paymentStatus)}>
                                    ● {order.paymentStatus || 'Unpaid'}
                                </span>
                            </div>
                            <div className="inv-qr">
                                <RealQRCode
                                    invoiceNo={order.invoiceNo || order.referenceNo || `INV-${order.id}`}
                                    amount={grandTotal}
                                    storeName={companyInfo.name || order.store || 'Namastute Store'}
                                    bankAccount={bankAccounts.length > 0 ? bankAccounts[0] : null}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Invoice for */}
                    {order.notes && (
                        <div className="inv-for">
                            Invoice For : <strong>{order.notes}</strong>
                        </div>
                    )}

                    {/* Products table */}
                    <div className="inv-table-wrap">
                        <table className="inv-table">
                            <thead>
                                <tr>
                                    <th>Product / Description</th>
                                    <th>Qty</th>
                                    <th>Unit Price</th>
                                    <th>Discount</th>
                                    <th>Tax %</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.length > 0 ? products.map((p, i) => {
                                    const base  = (parseFloat(p.unitPrice) || 0) * (parseInt(p.quantity) || 0) - (parseFloat(p.discount) || 0);
                                    const total = Math.max(0, base + base * ((parseFloat(p.taxPercent) || 0) / 100));
                                    return (
                                        <tr key={i}>
                                            <td><span className="inv-prod-name">{p.name || '—'}</span>
                                                {p.sku ? <><br /><small style={{ color: '#94a3b8', fontSize: '11px' }}>SKU: {p.sku}</small></> : null}
                                            </td>
                                            <td>{p.quantity}</td>
                                            <td>{fmtMoney(p.unitPrice)}</td>
                                            <td>{fmtMoney(p.discount)}</td>
                                            <td>{parseFloat(p.taxPercent || 0).toFixed(1)}%</td>
                                            <td>{fmtMoney(total)}</td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', color: '#94a3b8', padding: '24px' }}>
                                            No products recorded for this order.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals */}
                    <div className="inv-totals-row">
                        <div className="inv-totals-box">
                            <div className="inv-totals-line"><span>Sub Total</span><span>{fmtMoney(subtotal)}</span></div>
                            {discount > 0 && <div className="inv-totals-line"><span>Discount</span><span>- {fmtMoney(discount)}</span></div>}
                            {orderTax  > 0 && <div className="inv-totals-line"><span>Order Tax</span><span>{fmtMoney(orderTax)}</span></div>}
                            {shipping  > 0 && <div className="inv-totals-line"><span>Shipping</span><span>{fmtMoney(shipping)}</span></div>}
                            <div className="inv-totals-grand">
                                <span>Total Amount</span>
                                <span>{fmtMoney(grandTotal)}</span>
                            </div>
                            <div className="inv-amount-words">
                                Amount in Words : {numToWords(grandTotal)}
                            </div>
                            {paid > 0 && (
                                <>
                                    <div className="inv-totals-line" style={{ marginTop: '12px' }}><span>Paid Amount</span><span>{fmtMoney(paid)}</span></div>
                                    <div className="inv-totals-line" style={{ color: due > 0 ? '#dc2626' : '#16a34a', fontWeight: 700 }}>
                                        <span>Balance Due</span><span>{fmtMoney(due)}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Terms & Signature */}
                    <div className="inv-bottom">
                        <div>
                            <div className="inv-terms-label">Terms and Conditions</div>
                            <div className="inv-terms-text">
                                Please pay within 15 days from the date of invoice. Overdue interest
                                @ 14% will be charged on delayed payments.
                            </div>
                            <div className="inv-notes-label">Notes</div>
                            <div className="inv-terms-text">
                                Please quote invoice number {invoiceNo} when remitting funds.
                            </div>
                        </div>
                        <div className="inv-sig-area">
                            <div className="inv-sig-line" />
                            <div className="inv-sig-name">{order.biller || 'Admin'}</div>
                            <div className="inv-sig-role">Authorized Signatory</div>
                        </div>
                    </div>

                    {/* Footer strip */}
                    <div className="inv-footer-strip">
                        <div className="inv-footer-logo">
                            {companyInfo.logo ? (
                                <img src={companyInfo.logo} alt="Logo" style={{ height: '24px', objectFit: 'contain' }} />
                            ) : (
                                <div className="inv-logo-icon" style={{ width: 24, height: 24, fontSize: 11 }}>{companyInfo.name ? companyInfo.name.charAt(0).toUpperCase() : 'N'}</div>
                            )}
                            <span style={{ fontSize: 16, fontWeight: 800, color: '#1b2850' }}>{companyInfo.name || 'Namustutam'}</span>
                        </div>
                        <div className="inv-footer-pay">
                            Payment Made Via <strong>bank transfer / UPI</strong> in the name of <span style={{ color: '#ff9f43', fontWeight: 600 }}>{companyInfo.name || 'Namustutam Pvt. Ltd.'}</span>
                        </div>
                        <div className="inv-footer-bank">
                            {bankAccounts.length > 0 ? (
                                bankAccounts.map((b, idx) => (
                                    <span key={b.id}>
                                        {idx > 0 && <span> &nbsp;|&nbsp; </span>}
                                        Bank Name : {b.bankName} &nbsp;|&nbsp; Account Number : {b.accountNumber} &nbsp;|&nbsp; IFSC : {b.branchIfsc}
                                    </span>
                                ))
                            ) : (
                                "Bank Name : HDFC Bank | Account Number : 50100XXXXXXXX | IFSC : HDFC0001234"
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Bottom action buttons ────────────────── */}
                <div className="inv-actions">
                    <button className="inv-btn-print" onClick={handlePrint}>
                        <Printer size={15} /> Print Invoice
                    </button>
                    <button className="inv-btn-download" onClick={handlePrint}>
                        <Download size={15} /> Download PDF
                    </button>
                </div>

            </div>
        </div>
    );
};

export default InvoiceModal;
