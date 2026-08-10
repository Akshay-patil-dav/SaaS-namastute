import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Search, Barcode, ShoppingCart, Trash2, Plus, Minus,
    CreditCard, DollarSign, QrCode, Building, CheckCircle,
    User, RotateCcw, Printer, FileText, Sparkles, RefreshCw, X, ChevronRight, MonitorDot
} from 'lucide-react';
import apiClient, { ENV } from '@/api/config';
import { useCurrency } from '../../../hooks/useCurrency';
import { useAuth } from '../../../context/AuthContext';
import InvoiceModal from '../../../components/modals/sales/InvoiceModal/InvoiceModal';
import PosOrders from '../PosOrders/PosOrders';
import './pos-terminal.css';

const BASE_URL = ENV.API_BASE_URL;

const getImageUrl = (url) => {
    if (!url) return '';
    const cleanUrl = url.split(',')[0]?.trim();
    if (!cleanUrl) return '';
    if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://') || cleanUrl.startsWith('data:')) return cleanUrl;
    return `${ENV.BACKEND_BASE_URL}${cleanUrl.startsWith('/') ? '' : '/'}${cleanUrl}`;
};

export default function PosTerminal() {
    const { currencySymbol } = useCurrency();
    const { user } = useAuth();

    // Mode Tab: 'terminal' | 'history'
    const [activeTab, setActiveTab] = useState('terminal');

    // Data States
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);

    // Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [barcodeQuery, setBarcodeQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('ALL');

    // Cart & Customer States
    const [cart, setCart] = useState([]);
    const [customerName, setCustomerName] = useState('Walk-In Customer');
    const [showCustModal, setShowCustModal] = useState(false);
    const [tempCustName, setTempCustName] = useState('');

    // Summary & Payment States
    const [taxPercent, setTaxPercent] = useState(0);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [cashTendered, setCashTendered] = useState('');

    // Submission & Invoice Modal
    const [submitting, setSubmitting] = useState(false);
    const [invoiceOpen, setInvoiceOpen] = useState(false);
    const [completedOrder, setCompletedOrder] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const barcodeRef = useRef(null);

    // Load initial products and categories
    const fetchCatalog = useCallback(async () => {
        setLoadingProducts(true);
        try {
            const [prodRes, catRes] = await Promise.all([
                apiClient.get(`${BASE_URL}/products`),
                apiClient.get(`${BASE_URL}/category`).catch(() => ({ data: [] }))
            ]);
            setProducts(Array.isArray(prodRes.data) ? prodRes.data : []);
            setCategories(Array.isArray(catRes.data) ? catRes.data : []);
        } catch (err) {
            console.error('Failed to load catalog:', err);
        } finally {
            setLoadingProducts(false);
        }
    }, []);

    useEffect(() => {
        fetchCatalog();
    }, [fetchCatalog]);

    // Barcode scanner trigger
    const handleBarcodeKeyDown = (e) => {
        if (e.key === 'Enter' && barcodeQuery.trim()) {
            e.preventDefault();
            const code = barcodeQuery.trim().toLowerCase();
            const found = products.find(p => 
                (p.sku && p.sku.toLowerCase() === code) ||
                (p.barcode && p.barcode.toLowerCase() === code) ||
                (p.name && p.name.toLowerCase().includes(code))
            );
            if (found) {
                addToCart(found);
                setBarcodeQuery('');
            } else {
                alert(`No product found matching barcode/SKU: ${barcodeQuery}`);
            }
        }
    };

    // Cart Management
    const addToCart = (product) => {
        const stock = product.quantity ?? 99;
        if (stock <= 0) {
            alert(`"${product.name}" is out of stock!`);
            return;
        }

        setCart(prev => {
            const existing = prev.find(item => item.productId === product.id);
            if (existing) {
                if (existing.quantity >= stock) {
                    alert(`Cannot add more than available stock (${stock})`);
                    return prev;
                }
                return prev.map(item =>
                    item.productId === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                const imgUrl = getImageUrl(product.images || product.image);
                return [...prev, {
                    productId: product.id,
                    name: product.name,
                    sku: product.sku || '',
                    img: imgUrl,
                    unitPrice: parseFloat(product.price) || 0,
                    quantity: 1,
                    discount: 0,
                    taxPercent: 0,
                    stock: stock
                }];
            }
        });
    };

    const updateQty = (productId, delta) => {
        setCart(prev => prev.map(item => {
            if (item.productId === productId) {
                const newQty = item.quantity + delta;
                if (newQty <= 0) return null; // remove item
                if (newQty > item.stock) {
                    alert(`Maximum stock reached (${item.stock})`);
                    return item;
                }
                return { ...item, quantity: newQty };
            }
            return item;
        }).filter(Boolean));
    };

    const removeItem = (productId) => {
        setCart(prev => prev.filter(item => item.productId !== productId));
    };

    const clearCart = () => {
        if (cart.length === 0) return;
        if (window.confirm('Clear current cart items?')) {
            setCart([]);
            setDiscountAmount(0);
            setCashTendered('');
        }
    };

    // Filtered Products List
    const filteredProducts = products.filter(p => {
        const matchesCat = selectedCategory === 'ALL' || 
            (p.categoryName && p.categoryName === selectedCategory) ||
            (p.category && p.category.name === selectedCategory) ||
            (p.categoryId && String(p.categoryId) === String(selectedCategory));

        const matchesQuery = !searchQuery.trim() || 
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesCat && matchesQuery;
    });

    // Calculations
    const subtotal = cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    const taxAmount = (subtotal * (parseFloat(taxPercent) || 0)) / 100;
    const grandTotal = Math.max(0, subtotal + taxAmount - (parseFloat(discountAmount) || 0));
    
    const paidVal = paymentMethod === 'Cash' 
        ? (parseFloat(cashTendered) || grandTotal) 
        : grandTotal;
    const changeDue = Math.max(0, paidVal - grandTotal);

    // Quick tender shortcuts
    const handleQuickTender = (amt) => {
        if (amt === 'exact') {
            setCashTendered(grandTotal.toFixed(2));
        } else {
            setCashTendered(amt.toString());
        }
    };

    // Checkout & Bill Handler
    const handleCheckout = async () => {
        if (cart.length === 0) {
            setErrorMessage('Cart is empty. Please add at least one product.');
            return;
        }

        setSubmitting(true);
        setErrorMessage('');

        const refNo = 'POS-' + Math.floor(100000 + Math.random() * 900000);
        const payload = {
            referenceNo: refNo,
            customerName: customerName || 'Walk-In Customer',
            date: new Date().toISOString().split('T')[0],
            status: 'Completed',
            paymentStatus: 'Paid',
            paymentMethod: paymentMethod,
            orderTax: taxAmount,
            discount: parseFloat(discountAmount) || 0,
            shipping: 0,
            paidAmount: paidVal,
            dueAmount: 0,
            grandTotal: grandTotal,
            biller: user?.name || user?.identifier?.split('@')[0] || 'Cashier',
            notes: `POS Sale via ${paymentMethod}`,
            products: cart.map(item => ({
                productId: item.productId,
                name: item.name,
                sku: item.sku,
                img: item.img,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                discount: 0,
                taxPercent: 0
            }))
        };

        try {
            const res = await apiClient.post(`${BASE_URL}/pos-sales`, payload);
            const created = res.data || { ...payload, id: Date.now() };

            // Construct order object for Invoice Modal
            const orderForInvoice = {
                ...created,
                referenceNo: created.referenceNo || refNo,
                customerName: payload.customerName,
                grandTotal: grandTotal,
                paidAmount: paidVal,
                dueAmount: 0,
                orderTax: taxAmount,
                discount: payload.discount,
                paymentStatus: 'Paid',
                status: 'Completed',
                createdDate: new Date().toLocaleDateString(),
                productsJson: JSON.stringify(payload.products)
            };

            setCompletedOrder(orderForInvoice);
            setInvoiceOpen(true);

            // Reset cart
            setCart([]);
            setDiscountAmount(0);
            setCashTendered('');
            fetchCatalog(); // Refresh stock counts
        } catch (err) {
            console.error('POS Checkout failed:', err);
            setErrorMessage(err.response?.data?.error || 'Failed to complete transaction.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="pos-terminal-container">
            {/* Top Bar Switcher */}
            <div className="pos-terminal-topbar">
                <div className="d-flex align-items-center gap-3">
                    <button 
                        className={`pos-tab-btn ${activeTab === 'terminal' ? 'active' : ''}`}
                        onClick={() => setActiveTab('terminal')}
                    >
                        <ShoppingCart size={16} />
                        <span>POS Billing Terminal</span>
                    </button>
                    <button 
                        className={`pos-tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                        onClick={() => setActiveTab('history')}
                    >
                        <FileText size={16} />
                        <span>Sales History & Orders</span>
                    </button>
                </div>

                <div className="d-none d-md-flex align-items-center gap-3 text-muted small">
                    <span className="d-flex align-items-center gap-1">
                        <MonitorDot size={14} color="#ff9b29" /> Terminal Active
                    </span>
                    <span className="border-end pe-3">
                        Cashier: <strong className="text-dark">{user?.name || user?.identifier?.split('@')[0] || 'Admin'}</strong>
                    </span>
                    <button className="btn btn-sm btn-light border d-flex align-items-center gap-1" onClick={fetchCatalog}>
                        <RefreshCw size={13} /> Refresh
                    </button>
                </div>
            </div>

            {activeTab === 'history' ? (
                <div className="p-3" style={{ height: 'calc(100vh - 120px)', overflowY: 'auto' }}>
                    <PosOrders />
                </div>
            ) : (
                <div className="pos-terminal-main">
                    {/* Left Catalog Area */}
                    <div className="pos-catalog-section">
                        {/* Search & Barcode Bar */}
                        <div className="pos-filter-bar">
                            <div className="pos-search-input-wrap">
                                <Search size={16} className="position-absolute start-0 top-50 translate-middle-y ms-3 text-muted" />
                                <input 
                                    type="text"
                                    placeholder="Search products by Name or SKU..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className="pos-barcode-wrap">
                                <Barcode size={16} className="position-absolute start-0 top-50 translate-middle-y ms-3 text-muted" />
                                <input 
                                    ref={barcodeRef}
                                    type="text"
                                    placeholder="Scan Barcode + Enter"
                                    value={barcodeQuery}
                                    onChange={e => setBarcodeQuery(e.target.value)}
                                    onKeyDown={handleBarcodeKeyDown}
                                />
                            </div>
                        </div>

                        {/* Categories Pills */}
                        <div className="d-flex align-items-center gap-2 mb-3 overflow-x-auto pb-1">
                            <button 
                                className={`pos-cat-pill ${selectedCategory === 'ALL' ? 'active' : ''}`}
                                onClick={() => setSelectedCategory('ALL')}
                            >
                                All Items ({products.length})
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat.id || cat.name}
                                    className={`pos-cat-pill ${selectedCategory === cat.name ? 'active' : ''}`}
                                    onClick={() => setSelectedCategory(cat.name)}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>

                        {/* Product Grid */}
                        {loadingProducts ? (
                            <div className="d-flex align-items-center justify-content-center flex-column py-5 text-muted">
                                <div className="spinner-border text-warning spinner-border-sm mb-2" role="status" />
                                <span>Loading product catalog...</span>
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="text-center py-5 text-muted bg-white rounded-3 border">
                                <ShoppingCart size={36} className="mb-2 opacity-40 text-warning" />
                                <h6>No products found</h6>
                                <p className="small mb-0">Try matching another search keyword or category filter.</p>
                            </div>
                        ) : (
                            <div className="pos-prod-grid">
                                {filteredProducts.map(prod => {
                                    const cartItem = cart.find(i => i.productId === prod.id);
                                    const inQty = cartItem ? cartItem.quantity : 0;
                                    const imgUrl = getImageUrl(prod.images || prod.image);

                                    return (
                                        <div 
                                            key={prod.id}
                                            className={`pos-prod-card ${inQty > 0 ? 'in-cart' : ''}`}
                                            onClick={() => addToCart(prod)}
                                        >
                                            {inQty > 0 && <span className="pos-qty-badge">{inQty}</span>}
                                            
                                            <div className="pos-prod-img-box">
                                                {imgUrl ? (
                                                    <img src={imgUrl} alt={prod.name} onError={e => e.target.style.display='none'} />
                                                ) : (
                                                    <span className="pos-prod-initials">{prod.name.charAt(0).toUpperCase()}</span>
                                                )}
                                            </div>

                                            <div className="pos-prod-title" title={prod.name}>{prod.name}</div>
                                            <div className="pos-prod-sku">SKU: {prod.sku || 'N/A'}</div>

                                            <div className="pos-prod-footer">
                                                <span className="pos-prod-price">{currencySymbol}{(parseFloat(prod.price) || 0).toFixed(2)}</span>
                                                <span className={`pos-prod-stock ${(prod.quantity ?? 10) <= 5 ? 'stock-low' : 'stock-good'}`}>
                                                    {(prod.quantity ?? 10) <= 0 ? 'Out of stock' : `Qty: ${prod.quantity ?? 10}`}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Right Billing & Cart Panel */}
                    <div className="pos-cart-section">
                        {/* Cart Header */}
                        <div className="pos-cart-header">
                            <div className="pos-cust-select">
                                <User size={14} className="text-muted" />
                                <span>{customerName}</span>
                                <button 
                                    className="btn btn-sm btn-link p-0 text-warning text-decoration-none fw-bold ms-1"
                                    onClick={() => { setTempCustName(customerName); setShowCustModal(true); }}
                                >
                                    Edit
                                </button>
                            </div>
                            <button className="btn btn-sm text-danger text-decoration-none p-0 fw-semibold" onClick={clearCart}>
                                Clear Cart
                            </button>
                        </div>

                        {/* Cart Body Items */}
                        <div className="pos-cart-body">
                            {cart.length === 0 ? (
                                <div className="text-center py-5 text-muted">
                                    <ShoppingCart size={40} className="opacity-30 mb-2 text-warning" />
                                    <h6>Cart is Empty</h6>
                                    <p className="small mb-0">Click products or scan barcode to add items to bill.</p>
                                </div>
                            ) : (
                                cart.map(item => (
                                    <div className="pos-cart-item" key={item.productId}>
                                        {item.img ? (
                                            <img src={item.img} alt="" className="pos-cart-item-img" />
                                        ) : (
                                            <div className="pos-cart-item-img d-flex align-items-center justify-content-center bg-light fw-bold text-secondary">
                                                {item.name.charAt(0)}
                                            </div>
                                        )}
                                        <div className="pos-cart-item-info">
                                            <div className="pos-cart-item-name">{item.name}</div>
                                            <div className="pos-cart-item-price">{currencySymbol}{item.unitPrice.toFixed(2)}</div>
                                        </div>

                                        <div className="pos-qty-controls">
                                            <button className="pos-qty-btn" onClick={() => updateQty(item.productId, -1)}>
                                                <Minus size={12} />
                                            </button>
                                            <span className="pos-qty-val">{item.quantity}</span>
                                            <button className="pos-qty-btn" onClick={() => updateQty(item.productId, 1)}>
                                                <Plus size={12} />
                                            </button>
                                        </div>

                                        <div className="pos-cart-item-total">
                                            {currencySymbol}{(item.unitPrice * item.quantity).toFixed(2)}
                                        </div>

                                        <button className="pos-cart-del-btn" onClick={() => removeItem(item.productId)}>
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Cart Summary & Payment Footer */}
                        <div className="pos-cart-footer">
                            {errorMessage && (
                                <div className="alert alert-danger py-1 px-2 small mb-2">{errorMessage}</div>
                            )}

                            <div className="pos-summary-line">
                                <span>Subtotal</span>
                                <strong>{currencySymbol}{subtotal.toFixed(2)}</strong>
                            </div>

                            <div className="row g-2 mb-2">
                                <div className="col-6">
                                    <label className="form-label mb-1 text-muted" style={{ fontSize: '11px' }}>Tax (%)</label>
                                    <input 
                                        type="number" 
                                        className="form-control form-control-sm"
                                        min="0"
                                        value={taxPercent}
                                        onChange={e => setTaxPercent(e.target.value)}
                                    />
                                </div>
                                <div className="col-6">
                                    <label className="form-label mb-1 text-muted" style={{ fontSize: '11px' }}>Discount ({currencySymbol})</label>
                                    <input 
                                        type="number" 
                                        className="form-control form-control-sm"
                                        min="0"
                                        value={discountAmount}
                                        onChange={e => setDiscountAmount(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="pos-summary-total">
                                <span>Grand Total</span>
                                <span className="text-warning">{currencySymbol}{grandTotal.toFixed(2)}</span>
                            </div>

                            {/* Payment Method Selector */}
                            <label className="form-label mb-1 text-muted" style={{ fontSize: '11px' }}>PAYMENT MODE</label>
                            <div className="pos-pay-methods">
                                <button 
                                    className={`pos-pay-btn ${paymentMethod === 'Cash' ? 'selected' : ''}`}
                                    onClick={() => setPaymentMethod('Cash')}
                                >
                                    <DollarSign size={15} /> Cash
                                </button>
                                <button 
                                    className={`pos-pay-btn ${paymentMethod === 'Card' ? 'selected' : ''}`}
                                    onClick={() => setPaymentMethod('Card')}
                                >
                                    <CreditCard size={15} /> Card
                                </button>
                                <button 
                                    className={`pos-pay-btn ${paymentMethod === 'UPI' ? 'selected' : ''}`}
                                    onClick={() => setPaymentMethod('UPI')}
                                >
                                    <QrCode size={15} /> UPI/QR
                                </button>
                                <button 
                                    className={`pos-pay-btn ${paymentMethod === 'Bank' ? 'selected' : ''}`}
                                    onClick={() => setPaymentMethod('Bank')}
                                >
                                    <Building size={15} /> Bank
                                </button>
                            </div>

                            {/* Cash Tendered & Change */}
                            {paymentMethod === 'Cash' && grandTotal > 0 && (
                                <>
                                    <div className="pos-tender-row">
                                        <input 
                                            type="number"
                                            className="form-control form-control-sm"
                                            placeholder="Cash Tendered"
                                            value={cashTendered}
                                            onChange={e => setCashTendered(e.target.value)}
                                        />
                                        <button className="pos-tender-chip" onClick={() => handleQuickTender('exact')}>Exact</button>
                                        <button className="pos-tender-chip" onClick={() => handleQuickTender(Math.ceil(grandTotal / 10) * 10)}>${Math.ceil(grandTotal / 10) * 10}</button>
                                        <button className="pos-tender-chip" onClick={() => handleQuickTender(Math.ceil(grandTotal / 50) * 50)}>${Math.ceil(grandTotal / 50) * 50}</button>
                                    </div>
                                    {paidVal >= grandTotal && (
                                        <div className="d-flex justify-content-between text-success small fw-bold mb-2">
                                            <span>Change Due:</span>
                                            <span>{currencySymbol}{changeDue.toFixed(2)}</span>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* UPI Scan & Pay Live QR Code Box */}
                            {paymentMethod === 'UPI' && grandTotal > 0 && (
                                <div className="p-3 my-2 bg-white border rounded text-center shadow-sm">
                                    <div className="fw-bold text-dark mb-1" style={{ fontSize: '13px' }}>
                                        📱 Customer Scan &amp; Pay: {currencySymbol}{grandTotal.toFixed(2)}
                                    </div>
                                    <div className="d-inline-block bg-white p-2 rounded border my-1">
                                        <img
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`upi://pay?pa=namastute.pay@upi&pn=Namastute%20Store&am=${grandTotal.toFixed(2)}&cu=INR&tn=POS%20Bill`)}`}
                                            alt="UPI Scan to Pay"
                                            style={{ width: '130px', height: '130px', objectFit: 'contain' }}
                                            onError={(e) => {
                                                e.target.src = `https://bwipjs-api.metafloor.com/?bcid=qrcode&text=${encodeURIComponent(`upi://pay?pa=namastute.pay@upi&pn=Namastute%20Store&am=${grandTotal.toFixed(2)}&cu=INR&tn=POS%20Bill`)}&scale=4`;
                                            }}
                                        />
                                    </div>
                                    <div className="small text-success fw-bold">
                                        Scan with GPay, PhonePe, Paytm, BHIM or any UPI app
                                    </div>
                                </div>
                            )}

                            {/* Pay & Checkout Button */}
                            <button 
                                className="pos-checkout-btn"
                                disabled={cart.length === 0 || submitting}
                                onClick={handleCheckout}
                            >
                                {submitting ? (
                                    <>
                                        <div className="spinner-border spinner-border-sm" role="status" />
                                        Processing Sale...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle size={18} />
                                        PAY & GENERATE BILL ({currencySymbol}{grandTotal.toFixed(2)})
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Customer Name Edit Modal */}
            {showCustModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered modal-sm">
                        <div className="modal-content">
                            <div className="modal-header py-2">
                                <h6 className="modal-title">Customer Information</h6>
                                <button type="button" className="btn-close" onClick={() => setShowCustModal(false)} />
                            </div>
                            <div className="modal-body py-3">
                                <label className="form-label small fw-bold">Customer Name / Phone</label>
                                <input 
                                    type="text" 
                                    className="form-control"
                                    value={tempCustName}
                                    onChange={e => setTempCustName(e.target.value)}
                                    placeholder="Enter customer name..."
                                />
                            </div>
                            <div className="modal-footer py-2">
                                <button className="btn btn-sm btn-secondary" onClick={() => setShowCustModal(false)}>Cancel</button>
                                <button 
                                    className="btn btn-sm btn-warning text-white fw-bold"
                                    onClick={() => {
                                        setCustomerName(tempCustName.trim() || 'Walk-In Customer');
                                        setShowCustModal(false);
                                    }}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Invoice Bill Receipt Modal */}
            {completedOrder && (
                <InvoiceModal 
                    isOpen={invoiceOpen}
                    order={completedOrder}
                    orderType="POS"
                    onClose={() => {
                        setInvoiceOpen(false);
                        setCompletedOrder(null);
                    }}
                />
            )}
        </div>
    );
}
