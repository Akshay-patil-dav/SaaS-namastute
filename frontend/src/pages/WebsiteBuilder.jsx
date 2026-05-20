import React, { useState, useRef, useCallback, useEffect } from 'react';
import './WebsiteBuilder.css';
import {
  Monitor, Tablet, Smartphone, Palette, Eye, Save,
  Undo2, Redo2, X, Check, Search, Globe, Layers,
  Type, Image as ImageIcon, Layout, CreditCard, AlignLeft, AlignCenter,
  AlignRight, Mail, Phone, MapPin, Star, Users, MessageSquare,
  ShoppingBag, Navigation, FileText, Quote, Megaphone, Package,
  PlayCircle, Grid3x3, Minus, GripVertical, ChevronDown, ChevronUp,
  Trash2, MousePointerClick, ArrowRight, Sparkles, Rocket, Building2,
  Briefcase, Utensils, HeartPulse, BookOpen, Camera, Music, Leaf,
  Hammer, Car, Shirt, Home, Dumbbell, Plane, PenTool
} from 'lucide-react';

/* ────────────────────────────────────────────────────────────────────────── */
/*  BUSINESS TYPES                                                            */
/* ────────────────────────────────────────────────────────────────────────── */
const BUSINESS_TYPES = [
  { id: 'retail',      emoji: '🛒', name: 'Retail Store',      desc: 'Sell products online' },
  { id: 'restaurant',  emoji: '🍽️', name: 'Restaurant / Café', desc: 'Food & dining business' },
  { id: 'agency',      emoji: '💼', name: 'Agency / Studio',   desc: 'Services & consulting' },
  { id: 'portfolio',   emoji: '🎨', name: 'Portfolio',         desc: 'Showcase your work' },
  { id: 'healthcare',  emoji: '🏥', name: 'Healthcare / Clinic', desc: 'Medical services' },
  { id: 'education',   emoji: '📚', name: 'Education',         desc: 'Courses & learning' },
  { id: 'fitness',     emoji: '💪', name: 'Fitness / Gym',     desc: 'Health & wellness' },
  { id: 'real-estate', emoji: '🏡', name: 'Real Estate',       desc: 'Property listings' },
  { id: 'tech',        emoji: '💻', name: 'Tech / SaaS',       desc: 'Software & apps' },
  { id: 'fashion',     emoji: '👗', name: 'Fashion / Apparel', desc: 'Clothing & style' },
  { id: 'travel',      emoji: '✈️', name: 'Travel / Tourism',  desc: 'Tours & travel' },
  { id: 'other',       emoji: '🌐', name: 'Other',             desc: 'Custom business' },
];

/* ────────────────────────────────────────────────────────────────────────── */
/*  THEMES                                                                    */
/* ────────────────────────────────────────────────────────────────────────── */
const THEMES = [
  {
    id: 'namustutam',
    name: 'Namustutam',
    desc: 'Signature orange & navy',
    vars: {
      '--theme-primary':   '#ff9b29',
      '--theme-secondary': '#1c2b36',
      '--theme-bg':        '#ffffff',
      '--theme-text':      '#1c2b36',
      '--theme-accent':    '#6366f1',
      '--theme-font':      "'Inter', sans-serif",
      '--theme-radius':    '10px',
    },
    navBg: '#1c2b36', navText: '#fff', heroBg: 'linear-gradient(135deg,#ff9b29,#1c2b36)',
    colors: ['#ff9b29', '#1c2b36', '#ffffff'],
  },
  {
    id: 'clean-light',
    name: 'Clean Light',
    desc: 'Minimal blue-white for SaaS',
    vars: {
      '--theme-primary':   '#2563eb',
      '--theme-secondary': '#7c3aed',
      '--theme-bg':        '#ffffff',
      '--theme-text':      '#0f172a',
      '--theme-accent':    '#06b6d4',
      '--theme-font':      "'Inter', sans-serif",
      '--theme-radius':    '8px',
    },
    navBg: '#fff', navText: '#0f172a', heroBg: 'linear-gradient(135deg,#2563eb,#7c3aed)',
    colors: ['#2563eb', '#7c3aed', '#06b6d4'],
  },
  {
    id: 'bold-commerce',
    name: 'Bold Commerce',
    desc: 'Vibrant orange for retail',
    vars: {
      '--theme-primary':   '#f97316',
      '--theme-secondary': '#ef4444',
      '--theme-bg':        '#fafaf9',
      '--theme-text':      '#1c1917',
      '--theme-accent':    '#eab308',
      '--theme-font':      "'Outfit', sans-serif",
      '--theme-radius':    '10px',
    },
    navBg: '#1c1917', navText: '#fff', heroBg: 'linear-gradient(135deg,#f97316,#ef4444)',
    colors: ['#f97316', '#ef4444', '#eab308'],
  },
  {
    id: 'agency-pro',
    name: 'Agency Pro',
    desc: 'Bold pink-purple for agencies',
    vars: {
      '--theme-primary':   '#ec4899',
      '--theme-secondary': '#8b5cf6',
      '--theme-bg':        '#fdf4ff',
      '--theme-text':      '#1e1b4b',
      '--theme-accent':    '#22d3ee',
      '--theme-font':      "'Outfit', sans-serif",
      '--theme-radius':    '14px',
    },
    navBg: '#1e1b4b', navText: '#fff', heroBg: 'linear-gradient(135deg,#ec4899,#8b5cf6)',
    colors: ['#ec4899', '#8b5cf6', '#22d3ee'],
  },
  {
    id: 'shopify-minimal',
    name: 'Shopify Minimal',
    desc: 'Clean product-first look',
    vars: {
      '--theme-primary':   '#096dd9',
      '--theme-secondary': '#0284c7',
      '--theme-bg':        '#ffffff',
      '--theme-text':      '#111827',
      '--theme-accent':    '#16a34a',
      '--theme-font':      "'Inter', sans-serif",
      '--theme-radius':    '6px',
    },
    navBg: '#fff', navText: '#111827', heroBg: 'linear-gradient(135deg,#096dd9,#0284c7)',
    colors: ['#096dd9', '#16a34a', '#f3f4f6'],
  },
  {
    id: 'portfolio-zen',
    name: 'Portfolio Zen',
    desc: 'Earthy for creatives',
    vars: {
      '--theme-primary':   '#059669',
      '--theme-secondary': '#0891b2',
      '--theme-bg':        '#f8f7f4',
      '--theme-text':      '#1a1a1a',
      '--theme-accent':    '#d97706',
      '--theme-font':      "Georgia, serif",
      '--theme-radius':    '4px',
    },
    navBg: '#1a1a1a', navText: '#fff', heroBg: 'linear-gradient(135deg,#059669,#0891b2)',
    colors: ['#059669', '#0891b2', '#d97706'],
  },
];

