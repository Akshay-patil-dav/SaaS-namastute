import React, { useState } from 'react';
import { useCurrency } from '../../../hooks/useCurrency';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, Truck, CheckCircle } from 'lucide-react';
import { useCartStore } from '../../../store/cartStore';
import './Checkout.css';

const Checkout = () => {
    const { currencySymbol } = useCurrency();

    const navigate = useNavigate();
    const cart = useCartStore(state => state.cart);
    const clearCart = useCartStore(state => state.clearCart);
    const getCartTotal = useCartStore(state => state.getCartTotal);

    const [isSubmitted, setIsSubmitted] = useState(false);
    
    const subtotal = getCartTotal();
    const shipping = subtotal > 50 ? 0 : 15.00;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mock order submission
        setIsSubmitted(true);
        clearCart();
    };

    if (isSubmitted) {
        return (
            <div className="checkout-success">
                <CheckCircle size={80} className="success-icon" />
                <h2>Order Confirmed!</h2>
                <p>Thank you for your purchase. Your order number is #{Math.floor(Math.random() * 1000000)}.</p>
                <p>We have sent an order confirmation to your email.</p>
                <button className="btn-primary" onClick={() => navigate('/')}>
                    Return Home
                </button>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="checkout-empty">
                <h2>Your cart is empty</h2>
                <button className="btn-primary" onClick={() => navigate('/shop')}>
                    Return to Shop
                </button>
            </div>
        );
    }

    return (
        <div className="storefront-checkout-page">
            <div className="checkout-header">
                <h1>Checkout</h1>
                <p>Complete your order securely.</p>
            </div>

            <div className="checkout-layout">
                <div className="checkout-form-section">
                    <form onSubmit={handleSubmit} className="checkout-form">
                        
                        {/* Shipping Details */}
                        <div className="form-section">
                            <h2><Truck size={20} /> Shipping Information</h2>
                            <div className="form-grid">
                                <div className="form-group half">
                                    <label>First Name</label>
                                    <input type="text" required placeholder="John" />
                                </div>
                                <div className="form-group half">
                                    <label>Last Name</label>
                                    <input type="text" required placeholder="Doe" />
                                </div>
                                <div className="form-group full">
                                    <label>Email Address</label>
                                    <input type="email" required placeholder="john@example.com" />
                                </div>
                                <div className="form-group full">
                                    <label>Street Address</label>
                                    <input type="text" required placeholder="123 Main St" />
                                </div>
                                <div className="form-group half">
                                    <label>City</label>
                                    <input type="text" required placeholder="New York" />
                                </div>
                                <div className="form-group half">
                                    <label>Zip Code</label>
                                    <input type="text" required placeholder="10001" />
                                </div>
                            </div>
                        </div>

                        {/* Payment Details (Mock) */}
                        <div className="form-section">
                            <h2><CreditCard size={20} /> Payment Details</h2>
                            <div className="form-grid">
                                <div className="form-group full">
                                    <label>Card Number</label>
                                    <input type="text" required placeholder="**** **** **** ****" maxLength="19" />
                                </div>
                                <div className="form-group full">
                                    <label>Name on Card</label>
                                    <input type="text" required placeholder="John Doe" />
                                </div>
                                <div className="form-group half">
                                    <label>Expiry Date</label>
                                    <input type="text" required placeholder="MM/YY" maxLength="5" />
                                </div>
                                <div className="form-group half">
                                    <label>CVV</label>
                                    <input type="text" required placeholder="123" maxLength="4" />
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="btn-place-order">
                            Place Order ({currencySymbol}{total.toFixed(2)})
                        </button>
                    </form>
                </div>

                <div className="checkout-summary-section">
                    <div className="checkout-summary-card">
                        <h3>Order Summary</h3>
                        
                        <div className="checkout-items">
                            {cart.map(item => (
                                <div className="checkout-item" key={item.id}>
                                    <div className="checkout-item-image">
                                        <img src={item.image} alt={item.name} />
                                        <span className="checkout-item-qty">{item.quantity}</span>
                                    </div>
                                    <div className="checkout-item-info">
                                        <span className="checkout-item-name">{item.name}</span>
                                        <span className="checkout-item-price">{currencySymbol}{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="summary-divider"></div>
                        
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>{currencySymbol}{subtotal.toFixed(2)}</span>
                        </div>
                        
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                        </div>
                        
                        <div className="summary-row">
                            <span>Estimated Tax</span>
                            <span>{currencySymbol}{tax.toFixed(2)}</span>
                        </div>
                        
                        <div className="summary-divider"></div>
                        
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>{currencySymbol}{total.toFixed(2)}</span>
                        </div>
                        
                        <Link to="/cart" className="return-to-cart">Return to Cart</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
