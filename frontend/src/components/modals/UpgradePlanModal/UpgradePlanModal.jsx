import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useDataUsage, dispatchUsageRefresh } from '../../../context/UsageContext';
import { useCurrency } from '../../../hooks/useCurrency';
import {
    Zap, TrendingUp, Crown, Check, X, Star, Sparkles,
    Shield, AlertTriangle, ArrowRight, CheckCircle2, Clock, RefreshCw
} from 'lucide-react';
import apiClient, { API } from '../../../api/config';
import './UpgradePlanModal.css';

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

const UPGRADE_PLANS = [
    {
        id: 'STARTER',
        name: 'Starter',
        icon: Zap,
        monthlyPrice: 299,
        tagline: 'Essential features for single-store retailers.',
        color: '#6366f1',
        features: [
            '1 Store Location',
            'Up to 1,000 Products',
            'POS Billing & Inventory',
            'Basic Sales Analytics',
            'WhatsApp & Email Support'
        ]
    },
    {
        id: 'GROWTH',
        name: 'Growth',
        icon: TrendingUp,
        monthlyPrice: 499,
        popular: true,
        tagline: 'Advanced tools for growing businesses.',
        color: '#ea580c',
        features: [
            'Up to 3 Store Locations',
            'Unlimited Products',
            'POS & Online Orders',
            'Advanced Analytics & Reports',
            'Barcode & QR Code Printing',
            'Multi-role Access (Admin/Staff)'
        ]
    },
    {
        id: 'PREMIUM',
        name: 'Premium',
        icon: Crown,
        monthlyPrice: 899,
        tagline: 'Complete control for multi-store chains.',
        color: '#0284c7',
        features: [
            'Unlimited Locations',
            'Unlimited Products',
            'All Order Channels & API',
            'Custom Analytics & Exports',
            'Dedicated Account Manager',
            '99.9% Uptime SLA'
        ]
    }
];

