import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useDataUsage } from '../../../context/UsageContext';
import { useCurrency } from '../../../hooks/useCurrency';
import {
    Zap, TrendingUp, Crown, CheckCircle2, XCircle,
    Shield, Clock, Star, Sparkles, ArrowRight, BadgeCheck,
    RefreshCw, AlertCircle
} from 'lucide-react';
import apiClient, { API } from '../../../api/config';
import './Billing.css';

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        if (window.Razorpay) {
            resolve(true);
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

const PLANS = [
    {
        id: 'STARTER',
        name: 'Starter',
        icon: Zap,
        monthlyPrice: 299,
        tagline: 'Essential features for single-store retailers.',
        color: '#6366f1',
        gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
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
        monthlyPrice: 499,
        tagline: 'Advanced tools for growing businesses.',
        popular: true,
        color: '#ea580c',
        gradient: 'linear-gradient(135deg, #ff822d 0%, #ea580c 100%)',
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
        monthlyPrice: 899,
        tagline: 'Complete control for multi-store chains.',
        color: '#0284c7',
        gradient: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
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

export default function Billing() {
    const { user, fetchSession } = useAuth();
    const { usage, refreshUsage } = useDataUsage();
    const { currencySymbol } = useCurrency();
    const billing = 'monthly';
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [history, setHistory] = useState([]);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [paymentModal, setPaymentModal] = useState(null);
    const [latestTxnId, setLatestTxnId] = useState(null);

    const currentPlan = user?.plan || 'NONE';

    const fetchHistory = async () => {
        try {
            const res = await apiClient.get(`${API.PAYMENTS}/history`);
            setHistory(res.data || []);
        } catch (err) {
            console.error("Failed to fetch billing history", err);
        }
    };

    React.useEffect(() => {
        fetchSession?.();
        fetchHistory();
    }, []);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        setError('');
        try {
            await Promise.allSettled([
                fetchSession?.(),
                refreshUsage?.(),
                fetchHistory()
            ]);
        } catch {
            // ignore error
        } finally {
            setTimeout(() => setIsRefreshing(false), 500);
        }
    };

    const getMonthlyDisplay = (plan) => plan.monthlyPrice;
    const getChargeAmount = (plan) => plan.monthlyPrice;

    const handlePay = async (plan) => {
        const end = user?.subscriptionEndDate ? new Date(user.subscriptionEndDate) : null;
        const isCurrentActive = currentPlan === plan.id && end && end.getTime() > Date.now();
        if (isCurrentActive) return;
        setError('');
        setSuccess('');
        
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
            setError('Failed to load Razorpay SDK. Are you online?');
            return;
        }

        try {
            const amount = getChargeAmount(plan);
            // 1. Create order on backend
            const orderRes = await apiClient.post(`${API.PAYMENTS}/create-order`, {
                plan: plan.id,
                amount: amount,
                currency: 'INR',
                billingCycle: 'monthly'
            });
            const { orderId, razorpayKeyId } = orderRes.data;

            // 2. Initialize Razorpay checkout
            const options = {
                key: razorpayKeyId,
                amount: amount * 100, // in paise
                currency: 'INR',
                name: 'Samrajya Software',
                description: `${plan.name} Plan - Monthly Subscription`,
                order_id: orderId,
                handler: async function (response) {
                    try {
                        // 3. Verify payment on backend
                        await apiClient.post(`${API.PAYMENTS}/verify`, {
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                            plan: plan.id,
                            billingCycle: 'monthly',
                            amount: amount
                        });
                        
                        // 4. Sync exact state from server — covers both active and queued cases
                        await fetchSession();
                        fetchHistory();
                        setLatestTxnId(response.razorpay_payment_id);
                        
                        const duration = '30 days';
                        setPaymentModal({
                            type: 'success',
                            title: 'Payment Successful!',
                            plan: plan.name,
                            amount: amount,
                            duration,
                            message: `🎉 ${plan.name} plan has been activated successfully! Enjoy ${duration} of access.`
                        });
                        
                        setTimeout(() => {
                            document.getElementById('billing-history-section')?.scrollIntoView({ behavior: 'smooth' });
                        }, 500);
                        
                    } catch (verifyErr) {
                        setPaymentModal({
                            type: 'failed',
                            title: 'Verification Failed',
                            message: 'Payment verification failed. Please contact support if the amount was deducted.'
                        });
                    }
                },
                modal: {
                    ondismiss: function () {
                        apiClient.post(`${API.PAYMENTS}/record-status`, {
                            orderId,
                            plan: plan.id,
                            billingCycle: billing,
                            amount,
                            status: 'CANCELLED'
                        }).finally(() => fetchHistory());

                        setPaymentModal({
                            type: 'cancelled',
                            title: 'Payment Cancelled',
                            message: 'Checkout window was closed. No amount was charged to your account.'
                        });
                    }
                },
                prefill: {
                    name: user?.firstName ? `${user.firstName} ${user.lastName}` : '',
                    email: user?.email || '',
                    contact: user?.phone || ''
                },
                theme: {
                    color: plan.color || '#ea580c'
                }
            };
            
            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                apiClient.post(`${API.PAYMENTS}/record-status`, {
                    orderId,
                    paymentId: response.error?.metadata?.payment_id,
                    plan: plan.id,
                    billingCycle: billing,
                    amount,
                    status: 'FAILED'
                }).finally(() => fetchHistory());

                setPaymentModal({
                    type: 'failed',
                    title: 'Payment Not Processed',
                    message: response.error?.description || 'Payment could not be processed. Please check your bank or payment method.'
                });
            });
            rzp.open();
            
        } catch (err) {
            console.error('Payment initiation error:', err);
            let msg = 'Unknown error';
            if (err.response?.data) {
                msg = typeof err.response.data === 'string' ? err.response.data : JSON.stringify(err.response.data);
            } else if (err.message) {
                msg = err.message;
            }
            setError(`Failed to initiate payment: ${msg}`);
        }
    };

    // Removed legacy local payment success handler

    const renderStatus = () => {
        if (!user?.subscriptionEndDate || currentPlan === 'NONE') {
            const used = usage?.totalUsed ?? 0;
            const limit = usage?.limit && usage.limit > 0 ? usage.limit : 50;
            const remaining = Math.max(0, limit - used);
            const pct = Math.min(100, Math.round((used / limit) * 100));
            const isLimitReached = used >= limit && limit > 0;

            return (
                <div className="bp-status-container">
                    {isLimitReached && (
                        <div className="bp-status-limit-banner">
                            <div className="bp-status-limit-banner-left">
                                <AlertCircle size={22} className="bp-limit-icon-pulse" />
                                <div>
                                    <div className="bp-status-limit-title">50 Records Max Completed!</div>
                                    <div className="bp-status-limit-sub">
                                        You have stored {used} of {limit} free records. Please choose an upgrade plan below to unlock unlimited records.
                                    </div>
                                </div>
                            </div>
                            <button
                                className="bp-limit-upgrade-quick-btn"
                                onClick={() => {
                                    const growth = PLANS.find(p => p.id === 'GROWTH') || PLANS[0];
                                    handlePay(growth);
                                }}
                            >
                                <Sparkles size={14} />
                                Upgrade Now
                            </button>
                        </div>
                    )}
                    <div className={`bp-status bp-status--free ${isLimitReached ? 'bp-status--limit' : ''}`}>
                        <div className="bp-status-left">
                            <div className={`bp-status-badge-icon ${isLimitReached ? 'bp-status-badge-icon--red' : 'bp-status-badge-icon--orange'}`}>
                                {isLimitReached ? <AlertCircle size={22} /> : <BadgeCheck size={22} />}
                            </div>
                            <div>
                                <div className="bp-status-name" style={{ color: isLimitReached ? '#b91c1c' : undefined }}>
                                    {isLimitReached ? 'Free Tier - 50 Records Max Reached' : 'Free Tier Active'}
                                </div>
                                <div className="bp-status-expires">
                                    <Clock size={13} />
                                    <span>{used} of {limit} records stored · <strong>{isLimitReached ? '0 remaining (Limit Reached)' : `${remaining} remaining`}</strong></span>
                                </div>
                            </div>
                        </div>
                        <div className="bp-status-right">
                            <div className="bp-status-progress-wrap">
                                <div className="bp-status-bar">
                                    <div
                                        className={`bp-status-fill ${pct >= 90 ? 'bp-status-fill--danger' : 'bp-status-fill--orange'}`}
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                                <div className="bp-status-pct">{pct}% used ({remaining} left)</div>
                            </div>
                            <button
                                className="bp-refresh-btn"
                                onClick={handleRefresh}
                                disabled={isRefreshing}
                                title="Refresh subscription status"
                            >
                                <RefreshCw size={14} className={isRefreshing ? 'bp-spin-icon' : ''} />
                                <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        const end = new Date(user.subscriptionEndDate);
        const now = Date.now();
        const isExpired = end.getTime() <= now;
        const daysLeft = Math.max(0, Math.ceil((end - now) / 86400000));
        const pct = Math.min(100, Math.max(0, ((30 - daysLeft) / 30) * 100));

        if (isExpired && !user.nextPlan) {
            return (
                <div className="bp-status bp-status--expired">
                    <div className="bp-status-left">
                        <div className="bp-status-badge-icon bp-status-badge-icon--red">
                            <AlertCircle size={22} />
                        </div>
                        <div>
                            <div className="bp-status-name" style={{ color: '#b91c1c' }}>{currentPlan} Subscription Expired</div>
                            <div className="bp-status-expires">
                                <Clock size={13} />
                                <span>
                                    Expired on {end.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}. Select any plan below to restart.
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="bp-status-right">
                        <button
                            className="bp-refresh-btn"
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            title="Refresh subscription status"
                        >
                            <RefreshCw size={14} className={isRefreshing ? 'bp-spin-icon' : ''} />
                            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div className="bp-status-list">
                <div className="bp-status bp-status--active">
                    <div className="bp-status-left">
                        <div className="bp-status-badge-icon bp-status-badge-icon--green">
                            <BadgeCheck size={22} />
                        </div>
                        <div>
                            <div className="bp-status-name">{currentPlan} Plan Active</div>
                            <div className="bp-status-expires">
                                <Clock size={13} />
                                <span>
                                    Expires {end.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })} · <strong>{daysLeft} days remaining</strong>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="bp-status-right">
                        <div className="bp-status-progress-wrap">
                            <div className="bp-status-bar">
                                <div className="bp-status-fill bp-status-fill--green" style={{ width: `${Math.min(100, 100 - pct)}%` }} />
                            </div>
                            <div className="bp-status-pct">{daysLeft} days remaining</div>
                        </div>
                        <button
                            className="bp-refresh-btn"
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            title="Refresh subscription status"
                        >
                            <RefreshCw size={14} className={isRefreshing ? 'bp-spin-icon' : ''} />
                            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
                        </button>
                    </div>
                </div>

                {user.nextPlan && (
                    <div className="bp-status bp-status--queued">
                        <div className="bp-status-left">
                            <div className="bp-status-badge-icon" style={{ background: '#ffedd5', color: '#ea580c' }}>
                                <Clock size={22} />
                            </div>
                            <div>
                                <div className="bp-status-name" style={{ color: '#9a3412' }}>Upcoming: {user.nextPlan} Plan</div>
                                <div className="bp-status-expires" style={{ color: '#ea580c' }}>
                                    <BadgeCheck size={13} />
                                    <span>
                                        Starts automatically after your current {currentPlan} plan expires.
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="bp-status-right">
                            <div className="bp-status-progress-wrap" style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '13px', fontWeight: '700', color: '#ea580c' }}>
                                    {user.nextSubscriptionDays} days queued
                                </div>
                                <div style={{ fontSize: '11.5px', color: '#f97316', marginTop: '2px' }}>
                                    Status: On Hold
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="bp-wrap">

            {/* Hero header */}
            <div className="bp-hero">
                <div className="bp-hero-badge"><Sparkles size={14} /> Simple, Transparent Pricing</div>
                <h2 className="bp-hero-title">Choose the Perfect Plan for Your Business</h2>
                <p className="bp-hero-sub">Scale effortlessly with our flexible retail management features. Upgrade or change plans anytime.</p>
            </div>

            {/* Current status bar */}
            {renderStatus()}

            {/* Alerts */}
            {error   && <div className="bp-alert bp-alert--error">⚠️ {error}</div>}
            {success && <div className="bp-alert bp-alert--success">{success}</div>}

            {/* Cards Grid */}
            <div className="bp-grid">
                {PLANS.map((plan) => {
                    const PlanIcon = plan.icon;
                    const end = user?.subscriptionEndDate ? new Date(user.subscriptionEndDate) : null;
                    const isExpired = end ? end.getTime() <= Date.now() : false;
                    const isCurrentActive = currentPlan === plan.id && !isExpired;
                    const isCurrentExpired = currentPlan === plan.id && isExpired;
                    const price = getMonthlyDisplay(plan);
                    const charge = getChargeAmount(plan);

                    return (
                        <div
                            key={plan.id}
                            className={`bp-card ${plan.popular ? 'bp-card--popular' : ''} ${isCurrentActive ? 'bp-card--current' : ''}`}
                            style={{ '--plan-color': plan.color, '--plan-gradient': plan.gradient }}
                        >
                            {plan.popular && (
                                <div className="bp-popular-ribbon">
                                    <Star size={12} fill="currentColor" /> Most Popular
                                </div>
                            )}

                            {isCurrentActive && (
                                <div className="bp-current-chip">
                                    <CheckCircle2 size={13} /> Current Plan
                                </div>
                            )}

                            {isCurrentExpired && (
                                <div className="bp-current-chip" style={{ background: '#fee2e2', color: '#b91c1c' }}>
                                    <AlertCircle size={13} /> Expired Plan
                                </div>
                            )}

                            {/* Header / Icon */}
                            <div className="bp-card-top">
                                <div className="bp-card-icon">
                                    <PlanIcon size={22} />
                                </div>
                                <div className="bp-card-heading">
                                    <h3 className="bp-card-name">{plan.name}</h3>
                                    <p className="bp-card-tagline">{plan.tagline}</p>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="bp-card-pricing-box">
                                <div className="bp-card-price">
                                    <span className="bp-curr">{currencySymbol}</span>
                                    <span className="bp-amount">{price.toLocaleString()}</span>
                                    <span className="bp-period">/month</span>
                                </div>
                                <div className="bp-monthly-note">Billed on a monthly cycle</div>
                            </div>

                            <div className="bp-divider" />

                            {/* Features */}
                            <div className="bp-features-header">What's included:</div>
                            <ul className="bp-features">
                                {plan.features.map((f, i) => (
                                    <li key={i} className={f.included ? 'bp-feat--on' : 'bp-feat--off'}>
                                        {f.included
                                            ? <CheckCircle2 size={16} className="bp-feat-icon bp-feat-icon--check" />
                                            : <XCircle size={16} className="bp-feat-icon bp-feat-icon--cross" />
                                        }
                                        <span>{f.text}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA */}
                            <button
                                className={`bp-btn ${plan.popular ? 'bp-btn--primary' : 'bp-btn--secondary'} ${isCurrentActive ? 'bp-btn--current' : ''}`}
                                onClick={() => handlePay(plan)}
                                disabled={isCurrentActive}
                            >
                                {isCurrentActive ? (
                                    <><CheckCircle2 size={16} /> Current Plan</>
                                ) : isCurrentExpired ? (
                                    <><Zap size={16} /> Restart {plan.name} Plan</>
                                ) : (
                                    <>Get Started with {plan.name} <ArrowRight size={16} /></>
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Billing History Section */}
            <div id="billing-history-section" className="bp-history-section" style={{ marginTop: '50px', background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)', border: '1px solid #f1f5f9' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={18} color="#64748b" />
                    Billing & Payment History
                </h3>
                
                {(!history || history.length === 0) ? (
                    <div style={{ padding: '30px', textAlign: 'center', color: '#94a3b8', fontSize: '14px', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                        <div style={{ marginBottom: '8px' }}><BadgeCheck size={32} color="#cbd5e1" /></div>
                        No payment history found yet. Your future receipts will appear here!
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontWeight: '600' }}>
                                    <th style={{ padding: '12px 16px' }}>Date</th>
                                    <th style={{ padding: '12px 16px' }}>Plan</th>
                                    <th style={{ padding: '12px 16px' }}>Cycle</th>
                                    <th style={{ padding: '12px 16px' }}>Amount</th>
                                    <th style={{ padding: '12px 16px' }}>Invoice</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((tx, idx) => {
                                    const isNew = tx.razorpayPaymentId === latestTxnId || (idx === 0 && latestTxnId);
                                    return (
                                        <tr key={idx} className={isNew ? 'bp-new-highlight' : ''} style={{ borderBottom: '1px solid #f1f5f9', color: '#334155' }}>
                                            <td style={{ padding: '16px' }}>
                                                {(() => { const d = new Date(tx.transactionDate); return isNaN(d) ? tx.transactionDate : d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }); })()}
                                            </td>
                                            <td style={{ padding: '16px', fontWeight: '600' }}>
                                                {tx.plan}
                                                {isNew && <span style={{ marginLeft: '8px', fontSize: '11px', background: '#dcfce7', color: '#15803d', fontWeight: '700', padding: '2px 6px', borderRadius: '4px' }}>JUST PAID</span>}
                                            </td>
                                            <td style={{ padding: '16px', textTransform: 'capitalize' }}>{tx.billingCycle}</td>
                                            <td style={{ padding: '16px' }}>{currencySymbol}{tx.amount ? tx.amount.toFixed(2) : '0.00'}</td>
                                            <td style={{ padding: '16px' }}>
                                                {tx.status === 'CANCELLED' ? (
                                                    <span style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                                                        padding: '4px 10px', background: '#fef3c7', color: '#b45309',
                                                        borderRadius: '6px', fontSize: '12px', fontWeight: '600', marginRight: '8px'
                                                    }}>
                                                        <XCircle size={14} /> Cancelled
                                                    </span>
                                                ) : tx.status === 'FAILED' ? (
                                                    <span style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                                                        padding: '4px 10px', background: '#fee2e2', color: '#dc2626',
                                                        borderRadius: '6px', fontSize: '12px', fontWeight: '600', marginRight: '8px'
                                                    }}>
                                                        <XCircle size={14} /> Failed
                                                    </span>
                                                ) : (
                                                    <span style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                                                        padding: '4px 10px', background: '#f0fdf4', color: '#16a34a',
                                                        borderRadius: '6px', fontSize: '12px', fontWeight: '600', marginRight: '8px'
                                                    }}>
                                                        <BadgeCheck size={14} /> Paid
                                                    </span>
                                                )}
                                            <button 
                                                onClick={() => setSelectedTransaction(tx)}
                                                style={{
                                                    background: 'none', border: '1px solid #e2e8f0', borderRadius: '6px',
                                                    padding: '4px 10px', fontSize: '12px', fontWeight: '500', color: '#64748b',
                                                    cursor: 'pointer', transition: 'all 0.2s'
                                                }}
                                                onMouseOver={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = '#334155'; }}
                                                onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#64748b'; }}
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Trust bar */}
            <div className="bp-trust">
                <div className="bp-trust-item"><Shield size={16} /> 256-bit SSL Encrypted</div>
                <div className="bp-trust-item"><BadgeCheck size={16} /> Secure Payment Gateway</div>
                <div className="bp-trust-item"><Star size={16} /> Transparent, No Hidden Fees</div>
                <div className="bp-trust-item"><Clock size={16} /> Instant Activation</div>
            </div>

            {/* Transaction Details Modal */}
            {selectedTransaction && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
                    backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px'
                }}>
                    <div style={{
                        background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '440px',
                        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)', overflow: 'hidden'
                    }}>
                        <div style={{ padding: '24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>Transaction Receipt</h3>
                            <button onClick={() => setSelectedTransaction(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                                <XCircle size={22} />
                            </button>
                        </div>
                        <div style={{ padding: '24px' }}>
                            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                                <div style={{
                                    display: 'inline-flex',
                                    background: selectedTransaction.status === 'CANCELLED' ? '#fef3c7' : selectedTransaction.status === 'FAILED' ? '#fee2e2' : '#f0fdf4',
                                    color: selectedTransaction.status === 'CANCELLED' ? '#b45309' : selectedTransaction.status === 'FAILED' ? '#dc2626' : '#16a34a',
                                    padding: '12px', borderRadius: '50%', marginBottom: '12px'
                                }}>
                                    {selectedTransaction.status === 'CANCELLED' || selectedTransaction.status === 'FAILED' ? (
                                        <XCircle size={28} />
                                    ) : (
                                        <BadgeCheck size={28} />
                                    )}
                                </div>
                                <div style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a' }}>
                                    {currencySymbol}{selectedTransaction.amount ? selectedTransaction.amount.toFixed(2) : '0.00'}
                                </div>
                                <div style={{
                                    color: selectedTransaction.status === 'CANCELLED' ? '#b45309' : selectedTransaction.status === 'FAILED' ? '#dc2626' : '#16a34a',
                                    fontSize: '14px', marginTop: '4px', fontWeight: '600'
                                }}>
                                    {selectedTransaction.status === 'CANCELLED' ? 'Payment Cancelled' : selectedTransaction.status === 'FAILED' ? 'Payment Failed' : 'Successful Payment'}
                                </div>
                            </div>

                            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#64748b' }}>Status</span>
                                    <span style={{
                                        fontWeight: '700',
                                        color: selectedTransaction.status === 'CANCELLED' ? '#b45309' : selectedTransaction.status === 'FAILED' ? '#dc2626' : '#16a34a'
                                    }}>
                                        {selectedTransaction.status || 'PAID'}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#64748b' }}>Plan</span>
                                    <span style={{ fontWeight: '600', color: '#0f172a' }}>{selectedTransaction.plan} ({selectedTransaction.billingCycle})</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#64748b' }}>Date</span>
                                    <span style={{ fontWeight: '500', color: '#334155' }}>
                                        {(() => { const d = new Date(selectedTransaction.transactionDate); return isNaN(d) ? selectedTransaction.transactionDate : d.toLocaleString(); })()}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#64748b' }}>Payment ID</span>
                                    <span style={{ fontWeight: '500', color: '#334155', fontFamily: 'monospace' }}>{selectedTransaction.razorpayPaymentId}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#64748b' }}>Order ID</span>
                                    <span style={{ fontWeight: '500', color: '#334155', fontFamily: 'monospace' }}>{selectedTransaction.razorpayOrderId}</span>
                                </div>
                            </div>
                        </div>
                        <div style={{ padding: '20px 24px', background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end' }}>
                            <button 
                                onClick={() => setSelectedTransaction(null)}
                                style={{ background: '#0f172a', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Status Animated Modal */}
            {paymentModal && (
                <div className="bp-modal-overlay" onClick={() => setPaymentModal(null)}>
                    <div className="bp-modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className={`bp-anim-circle ${paymentModal.type === 'success' ? 'bp-anim-circle--success' : 'bp-anim-circle--failure'}`}>
                            {paymentModal.type === 'success' ? (
                                <CheckCircle2 size={44} strokeWidth={2.5} />
                            ) : (
                                <XCircle size={44} strokeWidth={2.5} />
                            )}
                        </div>

                        <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px' }}>
                            {paymentModal.title}
                        </h3>

                        <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 20px', lineHeight: '1.5' }}>
                            {paymentModal.message}
                        </p>

                        {paymentModal.type === 'success' && (
                            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '14px', marginBottom: '20px', display: 'flex', justifyContent: 'space-around', border: '1px solid #f1f5f9' }}>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#64748b' }}>Plan</div>
                                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>{paymentModal.plan}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '12px', color: '#64748b' }}>Amount Paid</div>
                                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#16a34a' }}>
                                        {currencySymbol}{typeof paymentModal.amount === 'number' ? paymentModal.amount.toFixed(2) : paymentModal.amount}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                            {paymentModal.type === 'success' ? (
                                <>
                                    <button
                                        onClick={() => {
                                            setPaymentModal(null);
                                            document.getElementById('billing-history-section')?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                        style={{
                                            background: '#0f172a', color: '#fff', border: 'none',
                                            padding: '11px 20px', borderRadius: '10px', fontWeight: '600',
                                            fontSize: '13.5px', cursor: 'pointer'
                                        }}
                                    >
                                        View in History
                                    </button>
                                    <button
                                        onClick={() => setPaymentModal(null)}
                                        style={{
                                            background: '#f1f5f9', color: '#475569', border: 'none',
                                            padding: '11px 20px', borderRadius: '10px', fontWeight: '600',
                                            fontSize: '13.5px', cursor: 'pointer'
                                        }}
                                    >
                                        Done
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setPaymentModal(null)}
                                    style={{
                                        background: '#0f172a', color: '#fff', border: 'none',
                                        padding: '11px 24px', borderRadius: '10px', fontWeight: '600',
                                        fontSize: '13.5px', cursor: 'pointer'
                                    }}
                                >
                                    Close
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
