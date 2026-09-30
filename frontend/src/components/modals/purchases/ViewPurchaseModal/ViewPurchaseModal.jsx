import React, { useRef, useState, useEffect } from 'react';
import { X, Printer, Download, FileText } from 'lucide-react';
import '../../sales/InvoiceModal/invoice-modal.css';
import { useCurrency } from '../../../../hooks/useCurrency';
import { useCompany } from '../../../../context/CompanyContext';
import { useSettings } from '../../../../hooks/useSettings';
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

const ViewPurchaseModal = ({ isOpen, purchase, onClose }) => {
    const { currencySymbol } = useCurrency();
    const { companyInfo } = useCompany();
    const { settings } = useSettings();
    const printRef = useRef(null);
    const [supplierData, setSupplierData] = useState(null);

    useEffect(() => {
        if (isOpen && purchase?.supplier) {
            apiClient.get(`/khata/parties?type=SUPPLIER&search=${encodeURIComponent(purchase.supplier)}`)
                .then(res => {
                    const matches = res.data;
                    if (matches && matches.length > 0) {
                        setSupplierData(matches[0]);
                    } else {
                        setSupplierData(null);
                    }
                })
                .catch(err => {
                    console.error("Failed to fetch supplier details", err);
                    setSupplierData(null);
                });
        }
    }, [isOpen, purchase]);

    if (!isOpen || !purchase) return null;

    let prods = [];
    try { prods = JSON.parse(purchase.productsJson || '[]'); } catch {}

    const fmtMoney = v => `${currencySymbol}${parseFloat(v||0).toFixed(2)}`;

    const handlePrint = () => {
        if (!printRef.current) return;
        const printContents = printRef.current.innerHTML;
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload();
    };

    return (
        <div className="inv-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="inv-wrapper">

                {/* ── Top bar ─────────────────────────────── */}
                <div className="inv-topbar">
                    <span className="inv-topbar-title">Purchase Record</span>
                    <div className="inv-topbar-actions">
                        <button className="inv-icon-btn pdf"   title="PDF"   onClick={handlePrint}><FileText size={14} /></button>
                        <button className="inv-icon-btn print" title="Print" onClick={handlePrint}><Printer  size={14} /></button>
                        <button className="inv-icon-btn"       title="Close" onClick={onClose}><X size={14} /></button>
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
                                {!companyInfo.logo && <span className="inv-company-name">{companyInfo.name || 'Samrajya Store'}</span>}
                            </div>
                            <div className="inv-company-addr">
                                {settings?.companyAddress || companyInfo?.address || 'Company Address'}<br />
                                {companyInfo?.phone && <>phone: {companyInfo.phone}<br /></>}
                                {companyInfo?.vat && <>VAT/GSTIN: {companyInfo.vat}</>}
                            </div>
                        </div>
                        <div className="inv-meta">
                            <div className="inv-number">{purchase.reference || 'REF-XXXX'}</div>
                            <div className="inv-meta-row">
                                Created Date : <strong>{purchase.formattedDate || purchase.date || '—'}</strong>
                            </div>
                            <div className="inv-meta-row">
                                Type : <strong>Purchase Order</strong>
                            </div>
                            <div className="inv-meta-row">
                                Status : <strong style={{color: purchase.status === 'Received' ? '#16a34a' : '#ea580c'}}>{purchase.status || 'Pending'}</strong>
                            </div>
                        </div>
                    </div>

                    {/* Parties */}
                    <div className="inv-parties">
                        {/* From Supplier */}
                        <div>
                            <div className="inv-party-label">From (Supplier)</div>
                            <div className="inv-party-name">
                                {supplierData?.businessName ? supplierData.businessName : (purchase.supplier || '—')}
                            </div>
                            <div className="inv-party-detail">
                                {supplierData?.businessName && <>{purchase.supplier}<br /></>}
                                {supplierData?.address && <>{supplierData.address}<br /></>}
                                {supplierData?.phone && <>Phone : {supplierData.phone}<br /></>}
                                {supplierData?.email && <>Email : {supplierData.email}<br /></>}
                                {supplierData?.gstin && <>GSTIN : {supplierData.gstin}</>}
                            </div>
                        </div>

                        {/* To Company */}
                        <div>
                            <div className="inv-party-label">To (My Company)</div>
                            <div className="inv-party-name">
                                {companyInfo?.name || settings?.companyName || 'My Company'}
                            </div>
                            <div className="inv-party-detail">
                                {settings?.companyAddress || companyInfo?.address || 'Company Address'}<br />
                                Phone: {settings?.companyPhone || companyInfo?.phone || 'N/A'}<br />
                                Email: {settings?.companyEmail || companyInfo?.email || 'N/A'}
                            </div>
                        </div>

                        {/* Payment */}
                        <div className="inv-pay-status-area">
                            <div>
                                <div className="inv-party-label">Payment Status</div>
                                <span className={payBadgeClass(purchase.paymentStatus)}>
                                    ● {purchase.paymentStatus || 'Unpaid'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    {purchase.notes && (
                        <div className="inv-for">
                            Notes : <strong>{purchase.notes}</strong>
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
                                {prods.length > 0 ? prods.map((p, i) => {
                                    return (
                                        <tr key={i}>
                                            <td><span className="inv-prod-name">{p.name || '—'}</span>
                                                {p.barcode ? <><br /><small style={{ color: '#94a3b8', fontSize: '11px' }}>Barcode: {p.barcode}</small></> : null}
                                            </td>
                                            <td>{p.qty}</td>
                                            <td>{fmtMoney(p.price)}</td>
                                            <td>{fmtMoney(p.discount)}</td>
                                            <td>{parseFloat(p.taxRate || 0).toFixed(1)}%</td>
                                            <td>{fmtMoney(p.totalCost)}</td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', color: '#94a3b8', padding: '24px' }}>
                                            No products recorded for this purchase.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals */}
                    <div className="inv-totals-row">
                        <div className="inv-totals-box">
                            {purchase.orderTax > 0 && <div className="inv-totals-line"><span>Order Tax</span><span>{fmtMoney(purchase.orderTax)}</span></div>}
                            {purchase.discount > 0 && <div className="inv-totals-line"><span>Discount</span><span>- {fmtMoney(purchase.discount)}</span></div>}
                            {purchase.shipping > 0 && <div className="inv-totals-line"><span>Shipping</span><span>{fmtMoney(purchase.shipping)}</span></div>}
                            <div className="inv-totals-grand">
                                <span>Grand Total</span>
                                <span>{fmtMoney(purchase.total)}</span>
                            </div>
                            <div className="inv-amount-words">
                                Amount in Words : {numToWords(purchase.total)}
                            </div>
                            {parseFloat(purchase.paid) > 0 && (
                                <>
                                    <div className="inv-totals-line" style={{ marginTop: '12px' }}><span>Paid Amount</span><span>{fmtMoney(purchase.paid)}</span></div>
                                    <div className="inv-totals-line" style={{ color: parseFloat(purchase.due) > 0 ? '#dc2626' : '#16a34a', fontWeight: 700 }}>
                                        <span>Balance Due</span><span>{fmtMoney(purchase.due)}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Terms & Signature */}
                    <div className="inv-bottom">
                        <div>
                            <div className="inv-terms-label">Purchase Terms</div>
                            <div className="inv-terms-text">
                                This is a system generated purchase record.
                            </div>
                        </div>
                        <div className="inv-sig-area">
                            <div className="inv-sig-line" />
                            <div className="inv-sig-name">Authorized Signatory</div>
                        </div>
                    </div>

                </div>

                {/* ── Bottom action buttons ────────────────── */}
                <div className="inv-actions">
                    <button className="inv-btn-print" onClick={handlePrint}>
                        <Printer size={15} /> Print Record
                    </button>
                    <button className="inv-btn-download" onClick={handlePrint}>
                        <Download size={15} /> Download PDF
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ViewPurchaseModal;
