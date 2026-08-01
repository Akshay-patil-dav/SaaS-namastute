import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, User, X } from 'lucide-react';
import { useCartStore } from '../../../store/cartStore';
import './StorefrontLayout.css';

const StorefrontLayout = () => {
    const cartCount = useCartStore(state => state.getCartCount());
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const navigate = useNavigate();

    const handleCartClick = () => {
        navigate('/cart');
    };

    return (
        <div className="storefront-container">
            {/* Navigation Header */}
            <header className="storefront-header">
                <div className="storefront-nav-container">
                    <div className="storefront-logo">
                        <Link to="/">E-Comm<span>Pro</span></Link>
                    </div>

                    <nav className="storefront-desktop-nav">
                        <Link to="/" className="nav-link">Home</Link>
                        <Link to="/shop" className="nav-link">Shop</Link>
                        <Link to="/categories" className="nav-link">Categories</Link>
                        <Link to="/about" className="nav-link">About Us</Link>
                    </nav>

                    <div className="storefront-nav-actions">
                        <button className="icon-btn" aria-label="Search">
                            <Search size={20} />
                        </button>
                        <button className="icon-btn" aria-label="User Account" onClick={() => navigate('/login')}>
                            <User size={20} />
                        </button>
                        <button className="icon-btn cart-btn" aria-label="Shopping Cart" onClick={handleCartClick}>
                            <ShoppingCart size={20} />
                            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                        </button>
                        <button 
                            className="icon-btn mobile-menu-btn" 
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="storefront-mobile-nav">
                        <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                        <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)}>Shop</Link>
                        <Link to="/categories" onClick={() => setIsMobileMenuOpen(false)}>Categories</Link>
                        <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
                    </div>
                )}
            </header>

            {/* Main Content Area */}
            <main className="storefront-main">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="storefront-footer">
                <div className="footer-content">
                    <div className="footer-section brand-section">
                        <h3>E-Comm<span>Pro</span></h3>
                        <p>Experience the best in modern shopping with our premium selection of products.</p>
                    </div>
                    <div className="footer-section">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><Link to="/shop">Shop</Link></li>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                            <li><Link to="/faq">FAQ</Link></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h4>Customer Service</h4>
                        <ul>
                            <li><Link to="/shipping">Shipping Policy</Link></li>
                            <li><Link to="/returns">Returns & Exchanges</Link></li>
                            <li><Link to="/terms">Terms of Service</Link></li>
                            <li><Link to="/privacy">Privacy Policy</Link></li>
                        </ul>
                    </div>
                    <div className="footer-section newsletter">
                        <h4>Subscribe</h4>
                        <p>Get 10% off your first order</p>
                        <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                            <input type="email" placeholder="Enter your email" />
                            <button type="submit">Subscribe</button>
                        </form>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} E-CommPro. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default StorefrontLayout;