/* ────────────────────────────────────────────────────────────────────────── */
/*  COMPONENT LIBRARY                                                         */
/* ────────────────────────────────────────────────────────────────────────── */
const COMPONENT_LIBRARY = [
  {
    category: 'Layout',
    items: [
      { type: 'NAVBAR',       label: 'Navbar',        icon: Navigation },
      { type: 'HERO',         label: 'Hero',          icon: Layers },
      { type: 'FEATURES',     label: 'Features',      icon: Grid3x3 },
      { type: 'CTA',          label: 'CTA Banner',    icon: Megaphone },
      { type: 'FOOTER',       label: 'Footer',        icon: Layout },
    ],
  },
  {
    category: 'Content',
    items: [
      { type: 'HEADING',      label: 'Heading',       icon: Type },
      { type: 'TEXT',         label: 'Paragraph',     icon: FileText },
      { type: 'IMAGE',        label: 'Image',         icon: ImageIcon },
      { type: 'VIDEO',        label: 'Video',         icon: PlayCircle },
      { type: 'QUOTE',        label: 'Quote',         icon: Quote },
      { type: 'DIVIDER',      label: 'Divider',       icon: Minus },
    ],
  },
  {
    category: 'Commerce',
    items: [
      { type: 'PRODUCTS',     label: 'Products',      icon: ShoppingBag },
      { type: 'PRICING',      label: 'Pricing',       icon: CreditCard },
      { type: 'BANNER',       label: 'Promo Banner',  icon: Star },
    ],
  },
  {
    category: 'Social',
    items: [
      { type: 'TESTIMONIALS', label: 'Testimonials',  icon: MessageSquare },
      { type: 'TEAM',         label: 'Team',          icon: Users },
      { type: 'CONTACT',      label: 'Contact',       icon: Mail },
    ],
  },
];

