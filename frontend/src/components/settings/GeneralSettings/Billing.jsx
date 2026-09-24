import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useDataUsage } from '../../../context/UsageContext';
import apiClient from '../../../api/config';
import { useCurrency } from '../../../hooks/useCurrency';
import {
    Zap, TrendingUp, Crown, CheckCircle2, XCircle,
    Shield, Clock, Star, Sparkles, ArrowRight, BadgeCheck
} from 'lucide-react';
import './Billing.css';

const PLANS = [
    {
        id: 'STARTER',
        name: 'Starter',
        icon: Zap,
        monthlyPrice: 499,
        yearlyPrice: 399,
        tagline: 'Essential features for single-store retailers.',
        color: '#6366f1',
        gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        features: [
            { text: '1 Store Location', included: true },
            { text: 'Up to 1,000 Products', included: true },
            { text: 'POS Billing & Basic Inventory', included: true },
            { text: 'Basic Sales Analytics', included: true },
            { text: 'WhatsApp & Email Support', included: true },
            { text: 'Barcode Printing', included: false },
            { text: 'Multi-role Access', included: false },
            { text: 'API Access', included: false },
        ],
    },
    {
        id: 'GROWTH',
        name: 'Growth',
        icon: TrendingUp,
        monthlyPrice: 999,
        yearlyPrice: 799,
        tagline: 'Advanced tools for growing businesses.',
        popular: true,
        color: '#ea580c',
        gradient: 'linear-gradient(135deg, #ff822d, #ea580c)',
        features: [
            { text: 'Up to 3 Store Locations', included: true },
            { text: 'Unlimited Products', included: true },
            { text: 'POS & Online Order Management', included: true },
            { text: 'Advanced Analytics & Reports', included: true },
            { text: 'Barcode & QR Code Printing', included: true },
            { text: 'Multi-role Access (Admin/Staff)', included: true },
            { text: 'Priority Chat Support', included: true },
            { text: 'API Access', included: false },
        ],
    },
    {
        id: 'PREMIUM',
        name: 'Premium',
        icon: Crown,
        monthlyPrice: 1999,
        yearlyPrice: 1599,
        tagline: 'Complete control for multi-store chains.',
        color: '#0ea5e9',
        gradient: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
        features: [
            { text: 'Unlimited Locations', included: true },
            { text: 'Unlimited Products', included: true },
            { text: 'All Order Channels & API Access', included: true },
            { text: 'Custom Analytics & Exports', included: true },
            { text: 'Barcode & QR Code Printing', included: true },
            { text: 'Dedicated Account Manager', included: true },
            { text: 'White-label Option', included: true },
            { text: '99.9% Uptime SLA', included: true },
        ],
    },
];

function loadRazorpay() {
    return new Promise(resolve => {
        if (document.querySelector('script[src*="razorpay"]')) { resolve(true); return; }
        const s = document.createElement('script');
        s.src = 'https://checkout.razorpay.com/v1/checkout.js';
        s.onload = () => resolve(true);
        s.onerror = () => resolve(false);
        document.body.appendChild(s);
    });
}

