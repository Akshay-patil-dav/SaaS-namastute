import { useState, useEffect, useRef } from 'react';
import {
    Scan, TrendingUp, Box, Check, MessageSquare,
    Zap, CheckCircle2, AlertCircle, Share2, Sliders,
    ShieldCheck, ArrowRight, Lock, Star, Store, Layers,
    Users, Globe, Send, Phone, Mail, Clock
} from 'lucide-react';
import WebsiteNavbar from '../../../components/common/WebsiteNavbar/WebsiteNavbar';
import WebsiteFooter from '../../../components/common/WebsiteFooter/WebsiteFooter';
import { useLandingPage } from '../../../context/LandingPageContext';
import { resolveContactChannels } from '../../../utils/contactChannels';
import apiClient from '../../../api/config';
import './PosSoftware.css';

const POS_APP_URL = 'https://namustutamsaas.vercel.app';

const HERO_KPIS = [
    { icon: <TrendingUp size={13} />, color: 'purple', badge: '+18.4%', badgeType: 'up', val: '₹48,950', label: "Today's Sales" },
    { icon: <Scan size={13} />, color: 'pink', badge: '1.4s avg', badgeType: 'neutral', val: '186', label: 'Bills Printed' },
    { icon: <Zap size={13} />, color: 'amber', badge: '0% Fee', badgeType: 'up', val: '₹21,400', label: 'UPI QR Settled' },
    { icon: <Box size={13} />, color: 'mint', badge: '3 Alert', badgeType: 'warn', val: '4,850', label: 'Active SKUs' }
];

const HERO_QUEUE_ROWS = [
    { dot: 'green', title: 'Invoice #INV-4091 — Ramesh Patel', sub: 'Cash + Loyalty Redeem • 58mm Thermal Printed', right: '₹1,140.00', isStatus: false },
    { dot: 'purple', title: 'Stock Transfer #TR-108', sub: 'Main Warehouse → Bandra Outlet • 120 units', right: 'Synced', isStatus: true }
];

const TRUST_BRANDS = [
    { icon: <Store size={18} />, name: 'FreshMart' },
    { icon: <Zap size={18} />, name: 'MetroMart' },
    { icon: <Layers size={18} />, name: 'Veda Lifestyle' },
    { icon: <ShieldCheck size={18} />, name: 'MedPlus Care' },
    { icon: <Box size={18} />, name: 'QuickCart POS' }
];

const ADVANTAGE_CARDS = [
    {
        icon: <Share2 size={24} />,
        color: 'purple',
        title: 'Seamless Collaboration',
        desc: 'Connect billing counters, warehouse managers, and store accountants in one synchronized real-time workspace with role-based permissions.'
    },
    {
        icon: <Sliders size={24} />,
        color: 'pink',
        title: 'All-in-One Cloud POS',
        desc: 'Ring up barcodes in under 2 seconds with offline resilience, cash drawer sync, weighing scales, and zero-fee dynamic UPI QR payments.'
    },
    {
        icon: <ShieldCheck size={24} />,
        color: 'amber',
        title: 'Multi-Store Inventory Sync',
        desc: 'Live stock tracking across multiple retail branches and warehouses with automated low-stock alerts and inter-branch transfer gate passes.'
    }
];

const BOOST_CARDS = [
    {
        num: '01',
        tint: 'peach',
        title: 'Instant Barcode & QR Checkout',
        desc: 'Scan items with any handheld or wireless scanner, apply dynamic discounts, and print thermal receipts in under 2 seconds.',
        mainTitle: 'Amul Gold Milk 500ml',
        badge: '₹33.00',
        badgeClass: 'orange',
        meta: 'Scanned via USB Laser Scanner in 0.2s',
        metaColor: '#ea580c',
        chipLeft: 'Receipt Format',
        chipRight: '58mm / 80mm Ready'
    },
    {
        num: '02',
        tint: 'mint',
        title: 'Multi-Store Inventory & Batches',
        desc: 'Real-time stock alerts across branches, automatic re-ordering, and batch/expiry tracking with strict FIFO rules.',
        mainTitle: 'Central Warehouse',
        badge: '4,850 Units',
        badgeClass: 'green',
        meta: 'FIFO Batch #NMS-2026-A Verified',
        metaColor: '#16a34a',
        chipLeft: 'Branch Sync',
        chipRight: '3 Outlets Connected'
    },
    {
        num: '03',
        tint: 'lavender',
        title: 'Customer Khata & WhatsApp Bills',
        desc: 'Replace paper registers with a digital Udhar ledger and send branded PDF invoices with UPI pay links directly to WhatsApp.',
        mainTitle: 'Ramesh Patel — Ledger',
        badge: '₹3,450 Due',
        badgeClass: 'purple',
        meta: '1-Click WhatsApp Reminder Sent',
        metaColor: '#ea580c',
        chipLeft: 'Payment Mode',
        chipRight: 'Dynamic UPI QR Link'
    }
];

