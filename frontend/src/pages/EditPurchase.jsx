import React, { useState, useEffect } from 'react';
import './CreateProduct.css'; // Reusing common form styles
import './AddPurchase.css';    // Specific styles for Purchase table
import { 
    Plus, 
    Search, 
    Calendar, 
    ChevronDown, 
    Bold, 
    Italic, 
    Underline, 
    Link as LinkIcon, 
    List, 
    ListOrdered, 
    Type,
    ArrowLeft,
    Trash2,
    Package,
    ShoppingCart,
    Info,
    DollarSign,
    RefreshCw,
    ChevronUp,
    PlusCircle,
    MinusCircle
} from 'lucide-react';

import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditPurchase = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [supplier, setSupplier] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [reference, setReference] = useState('REF-' + Math.floor(Math.random() * 10000));
    const [description, setDescription] = useState('');
    const [productSearch, setProductSearch] = useState('');
    const [items, setItems] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    
    // DB Products State
    const [dbProducts, setDbProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    // Order totals
    const [orderTax, setOrderTax] = useState(0);
    const [orderDiscount, setOrderDiscount] = useState(0);
    const [shipping, setShipping] = useState(0);
    const [status, setStatus] = useState('Pending');
    const [paymentStatus, setPaymentStatus] = useState('Paid');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState(null); // { type: 'success', message: '' }

    // ── Fetch Real Products ──────────────────────────────────────────────────
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/products`);
                // Map DB fields to our UI needs
                const mapped = res.data.map(p => ({
                    ...p,
                    barcode: p.itemBarcode || p.sku || '',
                    image: p.images ? p.images.split(',')[0] : 'https://images.unsplash.com/photo-1586769852044-692d6e67741e?w=100&h=100&fit=crop',
                    taxRate: p.tax ? parseInt(p.tax.replace(/[^0-9]/g, '')) : 0,
                    // Use price from DB if available
                    price: parseFloat(p.price) || 0
                }));
                setDbProducts(mapped);
            } catch (err) {
                console.error('Failed to fetch products', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // ── Fetch Purchase Details ───────────────────────────────────────────────
    useEffect(() => {
        if (!id) return;
        const fetchPurchase = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/purchases/${id}`);
                const data = res.data;
                setSupplier(data.supplier || '');
                setDate(data.date || new Date().toISOString().split('T')[0]);
                setReference(data.reference || '');
                setStatus(data.status || 'Pending');
                setPaymentStatus(data.paymentStatus || 'Paid');
                setOrderTax(data.orderTax || 0);
                setOrderDiscount(data.discount || 0);
                setShipping(data.shipping || 0);
                setDescription(data.notes || '');
                
                try {
                    const parsedItems = JSON.parse(data.productsJson || '[]');
                    setItems(parsedItems);
                } catch (e) {
                    setItems([]);
                }
            } catch (err) {
                console.error('Failed to fetch purchase', err);
                setToast({ type: 'error', message: 'Failed to load purchase details.' });
            }
        };
        fetchPurchase();
    }, [id]);

    // ── Search & Auto-add Logic ──────────────────────────────────────────────
    const handleSearchChange = (e) => {
        const val = e.target.value;
        setProductSearch(val);

        if (val.length > 0) {
            const matches = dbProducts.filter(p => 
                p.name.toLowerCase().includes(val.toLowerCase()) || 
                (p.barcode && p.barcode.includes(val))
            );
            
            setSuggestions(matches);
            setShowSuggestions(true);

            // Auto-add ONLY if exact barcode match
            const exactBarcode = dbProducts.find(p => p.barcode === val);
            if (exactBarcode) {
                addItem(exactBarcode);
                setProductSearch('');
                setShowSuggestions(false);
            }
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && suggestions.length > 0) {
            e.preventDefault();
            handleSelectProduct(suggestions[0]);
        }
    };

    const handleSelectProduct = (product) => {
        addItem(product);
        setProductSearch('');
        setShowSuggestions(false);
    };

    const calculateItem = (item) => {
        const safeQty = item.qty === '' ? 0 : parseInt(item.qty) || 0;
        const baseTotal = item.price * safeQty;
        const totalDiscount = item.discount * safeQty;
        const discountedTotal = baseTotal - totalDiscount;
        const taxAmount = (discountedTotal * item.taxRate) / 100;
        
        return {
            ...item,
            taxAmount,
            unitCost: (item.price - item.discount) + ((item.price - item.discount) * item.taxRate / 100),
            totalCost: discountedTotal + taxAmount
        };
    };

    const updateItemField = (id, field, value) => {
        setItems(prev => prev.map(item => {
            if (item.id === id) {
                let val = parseFloat(value);
                if (isNaN(val)) val = 0;
                return calculateItem({ ...item, [field]: val });
            }
            return item;
        }));
    };

    const addItem = (product) => {
        setItems(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => 
                    item.id === product.id 
                    ? calculateItem({ ...item, qty: item.qty + 1 })
                    : item
                );
            }
            return [...prev, calculateItem({
                ...product,
                qty: 1,
                discount: 0,
                taxRate: product.taxRate || 0
            })];
        });
    };

    const removeItem = (id) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const updateQty = (id, newQty) => {
        let qty = newQty;
        if (qty !== '') {
            qty = parseInt(qty);
            if (isNaN(qty) || qty < 1) qty = 1;
        }

        setItems(prev => prev.map(item => {
            if (item.id === id) {
                return calculateItem({ ...item, qty });
            }
            return item;
        }));
    };

    const calculateGrandTotal = () => {
        const subtotal = items.reduce((sum, item) => sum + item.totalCost, 0);
        return subtotal + parseFloat(orderTax || 0) + parseFloat(shipping || 0) - parseFloat(orderDiscount || 0);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!supplier) {
            setToast({ type: 'error', message: 'Please select a supplier.' });
            setTimeout(() => setToast(null), 3000);
            return;
        }
        if (items.length === 0) {
            setToast({ type: 'error', message: 'Please add at least one product.' });
            setTimeout(() => setToast(null), 3000);
            return;
        }

        setIsSubmitting(true);
        
        const newPurchase = {
            supplier,
            reference,
            date: date, // Keep original YYYY-MM-DD
            status,
            total: calculateGrandTotal(),
            paid: paymentStatus === 'Paid' ? calculateGrandTotal() : 0,
            due: paymentStatus === 'Paid' ? 0 : calculateGrandTotal(),
            paymentStatus: paymentStatus,
            orderTax,
            discount: orderDiscount,
            shipping,
            productsJson: JSON.stringify(items),
            notes: description
        };

        axios.put(`${import.meta.env.VITE_API_BASE_URL}/purchases/${id}`, newPurchase)
            .then(res => {
                setToast({ type: 'success', message: 'Purchase saved successfully!' });
                setIsSubmitting(false);
                setTimeout(() => {
                    if (status === 'Return') {
                        navigate('/purchase-return');
                    } else {
                        navigate('/purchases');
                    }
                }, 1500);
            })
            .catch(err => {
                console.error("Error saving purchase", err);
                setToast({ type: 'error', message: 'Failed to save purchase.' });
                setIsSubmitting(false);
            });
    };

    return (
        <div className="cp-container container-fluid px-0">
            {/* Toast notification */}
            {toast && (
                <div className={`cp-toast cp-toast-${toast.type}`}>
                    <PlusCircle size={18} />
                    <span>{toast.message}</span>
                </div>
            )}
            {/* Header */}
            <div className="cp-header mb-4">
                <div className="cp-title">
                    <h4>Edit Purchase</h4>
                    <p>Modify an existing purchase order in your inventory</p>
                </div>
                <div className="cp-actions">
                    <button className="btn-icon-action" title="Reset form" onClick={() => setItems([])}>
                        <RefreshCw size={18} />
                    </button>
                    <button className="btn-icon-action" title="Collapse">
                        <ChevronUp size={18} />
                    </button>
                    <button onClick={() => navigate('/purchases')} className="btn-dark-blue text-decoration-none d-flex align-items-center gap-2">
                        <ArrowLeft size={18} /> Back to Purchase
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} noValidate>
                {/* Basic Info Card */}
                <div className="cp-card">
                    <div className="cp-card-header">
                        <div className="cp-card-title"><Info size={18} /> Basic Information</div>
                        <ChevronDown size={18} className="text-muted" />
                    </div>
                    <div className="cp-card-body">
                        <div className="row">
                            <div className="col-md-4 cp-form-group">
                                <label className="cp-label">Supplier Name <span className="required">*</span></label>
                                <div className="cp-input-group">
                                    <select className="cp-input" value={supplier} onChange={(e) => setSupplier(e.target.value)} required>
                                        <option value="">Select</option>
                                        <option>Electro Mart</option>
                                        <option>Quantum Gadgets</option>
                                        <option>Prime Bazaar</option>
                                    </select>
                                    <button type="button" className="btn-generate" style={{ background: '#1b2850' }}>
                                        <Plus size={14} />
                                    </button>
                                </div>
                            </div>
                            <div className="col-md-4 cp-form-group">
                                <label className="cp-label">Date <span className="required">*</span></label>
                                <div className="cp-input-group">
                                    <input type="date" className="cp-input" value={date} onChange={(e) => setDate(e.target.value)} required />
                                </div>
                            </div>
                            <div className="col-md-4 cp-form-group">
                                <label className="cp-label">Reference <span className="required">*</span></label>
                                <input type="text" className="cp-input" value={reference} onChange={(e) => setReference(e.target.value)} required />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Selection Card */}
                <div className="cp-card">
                    <div className="cp-card-header">
                        <div className="cp-card-title"><Package size={18} /> Product Selection</div>
                        <span className="badge bg-soft-orange text-orange px-2 py-1" style={{ fontSize: '10px' }}>SCAN BARCODE</span>
                    </div>
                    <div className="cp-card-body">
                        <div className="cp-form-group mb-0 position-relative">
                            <label className="cp-label">Product Name or Barcode <span className="required">*</span></label>
                            <div className="cp-input-group">
                                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', zIndex: 10 }}>
                                    <Search size={18} />
                                </span>
                                <input 
                                    type="text" 
                                    className="cp-input" 
                                    style={{ paddingLeft: '45px' }}
                                    placeholder="Search by Name or Scan Barcode (e.g. 123456789)" 
                                    value={productSearch}
                                    onChange={handleSearchChange}
                                    onKeyDown={handleKeyDown}
                                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                    onFocus={() => productSearch.length > 0 && setShowSuggestions(true)}
                                    autoFocus
                                />
                            </div>

                            {/* Search Suggestions Dropdown */}
                            {showSuggestions && suggestions.length > 0 && (
                                <ul className="search-suggestions-dropdown">
                                    {suggestions.map(p => (
                                        <li key={p.id} onClick={() => handleSelectProduct(p)}>
                                            <div className="suggestion-info">
                                                <span className="suggestion-name">{p.name}</span>
                                                <span className="suggestion-barcode">{p.barcode}</span>
                                            </div>
                                            <span className="suggestion-price">${p.price}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Purchase Table */}
                        <div className="ap-table-wrapper mt-4">
                            <table className="ss-table" style={{ border: '1px solid #f1f5f9' }}>
                                <thead>
                                    <tr>
                                        <th style={{ background: '#f8fafc' }}>Product Name</th>
                                        <th style={{ background: '#f8fafc', textAlign: 'center' }}>QTY</th>
                                        <th style={{ background: '#f8fafc' }}>Purchase Price($)</th>
                                        <th style={{ background: '#f8fafc' }}>Discount($)</th>
                                        <th style={{ background: '#f8fafc' }}>Tax %</th>
                                        <th style={{ background: '#f8fafc' }}>Tax Amount($)</th>
                                        <th style={{ background: '#f8fafc' }}>Unit Cost($)</th>
                                        <th style={{ background: '#f8fafc' }}>Total Cost ($)</th>
                                        <th style={{ background: '#f8fafc', textAlign: 'center' }}>Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {items.length > 0 ? (
                                        items.map((item) => (
                                            <tr key={item.id}>
                                                <td className="fw-bold text-dark">
                                                    <div className="ap-table-product">
                                                        <img src={item.image} alt={item.name} className="ap-table-product-img" />
                                                        <span>{item.name}</span>
                                                    </div>
                                                </td>
                                                <td style={{ width: '140px' }}>
                                                    <div className="ap-qty-selector">
                                                        <button type="button" onClick={() => updateQty(item.id, item.qty + 1)}>
                                                            <PlusCircle size={18} />
                                                        </button>
                                                        <input 
                                                            type="number" 
                                                            className="cp-input text-center mx-1" 
                                                            value={item.qty} 
                                                            onChange={(e) => updateQty(item.id, e.target.value)}
                                                            style={{ width: '50px', padding: '2px 4px', height: '30px' }}
                                                        />
                                                        <button type="button" onClick={() => updateQty(item.id, item.qty - 1)}>
                                                            <MinusCircle size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td>
                                                    <input type="number" className="cp-input" value={item.price} onChange={(e) => updateItemField(item.id, 'price', e.target.value)} style={{ width: '80px', padding: '4px 8px', height: '30px' }} />
                                                </td>
                                                <td>
                                                    <input type="number" className="cp-input" value={item.discount} onChange={(e) => updateItemField(item.id, 'discount', e.target.value)} style={{ width: '80px', padding: '4px 8px', height: '30px' }} />
                                                </td>
                                                <td>
                                                    <input type="number" className="cp-input" value={item.taxRate} onChange={(e) => updateItemField(item.id, 'taxRate', e.target.value)} style={{ width: '80px', padding: '4px 8px', height: '30px' }} />
                                                </td>
                                                <td>{item.taxAmount.toFixed(2)}</td>
                                                <td>{item.unitCost.toFixed(2)}</td>
                                                <td className="fw-bold text-dark">{(item.totalCost).toFixed(2)}</td>

                                                <td style={{ textAlign: 'center' }}>
                                                    <button type="button" className="ss-action-btn delete" onClick={() => removeItem(item.id)}>
                                                        <Trash2 size={15} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="9" style={{ textAlign: 'center', padding: '40px' }}>
                                                <div className="empty-state">
                                                    <ShoppingCart size={40} strokeWidth={1} style={{ opacity: 0.2, marginBottom: '10px' }} />
                                                    <p style={{ color: '#94a3b8', fontSize: '13px' }}>Please search and add products to the list.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Additional Info Card */}
                <div className="cp-card">
                    <div className="cp-card-header">
                        <div className="cp-card-title"><DollarSign size={18} /> Additional Information</div>
                        <ChevronDown size={18} className="text-muted" />
                    </div>
                    <div className="cp-card-body">
                        <div className="row">
                            <div className="col-md-3 cp-form-group">
                                <label className="cp-label">Order Tax ($)</label>
                                <input type="number" className="cp-input" value={orderTax} onChange={(e) => setOrderTax(e.target.value)} />
                            </div>
                            <div className="col-md-3 cp-form-group">
                                <label className="cp-label">Discount ($)</label>
                                <input type="number" className="cp-input" value={orderDiscount} onChange={(e) => setOrderDiscount(e.target.value)} />
                            </div>
                            <div className="col-md-3 cp-form-group">
                                <label className="cp-label">Shipping ($)</label>
                                <input type="number" className="cp-input" value={shipping} onChange={(e) => setShipping(e.target.value)} />
                            </div>
                            <div className="col-md-3 cp-form-group">
                                <label className="cp-label">Status <span className="required">*</span></label>
                                <select className="cp-input" value={status} onChange={(e) => setStatus(e.target.value)} required>
                                    <option>Received</option>
                                    <option>Pending</option>
                                    <option>Ordered</option>
                                    <option>Return</option>
                                </select>
                            </div>
                            <div className="col-md-3 cp-form-group">
                                <label className="cp-label">Payment Status <span className="required">*</span></label>
                                <select className="cp-input" value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} required>
                                    <option>Paid</option>
                                    <option>Unpaid</option>
                                    <option>Overdue</option>
                                </select>
                            </div>
                            <div className="col-12 cp-form-group mt-2">
                                <label className="cp-label">Description</label>
                                <div className="rt-editor">
                                    <div className="rt-toolbar">
                                        <div><span>Normal</span> <ChevronDown size={14} /></div>
                                        <div className="vr mx-2"></div>
                                        <Bold size={16} /> <Italic size={16} /> <Underline size={16} /> <LinkIcon size={16} />
                                        <div className="vr mx-2"></div>
                                        <ListOrdered size={16} /> <List size={16} />
                                        <div className="vr mx-2"></div>
                                        <Type size={16} />
                                    </div>
                                    <textarea 
                                        className="rt-textarea" 
                                        placeholder="Add any additional notes here..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    ></textarea>
                                </div>
                                <div className="desc-hint">Maximum 60 Words</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary & Buttons */}
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div className="grand-total-display">
                        <span className="text-muted">Grand Total:</span>
                        <span className="ms-2 fw-bold text-dark h4 mb-0">${calculateGrandTotal().toFixed(2)}</span>
                    </div>
                    <div className="cp-footer mb-0">
                        <button type="button" className="btn-dark-blue px-4 py-2" onClick={() => navigate('/purchases')}>Cancel</button>
                        <button type="submit" className="btn-orange px-4 py-2" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Saving...
                                </>
                            ) : 'Update Purchase'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditPurchase;