/* ────────────────────────────────────────────────────────────────────────── */
/*  DEFAULT BLOCK PROPS                                                       */
/* ────────────────────────────────────────────────────────────────────────── */
const DEFAULT_PROPS = {
  NAVBAR:       { logo: 'MyBrand', links: ['Home', 'About', 'Products', 'Blog'], btnText: 'Get Started' },
  HERO:         { tag: '🚀 Now Available', h1: 'Build Your Business Online Today', p: 'A beautiful, fast website for your business in minutes. No coding required.', primaryBtn: 'Get Started Free', secondaryBtn: 'Watch Demo' },
  FEATURES:     { title: 'Why Choose Us', subtitle: 'Everything your business needs to succeed online', features: [{ icon: '⚡', title: 'Lightning Fast', desc: 'Optimized for peak performance' }, { icon: '🎨', title: 'Fully Customizable', desc: 'Match your brand perfectly' }, { icon: '📱', title: 'Mobile Ready', desc: 'Looks great on every device' }] },
  PRODUCTS:     { title: 'Featured Products', products: [{ emoji: '👟', name: 'Premium Sneakers', price: '₹2,499' }, { emoji: '👜', name: 'Leather Bag', price: '₹3,999' }, { emoji: '⌚', name: 'Smart Watch', price: '₹8,499' }, { emoji: '🎧', name: 'Wireless Earbuds', price: '₹4,299' }] },
  TESTIMONIALS: { title: 'What Our Customers Say', items: [{ text: '"This platform transformed our entire online presence. Sales went up 3x in one month!"', name: 'Priya S.', role: 'Store Owner' }, { text: '"The easiest builder I have used. Stunning results with zero effort."', name: 'Rahul M.', role: 'Freelancer' }, { text: '"Professional, fast, and reliable. Exactly what our team needed."', name: 'Ananya K.', role: 'Marketing Lead' }] },
  CTA:          { h2: 'Ready to Grow Your Business?', p: 'Join 50,000+ businesses who trust us to power their online presence.', btnText: 'Start Free Trial →' },
  FOOTER:       { brand: 'MyBrand', links: ['Privacy Policy', 'Terms of Service', 'Contact Us'], copy: '© 2026 MyBrand. All rights reserved.' },
  HEADING:      { text: 'Your Amazing Headline', level: 'h2', align: 'left' },
  TEXT:         { text: 'Add your paragraph text here. Describe your product, service, or brand story. Keep it engaging and clear for your visitors.' },
  IMAGE:        { src: null, alt: 'Image', caption: '' },
  VIDEO:        { url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', caption: 'Watch our intro video' },
  QUOTE:        { text: '"Great businesses are built on great relationships."', author: 'Business Leader' },
  DIVIDER:      {},
  PRICING:      { title: 'Simple, Transparent Pricing', plans: [{ name: 'Starter', price: '₹999', period: '/mo', features: ['5 Pages', '10GB Storage', 'Free Domain', 'SSL'], cta: 'Get Started', featured: false }, { name: 'Pro', price: '₹2,499', period: '/mo', features: ['Unlimited Pages', '100GB Storage', 'Free Domain', 'SSL', 'Priority Support'], cta: 'Go Pro', featured: true }, { name: 'Enterprise', price: '₹7,999', period: '/mo', features: ['Unlimited Everything', 'Dedicated Server', 'Analytics', 'SLA'], cta: 'Contact Sales', featured: false }] },
  BANNER:       { text: '🎉 Limited Time: 40% Off All Plans! Code: LAUNCH40', btnText: 'Claim Offer', bg: '#ff9b29' },
  TEAM:         { title: 'Meet Our Team', members: [{ name: 'Akash M.', role: 'CEO & Founder', emoji: '👨‍💼' }, { name: 'Priya S.', role: 'Lead Designer', emoji: '👩‍🎨' }, { name: 'Rahul K.', role: 'Head of Tech', emoji: '👨‍💻' }] },
  CONTACT:      { title: 'Get In Touch', address: '123 Business Park, Mumbai, MH 400001', phone: '+91 98765 43210', email: 'hello@mybrand.com' },
};

/* Business-type-specific starter blocks */
const STARTER_LAYOUTS = {
  retail:      ['NAVBAR', 'HERO', 'PRODUCTS', 'FEATURES', 'CTA', 'FOOTER'],
  restaurant:  ['NAVBAR', 'HERO', 'FEATURES', 'TESTIMONIALS', 'CONTACT', 'FOOTER'],
  agency:      ['NAVBAR', 'HERO', 'FEATURES', 'TEAM', 'TESTIMONIALS', 'CTA', 'FOOTER'],
  portfolio:   ['NAVBAR', 'HERO', 'FEATURES', 'IMAGE', 'QUOTE', 'CONTACT', 'FOOTER'],
  healthcare:  ['NAVBAR', 'HERO', 'FEATURES', 'TEAM', 'CONTACT', 'FOOTER'],
  education:   ['NAVBAR', 'HERO', 'FEATURES', 'PRICING', 'TESTIMONIALS', 'CTA', 'FOOTER'],
  fitness:     ['NAVBAR', 'HERO', 'FEATURES', 'PRICING', 'TESTIMONIALS', 'CTA', 'FOOTER'],
  'real-estate':['NAVBAR','HERO', 'FEATURES', 'PRODUCTS', 'CONTACT', 'FOOTER'],
  tech:        ['NAVBAR', 'HERO', 'FEATURES', 'PRICING', 'TESTIMONIALS', 'CTA', 'FOOTER'],
  fashion:     ['NAVBAR', 'HERO', 'PRODUCTS', 'BANNER', 'TESTIMONIALS', 'FOOTER'],
  travel:      ['NAVBAR', 'HERO', 'FEATURES', 'PRODUCTS', 'TESTIMONIALS', 'CONTACT', 'FOOTER'],
  other:       ['NAVBAR', 'HERO', 'FEATURES', 'CTA', 'FOOTER'],
};

/* ────────────────────────────────────────────────────────────────────────── */
/*  BLOCK RENDERER                                                            */
/* ────────────────────────────────────────────────────────────────────────── */
function renderBlock(block) {
  const p = block.props;
  switch (block.type) {

    case 'NAVBAR':
      return (
        <div className="wb-block-navbar">
          <div className="wb-block-navbar-logo">{p.logo}</div>
          <ul className="wb-block-navbar-links">
            {p.links.map((l, i) => <li key={i}><a href="#">{l}</a></li>)}
          </ul>
          <button className="wb-block-navbar-btn">{p.btnText}</button>
        </div>
      );

    case 'HERO':
      return (
        <div className="wb-block-hero">
          <div className="wb-block-hero-tag">{p.tag}</div>
          <h1>{p.h1}</h1>
          <p>{p.p}</p>
          <div className="wb-block-hero-cta">
            <button className="wb-block-hero-btn-p">{p.primaryBtn}</button>
            <button className="wb-block-hero-btn-s">{p.secondaryBtn}</button>
          </div>
        </div>
      );

    case 'FEATURES':
      return (
        <div className="wb-block-features">
          <div className="wb-block-features-title">{p.title}</div>
          <div className="wb-block-features-subtitle">{p.subtitle}</div>
          <div className="wb-block-features-grid">
            {p.features.map((f, i) => (
              <div className="wb-block-feature-card" key={i}>
                <div className="wb-block-feature-icon">{f.icon}</div>
                <div className="wb-block-feature-title">{f.title}</div>
                <div className="wb-block-feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'PRODUCTS':
      return (
        <div className="wb-block-products">
          <div className="wb-block-products-title">{p.title}</div>
          <div className="wb-block-products-grid">
            {p.products.map((pr, i) => (
              <div className="wb-block-product-card" key={i}>
                <div className="wb-block-product-img">{pr.emoji}</div>
                <div className="wb-block-product-info">
                  <div className="wb-block-product-name">{pr.name}</div>
                  <div className="wb-block-product-price">{pr.price}</div>
                  <button className="wb-block-product-btn">Add to Cart</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'TESTIMONIALS':
      return (
        <div className="wb-block-testimonials">
          <div className="wb-block-testimonials-title">{p.title}</div>
          <div className="wb-block-testimonials-grid">
            {p.items.map((t, i) => (
              <div className="wb-block-testimonial-card" key={i}>
                <div className="wb-block-testimonial-text">{t.text}</div>
                <div className="wb-block-testimonial-author">
                  <div className="wb-block-testimonial-avatar">{t.name[0]}</div>
                  <div>
                    <div className="wb-block-testimonial-name">{t.name}</div>
                    <div className="wb-block-testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'CTA':
      return (
        <div className="wb-block-cta">
          <h2>{p.h2}</h2>
          <p>{p.p}</p>
          <button className="wb-block-cta-btn">{p.btnText}</button>
        </div>
      );

    case 'FOOTER':
      return (
        <div className="wb-block-footer">
          <div className="wb-block-footer-brand">{p.brand}</div>
          <div className="wb-block-footer-links">
            {p.links.map((l, i) => <a key={i} href="#">{l}</a>)}
          </div>
          <div className="wb-block-footer-copy">{p.copy}</div>
        </div>
      );

    case 'HEADING': {
      const Tag = p.level || 'h2';
      return (
        <div className="wb-block-heading" style={{ textAlign: p.align || 'left' }}>
          <Tag contentEditable suppressContentEditableWarning style={{ outline: 'none' }}>
            {p.text}
          </Tag>
        </div>
      );
    }

    case 'TEXT':
      return (
        <div className="wb-block-text">
          <p contentEditable suppressContentEditableWarning style={{ outline: 'none' }}>
            {p.text}
          </p>
        </div>
      );

    case 'IMAGE':
      return (
        <div className="wb-block-image">
          <div className="wb-block-image-placeholder">
            <ImageIcon size={34} style={{ opacity: 0.35 }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: 'inherit' }}>Click to upload image</span>
            <span style={{ fontSize: 11, opacity: 0.6 }}>PNG, JPG, WebP supported</span>
          </div>
        </div>
      );

    case 'VIDEO':
      return (
        <div className="wb-block-video">
          <div className="wb-block-video-wrap">
            <iframe src={p.url} allow="autoplay; clipboard-write; encrypted-media" allowFullScreen />
          </div>
          {p.caption && <p style={{ textAlign: 'center', fontSize: 12, color: '#888', marginTop: 8 }}>{p.caption}</p>}
        </div>
      );

    case 'QUOTE':
      return (
        <div className="wb-block-quote">
          <blockquote>
            <p>{p.text}</p>
            <cite>— {p.author}</cite>
          </blockquote>
        </div>
      );

    case 'DIVIDER':
      return (
        <div className="wb-block-divider"><hr /></div>
      );

    case 'PRICING':
      return (
        <div className="wb-block-pricing">
          <div className="wb-block-pricing-title">{p.title}</div>
          <div className="wb-pricing-grid">
            {p.plans.map((plan, i) => (
              <div key={i} className={`wb-pricing-card ${plan.featured ? 'featured' : ''}`}>
                <div className="wb-pricing-plan-name" style={{ color: plan.featured ? 'rgba(255,255,255,0.75)' : undefined }}>{plan.name}</div>
                <div className="wb-pricing-price" style={{ color: plan.featured ? '#fff' : 'var(--theme-text)' }}>
                  {plan.price}<span className="wb-pricing-period">{plan.period}</span>
                </div>
                <ul className="wb-pricing-features">
                  {plan.features.map((f, j) => (
                    <li key={j} style={{ color: plan.featured ? 'rgba(255,255,255,0.9)' : undefined }}>
                      ✓ {f}
                    </li>
                  ))}
                </ul>
                <button className="wb-pricing-btn">{plan.cta}</button>
              </div>
            ))}
          </div>
        </div>
      );

    case 'BANNER':
      return (
        <div className="wb-block-banner" style={{ background: p.bg || 'var(--theme-primary)' }}>
          <span>{p.text}</span>
          <button style={{ color: p.bg || 'var(--theme-primary)' }}>{p.btnText}</button>
        </div>
      );

    case 'TEAM':
      return (
        <div className="wb-block-team">
          <h2>{p.title}</h2>
          <div className="wb-team-grid">
            {p.members.map((m, i) => (
              <div className="wb-team-member" key={i}>
                <div className="wb-team-avatar">{m.emoji}</div>
                <div className="wb-team-name">{m.name}</div>
                <div className="wb-team-role">{m.role}</div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'CONTACT':
      return (
        <div className="wb-block-contact">
          <h2>{p.title}</h2>
          <div className="wb-contact-grid">
            <div className="wb-contact-form">
              <input className="wb-contact-input" placeholder="Your full name" />
              <input className="wb-contact-input" placeholder="Your email address" />
              <textarea className="wb-contact-textarea" placeholder="Your message..." />
              <button className="wb-contact-submit">Send Message →</button>
            </div>
            <div className="wb-contact-info">
              {[
                { icon: <MapPin size={16} />, label: 'Address', val: p.address },
                { icon: <Phone size={16} />,  label: 'Phone',   val: p.phone },
                { icon: <Mail size={16} />,   label: 'Email',   val: p.email },
              ].map((item, i) => (
                <div className="wb-contact-info-item" key={i}>
                  <div className="wb-contact-info-icon">{item.icon}</div>
                  <div className="wb-contact-info-text">
                    <h4>{item.label}</h4>
                    <p>{item.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    default:
      return <div style={{ padding: 20, background: '#f4f7f6', textAlign: 'center', fontSize: 12, color: '#888' }}>Unknown block: {block.type}</div>;
  }
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  PROPERTIES PANEL                                                          */
/* ────────────────────────────────────────────────────────────────────────── */
function PropertiesPanel({ block, onUpdate }) {
  if (!block) {
    return (
      <div className="wb-right-panel">
        <div className="wb-panel-header">
          <div className="wb-panel-title">Properties</div>
          <div className="wb-panel-subtitle">Select a block to edit</div>
        </div>
        <div className="wb-props-empty">
          <MousePointerClick size={30} />
          <p>Click any block on the canvas to edit its content and properties here.</p>
        </div>
      </div>
    );
  }

  const p = block.props;
  const update = (key, val) => onUpdate({ ...p, [key]: val });

  const textarea = (label, key, rows = 3) => (
    <div className="wb-prop-row col" key={key}>
      <label className="wb-prop-label">{label}</label>
      <textarea
        className="wb-prop-input"
        style={{ height: rows * 22 + 12, resize: 'none' }}
        value={p[key] || ''}
        onChange={e => update(key, e.target.value)}
      />
    </div>
  );
  const field = (label, key) => (
    <div className="wb-prop-row" key={key}>
      <label className="wb-prop-label">{label}</label>
      <input className="wb-prop-input" value={p[key] || ''} onChange={e => update(key, e.target.value)} />
    </div>
  );

  const renderProps = () => {
    switch (block.type) {
      case 'NAVBAR':
        return (
          <>
            <div className="wb-prop-section">
              <div className="wb-prop-section-title">Branding</div>
              {field('Logo Text', 'logo')}
              {field('Button Label', 'btnText')}
            </div>
            <div className="wb-prop-section">
              <div className="wb-prop-section-title">Navigation Links</div>
              {(p.links || []).map((l, i) => (
                <div className="wb-prop-row" key={i}>
                  <label className="wb-prop-label">Link {i + 1}</label>
                  <input className="wb-prop-input" value={l} onChange={e => {
                    const arr = [...p.links]; arr[i] = e.target.value; update('links', arr);
                  }} />
                </div>
              ))}
            </div>
          </>
        );

      case 'HERO':
        return (
          <div className="wb-prop-section">
            <div className="wb-prop-section-title">Hero Content</div>
            {field('Tag Line', 'tag')}
            {textarea('Headline', 'h1', 2)}
            {textarea('Sub-text', 'p', 3)}
            {field('Primary Button', 'primaryBtn')}
            {field('Secondary Button', 'secondaryBtn')}
          </div>
        );

      case 'HEADING':
        return (
          <div className="wb-prop-section">
            <div className="wb-prop-section-title">Heading</div>
            {textarea('Text', 'text', 2)}
            <div className="wb-prop-row">
              <label className="wb-prop-label">Level</label>
              <select className="wb-prop-select" value={p.level || 'h2'} onChange={e => update('level', e.target.value)}>
                <option value="h1">H1 — Large</option>
                <option value="h2">H2 — Medium</option>
                <option value="h3">H3 — Small</option>
              </select>
            </div>
            <div className="wb-prop-row">
              <label className="wb-prop-label">Align</label>
              <div className="wb-align-group">
                {['left','center','right'].map(a => (
                  <button key={a} className={`wb-align-btn ${p.align === a ? 'active' : ''}`} onClick={() => update('align', a)}>
                    {a === 'left' ? <AlignLeft size={13}/> : a === 'center' ? <AlignCenter size={13}/> : <AlignRight size={13}/>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'TEXT':
        return (
          <div className="wb-prop-section">
            <div className="wb-prop-section-title">Paragraph</div>
            {textarea('Content', 'text', 5)}
          </div>
        );

      case 'CTA':
        return (
          <div className="wb-prop-section">
            <div className="wb-prop-section-title">Call to Action</div>
            {textarea('Headline', 'h2', 2)}
            {textarea('Sub-text', 'p', 2)}
            {field('Button Text', 'btnText')}
          </div>
        );

      case 'FOOTER':
        return (
          <div className="wb-prop-section">
            <div className="wb-prop-section-title">Footer</div>
            {field('Brand Name', 'brand')}
            {field('Copyright Text', 'copy')}
            <div className="wb-prop-section-title" style={{ marginTop: 10 }}>Links</div>
            {(p.links || []).map((l, i) => (
              <div className="wb-prop-row" key={i}>
                <label className="wb-prop-label">Link {i + 1}</label>
                <input className="wb-prop-input" value={l} onChange={e => {
                  const arr = [...p.links]; arr[i] = e.target.value; update('links', arr);
                }} />
              </div>
            ))}
          </div>
        );

      case 'CONTACT':
        return (
          <div className="wb-prop-section">
            <div className="wb-prop-section-title">Contact Info</div>
            {field('Section Title', 'title')}
            {field('Email', 'email')}
            {field('Phone', 'phone')}
            {field('Address', 'address')}
          </div>
        );

      case 'BANNER':
        return (
          <div className="wb-prop-section">
            <div className="wb-prop-section-title">Promo Banner</div>
            {textarea('Banner Text', 'text', 2)}
            {field('Button Text', 'btnText')}
            <div className="wb-prop-row">
              <label className="wb-prop-label">Background</label>
              <div className="wb-color-row">
                <div className="wb-color-swatch" style={{ background: p.bg || '#ff9b29' }}>
                  <input type="color" value={p.bg || '#ff9b29'} onChange={e => update('bg', e.target.value)} />
                </div>
                <input className="wb-color-hex" value={p.bg || '#ff9b29'} onChange={e => update('bg', e.target.value)} />
              </div>
            </div>
          </div>
        );

      case 'VIDEO':
        return (
          <div className="wb-prop-section">
            <div className="wb-prop-section-title">Video</div>
            {textarea('Embed URL', 'url', 2)}
            {field('Caption', 'caption')}
          </div>
        );

      case 'QUOTE':
        return (
          <div className="wb-prop-section">
            <div className="wb-prop-section-title">Quote</div>
            {textarea('Quote Text', 'text', 3)}
            {field('Author', 'author')}
          </div>
        );

      default:
        return (
          <div className="wb-prop-section">
            <div className="wb-prop-section-title">{block.type}</div>
            <p style={{ fontSize: 12, color: '#888', lineHeight: 1.5 }}>Click on text directly in the canvas to edit this block.</p>
          </div>
        );
    }
  };

  return (
    <div className="wb-right-panel">
      <div className="wb-panel-header">
        <div className="wb-panel-title">Properties</div>
        <div className="wb-panel-subtitle" style={{ color: '#ff9b29', fontWeight: 700 }}>
          ✏ {block.type.replace(/_/g, ' ')}
        </div>
      </div>
      <div className="wb-props-scroll">
        {renderProps()}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  THEME MINI-PREVIEW CARD                                                   */
/* ────────────────────────────────────────────────────────────────────────── */
function ThemeCard({ theme, selected, onSelect }) {
  const v = theme.vars;
  return (
    <div className={`wb-theme-card ${selected ? 'selected' : ''}`} onClick={onSelect}>
      <div className="wb-theme-preview" style={{ background: v['--theme-bg'] }}>
        <div className="wb-theme-nav-strip" style={{ background: theme.navBg }}>
          <span className="wb-theme-logo-text" style={{ color: theme.navText }}>{theme.name}</span>
          <div className="wb-theme-nav-btn" style={{ background: v['--theme-primary'], opacity: 0.8 }} />
        </div>
        <div className="wb-theme-hero-strip" style={{ background: theme.heroBg }}>
          <div className="wb-theme-h-bar" style={{ background: 'rgba(255,255,255,0.9)' }} />
          <div className="wb-theme-p-bar" style={{ background: 'rgba(255,255,255,0.6)' }} />
          <div className="wb-theme-btn-bar" style={{ background: '#fff' }} />
        </div>
      </div>
      {selected && <div className="wb-theme-check"><Check size={12} /></div>}
      <div className="wb-theme-info">
        <div className="wb-theme-name">{theme.name}</div>
        <div className="wb-theme-desc-text">{theme.desc}</div>
        <div className="wb-theme-dots">
          {theme.colors.map((c, i) => <div key={i} className="wb-theme-dot" style={{ background: c }} />)}
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  BUSINESS SETUP WIZARD  (3 steps)                                          */
/* ────────────────────────────────────────────────────────────────────────── */
function SetupWizard({ onComplete }) {
  const [step, setStep] = useState(1); // 1: business type, 2: theme, 3: site info
  const [bizType, setBizType]       = useState(null);
  const [theme, setTheme]           = useState(THEMES[0]);
  const [siteName, setSiteName]     = useState('');
  const [tagline, setTagline]       = useState('');
  const [email, setEmail]           = useState('');
  const [phone, setPhone]           = useState('');

  const canNext = step === 1 ? !!bizType : step === 2 ? true : siteName.trim().length > 0;

  const handleFinish = () => {
    onComplete({ bizType, theme, siteName: siteName || 'My Website', tagline, email, phone });
  };

  const stepLabels = ['Business Type', 'Choose Theme', 'Site Details'];

  return (
    <div className="wb-setup-overlay">
      <div className="wb-setup-modal">
        {/* Header */}
        <div className="wb-setup-header">
          <div className="wb-setup-header-left">
            <div className="wb-setup-badge"><Rocket size={12} /> Website Builder Setup</div>
            <div className="wb-setup-title">
              {step === 1 && 'What type of business is this for?'}
              {step === 2 && 'Pick a Theme for Your Website'}
              {step === 3 && 'Tell us about your website'}
            </div>
            <div className="wb-setup-subtitle">
              {step === 1 && 'We will pre-load the right blocks and layout for your business.'}
              {step === 2 && 'Choose a visual theme. You can always change it later.'}
              {step === 3 && 'Fill in your basic details to personalize the starter content.'}
            </div>
          </div>
          <div className="wb-setup-steps">
            {stepLabels.map((_, i) => (
              <div
                key={i}
                className={`wb-setup-step-dot ${step === i + 1 ? 'active' : step > i + 1 ? 'done' : ''}`}
                title={stepLabels[i]}
              />
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="wb-setup-body">
          {/* Step 1: Business Type */}
          {step === 1 && (
            <>
              <div className="wb-setup-step-title">Select your business category</div>
              <div className="wb-setup-step-hint">This is a one-time setup — it helps us generate the perfect starting layout for you.</div>
              <div className="wb-biz-grid">
                {BUSINESS_TYPES.map(biz => (
                  <div
                    key={biz.id}
                    className={`wb-biz-card ${bizType?.id === biz.id ? 'selected' : ''}`}
                    onClick={() => setBizType(biz)}
                  >
                    <div className="wb-biz-emoji">{biz.emoji}</div>
                    <div className="wb-biz-name">{biz.name}</div>
                    <div className="wb-biz-desc">{biz.desc}</div>
                    {bizType?.id === biz.id && (
                      <div className="wb-biz-check"><Check size={12} /></div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Step 2: Theme */}
          {step === 2 && (
            <>
              <div className="wb-setup-step-title">Choose your website theme</div>
              <div className="wb-setup-step-hint">Your theme controls colors, fonts, and border style. You can customize it anytime.</div>
              <div className="wb-theme-grid">
                {THEMES.map(t => (
                  <ThemeCard
                    key={t.id}
                    theme={t}
                    selected={theme.id === t.id}
                    onSelect={() => setTheme(t)}
                  />
                ))}
              </div>
            </>
          )}

          {/* Step 3: Site Info */}
          {step === 3 && (
            <>
              <div className="wb-setup-step-title">Enter your website details</div>
              <div className="wb-setup-step-hint">This information will be used to pre-fill blocks on your website. You can edit everything later.</div>
              <div className="wb-setup-form">
                <div className="wb-form-row-2col">
                  <div className="wb-form-row">
                    <label className="wb-form-label">Business / Website Name <span style={{ color: '#ef4444' }}>*</span></label>
                    <input
                      className="wb-form-input"
                      placeholder={`e.g. ${bizType?.name || 'My Business'}`}
                      value={siteName}
                      onChange={e => setSiteName(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <div className="wb-form-row">
                    <label className="wb-form-label">Tagline / Slogan</label>
                    <input
                      className="wb-form-input"
                      placeholder="e.g. Quality you can trust"
                      value={tagline}
                      onChange={e => setTagline(e.target.value)}
                    />
                  </div>
                </div>
                <div className="wb-form-row-2col">
                  <div className="wb-form-row">
                    <label className="wb-form-label">Contact Email</label>
                    <input
                      className="wb-form-input"
                      type="email"
                      placeholder="hello@mybusiness.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="wb-form-row">
                    <label className="wb-form-label">Phone Number</label>
                    <input
                      className="wb-form-input"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                    />
                  </div>
                </div>
                <div style={{ padding: '14px 16px', background: '#fff8f0', border: '1px solid rgba(255,155,41,0.25)', borderRadius: 10, fontSize: 12, color: '#92400e', lineHeight: 1.55 }}>
                  <strong>✅ You're almost ready!</strong> After clicking "Build My Website", we'll generate a complete website layout for your <strong>{bizType?.name}</strong> business using the <strong>{theme.name}</strong> theme. You can then drag, drop and customize every section.
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="wb-setup-footer">
          <div className="wb-setup-footer-info">
            Step {step} of {stepLabels.length} — {stepLabels[step - 1]}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {step > 1 && (
              <button className="wb-icon-btn" onClick={() => setStep(s => s - 1)}>
                ← Back
              </button>
            )}
            {step < 3 ? (
              <button
                className="wb-btn-orange"
                onClick={() => setStep(s => s + 1)}
                disabled={!canNext}
                style={{ opacity: canNext ? 1 : 0.5 }}
              >
                Continue <ArrowRight size={14} />
              </button>
            ) : (
              <button
                className="wb-btn-orange"
                onClick={handleFinish}
                disabled={!canNext}
                style={{ opacity: canNext ? 1 : 0.5 }}
              >
                <Sparkles size={14} /> Build My Website
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  CHANGE THEME MODAL                                                        */
/* ────────────────────────────────────────────────────────────────────────── */
function ThemeModal({ currentTheme, onApply, onClose }) {
  const [temp, setTemp] = useState(currentTheme);
  return (
    <div className="wb-modal-overlay" onClick={onClose}>
      <div className="wb-modal" onClick={e => e.stopPropagation()}>
        <div className="wb-modal-header">
          <div>
            <div className="wb-modal-title">Change Website Theme</div>
            <div className="wb-modal-sub">Applying a new theme updates colors, fonts, and border styles site-wide.</div>
          </div>
          <button className="wb-modal-close" onClick={onClose}><X size={15} /></button>
        </div>
        <div className="wb-modal-body">
          <div className="wb-theme-grid">
            {THEMES.map(t => (
              <ThemeCard key={t.id} theme={t} selected={temp.id === t.id} onSelect={() => setTemp(t)} />
            ))}
          </div>
        </div>
        <div className="wb-modal-footer">
          <button className="wb-icon-btn" onClick={onClose}>Cancel</button>
          <button className="wb-btn-orange" onClick={() => onApply(temp)}>
            <Check size={14} /> Apply: {temp.name}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  MAIN WEBSITE BUILDER                                                      */
/* ────────────────────────────────────────────────────────────────────────── */
export default function WebsiteBuilder() {
  const LS_SETUP  = 'wb_setup_done';
  const LS_BLOCKS = 'wb_blocks';
  const LS_THEME  = 'wb_theme';
  const LS_NAME   = 'wb_page_name';

  /* ── Wizard state ─────────────────────────────────────────────────────── */
  const [showSetup, setShowSetup]   = useState(false);
  const [bizType, setBizType]       = useState(null);

  /* ── Builder state ────────────────────────────────────────────────────── */
  const [blocks, setBlocks]         = useState([]);
  const [theme, setTheme]           = useState(THEMES[0]);
  const [selectedId, setSelectedId] = useState(null);
  const [device, setDevice]         = useState('desktop');
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [pageName, setPageName]     = useState('My Website');
  const [saveStatus, setSaveStatus] = useState('');
  const [history, setHistory]       = useState([]);
  const [histIdx, setHistIdx]       = useState(-1);
  const [search, setSearch]         = useState('');
  const [dragOverIdx, setDragOverIdx] = useState(null);
  const [draggingId, setDraggingId] = useState(null);

  const canvasRef = useRef(null);

  /* ── Boot: check localStorage ─────────────────────────────────────────── */
  useEffect(() => {
    const done = localStorage.getItem(LS_SETUP);
    if (!done) {
      setShowSetup(true);
      return;
    }
    // Restore saved state
    try {
      const saved = localStorage.getItem(LS_BLOCKS);
      if (saved) setBlocks(JSON.parse(saved));
      const savedTheme = localStorage.getItem(LS_THEME);
      if (savedTheme) setTheme(JSON.parse(savedTheme));
      const savedName = localStorage.getItem(LS_NAME);
      if (savedName) setPageName(savedName);
    } catch (_) {}
  }, []);

  /* ── Apply theme CSS vars to canvas frame ─────────────────────────────── */
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    Object.entries(theme.vars).forEach(([k, v]) => el.style.setProperty(k, v));
  }, [theme, blocks]);

  const selectedBlock = blocks.find(b => b.id === selectedId);

  /* ── Wizard complete ──────────────────────────────────────────────────── */
  const handleSetupComplete = useCallback(({ bizType: biz, theme: t, siteName, tagline, email, phone }) => {
    const types = STARTER_LAYOUTS[biz.id] || STARTER_LAYOUTS.other;
    const newBlocks = types.map(type => {
      const props = JSON.parse(JSON.stringify(DEFAULT_PROPS[type] || {}));
      // Personalize with user details
      if (type === 'NAVBAR') { props.logo = siteName; }
      if (type === 'HERO') {
        props.h1 = tagline ? `${siteName} — ${tagline}` : `Welcome to ${siteName}`;
      }
      if (type === 'FOOTER') { props.brand = siteName; props.copy = `© 2026 ${siteName}. All rights reserved.`; }
      if (type === 'CONTACT' && email) { props.email = email; if (phone) props.phone = phone; }
      return { id: `b${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, type, props };
    });

    setBizType(biz);
    setTheme(t);
    setBlocks(newBlocks);
    setPageName(siteName || 'My Website');
    setShowSetup(false);
    localStorage.setItem(LS_SETUP, '1');
    localStorage.setItem(LS_BLOCKS, JSON.stringify(newBlocks));
    localStorage.setItem(LS_THEME, JSON.stringify(t));
    localStorage.setItem(LS_NAME, siteName || 'My Website');
  }, []);

  /* ── History ──────────────────────────────────────────────────────────── */
  const pushHistory = (nb) => {
    setHistory(prev => [...prev.slice(0, histIdx + 1), nb]);
    setHistIdx(i => i + 1);
  };

  const undo = () => {
    if (histIdx <= 0) return;
    setHistIdx(i => i - 1);
    setBlocks(history[histIdx - 1]);
  };
  const redo = () => {
    if (histIdx >= history.length - 1) return;
    setHistIdx(i => i + 1);
    setBlocks(history[histIdx + 1]);
  };

  /* ── Block operations ─────────────────────────────────────────────────── */
  const addBlock = (type) => {
    const b = { id: `b${Date.now()}`, type, props: JSON.parse(JSON.stringify(DEFAULT_PROPS[type] || {})) };
    const nb = [...blocks, b];
    setBlocks(nb); pushHistory(nb); setSelectedId(b.id);
    setTimeout(() => canvasRef.current?.scrollTo?.({ top: 9999, behavior: 'smooth' }), 80);
  };

  const removeBlock = (id) => {
    const nb = blocks.filter(b => b.id !== id);
    setBlocks(nb); pushHistory(nb);
    if (selectedId === id) setSelectedId(null);
  };

  const moveUp = (id) => {
    const i = blocks.findIndex(b => b.id === id); if (i <= 0) return;
    const nb = [...blocks]; [nb[i-1], nb[i]] = [nb[i], nb[i-1]];
    setBlocks(nb); pushHistory(nb);
  };

  const moveDown = (id) => {
    const i = blocks.findIndex(b => b.id === id); if (i >= blocks.length - 1) return;
    const nb = [...blocks]; [nb[i], nb[i+1]] = [nb[i+1], nb[i]];
    setBlocks(nb); pushHistory(nb);
  };

  const updateProps = (id, newProps) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, props: newProps } : b));
  };

  /* ── Drag & drop ──────────────────────────────────────────────────────── */
  const onCompDragStart = (e, type) => e.dataTransfer.setData('wb/type', type);
  const onBlockDragStart = (e, id) => { setDraggingId(id); e.dataTransfer.effectAllowed = 'move'; };
  const onBlockDragEnd   = () => { setDraggingId(null); setDragOverIdx(null); };

  const onDragOver = (e, idx) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = e.dataTransfer.types.includes('wb/type') ? 'copy' : 'move';
    setDragOverIdx(idx);
  };

  const onDrop = (e, targetIdx) => {
    e.preventDefault(); setDragOverIdx(null);

    const type = e.dataTransfer.getData('wb/type');
    if (type && DEFAULT_PROPS[type] !== undefined) {
      const nb = [...blocks];
      const b = { id: `b${Date.now()}`, type, props: JSON.parse(JSON.stringify(DEFAULT_PROPS[type] || {})) };
      if (targetIdx != null) nb.splice(targetIdx, 0, b);
      else nb.push(b);
      setBlocks(nb); pushHistory(nb); setSelectedId(b.id);
      return;
    }

    if (draggingId) {
      const from = blocks.findIndex(b => b.id === draggingId);
      if (from === -1) return;
      const nb = [...blocks];
      const [moved] = nb.splice(from, 1);
      nb.splice(from < targetIdx ? targetIdx - 1 : targetIdx, 0, moved);
      setBlocks(nb); pushHistory(nb); setDraggingId(null);
    }
  };

  /* ── Save ─────────────────────────────────────────────────────────────── */
  const save = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      localStorage.setItem(LS_BLOCKS, JSON.stringify(blocks));
      localStorage.setItem(LS_THEME, JSON.stringify(theme));
      localStorage.setItem(LS_NAME, pageName);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 2500);
    }, 500);
  };

  /* ── Filtered components ──────────────────────────────────────────────── */
  const filteredLib = search.trim()
    ? COMPONENT_LIBRARY.map(c => ({
        ...c,
        items: c.items.filter(it =>
          it.label.toLowerCase().includes(search.toLowerCase()) ||
          it.type.toLowerCase().includes(search.toLowerCase())
        ),
      })).filter(c => c.items.length > 0)
    : COMPONENT_LIBRARY;

  /* ─────────────────────────────────────────────────────────────────────── */
  return (
    <>
      {/* One-time setup wizard */}
      {showSetup && <SetupWizard onComplete={handleSetupComplete} />}

      {/* Theme change modal */}
      {showThemeModal && (
        <ThemeModal
          currentTheme={theme}
          onApply={t => { setTheme(t); setShowThemeModal(false); }}
          onClose={() => setShowThemeModal(false)}
        />
      )}

      <div className="wb-wrapper" onClick={() => setSelectedId(null)}>

        {/* ── TOP BAR ──────────────────────────────────────────────── */}
        <div className="wb-topbar" onClick={e => e.stopPropagation()}>
          <div className="wb-topbar-left">
            {/* Globe icon (project orange) */}
            <Globe size={18} style={{ color: 'var(--wb-orange)', flexShrink: 0 }} />
            <input
              className="wb-page-name-input"
              value={pageName}
              onChange={e => setPageName(e.target.value)}
              placeholder="Website name..."
            />
            {/* Biz type badge */}
            {bizType && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                fontSize: 11, fontWeight: 700,
                background: 'var(--wb-orange-light)', color: 'var(--wb-orange-hover)',
                border: '1px solid rgba(255,155,41,0.22)', borderRadius: 20,
                padding: '3px 10px', flexShrink: 0,
              }}>
                {bizType.emoji} {bizType.name}
              </span>
            )}
            {saveStatus && (
              <span className={`wb-status-badge ${saveStatus}`}>
                {saveStatus === 'saving' ? '⏳ Saving…' : '✓ Saved'}
              </span>
            )}
          </div>

          {/* Device toggle */}
          <div className="wb-topbar-center">
            <div className="wb-device-toggle">
              {[
                { id: 'desktop', Icon: Monitor, label: 'Desktop' },
                { id: 'tablet',  Icon: Tablet,  label: 'Tablet' },
                { id: 'mobile',  Icon: Smartphone, label: 'Mobile' },
              ].map(({ id, Icon, label }) => (
                <button
                  key={id}
                  className={`wb-device-btn ${device === id ? 'active' : ''}`}
                  onClick={() => setDevice(id)}
                  title={label}
                >
                  <Icon size={15} />
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="wb-topbar-right">
            <button className="wb-icon-btn" onClick={undo}  disabled={histIdx <= 0}              title="Undo"><Undo2  size={14} /></button>
            <button className="wb-icon-btn" onClick={redo}  disabled={histIdx >= history.length - 1} title="Redo"><Redo2  size={14} /></button>
            <button className="wb-icon-btn" onClick={() => setShowThemeModal(true)} title="Change Theme">
              <Palette size={14} /><span>Theme</span>
            </button>
            <button className="wb-icon-btn" onClick={() => setShowSetup(true)} title="Reconfigure setup">
              <Building2 size={14} /><span>Change Business</span>
            </button>
            <button className="wb-icon-btn" onClick={() => window.open('', '_blank')} title="Preview site">
              <Eye size={14} /><span>Preview</span>
            </button>
            <button className="wb-btn-orange" onClick={save}>
              <Save size={14} /> Save &amp; Publish
            </button>
          </div>
        </div>

        {/* ── BODY ─────────────────────────────────────────────────── */}
        <div className="wb-body">

          {/* LEFT PANEL: Component Library */}
          <div className="wb-left-panel" onClick={e => e.stopPropagation()}>
            <div className="wb-panel-header">
              <div className="wb-panel-title">Components</div>
              <div className="wb-search-wrap">
                <Search size={12} style={{ color: 'var(--wb-dim)', flexShrink: 0 }} />
                <input
                  placeholder="Search blocks…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="wb-components-scroll">
              {filteredLib.map(cat => (
                <div key={cat.category}>
                  <div className="wb-cat-label">{cat.category}</div>
                  <div className="wb-comp-grid">
                    {cat.items.map(item => (
                      <div
                        key={item.type}
                        className="wb-comp-card"
                        draggable
                        onDragStart={e => onCompDragStart(e, item.type)}
                        onDoubleClick={() => addBlock(item.type)}
                        title={`Drag to canvas or double-click to add`}
                      >
                        <item.icon size={18} className="wb-comp-icon" />
                        <span className="wb-comp-label">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="wb-comp-tip">
                💡 <strong>Drag</strong> onto canvas or <strong>double-click</strong> to add at bottom.
              </div>
            </div>
          </div>

          {/* CENTER: Canvas */}
          <div
            className="wb-canvas-panel"
            onDragOver={e => e.preventDefault()}
            onDrop={e => {
              const type = e.dataTransfer.getData('wb/type');
              if (type) onDrop(e, null);
            }}
          >
            <div className="wb-canvas-scroll">
              <div
                ref={canvasRef}
                className={`wb-canvas-frame device-${device}`}
                style={{ fontFamily: theme.vars['--theme-font'] }}
                onClick={e => e.stopPropagation()}
              >
                {blocks.length === 0 ? (
                  <div
                    className={`wb-canvas-empty ${dragOverIdx === 0 ? 'drag-over' : ''}`}
                    onDragOver={e => onDragOver(e, 0)}
                    onDragLeave={() => setDragOverIdx(null)}
                    onDrop={e => onDrop(e, 0)}
                  >
                    <div className="wb-canvas-empty-icon"><Layout size={28} /></div>
                    <h3>Your Canvas is Empty</h3>
                    <p>Drag components from the left panel here, or double-click any component to add it.</p>
                  </div>
                ) : (
                  <>
                    {blocks.map((block, idx) => (
                      <React.Fragment key={block.id}>
                        {/* Drop zone before block */}
                        <div
                          className={`wb-drop-zone ${dragOverIdx === idx ? 'active' : ''}`}
                          onDragOver={e => onDragOver(e, idx)}
                          onDragLeave={() => setDragOverIdx(null)}
                          onDrop={e => onDrop(e, idx)}
                        />

                        {/* Block */}
                        <div
                          className={`wb-block-wrapper ${selectedId === block.id ? 'selected' : ''}`}
                          style={{ opacity: draggingId === block.id ? 0.4 : 1 }}
                          onClick={e => { e.stopPropagation(); setSelectedId(block.id); }}
                          draggable
                          onDragStart={e => onBlockDragStart(e, block.id)}
                          onDragEnd={onBlockDragEnd}
                        >
                          {/* Floating toolbar */}
                          <div className="wb-block-controls">
                            <GripVertical size={11} style={{ opacity: 0.6 }} />
                            <span className="wb-block-label-tag">{block.type}</span>
                            <button className="wb-block-action" onClick={e => { e.stopPropagation(); moveUp(block.id); }} title="Move Up"><ChevronUp size={11}/></button>
                            <button className="wb-block-action" onClick={e => { e.stopPropagation(); moveDown(block.id); }} title="Move Down"><ChevronDown size={11}/></button>
                            <button className="wb-block-action danger" onClick={e => { e.stopPropagation(); removeBlock(block.id); }} title="Delete"><Trash2 size={11}/></button>
                          </div>

                          {renderBlock(block)}
                        </div>
                      </React.Fragment>
                    ))}

                    {/* Drop zone after last block */}
                    <div
                      className={`wb-drop-zone ${dragOverIdx === blocks.length ? 'active' : ''}`}
                      onDragOver={e => onDragOver(e, blocks.length)}
                      onDragLeave={() => setDragOverIdx(null)}
                      onDrop={e => onDrop(e, blocks.length)}
                    />
                  </>
                )}
              </div>
            </div>

            {/* Status bar */}
            <div className="wb-status-bar">
              <span>
                {blocks.length} block{blocks.length !== 1 ? 's' : ''} ·
                Theme: <strong>{theme.name}</strong> ·
                {bizType ? ` ${bizType.emoji} ${bizType.name} ·` : ''} {device}
              </span>
              <span>Click canvas to deselect · Drag to reorder</span>
            </div>
          </div>

          {/* RIGHT PANEL: Properties */}
          <div onClick={e => e.stopPropagation()}>
            <PropertiesPanel
              block={selectedBlock}
              onUpdate={np => selectedId && updateProps(selectedId, np)}
            />
          </div>

        </div>
      </div>
    </>
  );
}
