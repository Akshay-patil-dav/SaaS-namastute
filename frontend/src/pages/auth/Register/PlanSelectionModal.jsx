import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useCurrency } from '../../../hooks/useCurrency';
import { Check, Star, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import StaticPaymentModal from '../../../components/modals/payment/StaticPaymentModal';
import './Modal.css';

const PLANS = [
    {
        id: 'STARTER',
        name: 'Starter',
        monthlyPrice: 499,
        tagline: 'Essential tools for single-store retailers.',
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
        monthlyPrice: 999,
        popular: true,
        tagline: 'Advanced automation for growing businesses.',
        color: '#ea580c',
        features: [
            'Up to 3 Store Locations',
            'Unlimited Products',
            'POS & Online Order Management',
            'Advanced Analytics & Reports',
            'Barcode & QR Code Printing',
            'Multi-role Access (Staff/Admin)',
            'Priority Support'
        ]
    },
    {
        id: 'PREMIUM',
        name: 'Premium',
        monthlyPrice: 1999,
        tagline: 'Complete control for multi-store chains.',
        color: '#0284c7',
        features: [
            'Unlimited Locations',
            'Unlimited Products',
            'All Channels & API Access',
            'Custom Analytics & Exports',
            'Dedicated Account Manager',
            'White-label Option',
            '99.9% Uptime SLA'
        ]
    }
];

export default function PlanSelectionModal({ onComplete }) {
    const { currencySymbol } = useCurrency();
    const { updatePlanContext } = useAuth();

    const billingCycle = 'monthly';
    const [selectedPlanForPayment, setSelectedPlanForPayment] = useState(null);

    const handleSelectPlan = (plan) => {
        setSelectedPlanForPayment(plan);
    };

    const handlePaymentSuccess = ({ planId }) => {
        const days = 30;
        const newEndDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
        updatePlanContext(planId, newEndDate);
        setSelectedPlanForPayment(null);
        if (onComplete) onComplete();
    };

    const getPlanPrice = (plan) => plan.monthlyPrice;
    const getTotalAmount = (plan) => plan.monthlyPrice;

    return (
        <>
            <div className="modal-overlay">
                <div className="modal-content plan-modal" style={{ maxWidth: '980px', background: '#ffffff', color: '#0f172a', border: '1px solid #e2e8f0', padding: '32px 28px' }}>
                    
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: '#fff7ed',
                            border: '1px solid #fed7aa',
                            color: '#ea580c',
                            padding: '4px 14px',
                            borderRadius: '99px',
                            fontSize: '12px',
                            fontWeight: '700',
                            marginBottom: '10px'
                        }}>
                            <Sparkles size={13} /> Select Your Plan
                        </div>
                        <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px' }}>Choose the Plan that Fits Your Business</h2>
                        <p style={{ color: '#64748b', fontSize: '14px', margin: '0' }}>Activate instantly with mock gateway checkout. Switch or upgrade anytime.</p>
                    </div>

                    {/* Plan Cards Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                        gap: '20px',
                        marginBottom: '24px',
                        alignItems: 'stretch'
                    }}>
                        {PLANS.map((plan) => {
                            const price = getPlanPrice(plan);
                            const totalAmount = getTotalAmount(plan);

                            return (
                                <div
                                    key={plan.id}
                                    style={{
                                        background: '#ffffff',
                                        border: plan.popular ? '2px solid #ea580c' : '1.5px solid #e2e8f0',
                                        borderRadius: '16px',
                                        padding: '24px 20px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        position: 'relative',
                                        boxShadow: plan.popular ? '0 10px 25px -4px rgba(234, 88, 12, 0.15)' : '0 2px 10px rgba(0, 0, 0, 0.03)',
                                        textAlign: 'left'
                                    }}
                                >
                                    {plan.popular && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '-12px',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            background: 'linear-gradient(135deg, #ff822d, #ea580c)',
                                            color: '#ffffff',
                                            fontSize: '11px',
                                            fontWeight: '800',
                                            padding: '3px 14px',
                                            borderRadius: '99px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            boxShadow: '0 4px 10px rgba(234, 88, 12, 0.35)',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}>
                                            <Star size={11} fill="currentColor" /> Most Popular
                                        </div>
                                    )}

                                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>
                                        {plan.name}
                                    </div>
                                    <div style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '14px', minHeight: '36px' }}>
                                        {plan.tagline}
                                    </div>

                                    {/* Price */}
                                    <div style={{
                                        background: '#f8fafc',
                                        border: '1px solid #f1f5f9',
                                        borderRadius: '10px',
                                        padding: '12px 14px',
                                        marginBottom: '16px'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                                            <span style={{ fontSize: '18px', fontWeight: '700', color: '#64748b' }}>{currencySymbol}</span>
                                            <span style={{ fontSize: '32px', fontWeight: '900', color: '#0f172a', lineHeight: '1' }}>{price.toLocaleString()}</span>
                                            <span style={{ fontSize: '13px', color: '#64748b', marginLeft: '4px' }}>/mo</span>
                                        </div>
                                        <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: '600', marginTop: '4px' }}>
                                            Billed on monthly cycle
                                        </div>
                                    </div>

                                    {/* Features */}
                                    <div style={{ fontSize: '11.5px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '10px' }}>
                                        What's included:
                                    </div>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: '9px', flex: 1 }}>
                                        {plan.features.map((feat, idx) => (
                                            <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#334155' }}>
                                                <span style={{
                                                    width: '16px',
                                                    height: '16px',
                                                    borderRadius: '50%',
                                                    background: '#dcfce7',
                                                    color: '#16a34a',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexShrink: 0
                                                }}>
                                                    <Check size={11} strokeWidth={3} />
                                                </span>
                                                <span>{feat}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Action Button */}
                                    <button
                                        type="button"
                                        onClick={() => handleSelectPlan(plan)}
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            borderRadius: '10px',
                                            fontSize: '13.5px',
                                            fontWeight: '700',
                                            border: plan.popular ? 'none' : '1.5px solid #cbd5e1',
                                            background: plan.popular ? 'linear-gradient(135deg, #ff822d 0%, #ea580c 100%)' : '#ffffff',
                                            color: plan.popular ? '#ffffff' : '#0f172a',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '6px',
                                            boxShadow: plan.popular ? '0 4px 14px rgba(234, 88, 12, 0.3)' : 'none',
                                            transition: 'all 0.18s'
                                        }}
                                    >
                                        <span>Select {plan.name}</span>
                                        <ArrowRight size={14} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer skip */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: '#64748b' }}>
                            <ShieldCheck size={16} color="#16a34a" /> 100% Mock Safe Checkout Demo
                        </div>
                        <button
                            type="button"
                            onClick={() => onComplete && onComplete()}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#64748b',
                                fontSize: '13px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                textDecoration: 'underline'
                            }}
                        >
                            Skip for now →
                        </button>
                    </div>
                </div>
            </div>

            {/* Static Payment Modal Gateway */}
            <StaticPaymentModal
                isOpen={!!selectedPlanForPayment}
                onClose={() => setSelectedPlanForPayment(null)}
                onSuccess={handlePaymentSuccess}
                plan={selectedPlanForPayment}
                billingCycle={billingCycle}
                amount={selectedPlanForPayment ? getTotalAmount(selectedPlanForPayment) : 0}
                currencySymbol={currencySymbol}
            />
        </>
    );
}