export default function UpgradePlanModal() {
    const { user, fetchSession } = useAuth();
    const { usage, refreshUsage, isUpgradeModalOpen, closeUpgradeModal, upgradeModalReason } = useDataUsage();
    const { currencySymbol } = useCurrency();

    const billingCycle = 'monthly';
    const [loadingPlanId, setLoadingPlanId] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [successData, setSuccessData] = useState(null);

    if (!isUpgradeModalOpen) return null;

    const freeLimit = usage?.limit && usage.limit > 0 ? usage.limit : 50;
    const freeUsed = usage?.totalUsed ?? 0;

    const getPlanPrice = (plan) => plan.monthlyPrice;
    const getChargeAmount = (plan) => plan.monthlyPrice;

    const handleUpgrade = async (plan) => {
        setErrorMsg('');
        setLoadingPlanId(plan.id);

        try {
            const isLoaded = await loadRazorpayScript();
            if (!isLoaded) {
                setErrorMsg('Failed to load Razorpay payment gateway. Please check your internet connection.');
                setLoadingPlanId(null);
                return;
            }

            const amount = getChargeAmount(plan);

            // 1. Create order on backend
            const orderRes = await apiClient.post(`${API.PAYMENTS}/create-order`, {
                plan: plan.id,
                amount: amount,
                currency: 'INR',
                billingCycle: 'monthly'
            });

            const { orderId, razorpayKeyId } = orderRes.data;

            // 2. Open Razorpay Checkout Modal
            const options = {
                key: razorpayKeyId,
                amount: amount * 100, // paise
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

                        // 4. Refresh session and data usage
                        await fetchSession();
                        if (refreshUsage) refreshUsage();
                        dispatchUsageRefresh();

                        setSuccessData({
                            plan: plan.name,
                            amount: amount,
                            duration: '30 Days'
                        });
                    } catch (verifyErr) {
                        setErrorMsg('Payment verification failed. Please contact support if your account was debited.');
                    } finally {
                        setLoadingPlanId(null);
                    }
                },
                modal: {
                    ondismiss: function () {
                        setLoadingPlanId(null);
                        apiClient.post(`${API.PAYMENTS}/record-status`, {
                            orderId,
                            plan: plan.id,
                            billingCycle: billingCycle,
                            amount,
                            status: 'CANCELLED'
                        }).catch(() => {});
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
            rzp.on('payment.failed', function (resp) {
                setLoadingPlanId(null);
                apiClient.post(`${API.PAYMENTS}/record-status`, {
                    orderId,
                    paymentId: resp.error?.metadata?.payment_id,
                    plan: plan.id,
                    billingCycle: billingCycle,
                    amount,
                    status: 'FAILED'
                }).catch(() => {});

                setErrorMsg(resp.error?.description || 'Payment failed. Please try a different payment method.');
            });

            rzp.open();
        } catch (err) {
            console.error('Upgrade plan initiation error:', err);
            let msg = 'Failed to initiate checkout.';
            if (err.response?.data) {
                msg = typeof err.response.data === 'string' ? err.response.data : JSON.stringify(err.response.data);
            } else if (err.message) {
                msg = err.message;
            }
            setErrorMsg(msg);
            setLoadingPlanId(null);
        }
    };

    return (
        <div className="upm-backdrop" onClick={closeUpgradeModal}>
            <div className="upm-container" onClick={(e) => e.stopPropagation()}>
                
                {/* Close Button */}
                <button
                    type="button"
                    className="upm-close-btn"
                    onClick={closeUpgradeModal}
                    title="Close"
                >
                    <X size={20} />
                </button>

                {/* If payment was just completed */}
                {successData ? (
                    <div className="upm-success-view">
                        <div className="upm-success-circle">
                            <CheckCircle2 size={54} strokeWidth={2.5} />
                        </div>
                        <h2 className="upm-success-title">Plan Upgraded Successfully! 🎉</h2>
                        <p className="upm-success-subtitle">
                            Your <strong>{successData.plan} Plan</strong> is now active for {successData.duration}. The 50 records limit has been completely removed!
                        </p>

                        <div className="upm-success-details-box">
                            <div>
                                <span className="upm-success-label">Active Plan</span>
                                <span className="upm-success-val">{successData.plan}</span>
                            </div>
                            <div className="upm-success-divider" />
                            <div>
                                <span className="upm-success-label">Amount Paid</span>
                                <span className="upm-success-val" style={{ color: '#16a34a' }}>
                                    {currencySymbol}{typeof successData.amount === 'number' ? successData.amount.toFixed(2) : successData.amount}
                                </span>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="upm-success-done-btn"
                            onClick={() => {
                                setSuccessData(null);
                                closeUpgradeModal();
                            }}
                        >
                            Continue to Application
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="upm-header">
                            <div className="upm-notification-badge">
                                <AlertTriangle size={14} className="upm-pulse-icon" />
                                <span>50 Records Max Limit Reached</span>
                            </div>

                            <h2 className="upm-title">Upgrade Your Plan to Continue</h2>
                            <p className="upm-subtitle">
                                {upgradeModalReason || (
                                    <>You have completed <strong>{freeUsed} of {freeLimit} free records</strong>. Upgrade now to unlock higher storage, multi-store support, and full POS capabilities.</>
                                )}
                            </p>
                        </div>

                        {/* Error banner if any */}
                        {errorMsg && (
                            <div className="upm-error-alert">
                                <AlertTriangle size={16} />
                                <span>{errorMsg}</span>
                            </div>
                        )}

                        {/* Plan Cards Grid */}
                        <div className="upm-cards-grid">
                            {UPGRADE_PLANS.map((plan) => {
                                const PlanIcon = plan.icon;
                                const price = getPlanPrice(plan);
                                const charge = getChargeAmount(plan);
                                const isLoading = loadingPlanId === plan.id;

                                return (
                                    <div
                                        key={plan.id}
                                        className={`upm-card ${plan.popular ? 'upm-card--popular' : ''}`}
                                        style={{ '--plan-accent': plan.color }}
                                    >
                                        {plan.popular && (
                                            <div className="upm-popular-ribbon">
                                                <Star size={11} fill="currentColor" /> Most Popular
                                            </div>
                                        )}

                                        <div className="upm-card-top">
                                            <div className="upm-card-icon-wrap" style={{ color: plan.color }}>
                                                <PlanIcon size={20} />
                                            </div>
                                            <div>
                                                <div className="upm-plan-name">{plan.name}</div>
                                                <div className="upm-plan-tagline">{plan.tagline}</div>
                                            </div>
                                        </div>

                                        <div className="upm-pricing-box">
                                            <div className="upm-price-num">
                                                <span className="upm-curr">{currencySymbol}</span>
                                                <span className="upm-val">{price.toLocaleString()}</span>
                                                <span className="upm-per">/month</span>
                                            </div>
                                            <div className="upm-billed-note">Billed on monthly cycle</div>
                                        </div>

                                        <div className="upm-feat-divider" />

                                        <div className="upm-feat-label">What's included:</div>
                                        <ul className="upm-feat-list">
                                            {plan.features.map((feat, i) => (
                                                <li key={i}>
                                                    <span className="upm-feat-chk">
                                                        <Check size={11} strokeWidth={3} />
                                                    </span>
                                                    <span>{feat}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <button
                                            type="button"
                                            className={`upm-cta-btn ${plan.popular ? 'upm-cta-btn--primary' : 'upm-cta-btn--secondary'}`}
                                            disabled={loadingPlanId !== null}
                                            onClick={() => handleUpgrade(plan)}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <RefreshCw size={15} className="upm-spin" />
                                                    <span>Connecting...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>Upgrade to {plan.name}</span>
                                                    <ArrowRight size={15} />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Footer Info */}
                        <div className="upm-footer">
                            <div className="upm-trust-item">
                                <Shield size={14} color="#16a34a" />
                                <span>256-Bit SSL Encrypted</span>
                            </div>
                            <div className="upm-trust-item">
                                <Clock size={14} color="#ea580c" />
                                <span>Instant Limit Removal</span>
                            </div>
                            <div className="upm-trust-item">
                                <Sparkles size={14} color="#6366f1" />
                                <span>Upgrade Anytime</span>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
