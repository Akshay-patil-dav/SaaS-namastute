import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient, { ENV } from '@/api/config';
import { useAuth } from '@/context/AuthContext';
import {
    Search, Plus, Minus, Trash2, UserPlus, ChevronDown, Check,
    Clock, Maximize, RefreshCw, ShoppingBag, Edit3,
    AlertTriangle, X, Percent, CheckCircle2, Printer, 
    Smartphone, Headphones, Laptop, Globe, Volume2, ClipboardList,
    LayoutGrid, List, Store, Monitor
} from 'lucide-react';
import './POS.css';
import { useCurrency } from '../../../hooks/useCurrency';
import Header from '../../../components/layout/Header/Header';

const BASE_URL = ENV.API_BASE_URL;

const CATEGORIES = [
    { name: 'All', icon: 'Layers' },
    { name: 'Headset', icon: 'Headphones' },
    { name: 'Shoes', icon: 'Sneakers' },
    { name: 'Mobiles', icon: 'Smartphone' },
    { name: 'Watches', icon: 'Watch' },
    { name: 'Laptops', icon: 'Laptop' },
    { name: 'Appliance', icon: 'WashingMachine' }
];

const DEFAULT_CUSTOMER = { id: 'c-1', name: 'Walk-in Customer', bonus: 0, loyalty: 0 };

