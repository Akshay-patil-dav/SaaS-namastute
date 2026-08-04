import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Star, ShoppingBag, ShieldCheck, Zap, Loader } from 'lucide-react';
import apiClient, { ENV } from '@/api/config';
import { useCartStore } from '../../../store/cartStore';
import './Home.css';
import { useCurrency } from '../../../hooks/useCurrency';


const Home = () => {
    const { currencySymbol } = useCurrency();

    const navigate = useNavigate();
    const addToCart = useCartStore(state => state.addToCart);
    const [trendingProducts, setTrendingProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await apiClient.get(`${ENV.API_BASE_URL}/products`);
                if (res.data && Array.isArray(res.data)) {
                    // For trending, we can take the highest rated or just top 3
                    const sorted = res.data.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                    setTrendingProducts(sorted.slice(0, 3));
                }
            } catch (err) {
                console.error("Error fetching products:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleAddToCart = (e, product) => {
        e.preventDefault(); // Prevent navigating to product details
        addToCart(product, 1);
    };

    return (
        <div className="storefront-home">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <div className="hero-text-block">
                        <span className="hero-badge">New Collection 2026</span>
                        <h1 className="hero-title">
                            Discover the Future of <br />
                            <span className="text-gradient">Premium Tech</span>
                        </h1>
                        <p className="hero-subtitle">
                            Elevate your everyday with our curated selection of high-end electronics and accessories. Designed for the modern lifestyle.
                        </p>
                        <div className="hero-actions">
                            <button className="btn-primary" onClick={() => navigate('/shop')}>
                                Shop Now <ArrowRight size={20} />
                            </button>
                            <button className="btn-secondary" onClick={() => navigate('/shop')}>
                                Explore Products
                            </button>
                        </div>
                    </div>
                    <div className="hero-image-wrapper">
                        <div className="hero-image-glow"></div>
                        <img src="/images/hero.png" alt="Premium Tech" className="hero-image" />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon"><Zap size={24} /></div>
                        <h3>Lightning Fast Delivery</h3>
                        <p>Get your products delivered within 24 hours.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon"><ShieldCheck size={24} /></div>
                        <h3>Secure Payments</h3>
                        <p>Your transactions are fully encrypted and safe.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon"><Star size={24} /></div>
                        <h3>Premium Quality</h3>
                        <p>We source only the best materials and components.</p>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="featured-products-section">
                <div className="section-header">
                    <h2>Trending Now</h2>
                    <Link to="/shop" className="view-all-link">View All Products <ArrowRight size={16}/></Link>
                </div>
                
                {loading ? (
                    <div className="home-loading-state">
                        <Loader size={48} className="spin-icon" />
                        <p>Loading trending products...</p>
                    </div>
                ) : (
                    <div className="product-grid">
                        {trendingProducts.map((product) => {
                            let imageUrl = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80';
                            if (product.images && Array.isArray(product.images) && product.images.length > 0) {
                                imageUrl = product.images[0].url;
                            } else if (typeof product.images === 'string') {
                                imageUrl = product.images.split(',')[0];
                            }

                            return (
                                <Link to={`/shop/product/${product.id}`} className="product-card" key={product.id}>
                                    <div className="product-image-container">
                                        <img src={imageUrl} alt={product.name} className="product-image" />
                                        <div className="product-overlay-gradient"></div>
                                        <button 
                                            className="add-to-cart-quick"
                                            onClick={(e) => handleAddToCart(e, product)}
                                            aria-label="Add to cart"
                                        >
                                            <ShoppingBag size={20} />
                                        </button>
                                    </div>
                                    <div className="product-info">
                                        <span className="product-category">{product.category || 'General'}</span>
                                        <h3 className="product-name">{product.name}</h3>
                                        <div className="product-meta">
                                            <div className="product-rating">
                                                <Star size={14} className="star-icon filled" />
                                                <span>{product.rating || 5.0}</span>
                                                <span className="review-count">({product.reviews || 0})</span>
                                            </div>
                                            <span className="product-price">{currencySymbol}{(product.price || 0).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
