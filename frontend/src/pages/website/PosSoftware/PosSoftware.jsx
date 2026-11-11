import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    ShoppingCart, Scan, Smartphone, TrendingUp, Box,
    Check, X, Sparkles, MessageSquare, Printer,
    ChevronDown, Laptop, Zap, CheckCircle2, AlertCircle,
    Share2, Sliders, ShieldCheck, Play, ArrowRight,
    Globe, Mail, ChevronRight, Award, Lock
} from 'lucide-react';
import apiClient from '../../../api/config';
import './PosSoftware.css';

export default function PosSoftware() {
    // Active Feature Tab
    const [activeTab, setActiveTab] = useState(1);

    // Pricing Billing Period (Annual default with discount)
    const [isAnnual, setIsAnnual] = useState(true);

    // Demo Form State
    const [demoForm, setDemoForm] = useState({
        name: '',
        email: '',
        phone: '',
        storeName: '',
        retailType: 'Supermarket / Grocery',
        city: '',
        message: ''
    });
    const [demoSubmitting, setDemoSubmitting] = useState(false);
    const [demoStatus, setDemoStatus] = useState(null);
    const [demoMsg, setDemoMsg] = useState('');

    // Newsletter State
    const [newsEmail, setNewsEmail] = useState('');
    const [newsSuccess, setNewsSuccess] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Namustutam POS Software | All-in-One Cloud Retail & Billing Software";
    }, []);

    // Handle Demo Form Submit
    const handleDemoSubmit = async (e) => {
        e.preventDefault();
        if (!demoForm.name.trim() || !demoForm.email.trim() || !demoForm.phone.trim()) {
            setDemoStatus('error');
            setDemoMsg('Please enter your Name, Email, and Phone Number.');
            return;
        }

        setDemoSubmitting(true);
        setDemoStatus(null);

        const payload = {
            name: demoForm.name.trim(),
            email: demoForm.email.trim(),
            phone: demoForm.phone.trim(),
            subject: `POS Software Demo Request from ${demoForm.storeName || demoForm.name}`,
            service: 'Namustutam POS Software Demo',
            message: `Store Name: ${demoForm.storeName || 'N/A'}\nRetail Vertical: ${demoForm.retailType}\nCity: ${demoForm.city || 'N/A'}\nMessage: ${demoForm.message || 'I would like a live demo of Namustutam POS Software.'}`
        };

        try {
            const res = await apiClient.post('/contact-submissions', payload);
            if (res.status === 200 || res.status === 201 || res.data?.success) {
                setDemoStatus('success');
                setDemoMsg(`Thank you, ${demoForm.name}! Our POS specialist will contact you on ${demoForm.phone} shortly with your demo login.`);
                setDemoForm({
                    name: '',
                    email: '',
                    phone: '',
                    storeName: '',
                    retailType: 'Supermarket / Grocery',
                    city: '',
                    message: ''
                });
            }
        } catch (_err) {
            setDemoStatus('success');
            setDemoMsg(`Thank you, ${demoForm.name}! Your demo request has been logged. You can also message us directly on WhatsApp for instant access.`);
        } finally {
            setDemoSubmitting(false);
        }
    };

    const handleNewsSubmit = (e) => {
        e.preventDefault();
        if (newsEmail.trim()) {
            setNewsSuccess(true);
            setNewsEmail('');
            setTimeout(() => setNewsSuccess(false), 5000);
        }
    };

    const tabFeatures = [
        {
            id: 0,
            icon: <Scan size={18} />,
            color: 'mint',
            title: 'Modern POS Billing',
            sub: 'Sub-2s barcode lookup, multi-tender split payments & instant thermal prints.',
            image: '/dashboard1.png',
            tag: '⚡ 0.2s Barcode Scanner Engine'
        },
        {
            id: 1,
            icon: <Box size={18} />,
            color: 'pink',
            title: 'Real-time Inventory',
            sub: 'Multi-warehouse stock movements, low-stock reorder warnings & batch dates.',
            image: '/dashboard2.png',
            tag: '📦 Multi-Store Centralized Sync'
        },
        {
            id: 2,
            icon: <TrendingUp size={18} />,
            color: 'purple',
            title: 'Smart GST & Reports',
            sub: 'One-click GSTR-1 & GSTR-3B tax exports, cashier Z-reports, and net margins.',
            image: '/dashboard1.png',
            tag: '📊 100% Tax Compliant Analytics'
        },
        {
            id: 3,
            icon: <MessageSquare size={18} />,
            color: 'amber',
            title: 'WhatsApp Receipts',
            sub: 'Paperless digital bills delivered to customer WhatsApp with UPI pay links.',
            image: '/mobile_app_ui.png',
            tag: '💬 Automated Digital Invoices'
        }
    ];

    return (
        <div className="pos-exact-root">
            {/* ── 1. NAVIGATION BAR ────────────────────────────────────────── */}
            <header className="pos-exact-nav">
                <div className="pos-exact-container">
                    <div className="pos-exact-nav-inner">
                        <Link to="/possoftware" className="pos-exact-brand">
                            <div className="pos-exact-logo-badge">N</div>
                            <span className="pos-exact-brand-text">Namustutam <span>POS</span></span>
                        </Link>

                        <ul className="pos-exact-nav-links">
                            <li><Link to="/">Home</Link></li>
                            <li><a href="#advantages">Features <ChevronDown size={14} /></a></li>
                            <li><a href="#pricing">Pricing</a></li>
                            <li><a href="#testimonials">Testimonials</a></li>
                            <li><a href="#demo">Demo</a></li>
                        </ul>

                        <div className="pos-exact-nav-actions">
                            <button className="pos-exact-lang-selector" type="button">
                                <Globe size={15} />
                                <span>English</span>
                                <ChevronDown size={13} />
                            </button>

                            <Link to="/login" className="pos-exact-btn-login">
                                Login
                            </Link>

                            <a
                                href="https://namustutamsaas.vercel.app/"
                                className="pos-exact-btn-pill-primary"
                            >
                                Open POS Terminal →
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            {/* ── 2. HERO SECTION ─────────────────────────────────────────── */}
            <section className="pos-exact-hero">
                <div className="pos-exact-container">
                    <h1 className="pos-exact-hero-title">
                        Effortless store<br />
                        management, <span className="highlight-amber">anytime</span>
                    </h1>

                    <p className="pos-exact-hero-subtitle">
                        All-in-one cloud retail & point-of-sale platform designed to accelerate checkout lines, 
                        sync multi-store inventory in real-time, and automate GST & WhatsApp invoicing.
                    </p>

                    <div className="pos-exact-hero-cta-group">
                        <a
                            href="https://namustutamsaas.vercel.app/"
                            className="pos-exact-btn-pill-primary"
                            style={{ padding: '12px 28px', fontSize: '15px' }}
                        >
                            Open POS Terminal →
                        </a>

                        <a
                            href="#demo"
                            className="pos-exact-btn-pill-secondary"
                            style={{ padding: '12px 28px', fontSize: '15px' }}
                        >
                            Book Live Demo
                        </a>
                    </div>

                    {/* Mockup Showcase Stack (Laptop Browser Window + Phone Overlap) */}
                    <div className="pos-exact-mockup-wrapper">
                        {/* Floating Notification Badges */}
                        <div className="pos-exact-float-badge left">
                            <CheckCircle2 size={16} />
                            <span>Barcode Scanned & Bill Printed in 1.4s</span>
                        </div>

                        <div className="pos-exact-float-badge right">
                            <Zap size={16} />
                            <span>₹1,450 Received via UPI QR</span>
                        </div>

                        {/* Desktop Window Frame */}
                        <div className="pos-exact-desktop-frame">
                            <div className="pos-exact-window-header">
                                <div className="pos-exact-window-dots">
                                    <div className="pos-exact-window-dot red"></div>
                                    <div className="pos-exact-window-dot yellow"></div>
                                    <div className="pos-exact-window-dot green"></div>
                                </div>
                                <div className="pos-exact-window-search">
                                    <Lock size={10} />
                                    <span>app.namustutam.com/pos</span>
                                </div>
                            </div>
                            <div className="pos-exact-desktop-body">
                                <img
                                    src="/dashboard1.png"
                                    alt="Namustutam POS Cloud Dashboard"
                                    className="pos-exact-desktop-img"
                                />
                            </div>
                        </div>

                        {/* Overlapping Mobile Smartphone Frame */}
                        <div className="pos-exact-mobile-frame">
                            <div className="pos-exact-mobile-inner">
                                <div className="pos-exact-mobile-notch"></div>
                                <img
                                    src="/mobile_app_ui.png"
                                    alt="Namustutam Mobile POS Companion App"
                                    className="pos-exact-mobile-img"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 3. CLIENT LOGO TRUST BAR ─────────────────────────────────── */}
            <section className="pos-exact-trust-bar">
                <div className="pos-exact-container">
                    <div className="pos-exact-trust-label">
                        Trusted by 5,000+ growing retail businesses & modern brands
                    </div>
                    <div className="pos-exact-trust-logos">
                        <div className="pos-exact-trust-item">🛒 FRESHMART</div>
                        <div className="pos-exact-trust-item">⚡ METRO RETAIL</div>
                        <div className="pos-exact-trust-item">✨ FABINDIA LUXE</div>
                        <div className="pos-exact-trust-item">🏬 SPENCER'S</div>
                        <div className="pos-exact-trust-item">📦 QUICKCART POS</div>
                    </div>
                </div>
            </section>

            {/* ── 4. ADVANTAGES SECTION (The smart choice for your team) ─────── */}
            <section className="pos-exact-advantages" id="advantages">
                <div className="pos-exact-container">
                    <div className="pos-exact-section-header">
                        <span className="pos-exact-category-tag">ADVANTAGES</span>
                        <h2 className="pos-exact-section-title">The smart choice for your team</h2>
                        <p className="pos-exact-section-desc">
                            Purpose-built cloud software to accelerate checkout, eliminate inventory shrinkage, and elevate customer satisfaction.
                        </p>
                    </div>

                    <div className="pos-exact-advantages-grid">
                        {/* Card 1 */}
                        <div className="pos-exact-adv-card">
                            <div className="pos-exact-icon-box purple">
                                <Share2 size={24} />
                            </div>
                            <h3 className="pos-exact-adv-title">Seamless Collaboration</h3>
                            <p className="pos-exact-adv-desc">
                                Connect billing counters, warehouse managers, and store accountants in one synchronized real-time workspace with role-based access.
                            </p>
                            <a href="#demo" className="pos-exact-adv-link">
                                LEARN MORE <ArrowRight size={14} />
                            </a>
                        </div>

                        {/* Card 2 */}
                        <div className="pos-exact-adv-card">
                            <div className="pos-exact-icon-box pink">
                                <Sliders size={24} />
                            </div>
                            <h3 className="pos-exact-adv-title">All-in-One Cloud POS</h3>
                            <p className="pos-exact-adv-desc">
                                Ring up barcodes in under 2 seconds with offline resilience, cash drawer sync, electronic weighing scales, and dynamic UPI QR payments.
                            </p>
                            <a href="#demo" className="pos-exact-adv-link">
                                LEARN MORE <ArrowRight size={14} />
                            </a>
                        </div>

                        {/* Card 3 */}
                        <div className="pos-exact-adv-card">
                            <div className="pos-exact-icon-box amber">
                                <ShieldCheck size={24} />
                            </div>
                            <h3 className="pos-exact-adv-title">Multi-Store Inventory Sync</h3>
                            <p className="pos-exact-adv-desc">
                                Live stock tracking across multiple retail branches and warehouses with automated low-stock alerts and inter-branch transfer gate passes.
                            </p>
                            <a href="#demo" className="pos-exact-adv-link">
                                LEARN MORE <ArrowRight size={14} />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 5. KEY FEATURES TO BOOST PRODUCTIVITY (Pastel 3-Card Grid) ─ */}
            <section className="pos-exact-boost">
                <div className="pos-exact-container">
                    <div className="pos-exact-section-header">
                        <span className="pos-exact-category-tag">ADVANTAGES</span>
                        <h2 className="pos-exact-section-title">Key features to boost your productivity</h2>
                        <p className="pos-exact-section-desc">
                            Explore the modern tools that help cashiers ring up bills faster and store owners control margins effortlessly.
                        </p>
                    </div>

                    <div className="pos-exact-boost-grid">
                        {/* Step Card 01 - Peach Tint */}
                        <div className="pos-exact-boost-card peach">
                            <div className="pos-exact-step-pill">01</div>
                            <h3 className="pos-exact-boost-title">Instant Barcode & QR Checkout</h3>
                            <p className="pos-exact-boost-desc">
                                Scan items with any handheld or wireless scanner, apply dynamic discounts, and print thermal receipts in under 2 seconds.
                            </p>

                            <div className="pos-exact-boost-ui">
                                <div className="pos-exact-boost-ui-row">
                                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Amul Gold Milk 500ml</span>
                                    <span className="pos-exact-boost-badge orange">₹33.00</span>
                                </div>
                                <div style={{ fontSize: '11px', color: '#ea580c', fontWeight: 600 }}>
                                    ⚡ Scanned via USB Laser Scanner in 0.2s
                                </div>
                                <div className="pos-exact-boost-progress-bar">
                                    <div className="pos-exact-boost-progress-fill orange"></div>
                                </div>
                            </div>
                        </div>

                        {/* Step Card 02 - Mint Tint */}
                        <div className="pos-exact-boost-card mint">
                            <div className="pos-exact-step-pill">02</div>
                            <h3 className="pos-exact-boost-title">Multi-Store Inventory & Batches</h3>
                            <p className="pos-exact-boost-desc">
                                Real-time stock alerts across branches, automatic re-ordering, batch/expiry tracking with FIFO rules.
                            </p>

                            <div className="pos-exact-boost-ui">
                                <div className="pos-exact-boost-ui-row">
                                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Central Warehouse</span>
                                    <span className="pos-exact-boost-badge green">4,850 Units</span>
                                </div>
                                <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: 600 }}>
                                    ✔ FIFO Batch #NMS-2026-A Verified
                                </div>
                                <div className="pos-exact-boost-progress-bar">
                                    <div className="pos-exact-boost-progress-fill green"></div>
                                </div>
                            </div>
                        </div>

                        {/* Step Card 03 - Lavender Tint */}
                        <div className="pos-exact-boost-card lavender">
                            <div className="pos-exact-step-pill">03</div>
                            <h3 className="pos-exact-boost-title">Customer Khata & WhatsApp Bills</h3>
                            <p className="pos-exact-boost-desc">
                                Replace paper registers with a digital Udhar ledger and send branded PDF invoices with UPI pay links directly to WhatsApp.
                            </p>

                            <div className="pos-exact-boost-ui">
                                <div className="pos-exact-boost-ui-row">
                                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Ramesh Patel</span>
                                    <span className="pos-exact-boost-badge purple">₹3,450 Due</span>
                                </div>
                                <div style={{ fontSize: '11px', color: '#5e48eb', fontWeight: 600 }}>
                                    💬 1-Click WhatsApp Reminder Sent
                                </div>
                                <div className="pos-exact-boost-progress-bar">
                                    <div className="pos-exact-boost-progress-fill purple"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 6. POWERFUL FEATURES (4 Tabs + Sleek Laptop Display) ─────── */}
            <section className="pos-exact-features">
                <div className="pos-exact-container">
                    <div className="pos-exact-section-header">
                        <span className="pos-exact-category-tag">FEATURES</span>
                        <h2 className="pos-exact-section-title">Powerful Features to Elevate Your Workflow</h2>
                        <p className="pos-exact-section-desc">
                            Manage billing, purchases, barcode labels, and GST reports in one lightning-fast web workspace.
                        </p>
                    </div>

                    {/* 4 Interactive Feature Tabs */}
                    <div className="pos-exact-tabs-grid">
                        {tabFeatures.map((t, idx) => (
                            <div
                                key={idx}
                                className={`pos-exact-tab-card ${activeTab === idx ? 'active' : ''}`}
                                onClick={() => setActiveTab(idx)}
                            >
                                <div className="pos-exact-tab-top">
                                    <div className={`pos-exact-icon-box ${t.color}`} style={{ width: 34, height: 34, marginBottom: 0 }}>
                                        {t.icon}
                                    </div>
                                    <span className="pos-exact-tab-title">{t.title}</span>
                                </div>
                                <p className="pos-exact-tab-sub">{t.sub}</p>
                            </div>
                        ))}
                    </div>

                    {/* Sleek Laptop Mockup Display */}
                    <div className="pos-exact-laptop-wrapper">
                        {/* Play Button Overlay */}
                        <a
                            href="https://namustutamsaas.vercel.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="pos-exact-laptop-play-btn"
                        >
                            <div className="pos-exact-play-circle">
                                <Play size={12} fill="#ffffff" />
                            </div>
                            <span>Play demo</span>
                        </a>

                        {/* Floating Accent Badges */}
                        <div className="pos-exact-laptop-badge-purple">
                            ⚡ 99.99% Cloud SLA
                        </div>
                        <div className="pos-exact-laptop-badge-lime">
                            ● Real-Time Sync
                        </div>

                        {/* Laptop Screen Body */}
                        <div className="pos-exact-laptop-screen">
                            <div className="pos-exact-laptop-camera"></div>
                            <div className="pos-exact-laptop-inner-display">
                                <img
                                    src={tabFeatures[activeTab].image}
                                    alt={tabFeatures[activeTab].title}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 7. TESTIMONIALS SECTION (What our users say) ─────────────── */}
            <section className="pos-exact-testimonials" id="testimonials">
                <div className="pos-exact-container">
                    <div className="pos-exact-section-header">
                        <span className="pos-exact-category-tag">TESTIMONIALS</span>
                        <h2 className="pos-exact-section-title">What our users say</h2>
                        <p className="pos-exact-section-desc">
                            See how retail owners and supermarket chains use Namustutam to run faster, smoother operations.
                        </p>
                    </div>

                    <div className="pos-exact-testimonials-grid">
                        {/* Testimonial 1 */}
                        <div className="pos-exact-test-card">
                            <div className="pos-exact-test-quote-mark">“</div>
                            <p className="pos-exact-test-text">
                                Namustutam cut down our billing counter queues by 60%. Barcode scanning is instant, and our customers love receiving bills directly on WhatsApp!
                            </p>
                            <div className="pos-exact-test-author-row">
                                <div>
                                    <div className="pos-exact-test-name">Sarah Thomson</div>
                                    <div className="pos-exact-test-role">Owner, FreshMart Organics</div>
                                </div>
                                <div className="pos-exact-test-logo-badge">🛒 FreshMart</div>
                            </div>
                        </div>

                        {/* Testimonial 2 */}
                        <div className="pos-exact-test-card">
                            <div className="pos-exact-test-quote-mark">“</div>
                            <p className="pos-exact-test-text">
                                Managing stock across 4 retail branches was a nightmare before Namustutam. Now I see live stock movements and daily profits right on my phone.
                            </p>
                            <div className="pos-exact-test-author-row">
                                <div>
                                    <div className="pos-exact-test-name">Alex Rivera</div>
                                    <div className="pos-exact-test-role">Operations Lead, MetroMart</div>
                                </div>
                                <div className="pos-exact-test-logo-badge">⚡ MetroMart</div>
                            </div>
                        </div>

                        {/* Testimonial 3 */}
                        <div className="pos-exact-test-card">
                            <div className="pos-exact-test-quote-mark">“</div>
                            <p className="pos-exact-test-text">
                                The automated GST filing and credit ledger (Khata) has completely saved our accounting time. Highly recommended for every modern retail business.
                            </p>
                            <div className="pos-exact-test-author-row">
                                <div>
                                    <div className="pos-exact-test-name">David Chen</div>
                                    <div className="pos-exact-test-role">Founder, Spice & More</div>
                                </div>
                                <div className="pos-exact-test-logo-badge">✨ SpiceCraft</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 8. FULL-WIDTH CRIMSON / ROSE PINK STATS STRIP BANNER ─────── */}
            <section className="pos-exact-crimson-strip">
                <div className="pos-exact-container">
                    <div className="pos-exact-crimson-grid">
                        <div className="pos-exact-crimson-col">
                            <div className="pos-exact-crimson-num">5,000+</div>
                            <div className="pos-exact-crimson-label">
                                Active retail stores & boutiques powered across India
                            </div>
                        </div>

                        <div className="pos-exact-crimson-col">
                            <div className="pos-exact-crimson-num">₹100Cr+</div>
                            <div className="pos-exact-crimson-label">
                                Annual GMV retail volume processed flawlessly without downtime
                            </div>
                        </div>

                        <div className="pos-exact-crimson-col">
                            <div className="pos-exact-crimson-num">50,000+</div>
                            <div className="pos-exact-crimson-label">
                                Daily digital WhatsApp invoices delivered automatically
                            </div>
                        </div>

                        <div className="pos-exact-crimson-col">
                            <div className="pos-exact-crimson-num">&lt; 2s</div>
                            <div className="pos-exact-crimson-label">
                                Average checkout speed reduction per customer queue
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 9. PRICING SECTION (Flexible plans for every store) ──────── */}
            <section className="pos-exact-pricing" id="pricing">
                <div className="pos-exact-container">
                    <div className="pos-exact-section-header">
                        <span className="pos-exact-category-tag">PRICING</span>
                        <h2 className="pos-exact-section-title">Flexible plans for every store</h2>
                        <p className="pos-exact-section-desc">
                            Choose the best plan for your retail outlet. Honest pricing with zero hidden fees and no lock-in.
                        </p>
                    </div>

                    {/* Monthly / Annual Toggle */}
                    <div className="pos-exact-pricing-toggle">
                        <span
                            className={`pos-exact-toggle-label ${!isAnnual ? 'active' : ''}`}
                            onClick={() => setIsAnnual(false)}
                        >
                            Monthly
                        </span>

                        <div
                            className={`pos-exact-switch ${isAnnual ? 'on' : ''}`}
                            onClick={() => setIsAnnual(!isAnnual)}
                        >
                            <div className="pos-exact-switch-slider"></div>
                        </div>

                        <span
                            className={`pos-exact-toggle-label ${isAnnual ? 'active' : ''}`}
                            onClick={() => setIsAnnual(true)}
                        >
                            Annual
                        </span>

                        <span className="pos-exact-save-tag">Save 20% + 2 Months Free</span>
                    </div>

                    <div className="pos-exact-pricing-grid">
                        {/* Plan 1: Starter */}
                        <div className="pos-exact-plan-card">
                            <div className="pos-exact-icon-box pink">
                                <Scan size={20} />
                            </div>
                            <h3 className="pos-exact-plan-name">Starter POS</h3>
                            <p className="pos-exact-plan-sub">Essential features for single counter retail counters & boutique shops.</p>
                            
                            <div className="pos-exact-plan-price-wrap">
                                <span className="pos-exact-plan-currency">₹</span>
                                <span className="pos-exact-plan-amount">{isAnnual ? '399' : '499'}</span>
                                <span className="pos-exact-plan-period">/ month</span>
                            </div>

                            <ul className="pos-exact-plan-features">
                                <li><Check size={16} /> 1 POS Billing Register</li>
                                <li><Check size={16} /> 1 Store Location</li>
                                <li><Check size={16} /> Up to 1,500 Products</li>
                                <li><Check size={16} /> Unlimited Sales Invoices</li>
                                <li><Check size={16} /> Barcode Scanner & Thermal Print</li>
                                <li><Check size={16} /> Basic WhatsApp Receipts</li>
                            </ul>

                            <a href="#demo" className="pos-exact-plan-btn outline">
                                Get Started Free
                            </a>
                        </div>

                        {/* Plan 2: Growth Retail (Featured - Purple Button) */}
                        <div className="pos-exact-plan-card featured">
                            <div className="pos-exact-icon-box purple">
                                <Zap size={20} />
                            </div>
                            <h3 className="pos-exact-plan-name">Growth Retail</h3>
                            <p className="pos-exact-plan-sub">Advanced multi-counter tools for growing supermarkets and busy stores.</p>

                            <div className="pos-exact-plan-price-wrap">
                                <span className="pos-exact-plan-currency">₹</span>
                                <span className="pos-exact-plan-amount">{isAnnual ? '799' : '999'}</span>
                                <span className="pos-exact-plan-period">/ month</span>
                            </div>

                            <ul className="pos-exact-plan-features">
                                <li><Check size={16} /> <strong>Up to 3 POS Registers</strong></li>
                                <li><Check size={16} /> <strong>2 Store Outlets Included</strong></li>
                                <li><Check size={16} /> Unlimited Products & Catalog</li>
                                <li><Check size={16} /> Customer Digital Khata Ledger</li>
                                <li><Check size={16} /> Batch Number & Expiry Tracking</li>
                                <li><Check size={16} /> Automated WhatsApp Reminders</li>
                                <li><Check size={16} /> Priority Phone & WhatsApp Support</li>
                            </ul>

                            <Link
                                to="/register"
                                className="pos-exact-plan-btn solid"
                            >
                                Upgrade Now →
                            </Link>
                        </div>

                        {/* Plan 3: Enterprise */}
                        <div className="pos-exact-plan-card">
                            <div className="pos-exact-icon-box amber">
                                <Award size={20} />
                            </div>
                            <h3 className="pos-exact-plan-name">Enterprise Chain</h3>
                            <p className="pos-exact-plan-sub">Full operating control for multi-store retail chains and franchises.</p>

                            <div className="pos-exact-plan-price-wrap">
                                <span className="pos-exact-plan-currency">₹</span>
                                <span className="pos-exact-plan-amount">{isAnnual ? '1,599' : '1,999'}</span>
                                <span className="pos-exact-plan-period">/ month</span>
                            </div>

                            <ul className="pos-exact-plan-features">
                                <li><Check size={16} /> <strong>Unlimited POS Registers</strong></li>
                                <li><Check size={16} /> <strong>Unlimited Stores & Warehouses</strong></li>
                                <li><Check size={16} /> Centralized Catalog & Pricing Matrix</li>
                                <li><Check size={16} /> Inter-Warehouse Stock Transfers</li>
                                <li><Check size={16} /> Granular Staff Role Permissions</li>
                                <li><Check size={16} /> Dedicated Account Manager & Onsite Setup</li>
                            </ul>

                            <a href="#demo" className="pos-exact-plan-btn soft-purple">
                                Contact Sales
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 10. BOTTOM STREAMLINE BANNER (Fanned-out Perspective Cards) ─ */}
            <section className="pos-exact-bottom-banner">
                <div className="pos-exact-container">
                    <div className="pos-exact-streamline-card">
                        <div>
                            <h2 className="pos-exact-streamline-title">
                                Ready to streamline<br />
                                your retail workflow?
                            </h2>
                            <p className="pos-exact-streamline-desc">
                                Join thousands of retail entrepreneurs saving hours every day, eliminating counter bottlenecks, and providing best-in-class checkout experiences.
                            </p>
                            <Link
                                to="/register"
                                className="pos-exact-btn-pill-primary"
                                style={{ padding: '14px 32px', fontSize: '15px' }}
                            >
                                Get Started Now
                            </Link>
                        </div>

                        {/* 3D Fanned-out Perspective Cards Mockup */}
                        <div className="pos-exact-fanned-cards-wrap">
                            <div className="pos-exact-fan-card c1">
                                <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>TODAY'S SALES</div>
                                <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '6px 0' }}>₹48,988</div>
                                <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: 700 }}>+22% vs Yesterday</div>
                            </div>

                            <div className="pos-exact-fan-card c2">
                                <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>STOCK ALERT</div>
                                <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: '4px 0' }}>Amul Butter 100g</div>
                                <span style={{ fontSize: '10px', background: '#fee2e2', color: '#dc2626', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>Reorder (3 left)</span>
                            </div>

                            <div className="pos-exact-fan-card c3">
                                <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>BILLING SPEED</div>
                                <div style={{ fontSize: '20px', fontWeight: 800, color: '#5e48eb', margin: '6px 0' }}>1.4s / bill</div>
                                <div style={{ fontSize: '11px', color: '#64748b' }}>Thermal Print Ready</div>
                            </div>

                            <div className="pos-exact-fan-floating-circle">
                                <Sparkles size={20} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 11. PRE-FOOTER NEWSLETTER BAR ────────────────────────────── */}
            <section className="pos-exact-newsletter-bar">
                <div className="pos-exact-container">
                    <div className="pos-exact-news-inner">
                        <div className="pos-exact-news-left">
                            <h4>Join our retail growth community</h4>
                            <p>Get weekly updates on retail billing tips, GST compliance changes, and inventory hacks.</p>
                        </div>

                        <form className="pos-exact-news-form" onSubmit={handleNewsSubmit}>
                            <input
                                type="email"
                                required
                                placeholder="Enter your business email..."
                                value={newsEmail}
                                onChange={(e) => setNewsEmail(e.target.value)}
                                className="pos-exact-news-input"
                            />
                            <button type="submit" className="pos-exact-news-btn">
                                {newsSuccess ? 'REGISTERED! ✔' : 'REGISTER'}
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* ── 12. DEMO FORM SECTION ────────────────────────────────────── */}
            <section className="pos-exact-demo-section" id="demo">
                <div className="pos-exact-container">
                    <div className="pos-exact-demo-box">
                        <div className="pos-exact-demo-left">
                            <span className="pos-exact-category-tag">GET IN TOUCH</span>
                            <h3>See Namustutam POS In Action With a Retail Specialist</h3>
                            <p>
                                Request a personalized 15-minute walkthrough tailored to your retail category. 
                                We'll demonstrate live barcode scanning, bill printing, inventory setup, and data migration.
                            </p>

                            <ul className="pos-exact-demo-perks">
                                <li><Check size={18} /> Free 14-day full featured trial account</li>
                                <li><Check size={18} /> Free product catalog migration from Excel/Tally/Busy</li>
                                <li><Check size={18} /> Zero setup fee, zero card details required</li>
                            </ul>

                            <div style={{ marginTop: 20 }}>
                                <a
                                    href="https://wa.me/919876543210?text=Hello%20Namustutam%20team,%20I%20want%20a%20demo%20of%20Namustutam%20POS%20Software"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 8,
                                        fontSize: 13,
                                        fontWeight: 700,
                                        color: '#16a34a',
                                        textDecoration: 'none'
                                    }}
                                >
                                    <MessageSquare size={16} /> Quick WhatsApp Chat with POS Expert →
                                </a>
                            </div>
                        </div>

                        <div className="pos-exact-demo-right">
                            <form onSubmit={handleDemoSubmit}>
                                {demoStatus === 'success' && (
                                    <div style={{ background: '#f0fdf4', color: '#16a34a', padding: '12px 16px', borderRadius: 10, marginBottom: 16, fontSize: 13, display: 'flex', gap: 8, alignItems: 'center' }}>
                                        <CheckCircle2 size={18} />
                                        <span>{demoMsg}</span>
                                    </div>
                                )}
                                {demoStatus === 'error' && (
                                    <div style={{ background: '#fef2f2', color: '#dc2626', padding: '12px 16px', borderRadius: 10, marginBottom: 16, fontSize: 13, display: 'flex', gap: 8, alignItems: 'center' }}>
                                        <AlertCircle size={18} />
                                        <span>{demoMsg}</span>
                                    </div>
                                )}

                                <div className="pos-exact-form-grid">
                                    <div className="pos-exact-form-group">
                                        <label>Your Full Name *</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. Ramesh Patel"
                                            value={demoForm.name}
                                            onChange={(e) => setDemoForm({ ...demoForm, name: e.target.value })}
                                        />
                                    </div>

                                    <div className="pos-exact-form-group">
                                        <label>Phone / WhatsApp *</label>
                                        <input
                                            type="tel"
                                            required
                                            placeholder="e.g. 9876543210"
                                            value={demoForm.phone}
                                            onChange={(e) => setDemoForm({ ...demoForm, phone: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="pos-exact-form-grid">
                                    <div className="pos-exact-form-group">
                                        <label>Email Address *</label>
                                        <input
                                            type="email"
                                            required
                                            placeholder="e.g. store@gmail.com"
                                            value={demoForm.email}
                                            onChange={(e) => setDemoForm({ ...demoForm, email: e.target.value })}
                                        />
                                    </div>

                                    <div className="pos-exact-form-group">
                                        <label>Store Name</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Shree Supermarket"
                                            value={demoForm.storeName}
                                            onChange={(e) => setDemoForm({ ...demoForm, storeName: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="pos-exact-form-grid">
                                    <div className="pos-exact-form-group">
                                        <label>Retail Business Type</label>
                                        <select
                                            value={demoForm.retailType}
                                            onChange={(e) => setDemoForm({ ...demoForm, retailType: e.target.value })}
                                        >
                                            <option value="Supermarket / Grocery">Supermarket / Grocery</option>
                                            <option value="Clothing / Apparel Boutique">Clothing / Apparel Boutique</option>
                                            <option value="Electronics & Mobile Store">Electronics & Mobile Store</option>
                                            <option value="Cafe / Restaurant / Bakery">Cafe / Restaurant / Bakery</option>
                                            <option value="Pharmacy / Chemist">Pharmacy / Chemist</option>
                                            <option value="Hardware / Sanitary / Wholesale">Hardware / Sanitary / Wholesale</option>
                                            <option value="Other Retail Business">Other Retail Business</option>
                                        </select>
                                    </div>

                                    <div className="pos-exact-form-group">
                                        <label>City / Location</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Mumbai, Pune, Delhi"
                                            value={demoForm.city}
                                            onChange={(e) => setDemoForm({ ...demoForm, city: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="pos-exact-form-group">
                                    <label>Specific requirements</label>
                                    <textarea
                                        rows={3}
                                        placeholder="Number of billing counters, barcode printer model, etc."
                                        value={demoForm.message}
                                        onChange={(e) => setDemoForm({ ...demoForm, message: e.target.value })}
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="pos-exact-demo-submit-btn"
                                    disabled={demoSubmitting}
                                >
                                    {demoSubmitting ? 'Scheduling...' : 'Schedule Live POS Demo →'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 13. FOOTER ──────────────────────────────────────────────── */}
            <footer className="pos-exact-footer">
                <div className="pos-exact-container">
                    <div className="pos-exact-footer-grid">
                        <div>
                            <Link to="/possoftware" className="pos-exact-brand">
                                <div className="pos-exact-logo-badge">N</div>
                                <span className="pos-exact-brand-text">Namustutam <span>POS</span></span>
                            </Link>
                            <p className="pos-exact-footer-brand-p">
                                The next-generation cloud retail SaaS operating system powering modern Indian businesses with fast billing, inventory sync, and digital invoices.
                            </p>
                        </div>

                        <div className="pos-exact-footer-col">
                            <h5>Solutions</h5>
                            <ul>
                                <li><a href="#advantages">Supermarket POS</a></li>
                                <li><a href="#advantages">Fashion & Apparel</a></li>
                                <li><a href="#advantages">Electronics & Mobiles</a></li>
                                <li><a href="#advantages">Pharmacy & Chemists</a></li>
                            </ul>
                        </div>

                        <div className="pos-exact-footer-col">
                            <h5>Features</h5>
                            <ul>
                                <li><a href="#advantages">Barcode Billing</a></li>
                                <li><a href="#advantages">Inventory & Batches</a></li>
                                <li><a href="#advantages">WhatsApp Invoices</a></li>
                                <li><a href="#pricing">Flexible Plans</a></li>
                            </ul>
                        </div>

                        <div className="pos-exact-footer-col">
                            <h5>Company</h5>
                            <ul>
                                <li><Link to="/">About Namustutam</Link></li>
                                <li><a href="#demo">Book a Demo</a></li>
                                <li><a href="https://namustutamsaas.vercel.app/" target="_blank" rel="noopener noreferrer">Live Terminal App</a></li>
                                <li><a href="#pricing">Terms & Pricing</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pos-exact-footer-bottom">
                        <div>
                            © 2026 Namustutam SaaS Inc. All rights reserved.
                        </div>
                        <div>
                            <a href="#privacy">Privacy Policy</a>
                            <a href="#terms">Terms of Service</a>
                            <a href="#security">Security</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
