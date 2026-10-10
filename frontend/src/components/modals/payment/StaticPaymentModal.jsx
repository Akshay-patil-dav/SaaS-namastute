import React, { useState } from 'react';
import {
    Shield, Lock, X, CheckCircle2, CreditCard,
    QrCode, Building2, Wallet, ArrowRight, Loader2,
    Sparkles, Smartphone
} from 'lucide-react';
import './StaticPaymentModal.css';

export default function StaticPaymentModal({
    isOpen,
    onClose,
    onSuccess,
    plan,
    billingCycle = 'monthly',
    amount = 0,
    currencySymbol = '₹'
}) {
    const [method, setMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking' | 'wallet'
    const [upiId, setUpiId] = useState('');
    const [selectedBank, setSelectedBank] = useState('HDFC');
    const [cardNumber, setCardNumber] = useState('4532 8921 0048 3920');
    const [cardExpiry, setCardExpiry] = useState('12/28');
    const [cardCvv, setCardCvv] = useState('883');
    const [cardName, setCardName] = useState('Akshay Patil');
    const [status, setStatus] = useState('idle'); // 'idle' | 'processing' | 'success'

    if (!isOpen || !plan) return null;

    const formattedAmount = Number(amount || 0).toLocaleString();

    const handlePay = () => {
        setStatus('processing');
        
        setTimeout(() => {
            setStatus('success');
            setTimeout(() => {
                setStatus('idle');
                onSuccess({
                    planId: plan.id,
                    planName: plan.name,
                    billingCycle,
                    amount,
                    transactionId: `TXN_${Date.now().toString(36).toUpperCase()}`
                });
            }, 1200);
        }, 1500);
    };

    return (
        <div className="spm-overlay">
            <div className="spm-modal">
                
                {/* Header */}
                <div className="spm-header">
                    <div className="spm-brand">
                        <div className="spm-brand-logo">N</div>
                        <div>
                            <div className="spm-merchant-name">Namustutam Cloud POS</div>
                            <div className="spm-plan-desc">{plan.name} Plan · Monthly Subscription</div>
                        </div>
                    </div>
                    
                    <div className="spm-header-right">
                        <div className="spm-amount-tag">
                            <span className="spm-amount-label">AMOUNT TO PAY</span>
                            <span className="spm-amount-val">{currencySymbol}{formattedAmount}</span>
                        </div>
                        {status === 'idle' && (
                            <button className="spm-close-btn" onClick={onClose} aria-label="Close">
                                <X size={18} />
                            </button>
                        )}
                    </div>
                </div>

                {status === 'processing' && (
                    <div className="spm-state-box">
                        <div className="spm-spinner-wrap">
                            <Loader2 size={48} className="spm-spin" />
                        </div>
                        <h3>Processing Payment</h3>
                        <p>Communicating securely with gateway...</p>
                        <div className="spm-sec-badge">
                            <Lock size={13} /> 256-Bit Encrypted Transaction
                        </div>
                    </div>
                )}

                {status === 'success' && (
                    <div className="spm-state-box spm-state-box--success">
                        <div className="spm-success-icon">
                            <CheckCircle2 size={54} />
                        </div>
                        <h3>Payment Successful!</h3>
                        <p>Your {plan.name} subscription has been activated.</p>
                        <div className="spm-txn-id">Transaction Ref: TXN_{Date.now().toString(36).toUpperCase()}</div>
                    </div>
                )}

                {status === 'idle' && (
                    <div className="spm-body">
                        {/* Sidebar Tabs */}
                        <div className="spm-tabs">
                            <button
                                className={`spm-tab ${method === 'upi' ? 'active' : ''}`}
                                onClick={() => setMethod('upi')}
                            >
                                <QrCode size={18} />
                                <span>UPI &amp; QR Code</span>
                            </button>

                            <button
                                className={`spm-tab ${method === 'card' ? 'active' : ''}`}
                                onClick={() => setMethod('card')}
                            >
                                <CreditCard size={18} />
                                <span>Cards (Credit/Debit)</span>
                            </button>

                            <button
                                className={`spm-tab ${method === 'netbanking' ? 'active' : ''}`}
                                onClick={() => setMethod('netbanking')}
                            >
                                <Building2 size={18} />
                                <span>Net Banking</span>
                            </button>

                            <button
                                className={`spm-tab ${method === 'wallet' ? 'active' : ''}`}
                                onClick={() => setMethod('wallet')}
                            >
                                <Wallet size={18} />
                                <span>Wallets / PayLater</span>
                            </button>
                        </div>

                        {/* Method Content */}
                        <div className="spm-content">
                            {method === 'upi' && (
                                <div className="spm-upi-pane">
                                    <div className="spm-qr-box">
                                        <div className="spm-qr-code">
                                            {/* Static Mock SVG QR Code */}
                                            <svg viewBox="0 0 100 100" width="130" height="130">
                                                <rect width="100" height="100" fill="#ffffff" />
                                                {/* Corner 1 */}
                                                <rect x="10" y="10" width="24" height="24" fill="#0f172a" />
                                                <rect x="14" y="14" width="16" height="16" fill="#ffffff" />
                                                <rect x="18" y="18" width="8" height="8" fill="#0f172a" />
                                                {/* Corner 2 */}
                                                <rect x="66" y="10" width="24" height="24" fill="#0f172a" />
                                                <rect x="70" y="14" width="16" height="16" fill="#ffffff" />
                                                <rect x="74" y="18" width="8" height="8" fill="#0f172a" />
                                                {/* Corner 3 */}
                                                <rect x="10" y="66" width="24" height="24" fill="#0f172a" />
                                                <rect x="14" y="70" width="16" height="16" fill="#ffffff" />
                                                <rect x="18" y="74" width="8" height="8" fill="#0f172a" />
                                                {/* Pattern mock dots */}
                                                <rect x="42" y="12" width="6" height="6" fill="#ea580c" />
                                                <rect x="52" y="12" width="6" height="6" fill="#0f172a" />
                                                <rect x="42" y="24" width="16" height="6" fill="#0f172a" />
                                                <rect x="40" y="40" width="20" height="20" fill="#ea580c" rx="4" />
                                                <rect x="12" y="44" width="18" height="6" fill="#0f172a" />
                                                <rect x="70" y="44" width="18" height="6" fill="#0f172a" />
                                                <rect x="44" y="70" width="8" height="18" fill="#0f172a" />
                                                <rect x="60" y="70" width="18" height="6" fill="#0f172a" />
                                                <rect x="70" y="82" width="18" height="8" fill="#ea580c" />
                                            </svg>
                                        </div>
                                        <div className="spm-qr-info">
                                            <div className="spm-qr-title">Scan QR with any UPI App</div>
                                            <div className="spm-upi-icons">
                                                <span className="spm-pill-tag">Google Pay</span>
                                                <span className="spm-pill-tag">PhonePe</span>
                                                <span className="spm-pill-tag">Paytm</span>
                                                <span className="spm-pill-tag">BHIM</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="spm-or-divider">
                                        <span>OR ENTER UPI ID</span>
                                    </div>

                                    <div className="spm-input-group">
                                        <input
                                            type="text"
                                            className="spm-input"
                                            placeholder="mobileNumber@upi or username@okhdfcbank"
                                            value={upiId}
                                            onChange={(e) => setUpiId(e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}

                            {method === 'card' && (
                                <div className="spm-card-pane">
                                    <div className="spm-input-group">
                                        <label>Card Number</label>
                                        <div className="spm-input-with-icon">
                                            <CreditCard size={18} />
                                            <input
                                                type="text"
                                                className="spm-input"
                                                value={cardNumber}
                                                onChange={(e) => setCardNumber(e.target.value)}
                                                placeholder="4532 •••• •••• ••••"
                                            />
                                        </div>
                                    </div>

                                    <div className="spm-row">
                                        <div className="spm-input-group">
                                            <label>Expiry Date</label>
                                            <input
                                                type="text"
                                                className="spm-input"
                                                value={cardExpiry}
                                                onChange={(e) => setCardExpiry(e.target.value)}
                                                placeholder="MM/YY"
                                            />
                                        </div>
                                        <div className="spm-input-group">
                                            <label>CVV / CVC</label>
                                            <input
                                                type="password"
                                                className="spm-input"
                                                maxLength={4}
                                                value={cardCvv}
                                                onChange={(e) => setCardCvv(e.target.value)}
                                                placeholder="•••"
                                            />
                                        </div>
                                    </div>

                                    <div className="spm-input-group">
                                        <label>Name on Card</label>
                                        <input
                                            type="text"
                                            className="spm-input"
                                            value={cardName}
                                            onChange={(e) => setCardName(e.target.value)}
                                            placeholder="Cardholder name"
                                        />
                                    </div>
                                </div>
                            )}

                            {method === 'netbanking' && (
                                <div className="spm-netbanking-pane">
                                    <div className="spm-section-label">Popular Banks</div>
                                    <div className="spm-banks-grid">
                                        {['HDFC', 'SBI', 'ICICI', 'Axis', 'Kotak', 'PNB'].map(bank => (
                                            <button
                                                key={bank}
                                                type="button"
                                                className={`spm-bank-card ${selectedBank === bank ? 'active' : ''}`}
                                                onClick={() => setSelectedBank(bank)}
                                            >
                                                <Building2 size={18} />
                                                <span>{bank} Bank</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {method === 'wallet' && (
                                <div className="spm-wallet-pane">
                                    <div className="spm-section-label">Select Wallet</div>
                                    <div className="spm-banks-grid">
                                        {['Paytm Wallet', 'Amazon Pay', 'Mobikwik', 'Freecharge'].map(w => (
                                            <button
                                                key={w}
                                                type="button"
                                                className={`spm-bank-card ${selectedBank === w ? 'active' : ''}`}
                                                onClick={() => setSelectedBank(w)}
                                            >
                                                <Wallet size={18} />
                                                <span>{w}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Pay Action CTA */}
                            <div className="spm-footer">
                                <button className="spm-pay-btn" onClick={handlePay}>
                                    <Shield size={16} />
                                    <span>Pay {currencySymbol}{formattedAmount}</span>
                                    <ArrowRight size={16} />
                                </button>
                                <div className="spm-sec-note">
                                    <Lock size={12} /> Encrypted &amp; Secure Checkout Demo
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