export default function POS() {
    const { currencySymbol } = useCurrency();
    const navigate = useNavigate();
    const { user } = useAuth();
    const currentDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState(CATEGORIES);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [viewMode, setViewMode] = useState('grid');

    const [cart, setCart] = useState([]);
    const [customersList, setCustomersList] = useState([DEFAULT_CUSTOMER]);
    const [selectedCustomer, setSelectedCustomer] = useState(DEFAULT_CUSTOMER);
    const [showCustomerCard, setShowCustomerCard] = useState(false);
    
    // Feature: Order Type
    const [orderType, setOrderType] = useState('POS'); // 'POS' or 'Online'

    const [shipping, setShipping] = useState(0.00);
    const [tax, setTax] = useState(0.00);
    const [coupon, setCoupon] = useState(0.00);
    const [discountApplied, setDiscountApplied] = useState(false);
    const [showSummaryEdit, setShowSummaryEdit] = useState({ type: null, value: '' });

    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
    const [customerModalOpen, setCustomerModalOpen] = useState(false);
    const [newCustomerName, setNewCustomerName] = useState('');
    const [heldOrdersModalOpen, setHeldOrdersModalOpen] = useState(false);
    const [heldOrders, setHeldOrders] = useState([]);

    const [timeString, setTimeString] = useState('');
    const [paymentType, setPaymentType] = useState('Cash');
    const [amountPaid, setAmountPaid] = useState('');
    const [submittingOrder, setSubmittingOrder] = useState(false);
    const [orderError, setOrderError] = useState('');
    const [recentOrderDetails, setRecentOrderDetails] = useState(null);
    const [mobileActiveTab, setMobileActiveTab] = useState('grid');

    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            const hrs = String(now.getHours()).padStart(2, '0');
            const mins = String(now.getMinutes()).padStart(2, '0');
            const secs = String(now.getSeconds()).padStart(2, '0');
            setTimeString(`${hrs}:${mins}:${secs}`);
        };
        updateClock();
        const id = setInterval(updateClock, 1000);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        const fetchAllData = async () => {
            setLoadingProducts(true);
            try {
                const custRes = await apiClient.get(`${BASE_URL}/customers`);
                let dbCusts = Array.isArray(custRes.data) ? custRes.data : [];
                if (dbCusts.length > 0) {
                    setCustomersList(dbCusts);
                    setSelectedCustomer(dbCusts[0]);
                } else {
                    setCustomersList([DEFAULT_CUSTOMER]);
                    setSelectedCustomer(DEFAULT_CUSTOMER);
                }

                const prodRes = await apiClient.get(`${BASE_URL}/products`);
                let dbProds = Array.isArray(prodRes.data) ? prodRes.data : [];
                let mappedDb = [];
                dbProds.forEach(p => {
                    if (p.productType === 'Variable Product' && Array.isArray(p.variants) && p.variants.length > 0) {
                        p.variants.forEach((variantType, typeIdx) => {
                            if (Array.isArray(variantType.values)) {
                                variantType.values.forEach((variant, valIdx) => {
                                    mappedDb.push({
                                        id: p.id,
                                        cartKey: `${p.id}-var-${typeIdx}-${valIdx}`,
                                        name: `${p.name} - ${variant.value}`,
                                        category: p.category || 'Appliance',
                                        purchasePrice: variant.purchasePrice ? parseFloat(variant.purchasePrice) : (parseFloat(p.purchasePrice) || 0),
                                        price: variant.price ? parseFloat(variant.price) : (parseFloat(p.price) || 0),
                                        sku: variant.sku || p.sku || '',
                                        itemBarcode: variant.barcode || p.itemBarcode || '',
                                        images: variant.image ? variant.image : (p.images ? p.images.split(',')[0].trim() : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'),
                                        quantity: variant.quantity ? parseInt(variant.quantity) : (p.quantity || 10),
                                        isVariant: true,
                                        variantTypeName: variantType.typeName
                                    });
                                });
                            }
                        });
                    } else {
                        mappedDb.push({
                            id: p.id,
                            cartKey: `${p.id}`,
                            name: p.name,
                            category: p.category || 'Appliance',
                            purchasePrice: parseFloat(p.purchasePrice) || 0,
                            price: parseFloat(p.price) || 0,
                            sku: p.sku || '',
                            itemBarcode: p.itemBarcode || p.barcode || '',
                            images: p.images ? p.images.split(',')[0].trim() : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
                            quantity: p.quantity || 10
                        });
                    }
                });
                
                const finalProducts = mappedDb;
                setProducts(finalProducts);
                setFilteredProducts(finalProducts);

                const dbCats = ['All', ...new Set(dbProds.map(p => p.category).filter(Boolean))];
                const cleanCats = dbCats.map(cat => {
                    const existing = CATEGORIES.find(c => c.name.toLowerCase() === cat.toLowerCase());
                    return {
                        name: cat,
                        icon: existing ? existing.icon : 'Layers'
                    };
                });
                setCategories(cleanCats);
            } catch (err) {
                console.error("Could not fetch database products.", err);
                setProducts([]);
                setFilteredProducts([]);
            } finally {
                setLoadingProducts(false);
            }
        };
        fetchAllData();

        const savedHeld = localStorage.getItem('pos_held_orders');
        if (savedHeld) {
            setHeldOrders(JSON.parse(savedHeld));
        }
    }, []);

    useEffect(() => {
        let result = products;
        if (selectedCategory !== 'All') {
            result = result.filter(p => p.category?.toLowerCase() === selectedCategory.toLowerCase());
        }
        if (searchTerm.trim() !== '') {
            const query = searchTerm.toLowerCase();
            result = result.filter(p => 
                p.name?.toLowerCase().includes(query) || 
                p.sku?.toLowerCase().includes(query) ||
                p.itemBarcode?.toLowerCase().includes(query)
            );
        }
        setFilteredProducts(result);
    }, [selectedCategory, searchTerm, products]);

    const addToCart = (product) => {
        const exist = cart.find(item => item.cartKey === product.cartKey);
        if (exist) {
            setCart(cart.map(item => 
                item.cartKey === product.cartKey ? { ...item, cartQty: item.cartQty + 1 } : item
            ));
        } else {
            setCart([...cart, { ...product, cartQty: 1 }]);
        }
    };

    const updateCartQty = (productKey, change) => {
        const item = cart.find(x => x.cartKey === productKey);
        if (!item) return;
        const newQty = item.cartQty + change;
        if (newQty <= 0) {
            removeFromCart(productKey);
        } else {
            setCart(cart.map(x => x.cartKey === productKey ? { ...x, cartQty: newQty } : x));
        }
    };

    const removeFromCart = (productKey) => {
        setCart(cart.filter(x => x.cartKey !== productKey));
    };

    const clearCart = () => {
        setCart([]);
    };

    const handleSelectCustomer = (e) => {
        const custId = e.target.value;
        const found = customersList.find(c => String(c.id) === String(custId));
        if (found) {
            setSelectedCustomer(found);
            setShowCustomerCard(String(found.id) !== 'c-1');
        }
    };

    const handleApplyCustomerBonus = () => {
        alert(`Successfully applied ${currencySymbol}${selectedCustomer.loyalty || 0} Loyalty Balance as coupon discount!`);
        setCoupon(prev => prev + (selectedCustomer.loyalty || 0));
        setShowCustomerCard(false);
    };

    const handleCreateCustomer = async () => {
        if (!newCustomerName.trim()) return;
        try {
            const res = await apiClient.post(`${BASE_URL}/customers`, { name: newCustomerName });
            const newCust = res.data;
            const updatedList = [...customersList, newCust];
            setCustomersList(updatedList);
            setSelectedCustomer(newCust);
            setShowCustomerCard(true);
            setNewCustomerName('');
            setCustomerModalOpen(false);
        } catch (error) {
            console.error("Failed to create customer", error);
            alert("Failed to add customer. Please try again.");
        }
    };

    const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.cartQty), 0);
    const autoDiscountValue = (discountApplied && cartSubtotal >= 20) ? (cartSubtotal * 0.05) : 0;
    const grandTotal = Math.max(0, cartSubtotal + shipping + tax - coupon - autoDiscountValue);

    const handleHoldOrder = () => {
        if (cart.length === 0) return alert('Cannot hold an empty order.');
        const held = {
            id: `held-${Date.now()}`,
            time: new Date().toLocaleTimeString(),
            date: new Date().toLocaleDateString(),
            customer: selectedCustomer,
            cart: [...cart],
            shipping,
            tax,
            coupon,
            subtotal: cartSubtotal,
            grandTotal,
            orderType
        };
        const newList = [held, ...heldOrders];
        setHeldOrders(newList);
        localStorage.setItem('pos_held_orders', JSON.stringify(newList));
        clearCart();
        alert('Order successfully put on HOLD!');
    };

    const handleRestoreHeldOrder = (order) => {
        setCart(order.cart);
        setSelectedCustomer(order.customer);
        setShowCustomerCard(order.customer.id !== 'c-1');
        setShipping(order.shipping);
        setTax(order.tax);
        setCoupon(order.coupon);
        if(order.orderType) setOrderType(order.orderType);
        setHeldOrdersModalOpen(false);
        const newList = heldOrders.filter(o => o.id !== order.id);
        setHeldOrders(newList);
        localStorage.setItem('pos_held_orders', JSON.stringify(newList));
    };

    const handleOpenPayment = () => {
        if (cart.length === 0) return alert('Order details are empty. Please add items to order list.');
        setAmountPaid(grandTotal.toFixed(2));
        setOrderError('');
        setPaymentModalOpen(true);
    };

    const submitOrderToBackend = async (finalStatus = 'Completed', finalPaymentStatus = 'Paid') => {
        setSubmittingOrder(true);
        setOrderError('');
        try {
            const formattedProducts = cart.map(item => ({
                productId: item.id,
                name: item.name,
                sku: item.sku,
                quantity: item.cartQty,
                unitPrice: item.price,
                discount: 0,
                taxPercent: 0
            }));

            const payload = {
                customerName: selectedCustomer.name,
                date: new Date().toISOString().split('T')[0],
                status: finalStatus,
                paymentStatus: finalPaymentStatus,
                orderTax: tax,
                discount: coupon + autoDiscountValue,
                shipping: shipping,
                paidAmount: finalPaymentStatus === 'Paid' ? grandTotal : 0,
                biller: user?.name || 'Admin',
                notes: `Order created via POS terminal. Type: ${orderType}`,
                products: formattedProducts
            };

            const endpoint = orderType === 'Online' ? `${BASE_URL}/sales` : `${BASE_URL}/pos-sales`;
            const res = await apiClient.post(endpoint, payload);
            
            setRecentOrderDetails({
                ...res.data,
                referenceNo: res.data.referenceNo || `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
                cart: [...cart],
                subtotal: cartSubtotal,
                grandTotal,
                paidAmount: finalPaymentStatus === 'Paid' ? grandTotal : 0,
                changeDue: finalPaymentStatus === 'Paid' ? Math.max(0, parseFloat(amountPaid) - grandTotal) : 0,
                paymentType,
                orderType
            });

            setPaymentSuccess(true);
        } catch (err) {
            console.error("Failed to post order to backend", err);
            setOrderError("Failed to submit order. Please try again.");
        } finally {
            setSubmittingOrder(false);
        }
    };

    const handleConfirmPayment = () => {
        if (parseFloat(amountPaid) < grandTotal) {
            setOrderError(`Paid amount must be at least ${currencySymbol}${grandTotal.toFixed(2)}`);
            return;
        }
        submitOrderToBackend('Completed', 'Paid');
    };

    const handleTransaction = () => {
        if (cart.length === 0) return alert('Please add items to cart first.');
        setPaymentType('Cash');
        setAmountPaid(grandTotal.toFixed(2));
        submitOrderToBackend('Completed', 'Paid');
    };

    const handleVoid = () => {
        if (cart.length === 0) return;
        if (window.confirm("Are you sure you want to void this current sale? All cart items will be cleared.")) {
            clearCart();
        }
    };

    const handleReset = () => {
        if (window.confirm("Reset entire terminal to defaults?")) {
            clearCart();
            setSelectedCustomer(customersList[0] || DEFAULT_CUSTOMER);
            setShowCustomerCard(false);
            setShipping(0.00);
            setTax(0.00);
            setCoupon(0.00);
            setDiscountApplied(false);
            setSearchTerm('');
            setSelectedCategory('All');
            setOrderType('POS');
        }
    };

    const completeOrderFlow = () => {
        clearCart();
        setPaymentModalOpen(false);
        setPaymentSuccess(false);
        setInvoiceModalOpen(false);
    };

    const renderCategoryIcon = (iconName) => {
        switch (iconName) {
            case 'Headphones': return <Headphones size={22} strokeWidth={1.5} />;
            case 'Sneakers': return (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 18h18V9.5c0-1.5-1-2.5-2.5-2.5H12L7 12H3v6z"/><path d="M7 12V8a2 2 0 0 1 2-2h1"/><path d="M12 18v-2"/><path d="M16 18v-2"/>
                </svg>
            );
            case 'Smartphone': return <Smartphone size={22} strokeWidth={1.5} />;
            case 'Watch': return <Clock size={22} strokeWidth={1.5} />;
            case 'Laptop': return <Laptop size={22} strokeWidth={1.5} />;
            case 'WashingMachine': return (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="4" width="16" height="16" rx="2"/><circle cx="12" cy="12" r="4"/><circle cx="16" cy="7" r="1"/>
                </svg>
            );
            default: return (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="5" y="3" width="14" height="18" rx="2"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/>
                </svg>
            );
        }
    };

    return (
        <div className="pos-terminal-wrapper">
            
            {/* Header */}
            <Header onMenuClick={() => {}} />

            {/* Mobile Tabs */}
            <div className="pos-mobile-tabs">
                <button className={mobileActiveTab === 'grid' ? 'active' : ''} onClick={() => setMobileActiveTab('grid')}>🛍️ Grid</button>
                <button className={mobileActiveTab === 'cart' ? 'active' : ''} onClick={() => setMobileActiveTab('cart')}>🛒 Cart ({cart.reduce((s, i) => s + i.cartQty, 0)})</button>
                <button className={mobileActiveTab === 'categories' ? 'active' : ''} onClick={() => setMobileActiveTab('categories')}>🏷️ Categories</button>
            </div>

            {/* Body */}
            <div className="pos-terminal-body">
                
                {/* 1. Categories Sidebar */}
                <aside className={`pos-sidebar-categories ${mobileActiveTab === 'categories' ? 'mobile-visible' : ''}`}>
                    {categories.map((cat, idx) => (
                        <button
                            key={idx}
                            className={`pos-category-card ${selectedCategory === cat.name ? 'active' : ''}`}
                            onClick={() => {
                                setSelectedCategory(cat.name);
                                setMobileActiveTab('grid');
                            }}
                        >
                            <div className="pos-category-icon-wrapper">
                                {renderCategoryIcon(cat.icon)}
                            </div>
                            <span className="pos-category-label">{cat.name}</span>
                        </button>
                    ))}
                </aside>

                {/* 2. Products Grid */}
                <section className={`pos-main-products-view ${mobileActiveTab === 'grid' ? 'mobile-visible' : ''}`}>
                    <div className="pos-search-header-row">
                        <div className="pos-welcome-banner">
                            <h2>Welcome back, {user?.name || 'Admin'}</h2>
                            <p>{currentDate}</p>
                        </div>

                        <div className="pos-search-controls">
                            <div className="pos-search-bar-wrap">
                                <Search size={16} className="text-muted" />
                                <input
                                    type="text"
                                    placeholder="Search Product, SKU, Barcode"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                {searchTerm && (
                                    <button className="pos-clear-search" onClick={() => setSearchTerm('')}>
                                        <X size={14} />
                                    </button>
                                )}
                            </div>

                            <button className="pos-all-brands-btn" onClick={() => setSelectedCategory('All')}>
                                View All Brands
                            </button>
                            
                            <div className="pos-view-toggle-wrap">
                                <button className={`pos-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>
                                    <LayoutGrid size={16} />
                                </button>
                                <button className={`pos-toggle-btn ${viewMode === 'table' ? 'active' : ''}`} onClick={() => setViewMode('table')}>
                                    <List size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="pos-products-scroll-area">
                        {loadingProducts ? (
                            <div className="pos-loading-state">
                                <div className="pos-loading-spinner"></div>
                                <p>Loading premium inventory...</p>
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="pos-empty-grid-state">
                                <ShoppingBag size={56} strokeWidth={1} color="#cbd5e1" />
                                <h3>No items found</h3>
                                <p>Try clearing search queries or checking other category filters.</p>
                                <button className="pos-reset-filters-btn" onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}>
                                    Reset Filters
                                </button>
                            </div>
                        ) : viewMode === 'table' ? (
                            <div className="pos-products-table-wrapper">
                                <table className="pos-products-table">
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>SKU</th>
                                            <th>Category</th>
                                            <th>Price</th>
                                            <th>Stock</th>
                                            <th className="text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProducts.map(p => {
                                            const cartItem = cart.find(x => x.sku === p.sku);
                                            const inCart = !!cartItem;
                                            const isOutOfStock = p.quantity <= 0;
                                            return (
                                                <tr key={p.sku} className={inCart ? 'selected-row' : ''}>
                                                    <td>
                                                        <div className="pos-table-prod-info">
                                                            <div className="table-img-wrap"><img src={p.images} alt={p.name} /></div>
                                                            <span className="table-prod-name">{p.name}</span>
                                                        </div>
                                                    </td>
                                                    <td>{p.sku || '---'}</td>
                                                    <td><span className="table-category-badge">{p.category}</span></td>
                                                    <td className="table-price">{currencySymbol}{p.price.toLocaleString()}</td>
                                                    <td>
                                                        <span className={`table-stock-badge ${isOutOfStock ? 'out' : p.quantity < 10 ? 'low' : 'in'}`}>
                                                            {p.quantity} in stock
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="table-action-cell">
                                                            {inCart ? (
                                                                <div className="pos-card-qty-controls">
                                                                    <button onClick={() => updateCartQty(p.sku, -1)}><Minus size={14} /></button>
                                                                    <span>{cartItem.cartQty}</span>
                                                                    <button onClick={() => updateCartQty(p.sku, 1)}><Plus size={14} /></button>
                                                                </div>
                                                            ) : (
                                                                <button className="table-add-btn" onClick={() => addToCart(p)} disabled={isOutOfStock}>
                                                                    {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="pos-products-grid">
                                {filteredProducts.map(p => {
                                    const cartItem = cart.find(x => x.sku === p.sku);
                                    const inCart = !!cartItem;
                                    const isOutOfStock = p.quantity <= 0;

                                    return (
                                        <div 
                                            key={p.sku} 
                                            className={`pos-product-card ${inCart ? 'selected' : ''} ${isOutOfStock ? 'out-of-stock' : ''}`}
                                            onClick={() => !inCart && !isOutOfStock && addToCart(p)}
                                        >
                                            {inCart && (
                                                <div className="pos-card-checkmark-badge animate-pop">
                                                    <Check size={14} color="#fff" strokeWidth={3} />
                                                </div>
                                            )}
                                            
                                            <div className="pos-card-img-wrapper">
                                                <img src={p.images} alt={p.name} />
                                                {isOutOfStock && <div className="pos-out-stock-overlay">Out of Stock</div>}
                                            </div>

                                            <div className="pos-card-details">
                                                <span className="pos-card-category">{p.category}</span>
                                                <h4 className="pos-card-title">{p.name}</h4>
                                                
                                                <div className="pos-card-footer">
                                                    <span className="pos-card-price">{currencySymbol}{p.price.toLocaleString()}</span>
                                                    
                                                    {inCart ? (
                                                        <div className="pos-card-qty-controls" onClick={(e) => e.stopPropagation()}>
                                                            <button onClick={() => updateCartQty(p.sku, -1)}><Minus size={14} /></button>
                                                            <span>{cartItem.cartQty}</span>
                                                            <button onClick={() => updateCartQty(p.sku, 1)}><Plus size={14} /></button>
                                                        </div>
                                                    ) : (
                                                        <button 
                                                            className="pos-card-add-btn" 
                                                            disabled={isOutOfStock}
                                                            onClick={(e) => { e.stopPropagation(); addToCart(p); }}
                                                        >
                                                            <Plus size={16} /> Add
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </section>

                {/* 3. Right Cart Panel */}
                <aside className={`pos-right-order-pane ${mobileActiveTab === 'cart' ? 'mobile-visible' : ''}`}>
                    <div className="pos-order-pane-header">
                        <h3>Current Order</h3>
                        <div className="pos-order-pane-actions">
                            <button className="pos-clear-all-btn" onClick={clearCart}>
                                <Trash2 size={14} /> Clear
                            </button>
                        </div>
                    </div>

                    <div className="pos-order-type-selector">
                        <label>Order Target:</label>
                        <div className="order-type-tabs">
                            <button 
                                className={orderType === 'POS' ? 'active pos-type' : ''} 
                                onClick={() => setOrderType('POS')}
                            >
                                <Store size={14} /> POS Sell
                            </button>
                            <button 
                                className={orderType === 'Online' ? 'active online-type' : ''} 
                                onClick={() => setOrderType('Online')}
                            >
                                <Monitor size={14} /> Online Sell
                            </button>
                        </div>
                    </div>

                    <div className="pos-customer-selection-card">
                        <div className="pos-customer-input-row">
                            <div className="pos-customer-select-wrapper">
                                <select value={selectedCustomer?.id || ''} onChange={handleSelectCustomer}>
                                    {customersList.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                                <ChevronDown size={14} className="pos-dropdown-chevron" />
                            </div>
                            <button className="pos-add-customer-btn" onClick={() => setCustomerModalOpen(true)}>
                                <UserPlus size={16} />
                            </button>
                        </div>

                        {showCustomerCard && (
                            <div className="pos-loyalty-bonus-card animate-pop">
                                <div>
                                    <h4>{selectedCustomer?.name}</h4>
                                    <span className="loyalty-badge">Loyalty: {currencySymbol}{selectedCustomer?.loyalty || 0}</span>
                                </div>
                                <button className="pos-loyalty-apply-btn" onClick={handleApplyCustomerBonus}>Apply</button>
                            </div>
                        )}
                    </div>

                    <div className="pos-order-items-list">
                        {cart.length === 0 ? (
                            <div className="pos-cart-empty-placeholder">
                                <ShoppingBag size={48} strokeWidth={1} color="#cbd5e1" />
                                <p>Cart is empty</p>
                                <span>Scan or add items to ring up a sale.</span>
                            </div>
                        ) : (
                            cart.map(item => (
                                <div className="pos-cart-item-row" key={item.cartKey}>
                                    <div className="cart-item-image">
                                        <img src={item.images} alt={item.name} />
                                    </div>
                                    <div className="cart-item-info">
                                        <span className="cart-item-name">{item.name}</span>
                                        <span className="cart-item-price">{currencySymbol}{item.price.toLocaleString()}</span>
                                    </div>
                                    <div className="cart-item-qty">
                                        <button onClick={() => updateCartQty(item.cartKey, -1)}><Minus size={12} /></button>
                                        <span>{item.cartQty}</span>
                                        <button onClick={() => updateCartQty(item.cartKey, 1)}><Plus size={12} /></button>
                                    </div>
                                    <div className="cart-item-total">
                                        {currencySymbol}{(item.price * item.cartQty).toLocaleString()}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="pos-payment-summary-block">
                        <div className="pos-summary-row" onClick={() => setShowSummaryEdit({ type: 'shipping', value: shipping })}>
                            <span>Shipping <Edit3 size={10} className="edit-icon"/></span>
                            <span>{currencySymbol}{shipping.toFixed(2)}</span>
                        </div>
                        <div className="pos-summary-row" onClick={() => setShowSummaryEdit({ type: 'tax', value: tax })}>
                            <span>Tax <Edit3 size={10} className="edit-icon"/></span>
                            <span>{currencySymbol}{tax.toFixed(2)}</span>
                        </div>
                        <div className="pos-summary-row discount" onClick={() => setShowSummaryEdit({ type: 'coupon', value: coupon })}>
                            <span>Discount <Edit3 size={10} className="edit-icon"/></span>
                            <span>-{currencySymbol}{coupon.toFixed(2)}</span>
                        </div>
                        {autoDiscountValue > 0 && (
                            <div className="pos-summary-row promo">
                                <span>Promo (5%)</span>
                                <span>-{currencySymbol}{autoDiscountValue.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="pos-summary-divider"></div>
                        <div className="pos-summary-grand-total">
                            <span>Total Due</span>
                            <span className="grand-price">{currencySymbol}{grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Bottom Control Bar */}
            <footer className="pos-terminal-bottom-bar">
                <button className="pos-action-btn hold-btn" onClick={handleHoldOrder}>
                    <span>⏸️</span> Hold
                </button>
                <button className="pos-action-btn void-btn" onClick={handleVoid}>
                    <span>🗑️</span> Void
                </button>
                <button className="pos-action-btn payment-btn" onClick={handleOpenPayment}>
                    <span>💵</span> Payment
                </button>
                <button className="pos-action-btn view-btn" onClick={() => navigate(orderType === 'Online' ? '/dashboard/sales-online' : '/dashboard/sales-pos')}>
                    <span>👁️</span> View Orders
                </button>
                <button className="pos-action-btn reset-btn" onClick={handleReset}>
                    <span>🔄</span> Reset
                </button>
                <button className="pos-action-btn transaction-btn" onClick={handleTransaction}>
                    <span>🚀</span> Transaction
                </button>
            </footer>

            {/* Modals... */}
            {showSummaryEdit.type && (
                <div className="pos-modal-overlay">
                    <div className="pos-modal-card mini animate-pop">
                        <div className="pos-modal-header">
                            <h4>Edit {showSummaryEdit.type.toUpperCase()}</h4>
                            <button className="pos-modal-close" onClick={() => setShowSummaryEdit({ type: null, value: '' })}><X size={16} /></button>
                        </div>
                        <div className="pos-modal-body">
                            <div className="pos-input-group">
                                <label>Enter value in USD ({currencySymbol})</label>
                                <input 
                                    type="number" 
                                    step="0.01" 
                                    autoFocus
                                    value={showSummaryEdit.value}
                                    onChange={(e) => setShowSummaryEdit({ ...showSummaryEdit, value: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="pos-modal-footer">
                            <button className="pos-btn-cancel" onClick={() => setShowSummaryEdit({ type: null, value: '' })}>Cancel</button>
                            <button className="pos-btn-submit" onClick={() => {
                                const val = parseFloat(showSummaryEdit.value) || 0;
                                if (showSummaryEdit.type === 'shipping') setShipping(val);
                                if (showSummaryEdit.type === 'tax') setTax(val);
                                if (showSummaryEdit.type === 'coupon') setCoupon(val);
                                setShowSummaryEdit({ type: null, value: '' });
                            }}>Save</button>
                        </div>
                    </div>
                </div>
            )}

            {paymentModalOpen && (
                <div className="pos-modal-overlay">
                    <div className="pos-modal-card payment-process animate-pop">
                        <div className="pos-modal-header">
                            <h3>🛒 Secure Checkout - {orderType}</h3>
                            <button className="pos-modal-close" onClick={() => setPaymentModalOpen(false)} disabled={submittingOrder}>
                                <X size={18} />
                            </button>
                        </div>

                        {!paymentSuccess ? (
                            <div className="pos-modal-body split-payment">
                                <div className="payment-summary-column">
                                    <h4>Order Summary</h4>
                                    <div className="payment-summary-bill">
                                        <div className="bill-row"><span>Subtotal</span><span>{currencySymbol}{cartSubtotal.toFixed(2)}</span></div>
                                        <div className="bill-row"><span>Shipping</span><span>{currencySymbol}{shipping.toFixed(2)}</span></div>
                                        <div className="bill-row"><span>Tax</span><span>{currencySymbol}{tax.toFixed(2)}</span></div>
                                        <div className="bill-row promo"><span>Discounts</span><span>-{currencySymbol}{(coupon + autoDiscountValue).toFixed(2)}</span></div>
                                        <div className="bill-divider"></div>
                                        <div className="bill-grand-total"><span>Grand Total</span><span>{currencySymbol}{grandTotal.toFixed(2)}</span></div>
                                    </div>
                                    {orderError && (
                                        <div className="payment-error-alert animate-pop">
                                            <AlertTriangle size={15} /><span>{orderError}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="payment-methods-column">
                                    <h4>Payment Mode</h4>
                                    <div className="payment-type-selector">
                                        <button className={`payment-type-card ${paymentType === 'Cash' ? 'active' : ''}`} onClick={() => setPaymentType('Cash')}>💵 Cash</button>
                                        <button className={`payment-type-card ${paymentType === 'Card' ? 'active' : ''}`} onClick={() => setPaymentType('Card')}>💳 Card / UPI</button>
                                        <button className={`payment-type-card ${paymentType === 'QR' ? 'active' : ''}`} onClick={() => setPaymentType('QR')}>📱 QR Code</button>
                                    </div>

                                    {paymentType === 'QR' ? (
                                        <div className="payment-qr-mockup">
                                            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=NamustutePOS-${grandTotal}`} alt="QR payment" />
                                            <p>Scan to Pay {currencySymbol}{grandTotal.toFixed(2)}</p>
                                        </div>
                                    ) : (
                                        <div className="payment-amount-input-block">
                                            <label>Amount Received</label>
                                            <div className="pay-amount-field-wrap">
                                                <span className="currency-prefix">{currencySymbol}</span>
                                                <input type="number" step="0.01" value={amountPaid} onChange={(e) => setAmountPaid(e.target.value)} />
                                            </div>
                                            {parseFloat(amountPaid) >= grandTotal && (
                                                <div className="payment-change-indicator">
                                                    <span>Change Due:</span>
                                                    <span className="change-val">{currencySymbol}{(parseFloat(amountPaid) - grandTotal).toFixed(2)}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="payment-confirm-actions">
                                        <button className="btn-pay-cancel" onClick={() => setPaymentModalOpen(false)} disabled={submittingOrder}>Cancel</button>
                                        <button className="btn-pay-submit" onClick={handleConfirmPayment} disabled={submittingOrder}>
                                            {submittingOrder ? 'Processing...' : `Confirm Paid ${currencySymbol}${grandTotal.toFixed(2)}`}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="payment-success-card animate-pop">
                                <div className="success-lottie-badge"><CheckCircle2 size={56} /></div>
                                <h2>Payment Successful!</h2>
                                <p>Reference: <b>{recentOrderDetails?.referenceNo}</b> | Saved to: <b>{orderType}</b></p>
                                
                                <div className="success-transaction-details">
                                    <div className="detail-row"><span>Total</span><span>{currencySymbol}{recentOrderDetails?.grandTotal?.toFixed(2)}</span></div>
                                    <div className="detail-row"><span>Change</span><span>{currencySymbol}{recentOrderDetails?.changeDue?.toFixed(2)}</span></div>
                                    <div className="detail-row"><span>Mode</span><span>{recentOrderDetails?.paymentType}</span></div>
                                </div>

                                <div className="success-action-btns">
                                    <button className="btn-print-receipt" onClick={() => setInvoiceModalOpen(true)}><Printer size={16} /> Print Receipt</button>
                                    <button className="btn-success-complete" onClick={completeOrderFlow}>New Sale</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {invoiceModalOpen && recentOrderDetails && (
                <div className="pos-modal-overlay invoice-print-overlay">
                    <div className="pos-invoice-card animate-pop">
                        <div className="pos-invoice-header no-print">
                            <h4>Receipt ({orderType})</h4>
                            <div className="header-actions">
                                <button className="btn-print" onClick={() => window.print()}><Printer size={14} /> Print</button>
                                <button className="btn-close" onClick={completeOrderFlow}><X size={16} /></button>
                            </div>
                        </div>

                        <div className="pos-invoice-paper" id="printable-receipt">
                            <div className="invoice-header-branding">
                                <h2>Namustute Retail</h2>
                                <p>123 Business Way, Silicon Plaza</p>
                                <p>Phone: +1 555-019-2831</p>
                            </div>
                            <div className="invoice-divider"></div>
                            <div className="invoice-meta-details">
                                <p><b>No:</b> {recentOrderDetails.referenceNo}</p>
                                <p><b>Date:</b> {recentOrderDetails.date}</p>
                                <p><b>Customer:</b> {recentOrderDetails.customerName}</p>
                                <p><b>Type:</b> {orderType} Sale</p>
                            </div>
                            <div className="invoice-divider"></div>
                            <table className="invoice-items-table">
                                <thead>
                                    <tr><th>Item</th><th>Qty</th><th style={{textAlign:'right'}}>Total</th></tr>
                                </thead>
                                <tbody>
                                    {recentOrderDetails.cart.map((item, i) => (
                                        <tr key={i}>
                                            <td>{item.name}</td>
                                            <td>{item.cartQty}</td>
                                            <td style={{textAlign:'right'}}>{currencySymbol}{(item.price * item.cartQty).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="invoice-divider"></div>
                            <div className="invoice-pricing-breakdown">
                                <div className="price-row grand-total">
                                    <span>Grand Total</span>
                                    <span>{currencySymbol}{recentOrderDetails.grandTotal.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="invoice-footer-notes">
                                <p>Thank you for shopping with us!</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {customerModalOpen && (
                <div className="pos-modal-overlay">
                    <div className="pos-modal-card mini animate-pop">
                        <div className="pos-modal-header">
                            <h4>Add New Customer</h4>
                            <button className="pos-modal-close" onClick={() => setCustomerModalOpen(false)}><X size={16} /></button>
                        </div>
                        <div className="pos-modal-body">
                            <div className="pos-input-group">
                                <label>Customer Name</label>
                                <input type="text" autoFocus value={newCustomerName} onChange={(e) => setNewCustomerName(e.target.value)} />
                            </div>
                        </div>
                        <div className="pos-modal-footer">
                            <button className="pos-btn-cancel" onClick={() => setCustomerModalOpen(false)}>Cancel</button>
                            <button className="pos-btn-submit" onClick={handleCreateCustomer} disabled={!newCustomerName.trim()}>Save Customer</button>
                        </div>
                    </div>
                </div>
            )}

            {heldOrdersModalOpen && (
                <div className="pos-modal-overlay">
                    <div className="pos-modal-card animate-pop">
                        <div className="pos-modal-header">
                            <h4>⏸️ Suspended Orders</h4>
                            <button className="pos-modal-close" onClick={() => setHeldOrdersModalOpen(false)}><X size={18} /></button>
                        </div>
                        <div className="pos-modal-body held-orders-list-body">
                            {heldOrders.length === 0 ? (
                                <p className="text-muted text-center p-4">No suspended sales.</p>
                            ) : (
                                <div className="held-orders-grid">
                                    {heldOrders.map((order) => (
                                        <div className="held-order-card" key={order.id}>
                                            <div className="held-order-card-header">
                                                <span>{order.date} @ {order.time}</span>
                                                <button onClick={() => {
                                                    const newList = heldOrders.filter(o => o.id !== order.id);
                                                    setHeldOrders(newList);
                                                    localStorage.setItem('pos_held_orders', JSON.stringify(newList));
                                                }}>Remove</button>
                                            </div>
                                            <div className="held-order-card-body">
                                                <p><b>Customer:</b> {order.customer.name}</p>
                                                <p><b>Total Due:</b> {currencySymbol}{order.grandTotal.toFixed(2)}</p>
                                                <p><b>Type:</b> {order.orderType || 'POS'}</p>
                                            </div>
                                            <button className="held-restore-btn" onClick={() => handleRestoreHeldOrder(order)}>Restore to Cart</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
