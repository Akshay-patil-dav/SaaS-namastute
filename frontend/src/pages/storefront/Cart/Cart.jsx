import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../../store/cartStore';
import './Cart.css';

const Cart = () => {
    const navigate = useNavigate();
    const cart = useCartStore(state => state.cart);
    const updateQuantity = useCartStore(state => state.updateQuantity);
    const removeFromCart = useCartStore(state => state.removeFromCart);
    const getCartTotal = useCartStore(state => state.getCartTotal);
    const getCartCount = useCartStore(state => state.getCartCount);

    const subtotal = getCartTotal();
    const shipping = subtotal > 50 ? 0 : 15.00;
    const tax = subtotal * 0.08; // 8% mock tax
    const total = subtotal + shipping + tax;

    if (cart.length === 0) {
        return (
            <div className="empty-cart-container">
                <ShoppingBag size={64} className="empty-cart-icon" />
                <h2>Your cart is empty</h2>
                <p>Looks like you haven't added anything to your cart yet.</p>
                <button className="btn-primary" onClick={() => navigate('/shop')}>
                    Start Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="storefront-cart-page">
            <div className="cart-header">
                <h1>Shopping Cart</h1>
                <p>{getCartCount()} items in your cart</p>
            </div>

            <div className="cart-layout">
                <div className="cart-items-section">
                    <div className="cart-items-list">
                        {cart.map((item) => (
                            <div className="cart-item" key={item.id}>
                                <div className="cart-item-image">
                                    <img src={item.image} alt={item.name} />
                                </div>
                                <div className="cart-item-details">
                                    <Link to={`/shop/product/${item.id}`} className="cart-item-name">
                                        {item.name}
                                    </Link>
                                    <span className="cart-item-category">{item.category}</span>
                                    <div className="cart-item-actions-mobile">
                                        <div className="cart-qty-controls">
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={14}/></button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={14}/></button>
                                        </div>
                                        <button className="cart-item-remove" onClick={() => removeFromCart(item.id)}>
                                            <Trash2 size={16} /> Remove
                                        </button>
                                    </div>
                                </div>
                                <div className="cart-item-price-section">
                                    <span className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                                    <span className="cart-item-unit-price">${item.price.toFixed(2)} each</span>
                                </div>
                                <div className="cart-item-actions-desktop">
                                    <div className="cart-qty-controls">
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={14}/></button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={14}/></button>
                                    </div>
                                    <button className="cart-item-remove-icon" onClick={() => removeFromCart(item.id)} aria-label="Remove item">
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="cart-summary-section">
                    <div className="cart-summary-card">
                        <h3>Order Summary</h3>
                        
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                        </div>
                        
                        <div className="summary-row">
                            <span>Estimated Tax</span>
                            <span>${tax.toFixed(2)}</span>
                        </div>
                        
                        <div className="summary-divider"></div>
                        
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        
                        <button className="btn-checkout" onClick={() => navigate('/checkout')}>
                            Proceed to Checkout <ArrowRight size={20} />
                        </button>
                        
                        <div className="continue-shopping">
                            <Link to="/shop">Continue Shopping</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
