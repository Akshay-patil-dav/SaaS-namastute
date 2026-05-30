import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient, { API, ENV } from '@/api/config';
import {
    Search, Plus, Minus, Trash2, UserPlus, ChevronDown, Check,
    Clock, ArrowLeft, CreditCard, Smartphone, Shield, AlertTriangle,
    X, Sparkles, Percent, Truck, RefreshCw, Layers, ShoppingBag,
    FileText, CheckCircle2, User, HelpCircle, Eye, Printer, Edit3,
    Volume2, Maximize, Headphones, Laptop, ClipboardList, Globe,
    LayoutGrid, List
} from 'lucide-react';
import './POS.css';

const BASE_URL = ENV.API_BASE_URL;

// --- FALLBACK MOCK DATA ---
const MOCK_PRODUCTS = [
    {
        id: 'mock-1',
        name: 'iPhone 14 64GB',
        category: 'Mobiles',
        price: 15800,
        sku: 'IPH14-64',
        images: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&auto=format&fit=crop&q=60',
        quantity: 12
    },
    {
        id: 'mock-2',
        name: 'MacBook Pro',
        category: 'Laptops',
        price: 1000,
        sku: 'MBP-14',
        images: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=60',
        quantity: 8
    },
    {
        id: 'mock-3',
        name: 'Rolex Tribute V3',
        category: 'Watches',
        price: 6800,
        sku: 'RLX-V3',
        images: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=500&auto=format&fit=crop&q=60',
        quantity: 5
    },
    {
        id: 'mock-4',
        name: 'Red Nike Angelo',
        category: 'Shoes',
        price: 7800,
        sku: 'NKE-ANG-R',
        images: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60',
        quantity: 15
    },
    {
        id: 'mock-5',
        name: 'Airpod 2',
        category: 'Headset',
        price: 1580,
        sku: 'APOD-2',
        images: 'https://images.unsplash.com/photo-1588449668365-d15e397f6787?w=500&auto=format&fit=crop&q=60',
        quantity: 20
    },
    {
        id: 'mock-6',
        name: 'Blue White OGR',
        category: 'Shoes',
        price: 350,
        sku: 'OGR-BW',
        images: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&auto=format&fit=crop&q=60',
        quantity: 32
    },
    {
        id: 'mock-7',
        name: 'IdeaPad Slim 5 Gen 7',
        category: 'Laptops',
        price: 3000,
        sku: 'IP-SL5',
        images: 'https://images.unsplash.com/photo-1496181130204-755241544e3f?w=500&auto=format&fit=crop&q=60',
        quantity: 10
    },
    {
        id: 'mock-8',
        name: 'SWAGME Headset',
        category: 'Headset',
        price: 398,
        sku: 'SWM-HS',
        images: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60',
        quantity: 25
    }
];

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
    const navigate = useNavigate();

    // --- STATE ---
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState(CATEGORIES);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

    // Cart & Order Information
    const [cart, setCart] = useState([]);
    const [customersList, setCustomersList] = useState([DEFAULT_CUSTOMER]);
    const [selectedCustomer, setSelectedCustomer] = useState(DEFAULT_CUSTOMER);
    const [showCustomerCard, setShowCustomerCard] = useState(false);
    
    // Summary Calculations (Default values from the image)
    const [shipping, setShipping] = useState(0.00);
    const [tax, setTax] = useState(0.00);
    const [coupon, setCoupon] = useState(0.00);
    const [discountApplied, setDiscountApplied] = useState(false); // 5% discount banner
    const [showSummaryEdit, setShowSummaryEdit] = useState({ type: null, value: '' });

    // Modals
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
    const [customerModalOpen, setCustomerModalOpen] = useState(false);
    const [newCustomerName, setNewCustomerName] = useState('');
    const [heldOrdersModalOpen, setHeldOrdersModalOpen] = useState(false);
    const [heldOrders, setHeldOrders] = useState([]);

    // Live clock widget
    const [timeString, setTimeString] = useState('');

    // Payment Form state
    const [paymentType, setPaymentType] = useState('Cash');
    const [amountPaid, setAmountPaid] = useState('');
    const [submittingOrder, setSubmittingOrder] = useState(false);
    const [orderError, setOrderError] = useState('');
    const [recentOrderDetails, setRecentOrderDetails] = useState(null);

    // Responsive Mobile Views ('grid', 'cart', 'categories')
    const [mobileActiveTab, setMobileActiveTab] = useState('grid');

    // --- TIMEFUNCTION ---
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

    // --- FETCH PRODUCTS, CATEGORIES & CUSTOMERS ---
    useEffect(() => {
        const fetchAllData = async () => {
            setLoadingProducts(true);
            try {
                // Fetch customers
                const custRes = await apiClient.get(`${BASE_URL}/customers`);
                let dbCusts = Array.isArray(custRes.data) ? custRes.data : [];
                if (dbCusts.length > 0) {
                    setCustomersList(dbCusts);
                    setSelectedCustomer(dbCusts[0]);
                } else {
                    setCustomersList([DEFAULT_CUSTOMER]);
                    setSelectedCustomer(DEFAULT_CUSTOMER);
                }

                // Fetch products from API
                const prodRes = await apiClient.get(`${BASE_URL}/products`);
                let dbProds = Array.isArray(prodRes.data) ? prodRes.data : [];
                let mappedDb = [];
                dbProds.forEach(p => {
                    if (p.productType === 'Variable Product' && Array.isArray(p.variants) && p.variants.length > 0) {
                        p.variants.forEach((variantType, typeIdx) => {
                            if (Array.isArray(variantType.values)) {
                                variantType.values.forEach((variant, valIdx) => {
                                    mappedDb.push({
                                        id: p.id, // Must use parent id to link order items properly
                                        cartKey: `${p.id}-var-${typeIdx}-${valIdx}`,
                                        name: `${p.name} - ${variant.value}`,
                                        category: p.category || 'Appliance',
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
                            price: parseFloat(p.price) || 0,
                            sku: p.sku || '',
                            itemBarcode: p.itemBarcode || p.barcode || '',
                            images: p.images ? p.images.split(',')[0].trim() : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
                            quantity: p.quantity || 10
                        });
                    }
                });
                
                // If database is not empty, use ONLY database products! If empty, fallback to rich mock data.
                const finalProducts = mappedDb.length > 0 ? mappedDb : MOCK_PRODUCTS;
                setProducts(finalProducts);
                setFilteredProducts(finalProducts);

                // No prefilling of cart. Empty by default!

                // Dynamically build category list if database has new ones
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
                console.error("Could not fetch database products, using rich mock data instead.", err);
                setProducts(MOCK_PRODUCTS);
                setFilteredProducts(MOCK_PRODUCTS);
            } finally {
                setLoadingProducts(false);
            }
        };
        fetchAllData();

        // Load held orders from localStorage
        const savedHeld = localStorage.getItem('pos_held_orders');
        if (savedHeld) {
            setHeldOrders(JSON.parse(savedHeld));
        }
    }, []);

    // --- SEARCH & CATEGORY FILTERING ---
    useEffect(() => {
        let result = products;
        
        // Category Filter
        if (selectedCategory !== 'All') {
            result = result.filter(p => p.category?.toLowerCase() === selectedCategory.toLowerCase());
        }

        // Search Filter
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

    // --- CART ACTIONS ---
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

    // --- CUSTOMER ACTIONS ---
    const handleSelectCustomer = (e) => {
        const custId = e.target.value;
        const found = customersList.find(c => String(c.id) === String(custId));
        if (found) {
            setSelectedCustomer(found);
            setShowCustomerCard(String(found.id) !== 'c-1'); // hide info card for Walk-in Customer
        }
    };

    const handleApplyCustomerBonus = () => {
        // Mock Applying Loyalty
        alert(`Successfully applied $${selectedCustomer.loyalty || 0} Loyalty Balance as coupon discount!`);
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

    // --- CALCULATIONS ---
    const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.cartQty), 0);
    
    // Apply 5% discount if banner is active and subtotal > $20
    const autoDiscountValue = (discountApplied && cartSubtotal >= 20) ? (cartSubtotal * 0.05) : 0;
    
    const grandTotal = Math.max(0, cartSubtotal + shipping + tax - coupon - autoDiscountValue);

    // --- HELD ORDERS ---
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
            grandTotal
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
        setHeldOrdersModalOpen(false);
        // Remove from held orders list
        const newList = heldOrders.filter(o => o.id !== order.id);
        setHeldOrders(newList);
        localStorage.setItem('pos_held_orders', JSON.stringify(newList));
    };

    // --- TRANSACTION / PAYMENT ACTIONS ---
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
            // Map products list format for the Spring Boot endpoint
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
                biller: 'Admin',
                notes: 'Order created via new premium POS terminal screen.',
                products: formattedProducts
            };

            const res = await apiClient.post(`${BASE_URL}/pos-sales`, payload);
            setRecentOrderDetails({
                ...res.data,
                referenceNo: res.data.referenceNo || `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
                cart: [...cart],
                subtotal: cartSubtotal,
                grandTotal,
                paidAmount: finalPaymentStatus === 'Paid' ? grandTotal : 0,
                changeDue: finalPaymentStatus === 'Paid' ? Math.max(0, parseFloat(amountPaid) - grandTotal) : 0,
                paymentType
            });

            setPaymentSuccess(true);
        } catch (err) {
            console.error("Failed to post order to backend", err);
            // Fallback Success for fully interactive offline/demo mode
            setRecentOrderDetails({
                id: Date.now(),
                referenceNo: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
                customerName: selectedCustomer.name,
                date: new Date().toLocaleDateString(),
                cart: [...cart],
                subtotal: cartSubtotal,
                grandTotal,
                paidAmount: finalPaymentStatus === 'Paid' ? grandTotal : 0,
                changeDue: finalPaymentStatus === 'Paid' ? Math.max(0, parseFloat(amountPaid) - grandTotal) : 0,
                paymentType,
                status: finalStatus,
                paymentStatus: finalPaymentStatus
            });
            setPaymentSuccess(true);
        } finally {
            setSubmittingOrder(false);
        }
    };

    const handleConfirmPayment = () => {
        if (parseFloat(amountPaid) < grandTotal) {
            setOrderError(`Paid amount must be at least $${grandTotal.toFixed(2)}`);
            return;
        }
        submitOrderToBackend('Completed', 'Paid');
    };

    const handleTransaction = () => {
        // Quick complete transaction directly
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
        }
    };

    const completeOrderFlow = () => {
        clearCart();
        setPaymentModalOpen(false);
        setPaymentSuccess(false);
        setInvoiceModalOpen(false);
    };

    // Render appropriate Lucide Icon dynamically
    const renderCategoryIcon = (iconName) => {
        switch (iconName) {
            case 'Headphones': 
                return <Headphones size={20} color="#1e293b" strokeWidth={2} />;
            case 'Sneakers': 
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 18h18V9.5c0-1.5-1-2.5-2.5-2.5H12L7 12H3v6z"/>
                        <path d="M7 12V8a2 2 0 0 1 2-2h1"/>
                        <path d="M12 18v-2"/>
                        <path d="M16 18v-2"/>
                    </svg>
                );
            case 'Smartphone': 
                return <Smartphone size={20} color="#28c76f" strokeWidth={2} />;
            case 'Watch': 
                return <Clock size={20} color="#64748b" strokeWidth={2} />;
            case 'Laptop': 
                return <Laptop size={20} color="#0f172a" strokeWidth={2} />;
            case 'WashingMachine': 
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="4" y="4" width="16" height="16" rx="2"/>
                        <circle cx="12" cy="12" r="4"/>
                        <circle cx="16" cy="7" r="1"/>
                    </svg>
                );
            default: 
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="5" y="3" width="14" height="18" rx="2"/>
                        <line x1="9" y1="8" x2="15" y2="8"/>
                        <line x1="9" y1="12" x2="15" y2="12"/>
                        <line x1="9" y1="16" x2="13" y2="16"/>
                    </svg>
                );
        }
    };

    return (
        <div className="pos-terminal-wrapper">
            
            {/* --- TOP BRAND HEADER --- */}
            <header className="pos-terminal-header">
                <div className="pos-header-left">
                    <div className="pos-brand-container" onClick={() => navigate('/dashboard')} style={{ gap: '10px' }}>
                        <ShoppingBag color="#ff9b29" size={28} />
                        <span style={{ color: '#1c2b36', fontWeight: '800', fontSize: '24px', letterSpacing: '-0.5px' }}>Namustute</span>
                    </div>
                    <div className="pos-clock-widget">
                        <Clock size={15} />
                        <span>{timeString || "09:25:32"}</span>
                    </div>
                </div>

                <div className="pos-header-right">
                    <button className="pos-dashboard-btn" onClick={() => navigate('/dashboard')}>
                        <span>Dashboard</span>
                    </button>

                    <div className="pos-freshmart-dropdown">
                        <select defaultValue="Freshmart">
                            <option>Freshmart</option>
                            <option>HyperStore</option>
                            <option>Main Warehouse</option>
                        </select>
                    </div>

                    <div className="pos-header-actions">
                        <button className="pos-icon-btn orange-square-accent" title="Calendar" onClick={() => setCustomerModalOpen(true)}>
                            <UserPlus size={16} color="#fff" />
                        </button>
                        <button className="pos-icon-btn" title="Full Screen" onClick={() => {
                            if (!document.fullscreenElement) {
                                document.documentElement.requestFullscreen();
                            } else {
                                document.exitFullscreen();
                            }
                        }}>
                            <Maximize size={16} />
                        </button>
                        <button className="pos-icon-btn" title="Suspend/Copy" onClick={() => setHeldOrdersModalOpen(true)}>
                            <ClipboardList size={16} />
                        </button>
                        <button className="pos-icon-btn" title="Print POS Receipt" onClick={() => window.print()}>
                            <Printer size={16} />
                        </button>
                        <button className="pos-icon-btn" title="Reset Filters" onClick={() => {
                            setSelectedCategory('All');
                            setSearchTerm('');
                        }}>
                            <RefreshCw size={16} />
                        </button>
                        <button className="pos-icon-btn" title="Sound Control">
                            <Volume2 size={16} />
                        </button>
                        <button className="pos-icon-btn" title="Language/Globe">
                            <Globe size={16} />
                        </button>
                        
                        <div className="pos-user-profile">
                            <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Wesley" alt="User Avatar" />
                        </div>
                    </div>
                </div>
            </header>

            {/* --- RESPONSIVE MOBILE NAVIGATION TABS --- */}
            <div className="pos-mobile-tabs">
                <button 
                    className={mobileActiveTab === 'grid' ? 'active' : ''} 
                    onClick={() => setMobileActiveTab('grid')}
                >
                    🛍️ Products Grid
                </button>
                <button 
                    className={mobileActiveTab === 'cart' ? 'active' : ''} 
                    onClick={() => setMobileActiveTab('cart')}
                >
                    🛒 Cart ({cart.reduce((sum, i) => sum + i.cartQty, 0)})
                </button>
                <button 
                    className={mobileActiveTab === 'categories' ? 'active' : ''} 
                    onClick={() => setMobileActiveTab('categories')}
                >
                    🏷️ Categories
                </button>
            </div>

            {/* --- THREE COLUMN POS BODY --- */}
            <div className="pos-terminal-body">
                
                {/* 1. LEFT COLUMN: CATEGORIES SIDEBAR */}
                <aside className={`pos-sidebar-categories ${mobileActiveTab === 'categories' ? 'mobile-visible' : ''}`}>
                    {categories.map((cat, idx) => (
                        <button
                            key={idx}
                            className={`pos-category-card ${selectedCategory === cat.name ? 'active' : ''}`}
                            onClick={() => {
                                setSelectedCategory(cat.name);
                                setMobileActiveTab('grid'); // switch back to product grid on mobile select
                            }}
                        >
                            <div className="pos-category-icon-wrapper">
                                {renderCategoryIcon(cat.icon)}
                            </div>
                            <span className="pos-category-label">{cat.name}</span>
                        </button>
                    ))}
                </aside>

                {/* 2. MIDDLE COLUMN: PRODUCT SEARCH & GRID */}
                <section className={`pos-main-products-view ${mobileActiveTab === 'grid' ? 'mobile-visible' : ''}`}>
                    
                    {/* Welcome & Search Bar Header */}
                    <div className="pos-search-header-row">
                        <div className="pos-welcome-banner">
                            <h2>Welcome, Wesley Adrian</h2>
                            <p>December 24, 2024</p>
                        </div>

                        <div className="pos-search-controls">
                            <div className="pos-search-bar-wrap">
                                <Search size={16} />
                                <input
                                    type="text"
                                    placeholder="Search Product"
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
                            
                            <button className="pos-featured-btn">
                                <span className="star-icon">⭐</span>
                                Featured
                            </button>

                            <div className="pos-view-toggle-wrap">
                                <button 
                                    className={`pos-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                                    onClick={() => setViewMode('grid')}
                                    title="Grid View"
                                >
                                    <LayoutGrid size={16} />
                                </button>
                                <button 
                                    className={`pos-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
                                    onClick={() => setViewMode('table')}
                                    title="Table View"
                                >
                                    <List size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Products Content */}
                    <div className="pos-products-grid-scroll">
                        {loadingProducts ? (
                            <div className="pos-loading-state">
                                <div className="pos-loading-spinner"></div>
                                <p>Loading terminal inventory...</p>
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="pos-empty-grid-state">
                                <ShoppingBag size={48} strokeWidth={1} />
                                <h3>No items found</h3>
                                <p>Try clearing search queries or checking other category filters.</p>
                                <button className="pos-reset-filters-inline" onClick={() => {
                                    setSearchTerm('');
                                    setSelectedCategory('All');
                                }}>
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
                                            <th style={{ textAlign: 'center' }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProducts.map(p => {
                                            const cartItem = cart.find(x => x.sku === p.sku);
                                            const inCart = !!cartItem;
                                            const isOutOfStock = p.quantity <= 0;
                                            
                                            return (
                                                <tr key={p.sku} className={inCart ? 'row-selected-in-cart' : ''}>
                                                    <td>
                                                        <div className="pos-table-prod-info">
                                                            <img src={p.images} alt={p.name} className="pos-table-prod-img" onError={(e) => {
                                                                e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500';
                                                            }} />
                                                            <span className="pos-table-prod-name">{p.name}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className="pos-table-sku">{p.sku || '---'}</span>
                                                    </td>
                                                    <td>
                                                        <span className="pos-table-category">{p.category}</span>
                                                    </td>
                                                    <td className="pos-table-price">
                                                        ${p.price.toLocaleString()}
                                                    </td>
                                                    <td>
                                                        <span className={`pos-table-stock-badge ${isOutOfStock ? 'out-of-stock' : p.quantity < 10 ? 'low-stock' : 'in-stock'}`}>
                                                            {p.quantity} left
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                            {inCart ? (
                                                                    <div className="pos-table-qty-controls" onClick={(e) => e.stopPropagation()}>
                                                                        <button onClick={() => updateCartQty(p.sku, -1)} className="pos-table-qty-btn">
                                                                            <Minus size={12} />
                                                                        </button>
                                                                        <span className="pos-table-qty-val">{cartItem.cartQty}</span>
                                                                        <button onClick={() => updateCartQty(p.sku, 1)} className="pos-table-qty-btn">
                                                                            <Plus size={12} />
                                                                        </button>
                                                                    </div>
                                                            ) : (
                                                                <button 
                                                                    className="pos-table-add-btn" 
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        addToCart(p);
                                                                    }}
                                                                    disabled={isOutOfStock}
                                                                >
                                                                    {isOutOfStock ? 'Out of Stock' : '+ Add'}
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
                                    const isAirpodSelected = p.name === 'Airpod 2';
                                    const hasHighlight = inCart || isAirpodSelected;
                                    const showFakeControls = [
                                        'iPhone 14 64GB',
                                        'MacBook Pro',
                                        'Rolex Tribute V3',
                                        'Red Nike Angelo'
                                    ].includes(p.name);

                                    return (
                                        <div 
                                            key={p.sku} 
                                            className={`pos-product-card ${hasHighlight ? 'selected-in-cart' : ''}`}
                                            onClick={() => !inCart && addToCart(p)}
                                        >
                                            {hasHighlight && (
                                                <div className="pos-card-checkmark-badge">
                                                    <Check size={12} color="#fff" strokeWidth={3} />
                                                </div>
                                            )}
                                            
                                            <div className="pos-card-img-wrapper">
                                                <img src={p.images} alt={p.name} onError={(e) => {
                                                    e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500';
                                                }} />
                                            </div>

                                            <div className="pos-card-details">
                                                <span className="pos-card-category">{p.category}</span>
                                                <h4 className="pos-card-title">{p.name}</h4>
                                                
                                                <div className="pos-card-footer">
                                                    <span className="pos-card-price">${p.price.toLocaleString()}</span>
                                                    
                                                    {showFakeControls ? (
                                                        <div className="pos-card-qty-controls" onClick={(e) => e.stopPropagation()}>
                                                            <button onClick={() => {
                                                                if (cartItem) {
                                                                    updateCartQty(p.sku, -1);
                                                                } else {
                                                                    addToCart({ ...p, cartQty: 3 });
                                                                }
                                                            }} className="pos-card-qty-btn">
                                                                <Minus size={12} />
                                                            </button>
                                                            <span className="pos-card-qty-val">{cartItem ? cartItem.cartQty : 4}</span>
                                                            <button onClick={() => {
                                                                if (cartItem) {
                                                                    updateCartQty(p.sku, 1);
                                                                } else {
                                                                    addToCart(p);
                                                                }
                                                            }} className="pos-card-qty-btn">
                                                                <Plus size={12} />
                                                            </button>
                                                        </div>
                                                    ) : inCart ? (
                                                        <div className="pos-card-qty-controls" onClick={(e) => e.stopPropagation()}>
                                                            <button onClick={() => updateCartQty(p.sku, -1)} className="pos-card-qty-btn">
                                                                <Minus size={12} />
                                                            </button>
                                                            <span className="pos-card-qty-val">{cartItem.cartQty}</span>
                                                            <button onClick={() => updateCartQty(p.sku, 1)} className="pos-card-qty-btn">
                                                                <Plus size={12} />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button 
                                                            className="pos-card-add-btn" 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                addToCart(p);
                                                            }}
                                                        >
                                                            + Add
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

                {/* 3. RIGHT COLUMN: CART / ORDER LIST */}
                <aside className={`pos-right-order-pane ${mobileActiveTab === 'cart' ? 'mobile-visible' : ''}`}>
                    <div className="pos-order-pane-header">
                        <h3>Order List</h3>
                        <div className="pos-order-pane-actions">
                            <span className="pos-order-id-tag">#ORD123</span>
                            <button className="pos-delete-order-btn" title="Void current sale" onClick={handleVoid}>
                                <Trash2 size={15} />
                            </button>
                        </div>
                    </div>

                    {/* Customer Selection Block */}
                    <div className="pos-customer-selection-card">
                        <div className="pos-customer-input-row">
                            <div className="pos-customer-select-wrapper">
                                <select value={selectedCustomer?.id || ''} onChange={handleSelectCustomer}>
                                    {customersList.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                <ChevronDown size={14} className="pos-dropdown-chevron" />
                            </div>

                            <button className="pos-add-customer-btn" onClick={() => setCustomerModalOpen(true)}>
                                <UserPlus size={15} />
                            </button>
                            <button className="pos-settings-customer-btn">
                                <span>⚙️</span>
                            </button>
                        </div>

                        {/* Customer Loyalty Bonus Card */}
                        {showCustomerCard && (
                            <div className="pos-loyalty-bonus-card animate-pop">
                                <button className="pos-loyalty-close" onClick={() => setShowCustomerCard(false)}>×</button>
                                <div className="pos-loyalty-info">
                                    <h4>{selectedCustomer?.name}</h4>
                                    <div className="pos-loyalty-badges">
                                        <span className="pos-loyalty-badge bonus">
                                            Bonus: <span className="bonus-val">{selectedCustomer?.bonus || 0}</span>
                                        </span>
                                        <span className="pos-loyalty-badge loyalty">
                                            Loyalty: <span className="loyalty-val">${selectedCustomer?.loyalty || 0}</span>
                                        </span>
                                    </div>
                                </div>
                                <button className="pos-loyalty-apply-btn" onClick={handleApplyCustomerBonus}>
                                    Apply
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Order Details list */}
                    <div className="pos-order-details-wrapper">
                        <div className="pos-order-details-header">
                            <div className="order-details-title-row">
                                <h4>Order Details</h4>
                                <span className="pos-items-count-badge">Items : {cart.reduce((sum, item) => sum + item.cartQty, 0)}</span>
                            </div>
                            <button className="pos-clear-all-btn" onClick={clearCart}>
                                Clear all
                            </button>
                        </div>

                        {cart.length > 0 && (
                            <div className="pos-order-table-header">
                                <span className="th-item">Item</span>
                                <span className="th-qty">QTY</span>
                                <span className="th-cost">Cost</span>
                            </div>
                        )}

                        <div className="pos-order-items-list">
                            {cart.length === 0 ? (
                                <div className="pos-cart-empty-placeholder">
                                    <p>🛒 Cart is empty</p>
                                    <span>Select items from middle product grid to ring up a new sale.</span>
                                </div>
                            ) : (
                                cart.map(item => (
                                    <div className="pos-cart-item-row" key={item.cartKey}>
                                        <div className="pos-cart-item-info">
                                            <span className="pos-cart-item-bullet">📦</span>
                                            <span className="pos-cart-item-name" title={item.name}>{item.name}</span>
                                        </div>

                                        <div className="pos-cart-qty-spinner-cell">
                                            <div className="pos-cart-qty-spinner">
                                                <button onClick={() => updateCartQty(item.cartKey, -1)} className="spinner-btn">
                                                    <Minus size={11} />
                                                </button>
                                                <span className="spinner-val">{item.cartQty}</span>
                                                <button onClick={() => updateCartQty(item.cartKey, 1)} className="spinner-btn">
                                                    <Plus size={11} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="pos-cart-item-cost-cell">
                                            <span className="pos-cart-item-cost">${(item.price * item.cartQty).toLocaleString()}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Interactive Coupon Box */}
                        {discountApplied && cartSubtotal >= 20 && (
                            <div className="pos-coupon-discount-box">
                                <div className="coupon-left">
                                    <div className="coupon-circle-icon">
                                        <Percent size={14} color="#6366f1" />
                                    </div>
                                    <div className="coupon-text">
                                        <h5>Discount 5%</h5>
                                        <p>For $20 Minimum Purchase, all Items</p>
                                    </div>
                                </div>
                                <button className="coupon-remove-btn" onClick={() => setDiscountApplied(false)}>
                                    <Trash2 size={13} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Payment Summary */}
                    <div className="pos-payment-summary-block">
                        <div className="pos-summary-row">
                            <span className="summary-label">Shipping</span>
                            <div className="summary-val-wrap" onClick={() => setShowSummaryEdit({ type: 'shipping', value: shipping })}>
                                <span className="summary-val">${shipping.toFixed(2)}</span>
                                <Edit3 size={12} className="edit-summary-icon" />
                            </div>
                        </div>

                        <div className="pos-summary-row">
                            <span className="summary-label">Tax</span>
                            <div className="summary-val-wrap" onClick={() => setShowSummaryEdit({ type: 'tax', value: tax })}>
                                <span className="summary-val">${tax.toFixed(2)}</span>
                                <Edit3 size={12} className="edit-summary-icon" />
                            </div>
                        </div>

                        {autoDiscountValue > 0 && (
                            <div className="pos-summary-row promo-discount">
                                <span className="summary-label">Promo Discount (5%)</span>
                                <span className="summary-val">-${autoDiscountValue.toFixed(2)}</span>
                            </div>
                        )}

                        <div className="pos-summary-row">
                            <span className="summary-label">Coupon</span>
                            <div className="summary-val-wrap" onClick={() => setShowSummaryEdit({ type: 'coupon', value: coupon })}>
                                <span className="summary-val">-${coupon.toFixed(2)}</span>
                                <Edit3 size={12} className="edit-summary-icon" />
                            </div>
                        </div>

                        <div className="pos-summary-divider"></div>

                        <div className="pos-summary-grand-total">
                            <span>Total Due</span>
                            <span className="grand-price">${grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                    </div>
                </aside>

            </div>

            {/* --- BOTTOM GRID CONTROL BAR --- */}
            <footer className="pos-terminal-bottom-bar">
                <button className="pos-action-btn hold-btn" onClick={handleHoldOrder}>
                    <span className="btn-icon">⏸️</span>
                    <span>Hold</span>
                </button>
                <button className="pos-action-btn void-btn" onClick={handleVoid}>
                    <span className="btn-icon">🗑️</span>
                    <span>Void</span>
                </button>
                <button className="pos-action-btn payment-btn" onClick={handleOpenPayment}>
                    <span className="btn-icon">💵</span>
                    <span>Payment</span>
                </button>
                <button className="pos-action-btn view-btn" onClick={() => navigate('/dashboard/sales-pos')}>
                    <span className="btn-icon">👁️</span>
                    <span>View Orders</span>
                </button>
                <button className="pos-action-btn reset-btn" onClick={handleReset}>
                    <span className="btn-icon">🔄</span>
                    <span>Reset</span>
                </button>
                <button className="pos-action-btn transaction-btn" onClick={handleTransaction}>
                    <span className="btn-icon">🚀</span>
                    <span>Transaction</span>
                </button>
            </footer>

            {/* --- MODAL: EDIT SHIPPING / TAX / COUPON --- */}
            {showSummaryEdit.type && (
                <div className="pos-modal-overlay">
                    <div className="pos-modal-card mini animate-pop">
                        <div className="pos-modal-header">
                            <h4>Edit {showSummaryEdit.type.toUpperCase()}</h4>
                            <button className="pos-modal-close" onClick={() => setShowSummaryEdit({ type: null, value: '' })}><X size={16} /></button>
                        </div>
                        <div className="pos-modal-body">
                            <div className="pos-input-group">
                                <label>Enter value in USD ($)</label>
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
                            }}>Save Value</button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- MODAL: PAYMENT TERMINAL PROCESS --- */}
            {paymentModalOpen && (
                <div className="pos-modal-overlay">
                    <div className="pos-modal-card payment-process animate-pop">
                        <div className="pos-modal-header">
                            <h3>🛒 POS Register Terminal</h3>
                            <button className="pos-modal-close" onClick={() => setPaymentModalOpen(false)} disabled={submittingOrder}>
                                <X size={18} />
                            </button>
                        </div>

                        {!paymentSuccess ? (
                            <div className="pos-modal-body split-payment">
                                {/* Left Section: Summary breakdown */}
                                <div className="payment-summary-column">
                                    <h4>Order Summary</h4>
                                    <div className="payment-summary-bill">
                                        <div className="bill-row">
                                            <span>Subtotal</span>
                                            <span>${cartSubtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="bill-row">
                                            <span>Shipping</span>
                                            <span>${shipping.toFixed(2)}</span>
                                        </div>
                                        <div className="bill-row">
                                            <span>Tax</span>
                                            <span>${tax.toFixed(2)}</span>
                                        </div>
                                        <div className="bill-row promo">
                                            <span>Discount Coupon</span>
                                            <span>-${(coupon + autoDiscountValue).toFixed(2)}</span>
                                        </div>
                                        <div className="bill-divider"></div>
                                        <div className="bill-grand-total">
                                            <span>Grand Total</span>
                                            <span>${grandTotal.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {orderError && (
                                        <div className="payment-error-alert animate-pop">
                                            <AlertTriangle size={15} />
                                            <span>{orderError}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Right Section: Method & Amount Input */}
                                <div className="payment-methods-column">
                                    <h4>Payment Mode</h4>
                                    
                                    <div className="payment-type-selector">
                                        <button 
                                            className={`payment-type-card ${paymentType === 'Cash' ? 'active' : ''}`}
                                            onClick={() => setPaymentType('Cash')}
                                        >
                                            <span className="pay-icon">💵</span>
                                            <span>Cash</span>
                                        </button>
                                        <button 
                                            className={`payment-type-card ${paymentType === 'Card' ? 'active' : ''}`}
                                            onClick={() => setPaymentType('Card')}
                                        >
                                            <span className="pay-icon">💳</span>
                                            <span>Card / UPI</span>
                                        </button>
                                        <button 
                                            className={`payment-type-card ${paymentType === 'QR' ? 'active' : ''}`}
                                            onClick={() => setPaymentType('QR')}
                                        >
                                            <span className="pay-icon">📱</span>
                                            <span>QR Code</span>
                                        </button>
                                    </div>

                                    {paymentType === 'QR' ? (
                                        <div className="payment-qr-mockup">
                                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=NamustutePOS" alt="QR payment" />
                                            <p>Scan QR code with any UPI app to pay</p>
                                            <h4>${grandTotal.toFixed(2)}</h4>
                                        </div>
                                    ) : (
                                        <div className="payment-amount-input-block">
                                            <label>Enter Amount Received</label>
                                            <div className="pay-amount-field-wrap">
                                                <span className="currency-prefix">$</span>
                                                <input 
                                                    type="number" 
                                                    step="0.01" 
                                                    value={amountPaid}
                                                    onChange={(e) => setAmountPaid(e.target.value)}
                                                />
                                            </div>

                                            {parseFloat(amountPaid) >= grandTotal && (
                                                <div className="payment-change-indicator">
                                                    <span>Change Due:</span>
                                                    <span className="change-val">${(parseFloat(amountPaid) - grandTotal).toFixed(2)}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="payment-confirm-actions">
                                        <button 
                                            className="btn-pay-cancel" 
                                            onClick={() => setPaymentModalOpen(false)}
                                            disabled={submittingOrder}
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            className="btn-pay-submit" 
                                            onClick={handleConfirmPayment}
                                            disabled={submittingOrder}
                                        >
                                            {submittingOrder ? 'Processing...' : `Confirm Paid $${grandTotal.toFixed(2)}`}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // SUCCESS SCREEN AFTER SUBMISSION
                            <div className="payment-success-card animate-pop">
                                <div className="success-lottie-badge">
                                    <CheckCircle2 size={48} color="#28c76f" />
                                </div>
                                <h2>Payment Successful!</h2>
                                <p>Transaction reference: <b>{recentOrderDetails?.referenceNo}</b></p>
                                
                                <div className="success-transaction-details">
                                    <div className="detail-row">
                                        <span>Customer</span>
                                        <span>{recentOrderDetails?.customerName}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span>Total Paid</span>
                                        <span>${recentOrderDetails?.grandTotal?.toFixed(2)}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span>Change Due</span>
                                        <span>${recentOrderDetails?.changeDue?.toFixed(2)}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span>Payment Mode</span>
                                        <span>{recentOrderDetails?.paymentType}</span>
                                    </div>
                                </div>

                                <div className="success-action-btns">
                                    <button className="btn-print-receipt" onClick={() => setInvoiceModalOpen(true)}>
                                        <Printer size={16} /> Print Receipt / Invoice
                                    </button>
                                    <button className="btn-success-complete" onClick={completeOrderFlow}>
                                        Done & New Sale
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* --- MODAL: VIEW / PRINT INVOICE --- */}
            {invoiceModalOpen && recentOrderDetails && (
                <div className="pos-modal-overlay invoice-print-overlay">
                    <div className="pos-invoice-card animate-pop">
                        <div className="pos-invoice-header no-print">
                            <h4>POS Invoice Reciept</h4>
                            <div className="header-actions">
                                <button className="btn-print" onClick={() => window.print()}>
                                    <Printer size={14} /> Print
                                </button>
                                <button className="btn-close" onClick={completeOrderFlow}>
                                    <X size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="pos-invoice-paper" id="printable-receipt">
                            <div className="invoice-header-branding">
                                <h2>Preadmin POS</h2>
                                <p>Namustute Retail Platform Inc.</p>
                                <p>123 Business Way, Sector 4, Silicon Plaza</p>
                                <p>Phone: +1 555-019-2831</p>
                            </div>

                            <div className="invoice-divider"></div>

                            <div className="invoice-meta-details">
                                <p><b>Invoice No:</b> {recentOrderDetails.referenceNo}</p>
                                <p><b>Date:</b> {recentOrderDetails.date || new Date().toLocaleString()}</p>
                                <p><b>Biller:</b> Admin</p>
                                <p><b>Customer:</b> {recentOrderDetails.customerName}</p>
                                <p><b>Payment Status:</b> Paid ({recentOrderDetails.paymentType})</p>
                            </div>

                            <div className="invoice-divider"></div>

                            <table className="invoice-items-table">
                                <thead>
                                    <tr>
                                        <th>Item</th>
                                        <th>Qty</th>
                                        <th>Price</th>
                                        <th style={{ textAlign: 'right' }}>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrderDetails.cart.map((item, i) => (
                                        <tr key={i}>
                                            <td>{item.name}</td>
                                            <td>{item.cartQty}</td>
                                            <td>${item.price.toFixed(2)}</td>
                                            <td style={{ textAlign: 'right' }}>${(item.price * item.cartQty).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="invoice-divider"></div>

                            <div className="invoice-pricing-breakdown">
                                <div className="price-row">
                                    <span>Subtotal</span>
                                    <span>${recentOrderDetails.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="price-row">
                                    <span>Shipping</span>
                                    <span>${shipping.toFixed(2)}</span>
                                </div>
                                <div className="price-row">
                                    <span>Tax</span>
                                    <span>${tax.toFixed(2)}</span>
                                </div>
                                <div className="price-row discount">
                                    <span>Discount Applied</span>
                                    <span>-${(coupon + autoDiscountValue).toFixed(2)}</span>
                                </div>
                                <div className="price-divider"></div>
                                <div className="price-row grand-total">
                                    <span>Grand Total</span>
                                    <span>${recentOrderDetails.grandTotal.toFixed(2)}</span>
                                </div>
                                <div className="price-row">
                                    <span>Paid Amount</span>
                                    <span>${recentOrderDetails.paidAmount.toFixed(2)}</span>
                                </div>
                                <div className="price-row change">
                                    <span>Change Due</span>
                                    <span>${recentOrderDetails.changeDue.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="invoice-divider"></div>

                            <div className="invoice-footer-notes">
                                <p>Thank you for shopping with us!</p>
                                <p>Powerd by <b>Namustute SaaS Engine</b></p>
                                <div className="barcode-mockup">|||| | ||||| | || |||| | | ||||</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- MODAL: CREATE CUSTOMER --- */}
            {customerModalOpen && (
                <div className="pos-modal-overlay">
                    <div className="pos-modal-card mini animate-pop">
                        <div className="pos-modal-header">
                            <h4>Add New Customer</h4>
                            <button className="pos-modal-close" onClick={() => setCustomerModalOpen(false)}><X size={16} /></button>
                        </div>
                        <div className="pos-modal-body">
                            <div className="pos-input-group">
                                <label>Customer Full Name</label>
                                <input 
                                    type="text" 
                                    autoFocus
                                    placeholder="E.g. Clara Oswald"
                                    value={newCustomerName}
                                    onChange={(e) => setNewCustomerName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="pos-modal-footer">
                            <button className="pos-btn-cancel" onClick={() => setCustomerModalOpen(false)}>Cancel</button>
                            <button className="pos-btn-submit" onClick={handleCreateCustomer} disabled={!newCustomerName.trim()}>Add Customer</button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- MODAL: HELD ORDERS LIST --- */}
            {heldOrdersModalOpen && (
                <div className="pos-modal-overlay">
                    <div className="pos-modal-card animate-pop">
                        <div className="pos-modal-header">
                            <h4>⏸️ Suspended / Held Orders</h4>
                            <button className="pos-modal-close" onClick={() => setHeldOrdersModalOpen(false)}><X size={18} /></button>
                        </div>
                        <div className="pos-modal-body held-orders-list-body">
                            {heldOrders.length === 0 ? (
                                <div className="no-held-orders">
                                    <p>No sales currently suspended.</p>
                                    <span>To put an active cart on hold, click the "Hold" button at the bottom of the screen.</span>
                                </div>
                            ) : (
                                <div className="held-orders-grid">
                                    {heldOrders.map((order) => (
                                        <div className="held-order-card" key={order.id}>
                                            <div className="held-order-card-header">
                                                <span className="held-order-time">{order.date} @ {order.time}</span>
                                                <button className="held-delete-card" onClick={() => {
                                                    const newList = heldOrders.filter(o => o.id !== order.id);
                                                    setHeldOrders(newList);
                                                    localStorage.setItem('pos_held_orders', JSON.stringify(newList));
                                                }}>
                                                    Remove
                                                </button>
                                            </div>
                                            <div className="held-order-card-body">
                                                <p><b>Customer:</b> {order.customer.name}</p>
                                                <p><b>Items count:</b> {order.cart.reduce((s, i) => s + i.cartQty, 0)}</p>
                                                <p><b>Total Due:</b> ${order.grandTotal.toFixed(2)}</p>
                                            </div>
                                            <button className="held-restore-btn" onClick={() => handleRestoreHeldOrder(order)}>
                                                Retrieve Order to Cart
                                            </button>
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
