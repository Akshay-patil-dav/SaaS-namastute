import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import apiClient from '../../../api/config';
import './Modal.css';

export default function PlanSelectionModal({ onComplete }) {
    const { updatePlanContext } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSelectPlan = async (plan) => {
        setLoading(true);
        setError('');
        try {
            await apiClient.put('/api/users/current/plan', { plan });
            updatePlanContext(plan);
            onComplete();
        } catch (_err) {
            setError(`Failed to select ${plan} plan`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content plan-modal">
                <h2 style={{ marginBottom: '16px' }}>Choose Your Plan</h2>
                <p style={{ marginBottom: '40px' }}>Select the plan that fits your business needs.</p>

                {error && <div className="modal-error">{error}</div>}
                
                {loading && <div style={{ marginBottom: '20px', color: '#ff6b00' }}>Processing...</div>}

                <div className="plan-grid">
                    {/* Starter Plan */}
                    <div className="plan-card">
                        <div className="plan-name">Starter</div>
                        <div className="plan-price">₹499<span>/mo</span></div>
                        <p className="plan-desc">Essential features for single-store retailers.</p>
                        
                        <ul className="plan-features">
                            <li><span className="feature-check">✓</span> 1 Store Location</li>
                            <li><span className="feature-check">✓</span> Up to 1,000 Products</li>
                            <li><span className="feature-check">✓</span> POS Billing & Basic Inventory</li>
                            <li><span className="feature-check">✓</span> Basic Sales Analytics</li>
                            <li><span className="feature-check">✓</span> WhatsApp & Email Support</li>
                            <li><span className="feature-cross">−</span> Barcode Printing</li>
                            <li><span className="feature-cross">−</span> Multi-role Access</li>
                        </ul>
                        
                        <button 
                            className="btn-plan"
                            onClick={() => handleSelectPlan('STARTER')}
                            disabled={loading}
                        >
                            Start Free Trial
                        </button>
                    </div>

                    {/* Growth Plan */}
                    <div className="plan-card popular">
                        <div className="popular-badge">Most Popular</div>
                        <div className="plan-name">Growth</div>
                        <div className="plan-price">₹999<span>/mo</span></div>
                        <p className="plan-desc">Advanced tools for growing businesses.</p>
                        
                        <ul className="plan-features">
                            <li><span className="feature-check">✓</span> Up to 3 Store Locations</li>
                            <li><span className="feature-check">✓</span> Unlimited Products</li>
                            <li><span className="feature-check">✓</span> POS & Online Order Management</li>
                            <li><span className="feature-check">✓</span> Advanced Analytics & Reports</li>
                            <li><span className="feature-check">✓</span> Barcode & QR Code Printing</li>
                            <li><span className="feature-check">✓</span> Multi-role Access (Admin/Staff)</li>
                            <li><span className="feature-check">✓</span> Priority Chat Support</li>
                        </ul>
                        
                        <button 
                            className="btn-plan primary"
                            onClick={() => handleSelectPlan('GROWTH')}
                            disabled={loading}
                        >
                            Get Started
                        </button>
                    </div>

                    {/* Premium Plan */}
                    <div className="plan-card">
                        <div className="plan-name">Premium</div>
                        <div className="plan-price">₹1,999<span>/mo</span></div>
                        <p className="plan-desc">Complete control for multi-store chains.</p>
                        
                        <ul className="plan-features">
                            <li><span className="feature-check">✓</span> Unlimited Locations</li>
                            <li><span className="feature-check">✓</span> Unlimited Products</li>
                            <li><span className="feature-check">✓</span> All Order Channels & API Access</li>
                            <li><span className="feature-check">✓</span> Custom Analytics & Exports</li>
                            <li><span className="feature-check">✓</span> Dedicated Account Manager</li>
                            <li><span className="feature-check">✓</span> White-label Option</li>
                            <li><span className="feature-check">✓</span> 99.9% Uptime SLA</li>
                        </ul>
                        
                        <button 
                            className="btn-plan"
                            onClick={() => handleSelectPlan('PREMIUM')}
                            disabled={loading}
                        >
                            Contact Sales
                        </button>
                    </div>
                </div>

                <div style={{ marginTop: '20px' }}>
                    <span 
                        className="skip-link" 
                        onClick={() => handleSelectPlan('NONE')}
                    >
                        Skip for now
                    </span>
                </div>
            </div>
        </div>
    );
}