const TESTIMONIALS = [
    {
        quote: 'Namustutam cut down our billing counter queues by 60%. Barcode scanning is instant, and our customers love receiving digital receipts directly on WhatsApp.',
        initials: 'PS',
        name: 'Priya Sharma',
        role: 'Founder, StyleHub Apparel Boutique'
    },
    {
        quote: 'Managing stock across 4 retail branches was exhausting before Namustutam. Now I monitor live inventory movements and daily profits right from my phone.',
        initials: 'RK',
        name: 'Rajesh Kulkarni',
        role: 'Director, FreshMart Superstores'
    },
    {
        quote: 'Automated GST reporting and the customer credit ledger saved our accounting team hours every week. Best cloud POS investment we have made.',
        initials: 'VN',
        name: 'Vikram Nair',
        role: 'Managing Partner, MedPlus Care'
    }
];

const DEFAULT_POS_STATS = [
    {
        id: 'total',
        target: 15,
        prefix: '',
        accent: '+',
        title: 'Total Clients',
        label: 'Active retail counters & boutiques powered across India'
    },
    {
        id: 'online',
        target: 5,
        prefix: '',
        accent: '+',
        title: 'Online Customers',
        label: 'Live cloud web billing & WhatsApp digital invoices sync'
    },
    {
        id: 'offline',
        target: 10,
        prefix: '',
        accent: '+',
        title: 'Offline Customers',
        label: 'In-store counter & desktop billing clients with zero downtime'
    },
    {
        id: 'speed',
        target: 2,
        prefix: '< ',
        accent: 's',
        title: 'Checkout Speed',
        label: 'Average checkout completion time per customer queue'
    }
];