export default function Billing() {
    const { user, updatePlanContext } = useAuth();
    const { usage } = useDataUsage();
    const { currencySymbol } = useCurrency();
    const [billing, setBilling] = useState('monthly'); // 'monthly' | 'yearly'
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const currentPlan = user?.plan || 'NONE';

    useEffect(() => { loadRazorpay(); }, []);

    const getPrice = (plan) => billing === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;

    const handlePay = async (plan) => {
        if (plan.id === currentPlan) return;
        setLoading(plan.id);
        setError('');
        setSuccess('');

        const amount = getPrice(plan);
        try {
            const { data } = await apiClient.post('/api/payments/create-order', {
                plan: plan.id, amount, currency: 'INR',
            });

            const ok = await loadRazorpay();
            if (!ok || !window.Razorpay) throw new Error('Razorpay SDK failed to load');

            const rzp = new window.Razorpay({
                key: data.razorpayKeyId,
                amount: data.amount * 100,
                currency: data.currency,
                name: 'Samrajya Software',
                description: `${plan.name} Plan — 30 days`,
                order_id: data.orderId,
                prefill: { name: user?.name || '', email: user?.email || '' },
                theme: { color: plan.color },
                handler: async (response) => {
                    try {
                        const res = await apiClient.post('/api/payments/verify', {
                            razorpayOrderId:   response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                            plan: plan.id,
                        });
                        updatePlanContext(plan.id, res.data.subscriptionEndDate);
                        setSuccess(`🎉 ${plan.name} plan activated! Enjoy 30 days of access.`);
                        setTimeout(() => setSuccess(''), 6000);
                    } catch {
                        setError('Payment succeeded but plan activation failed. Contact support.');
                    } finally { setLoading(null); }
                },
                modal: { ondismiss: () => setLoading(null) },
            });
            rzp.on('payment.failed', (r) => { setError(`Payment failed: ${r.error.description}`); setLoading(null); });
            rzp.open();
        } catch (err) {
            setError(err.response?.data || err.message || 'Failed to initiate payment.');
            setLoading(null);
        }
    };

    const renderStatus = () => {
        if (!user?.subscriptionEndDate || currentPlan === 'NONE') {
            const used = usage?.totalUsed ?? 0;
            const limit = usage?.limit && usage.limit > 0 ? usage.limit : 50;
            const remaining = Math.max(0, limit - used);
            const pct = Math.min(100, Math.round((used / limit) * 100));

            return (
                <div className="bp-status" style={{ borderColor: pct >= 90 ? '#fca5a5' : 'rgba(234, 88, 12, 0.2)', background: pct >= 90 ? '#fef2f2' : 'var(--pos-orange-light, #fff7ed)' }}>
                    <div className="bp-status-left">
                        <BadgeCheck size={20} className="bp-status-icon" style={{ color: pct >= 90 ? '#ef4444' : 'var(--pos-orange, #ea580c)' }} />
                        <div>
                            <div className="bp-status-name" style={{ color: 'var(--pos-dark-blue, #0f172a)' }}>Free Plan Active</div>
                            <div className="bp-status-expires">
                                <Clock size={12} />
                                {used} of {limit} records stored · {remaining} remaining
                            </div>
                        </div>
                    </div>
                    <div className="bp-status-progress-wrap">
                        <div className="bp-status-bar" style={{ backgroundColor: 'rgba(234, 88, 12, 0.15)' }}>
                            <div className="bp-status-fill" style={{
                                width: `${pct}%`,
                                background: pct >= 90 ? '#ef4444' : 'linear-gradient(90deg, #ff822d 0%, #ea580c 100%)',
                                boxShadow: pct > 0 ? '0 0 6px rgba(234, 88, 12, 0.35)' : 'none'
                            }} />
                        </div>
                        <div className="bp-status-pct" style={{ color: 'var(--pos-dark-blue, #0f172a)' }}>{pct}% used ({remaining} left)</div>
                    </div>
                </div>
            );
        }

        const end = new Date(user.subscriptionEndDate);
        const now = Date.now();
        const daysLeft = Math.max(0, Math.ceil((end - now) / 86400000));
        const pct = Math.min(100, Math.max(0, ((30 - daysLeft) / 30) * 100));

        return (
            <div className="bp-status">
                <div className="bp-status-left">
                    <BadgeCheck size={20} className="bp-status-icon" />
                    <div>
                        <div className="bp-status-name">{currentPlan} Plan Active</div>
                        <div className="bp-status-expires">
                            <Clock size={12} />
                            Expires {end.toLocaleDateString()} at {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {daysLeft} days left
                        </div>
                    </div>
                </div>
                <div className="bp-status-progress-wrap">
                    <div className="bp-status-bar"><div className="bp-status-fill" style={{ width: `${pct}%` }} /></div>
                    <div className="bp-status-pct">{daysLeft}d remaining</div>
                </div>
            </div>
        );
    };

    return (
        <div className="bp-wrap">

            {/* Hero header */}
            <div className="bp-hero">
                <div className="bp-hero-badge"><Sparkles size={14} /> Flexible Plans</div>
                <h2 className="bp-hero-title">Choose Your Plan</h2>
                <p className="bp-hero-sub">Start small, scale as you grow. Upgrade or downgrade anytime.</p>

                {/* Billing toggle */}
                <div className="bp-toggle">
                    <button
                        className={`bp-toggle-btn ${billing === 'monthly' ? 'active' : ''}`}
                        onClick={() => setBilling('monthly')}
                    >Monthly</button>
                    <button
                        className={`bp-toggle-btn ${billing === 'yearly' ? 'active' : ''}`}
                        onClick={() => setBilling('yearly')}
                    >
                        Yearly
                        <span className="bp-save-pill">Save 20%</span>
                    </button>
                </div>
            </div>

            {renderStatus()}

            {error   && <div className="bp-alert bp-alert--error">⚠️ {error}</div>}
            {success && <div className="bp-alert bp-alert--success">{success}</div>}

            {/* Cards */}
            <div className="bp-grid">
                {PLANS.map((plan) => {
                    const PlanIcon = plan.icon;
                    const isCurrent = currentPlan === plan.id;
                    const isLoading = loading === plan.id;
                    const price = getPrice(plan);

                    return (
                        <div
                            key={plan.id}
                            className={`bp-card ${plan.popular ? 'bp-card--popular' : ''} ${isCurrent ? 'bp-card--current' : ''}`}
                            style={{ '--plan-color': plan.color, '--plan-gradient': plan.gradient }}
                        >
                            {plan.popular && (
                                <div className="bp-popular-ribbon">
                                    <Star size={12} fill="white" /> Most Popular
                                </div>
                            )}

                            {isCurrent && (
                                <div className="bp-current-chip">
                                    <CheckCircle2 size={11} /> Current Plan
                                </div>
                            )}

                            {/* Icon */}
                            <div className="bp-card-icon">
                                <PlanIcon size={22} />
                            </div>

                            {/* Name & Price */}
                            <div className="bp-card-name">{plan.name}</div>
                            <div className="bp-card-price">
                                <span className="bp-curr">{currencySymbol}</span>
                                <span className="bp-amount">{price.toLocaleString()}</span>
                                <span className="bp-period">/{billing === 'yearly' ? 'mo*' : 'mo'}</span>
                            </div>
                            {billing === 'yearly' && (
                                <div className="bp-yearly-note">Billed as {currencySymbol}{(price * 12).toLocaleString()}/yr</div>
                            )}

                            <p className="bp-card-tagline">{plan.tagline}</p>

                            <div className="bp-divider" />

                            {/* Features */}
                            <ul className="bp-features">
                                {plan.features.map((f, i) => (
                                    <li key={i} className={f.included ? 'bp-feat--on' : 'bp-feat--off'}>
                                        {f.included
                                            ? <CheckCircle2 size={15} className="bp-feat-icon" />
                                            : <XCircle size={15} className="bp-feat-icon" />
                                        }
                                        {f.text}
                                    </li>
                                ))}
                            </ul>

                            {/* CTA */}
                            <button
                                className={`bp-btn ${plan.popular ? 'bp-btn--primary' : ''} ${isCurrent ? 'bp-btn--current' : ''}`}
                                onClick={() => handlePay(plan)}
                                disabled={!!loading || isCurrent}
                            >
                                {isLoading ? (
                                    <span className="bp-spinner" />
                                ) : isCurrent ? (
                                    <><CheckCircle2 size={15} /> Active Plan</>
                                ) : (
                                    <>Get {plan.name} <ArrowRight size={15} /></>
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Trust bar */}
            <div className="bp-trust">
                <div className="bp-trust-item"><Shield size={14} /> Bank-grade 256-bit SSL</div>
                <div className="bp-trust-item"><BadgeCheck size={14} /> Powered by Razorpay</div>
                <div className="bp-trust-item"><Star size={14} /> No hidden charges</div>
                <div className="bp-trust-item"><Clock size={14} /> Cancel anytime</div>
            </div>
        </div>
    );
}