function StatsBanner({ stats }) {
    const sectionRef = useRef(null);
    const items = (stats && stats.length > 0) ? stats : DEFAULT_POS_STATS;
    const [counts, setCounts] = useState(() => items.map((item) => Number(item.target) || 0));
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        const el = sectionRef.current;
        if (!el || typeof IntersectionObserver === 'undefined') {
            setHasAnimated(true);
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    setHasAnimated(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.2 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!hasAnimated) return;

        let rafId = 0;
        const duration = 900;
        const start = performance.now();

        const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCounts(items.map((item) => Math.round((Number(item.target) || 0) * eased)));
            if (progress < 1) {
                rafId = requestAnimationFrame(tick);
            }
        };

        rafId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafId);
    }, [hasAnimated, items]);

    return (
        <section ref={sectionRef} className="pos-stats-strip-exact" aria-label="Client Adoption Metrics">
            <div className="pos-exact-container">
                <div className="pos-stats-strip-grid">
                    {items.map((stat, idx) => (
                        <div key={stat.id || idx} className="pos-stats-strip-col">
                            <div className="pos-stats-strip-num-row">
                                <span className="pos-stats-strip-val">
                                    {stat.prefix || ''}{counts[idx]}
                                </span>
                                <span className="pos-stats-strip-accent">{stat.accent || '+'}</span>
                            </div>
                            <div className="pos-stats-strip-title">{stat.title}</div>
                            <div className="pos-stats-strip-desc">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

const DEFAULT_PRICING_PLANS = [
    {
        id: 'STARTER',
        name: 'Starter POS',
        sub: 'Essential tools for single-counter retail stores and boutique shops.',
        monthly: '399',
        billedNote: '₹399 billed monthly • Cancel anytime',
        featured: false,
        btnClass: 'outline',
        ctaLabel: 'Get Started Free',
        ctaHref: `${POS_APP_URL}/register`,
        external: true,
        features: [
            '1 POS Billing Register',
            '1 Store Location',
            'Up to 1,500 Active SKUs',
            'Unlimited GST Sales Invoices',
            'Barcode Scanner & Thermal Print',
            'Basic WhatsApp Digital Bills'
        ]
    },
    {
        id: 'GROWTH',
        name: 'Growth Retail',
        sub: 'Multi-counter billing, batch control, and Khata tools for busy stores.',
        monthly: '799',
        billedNote: '₹799 billed monthly • Cancel anytime',
        featured: true,
        badge: 'MOST POPULAR',
        btnClass: 'solid',
        ctaLabel: 'Upgrade Now →',
        ctaHref: `${POS_APP_URL}/register`,
        external: true,
        features: [
            'Up to 3 POS Registers',
            '2 Store Outlets Included',
            'Unlimited Products & Catalog',
            'Customer Digital Khata Ledger',
            'Batch Number & Expiry Tracking',
            'Automated WhatsApp Reminders'
        ]
    },
    {
        id: 'ENTERPRISE',
        name: 'Enterprise Chain',
        sub: 'Full operating control for retail chains, franchises, and warehouses.',
        monthly: '1,599',
        billedNote: '₹1,599 billed monthly • Dedicated Support',
        featured: false,
        btnClass: 'soft-orange',
        ctaLabel: 'Contact Sales',
        ctaHref: '#demo',
        external: false,
        features: [
            'Unlimited POS Registers',
            'Unlimited Stores & Warehouses',
            'Centralized Pricing & Catalog Sync',
            'Inter-Warehouse Stock Gate Passes',
            'Granular Staff Role Permissions',
            'Dedicated Onboarding & Priority SLA'
        ]
    }
];

export default function PosSoftware() {
    const { landingData } = useLandingPage();
    const contact = landingData?.contact || {};
    const posConfig = landingData?.posSoftware || {};
    const statsList = (posConfig.stats && posConfig.stats.length > 0) ? posConfig.stats : DEFAULT_POS_STATS;
    const pricingList = (posConfig.pricingPlans && posConfig.pricingPlans.length > 0) ? posConfig.pricingPlans : DEFAULT_PRICING_PLANS;
    const demoInfo = posConfig.demoInfo || {
        tag: 'GET IN TOUCH',
        title: 'See Namustutam POS In Action With a Retail Specialist',
        description: 'Request a personalized 15-minute walkthrough tailored to your retail category. We\'ll demonstrate live barcode scanning, bill printing, inventory setup, and data migration.',
        bullets: [
            'Free 14-day full featured trial account',
            'Free product catalog migration from Excel, Tally, or Busy',
            'Zero setup fee, zero card details required'
        ],
        whatsappCta: 'Quick WhatsApp Chat with POS Expert →'
    };

    const { whatsappUrl } = resolveContactChannels(contact);
    const whatsappHref = whatsappUrl
        ? `${whatsappUrl}?text=Hello%20Namustutam%20team,%20I%20want%20a%20demo%20of%20Namustutam%20POS%20Software`
        : '';

    const [demoForm, setDemoForm] = useState({
        name: '',
        phone: '',
        email: '',
        storeName: '',
        businessType: 'Supermarket / Grocery',
        city: '',
        requirements: ''
    });
    const [demoSubmitting, setDemoSubmitting] = useState(false);
    const [demoStatus, setDemoStatus] = useState(null); // 'success' | 'error' | null
    const [demoMsg, setDemoMsg] = useState('');
    const [submittedName, setSubmittedName] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = 'Namustutam POS Software | All-in-One Cloud Retail & Billing Software';
    }, []);

    const handleDemoChange = (e) => {
        const { name, value } = e.target;
        setDemoForm((prev) => ({ ...prev, [name]: value }));
        if (demoStatus === 'error') {
            setDemoStatus(null);
            setDemoMsg('');
        }
    };

    const handleDemoSubmit = async (e) => {
        e.preventDefault();

        if (!demoForm.name.trim() || !demoForm.email.trim() || !demoForm.phone.trim()) {
            setDemoStatus('error');
            setDemoMsg('Please fill in your Full Name, Phone / WhatsApp, and Email Address.');
            return;
        }

        setDemoSubmitting(true);
        setDemoStatus(null);
        setDemoMsg('');

        const payload = {
            name: demoForm.name.trim(),
            email: demoForm.email.trim(),
            phone: demoForm.phone.trim() || undefined,
            service: `Namustutam POS Software (${demoForm.businessType || 'Retail'})`,
            subject: `POS Demo Request: ${demoForm.storeName ? demoForm.storeName.trim() + ' (' + (demoForm.city?.trim() || 'India') + ')' : demoForm.name.trim()}`,
            message: [
                `Store Name: ${demoForm.storeName?.trim() || 'Not specified'}`,
                `Retail Category: ${demoForm.businessType || 'Supermarket / Grocery'}`,
                `City / Location: ${demoForm.city?.trim() || 'Not specified'}`,
                `Phone / WhatsApp: ${demoForm.phone?.trim() || 'Not specified'}`,
                `Specific Requirements: ${demoForm.requirements?.trim() || '15-minute live POS demo & onboarding walkthrough requested.'}`
            ].join('\n')
        };

        try {
            const res = await apiClient.post('/contact-submissions', payload);
            if (res.data?.success || res.status === 200 || res.status === 201) {
                setSubmittedName(demoForm.name.trim());
                setDemoStatus('success');
                setDemoForm({
                    name: '',
                    phone: '',
                    email: '',
                    storeName: '',
                    businessType: 'Supermarket / Grocery',
                    city: '',
                    requirements: ''
                });
            } else {
                throw new Error(res.data?.message || 'Failed to submit form');
            }
        } catch (err) {
            try {
                const retryRes = await apiClient.post('/contacts', payload);
                if (retryRes.data?.success || retryRes.status === 200 || retryRes.status === 201) {
                    setSubmittedName(demoForm.name.trim());
                    setDemoStatus('success');
                    setDemoForm({
                        name: '',
                        phone: '',
                        email: '',
                        storeName: '',
                        businessType: 'Supermarket / Grocery',
                        city: '',
                        requirements: ''
                    });
                    setDemoSubmitting(false);
                    return;
                }
            } catch (_retryErr) {
                // Secondary fallback failed
            }

            setDemoStatus('error');
            const msg = err.response?.data?.message || err.message || 'Unable to connect to the server. Please try again or reach out via WhatsApp.';
            setDemoMsg(msg);
        } finally {
            setDemoSubmitting(false);
        }
    };

    return (
        <div className="pos-exact-root">
            {/* ── 1. GLOBAL LANDING PAGE HEADER ──────────────────────────── */}
            <WebsiteNavbar />

            {/* ── 2. HERO SECTION ─────────────────────────────────────────── */}
            <section className="pos-exact-hero">
                <div className="pos-exact-container">
                    <div className="pos-exact-hero-pill">
                        <span className="pos-exact-hero-pill-dot" />
                        <span>Cloud Retail ERP &amp; Point-of-Sale Platform</span>
                    </div>

                    <h1 className="pos-exact-hero-title">
                        Effortless retail<br />
                        management, <span className="highlight-amber">anytime</span>
                    </h1>

                    <p className="pos-exact-hero-subtitle">
                        All-in-one cloud POS &amp; retail operating system designed to accelerate checkout lines,
                        sync multi-store inventory in real-time, and automate GST &amp; WhatsApp invoicing.
                    </p>

                    <div className="pos-exact-hero-cta-group">
                        <a
                            href={`${POS_APP_URL}/`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="pos-exact-btn-pill-primary"
                        >
                            Open POS Terminal →
                        </a>

                        <a
                            href="#demo"
                            className="pos-exact-btn-pill-secondary"
                        >
                            Book Live Demo
                        </a>
                    </div>

                    {/* Vector Desktop App + Crisp Mobile Companion Mockup Stack */}
                    <div className="pos-exact-mockup-wrapper">
                        <div className="pos-exact-desktop-frame">
                            <div className="pos-exact-window-header">
                                <div className="pos-exact-window-dots">
                                    <span className="pos-exact-window-dot red" />
                                    <span className="pos-exact-window-dot yellow" />
                                    <span className="pos-exact-window-dot green" />
                                </div>
                                <div className="pos-exact-window-search">
                                    <Lock size={11} />
                                    <span>namustutamsaas.vercel.app/dashboard</span>
                                </div>
                                <div className="pos-exact-window-right-pill">
                                    <span className="pos-live-dot" /> Cloud Synced
                                </div>
                            </div>

                            <div className="pos-mock-app">
                                <aside className="pos-mock-sidebar">
                                    <div className="pos-mock-brand">
                                        <span className="pos-mock-brand-icon">N</span>
                                        <span>Namustutam POS</span>
                                    </div>
                                    <div className="pos-mock-store-select">
                                        <span className="store-dot" /> FreshMart #01
                                    </div>
                                    <div className="pos-mock-nav-group">
                                        <div className="pos-mock-nav-item active"><TrendingUp size={14} /> Dashboard</div>
                                        <div className="pos-mock-nav-item"><Scan size={14} /> POS Terminal</div>
                                        <div className="pos-mock-nav-item"><Box size={14} /> Inventory</div>
                                        <div className="pos-mock-nav-item"><MessageSquare size={14} /> WhatsApp CRM</div>
                                    </div>
                                    <div className="pos-mock-sidebar-card">
                                        <div className="title">Shift #04 Active</div>
                                        <div className="sub">Counter 01 • Online</div>
                                    </div>
                                </aside>

                                <div className="pos-mock-main">
                                    <div className="pos-mock-topbar">
                                        <div className="pos-mock-greeting">
                                            <h4>Hello, Store Admin</h4>
                                            <p>Live store overview across 3 branches • Updated 2s ago</p>
                                        </div>
                                        <div className="pos-mock-topbar-actions">
                                            <span className="pos-mock-chip">Today</span>
                                            <span className="pos-mock-btn">+ New POS Bill</span>
                                        </div>
                                    </div>

                                    <div className="pos-mock-kpi-row">
                                        {HERO_KPIS.map((kpi) => (
                                            <div key={kpi.label} className="pos-mock-kpi">
                                                <div className="kpi-top">
                                                    <span className={`kpi-icon ${kpi.color}`}>{kpi.icon}</span>
                                                    <span className={`kpi-badge ${kpi.badgeType}`}>{kpi.badge}</span>
                                                </div>
                                                <div className="kpi-val">{kpi.val}</div>
                                                <div className="kpi-lbl">{kpi.label}</div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pos-mock-lower-grid">
                                        <div className="pos-mock-queue">
                                            <div className="pos-mock-panel-head">
                                                <span>Live Counter Feed</span>
                                                <span className="view-all">View All</span>
                                            </div>

                                            <div className="pos-mock-highlight-card">
                                                <div className="hl-top">
                                                    <span>Register #01 • Paid via UPI QR</span>
                                                    <span className="hl-amount">₹2,480.00</span>
                                                </div>
                                                <div className="hl-title">Invoice #INV-4092 — FreshMart Retail Bill</div>
                                                <div className="hl-meta">8 items scanned in 1.3s • WhatsApp e-bill sent</div>
                                            </div>

                                            {HERO_QUEUE_ROWS.map((row) => (
                                                <div key={row.title} className="pos-mock-row-card">
                                                    <div className="row-left">
                                                        <span className={`row-dot ${row.dot}`} />
                                                        <div>
                                                            <div className="row-title">{row.title}</div>
                                                            <div className="row-sub">{row.sub}</div>
                                                        </div>
                                                    </div>
                                                    <span className={row.isStatus ? 'row-status' : 'row-price'}>{row.right}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="pos-mock-side-panel">
                                            <div className="pos-mock-panel-head">
                                                <span>Hourly Volume</span>
                                                <span className="pos-live-pill">LIVE</span>
                                            </div>
                                            <div className="pos-mock-bars">
                                                {[42, 64, 55, 92, 74, 80].map((heightPct, i) => (
                                                    <div
                                                        key={i}
                                                        className={`bar ${i === 3 ? 'active' : ''}`}
                                                        style={{ height: `${heightPct}%` }}
                                                    />
                                                ))}
                                            </div>
                                            <div className="pos-mock-channel-list">
                                                <div className="ch-item"><span>UPI Dynamic QR</span><strong>54%</strong></div>
                                                <div className="ch-item"><span>Cash Register</span><strong>28%</strong></div>
                                                <div className="ch-item"><span>Card / Khata</span><strong>18%</strong></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pos-exact-mobile-frame">
                            <div className="pos-exact-mobile-inner">
                                <div className="pos-exact-mobile-notch" />
                                <div className="pos-mobile-screen">
                                    <div className="pos-mob-header">
                                        <div>
                                            <div className="mob-sub">Mobile Companion</div>
                                            <div className="mob-title">FreshMart #01</div>
                                        </div>
                                        <span className="mob-badge">LIVE</span>
                                    </div>

                                    <div className="pos-mob-balance-card">
                                        <div className="mob-bal-lbl">Today&apos;s Net Sales</div>
                                        <div className="mob-bal-val">₹48,950</div>
                                        <div className="mob-bal-meta">▲ 18.4% vs yesterday</div>
                                    </div>

                                    <div className="pos-mob-receipt">
                                        <div className="rec-head">
                                            <span>WhatsApp E-Receipt</span>
                                            <span className="rec-ok">Sent</span>
                                        </div>
                                        <div className="rec-row"><span>Bill #INV-4092</span><strong>₹2,480</strong></div>
                                        <div className="rec-row muted"><span>Payment Mode</span><span>UPI QR</span></div>
                                        <div className="rec-row muted"><span>GST Breakdown</span><span>₹378.30</span></div>
                                    </div>

                                    <div className="pos-mob-actions">
                                        <div className="mob-act purple">New Bill</div>
                                        <div className="mob-act outline">Khata Due</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pos-exact-mockup-fade" />
                    </div>
                </div>
            </section>

            {/* ── 3. CLIENT LOGO TRUST BAR ────────────────────────────────── */}
            <section className="pos-exact-trust-bar">
                <div className="pos-exact-container">
                    <div className="pos-exact-trust-label">
                        Trusted by 5,000+ growing retail stores &amp; modern brands
                    </div>
                    <div className="pos-exact-trust-logos">
                        {TRUST_BRANDS.map((b) => (
                            <div key={b.name} className="pos-exact-trust-item">
                                {b.icon}
                                <span>{b.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 4. ADVANTAGES SECTION ────────────────────────────────────── */}
            <section className="pos-exact-advantages" id="advantages">
                <div className="pos-exact-container">
                    <div className="pos-exact-section-header">
                        <span className="pos-exact-category-tag">Advantages</span>
                        <h2 className="pos-exact-section-title">The smart choice for your store</h2>
                        <p className="pos-exact-section-desc">
                            Purpose-built cloud software to accelerate checkout, eliminate inventory shrinkage, and elevate customer satisfaction.
                        </p>
                    </div>

                    <div className="pos-exact-advantages-grid">
                        {ADVANTAGE_CARDS.map((card) => (
                            <div key={card.title} className="pos-exact-adv-card">
                                <div className={`pos-exact-icon-box ${card.color}`}>
                                    {card.icon}
                                </div>
                                <h3 className="pos-exact-adv-title">{card.title}</h3>
                                <p className="pos-exact-adv-desc">{card.desc}</p>
                                <a href="#demo" className="pos-exact-adv-link">
                                    Learn More <ArrowRight size={14} />
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 5. KEY FEATURES TO BOOST PRODUCTIVITY ───────────────────── */}
            <section className="pos-exact-boost">
                <div className="pos-exact-container">
                    <div className="pos-exact-section-header">
                        <span className="pos-exact-category-tag">Key Highlights</span>
                        <h2 className="pos-exact-section-title">Key features to boost your productivity</h2>
                        <p className="pos-exact-section-desc">
                            Explore the modern tools that help cashiers ring up bills faster and store owners control margins effortlessly.
                        </p>
                    </div>

                    <div className="pos-exact-boost-grid">
                        {BOOST_CARDS.map((card) => (
                            <div key={card.num} className={`pos-exact-boost-card ${card.tint}`}>
                                <div className="pos-exact-step-pill">{card.num}</div>
                                <h3 className="pos-exact-boost-title">{card.title}</h3>
                                <p className="pos-exact-boost-desc">{card.desc}</p>

                                <div className="pos-exact-boost-ui-stack">
                                    <div className="pos-exact-boost-ui">
                                        <div className="pos-exact-boost-ui-row">
                                            <span className="pos-exact-boost-ui-title">{card.mainTitle}</span>
                                            <span className={`pos-exact-boost-badge ${card.badgeClass}`}>{card.badge}</span>
                                        </div>
                                        <div className="pos-exact-boost-ui-meta" style={{ color: card.metaColor }}>
                                            {card.meta}
                                        </div>
                                        <div className="pos-exact-boost-progress-bar">
                                            <div className={`pos-exact-boost-progress-fill ${card.badgeClass}`} />
                                        </div>
                                    </div>
                                    <div className="pos-exact-boost-mini-chip">
                                        <span>{card.chipLeft}</span>
                                        <strong style={{ color: card.metaColor }}>{card.chipRight}</strong>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 7. TESTIMONIALS SECTION ─────────────────────────────────── */}
            <section className="pos-exact-testimonials" id="testimonials">
                <div className="pos-exact-container">
                    <div className="pos-exact-section-header">
                        <span className="pos-exact-category-tag">Testimonials</span>
                        <h2 className="pos-exact-section-title">Trusted by growing retail owners</h2>
                        <p className="pos-exact-section-desc">
                            See how retail entrepreneurs and multi-branch stores use Namustutam to run faster, smoother operations.
                        </p>
                    </div>

                    <div className="pos-exact-testimonials-grid">
                        {TESTIMONIALS.map((item) => (
                            <div key={item.name} className="pos-exact-test-card">
                                <div className="pos-exact-test-stars">
                                    {[0, 1, 2, 3, 4].map((s) => (
                                        <Star key={s} size={15} fill="#f59e0b" />
                                    ))}
                                </div>
                                <p className="pos-exact-test-text">&ldquo;{item.quote}&rdquo;</p>
                                <div className="pos-exact-test-author-row">
                                    <div className="pos-exact-test-avatar">{item.initials}</div>
                                    <div>
                                        <div className="pos-exact-test-name">{item.name}</div>
                                        <div className="pos-exact-test-role">{item.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 8. STATS BANNER (Exact Match with Image 1) ─────────────── */}
            <StatsBanner stats={statsList} />

            {/* ── 9. PRICING SECTION (Exact Match with Image 3: No Annual Toggle) ──── */}
            <section className="pos-exact-pricing" id="pricing">
                <div className="pos-exact-container">
                    <div className="pos-exact-section-header">
                        <span className="pos-exact-category-tag">Pricing</span>
                        <h2 className="pos-exact-section-title">Flexible plans for every store</h2>
                        <p className="pos-exact-section-desc">
                            Choose the best plan for your retail outlet. Transparent pricing with zero hidden fees and no lock-in.
                        </p>
                    </div>

                    <div className="pos-exact-pricing-grid">
                        {pricingList.map((plan) => (
                            <div key={plan.id} className={`pos-exact-plan-card ${plan.featured ? 'featured' : ''}`}>
                                {plan.badge && <div className="pos-exact-popular-pill">{plan.badge}</div>}
                                <h3 className="pos-exact-plan-name">{plan.name}</h3>
                                <p className="pos-exact-plan-sub">{plan.sub}</p>

                                <div className="pos-exact-plan-price-wrap">
                                    <div className="pos-exact-plan-price-row">
                                        <span className="pos-exact-plan-currency">₹</span>
                                        <span className="pos-exact-plan-amount">{plan.monthly}</span>
                                        <span className="pos-exact-plan-period">/ month</span>
                                    </div>
                                    <div className="pos-exact-plan-billed">
                                        {plan.billedNote || `₹${plan.monthly} billed monthly`}
                                    </div>
                                </div>

                                <ul className="pos-exact-plan-features">
                                    {plan.features.map((feat) => (
                                        <li key={feat}><Check size={16} /> <span>{feat}</span></li>
                                    ))}
                                </ul>

                                {plan.external ? (
                                    <a
                                        href={plan.ctaHref || `${POS_APP_URL}/register`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`pos-exact-plan-btn ${plan.btnClass || (plan.featured ? 'solid' : 'outline')}`}
                                    >
                                        {plan.ctaLabel}
                                    </a>
                                ) : (
                                    <a
                                        href={plan.ctaHref || '#demo'}
                                        className={`pos-exact-plan-btn ${plan.btnClass || (plan.featured ? 'solid' : 'outline')}`}
                                    >
                                        {plan.ctaLabel}
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 10. BOTTOM STREAMLINE CTA BANNER ────────────────────────── */}
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
                            <a
                                href={`${POS_APP_URL}/register`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="pos-exact-btn-pill-primary"
                            >
                                Get Started Now →
                            </a>
                        </div>

                        <div className="pos-exact-fanned-cards-wrap">
                            <div className="pos-exact-fan-card c1">
                                <div style={{ fontSize: '10.5px', color: '#64748b', fontWeight: 700 }}>TODAY&apos;S SALES</div>
                                <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '6px 0' }}>₹48,988</div>
                                <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: 700 }}>+22% vs Yesterday</div>
                            </div>

                            <div className="pos-exact-fan-card c3">
                                <div style={{ fontSize: '10.5px', color: '#64748b', fontWeight: 700 }}>BILLING SPEED</div>
                                <div style={{ fontSize: '20px', fontWeight: 800, color: '#ff5b00', margin: '6px 0' }}>1.4s / bill</div>
                                <div style={{ fontSize: '11px', color: '#64748b' }}>Thermal Print Ready</div>
                            </div>

                            <div className="pos-exact-fan-card c2">
                                <div style={{ fontSize: '10.5px', color: '#64748b', fontWeight: 700 }}>STOCK ALERT</div>
                                <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>Amul Butter 100g</div>
                                <span style={{ fontSize: '10.5px', background: '#fee2e2', color: '#dc2626', padding: '2px 7px', borderRadius: 4, fontWeight: 700 }}>Reorder (3 left)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 11. DEMO REQUEST SECTION (Exact Match with Image 2) ── */}
            <section className="pos-exact-demo-section" id="demo">
                <div className="pos-exact-container">
                    <div className="pos-demo-card-exact">
                        {/* Left column: Information, Checklist, WhatsApp CTA */}
                        <div className="pos-demo-left-panel">
                            <span className="pos-demo-badge">{demoInfo.tag || 'GET IN TOUCH'}</span>
                            <h2 className="pos-demo-headline">{demoInfo.title || 'See Namustutam POS In Action With a Retail Specialist'}</h2>
                            <p className="pos-demo-desc">
                                {demoInfo.description || 'Request a personalized 15-minute walkthrough tailored to your retail category. We\'ll demonstrate live barcode scanning, bill printing, inventory setup, and data migration.'}
                            </p>

                            <div className="pos-demo-checklist">
                                {(demoInfo.bullets || [
                                    'Free 14-day full featured trial account',
                                    'Free product catalog migration from Excel, Tally, or Busy',
                                    'Zero setup fee, zero card details required'
                                ]).map((bullet, bIdx) => (
                                    <div key={bIdx} className="pos-demo-check-item">
                                        <Check size={18} className="pos-demo-check-icon" />
                                        <span>{bullet}</span>
                                    </div>
                                ))}
                            </div>

                            {whatsappHref ? (
                                <a
                                    href={whatsappHref}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="pos-demo-whatsapp-btn"
                                >
                                    <MessageSquare size={17} />
                                    <span>{demoInfo.whatsappCta || 'Quick WhatsApp Chat with POS Expert →'}</span>
                                </a>
                            ) : null}
                        </div>

                        {/* Right column: Form matching Image 2 */}
                        <div className="pos-demo-right-panel">
                            <form className="pos-demo-form" onSubmit={handleDemoSubmit}>
                                <div className="pos-demo-form-grid">
                                    <div className="pos-demo-field">
                                        <label htmlFor="pos-form-name">Your Full Name *</label>
                                        <input
                                            id="pos-form-name"
                                            type="text"
                                            name="name"
                                            placeholder="e.g. Ramesh Patel"
                                            value={demoForm.name}
                                            onChange={handleDemoChange}
                                            required
                                        />
                                    </div>

                                    <div className="pos-demo-field">
                                        <label htmlFor="pos-form-phone">Phone / WhatsApp *</label>
                                        <input
                                            id="pos-form-phone"
                                            type="tel"
                                            name="phone"
                                            placeholder="e.g. 9876543210"
                                            value={demoForm.phone}
                                            onChange={handleDemoChange}
                                            required
                                        />
                                    </div>

                                    <div className="pos-demo-field">
                                        <label htmlFor="pos-form-email">Email Address *</label>
                                        <input
                                            id="pos-form-email"
                                            type="email"
                                            name="email"
                                            placeholder="e.g. store@gmail.com"
                                            value={demoForm.email}
                                            onChange={handleDemoChange}
                                            required
                                        />
                                    </div>

                                    <div className="pos-demo-field">
                                        <label htmlFor="pos-form-store">Store Name</label>
                                        <input
                                            id="pos-form-store"
                                            type="text"
                                            name="storeName"
                                            placeholder="e.g. Shree Supermarket"
                                            value={demoForm.storeName}
                                            onChange={handleDemoChange}
                                        />
                                    </div>

                                    <div className="pos-demo-field">
                                        <label htmlFor="pos-form-biz">Retail Business Type</label>
                                        <select
                                            id="pos-form-biz"
                                            name="businessType"
                                            value={demoForm.businessType}
                                            onChange={handleDemoChange}
                                        >
                                            <option value="Supermarket / Grocery">Supermarket / Grocery</option>
                                            <option value="Clothing / Apparel Boutique">Clothing / Apparel Boutique</option>
                                            <option value="Electronics & Mobile Store">Electronics &amp; Mobile Store</option>
                                            <option value="Cafe / Restaurant / Bakery">Cafe / Restaurant / Bakery</option>
                                            <option value="Pharmacy / Chemist">Pharmacy / Chemist</option>
                                            <option value="Hardware / Sanitary / Wholesale">Hardware / Sanitary / Wholesale</option>
                                            <option value="Other Retail Business">Other Retail Business</option>
                                        </select>
                                    </div>

                                    <div className="pos-demo-field">
                                        <label htmlFor="pos-form-city">City / Location</label>
                                        <input
                                            id="pos-form-city"
                                            type="text"
                                            name="city"
                                            placeholder="e.g. Mumbai, Pune, Delhi"
                                            value={demoForm.city}
                                            onChange={handleDemoChange}
                                        />
                                    </div>
                                </div>

                                <div className="pos-demo-field" style={{ marginTop: '14px' }}>
                                    <label htmlFor="pos-form-req">Specific requirements</label>
                                    <textarea
                                        id="pos-form-req"
                                        name="requirements"
                                        rows={3}
                                        placeholder="Number of billing counters, barcode printer model, etc."
                                        value={demoForm.requirements}
                                        onChange={handleDemoChange}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="pos-demo-submit-btn"
                                    disabled={demoSubmitting}
                                >
                                    {demoSubmitting ? (
                                        <>
                                            <span className="pos-contact-spinner" />
                                            <span>Scheduling Walkthrough...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Schedule Live POS Demo →</span>
                                        </>
                                    )}
                                </button>

                                {demoStatus === 'success' && (
                                    <div className="pos-contact-success-msg" style={{ marginTop: '16px' }}>
                                        <CheckCircle2 size={24} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                                        <div>
                                            <div style={{ fontWeight: 800, fontSize: '15px', marginBottom: '4px' }}>
                                                Demo Request Scheduled{submittedName ? `, ${submittedName}` : ''}!
                                            </div>
                                            <div style={{ fontSize: '13px', color: '#065f46', lineHeight: 1.5 }}>
                                                Your retail walkthrough request has been saved in our database. A POS specialist will contact you on WhatsApp/Phone within 24 hours.
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {demoStatus === 'error' && (
                                    <div className="pos-contact-error-msg" style={{ marginTop: '16px' }}>
                                        <AlertCircle size={24} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                                        <div>
                                            <div style={{ fontWeight: 800, fontSize: '15px', marginBottom: '4px' }}>
                                                Submission Issue
                                            </div>
                                            <div style={{ fontSize: '13px', color: '#991b1b', lineHeight: 1.5 }}>
                                                {demoMsg || 'Failed to submit inquiry. Please check your network or connect directly on WhatsApp.'}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 12. GLOBAL LANDING PAGE FOOTER ─────────────────────────── */}
            <WebsiteFooter />
        </div>
    );
}
