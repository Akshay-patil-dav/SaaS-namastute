import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, ShieldCheck, Truck, RotateCcw, Minus, Plus, ShoppingCart, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { useCartStore } from '../../../store/cartStore';
import './ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const addToCart = useCartStore(state => state.addToCart);
    
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        axios.get(`http://localhost:3000/api/products/${id}`)
            .then(response => {
                setProduct(response.data);
                setLoading(false);
                window.scrollTo(0, 0);
            })
            .catch(err => {
                console.error("Error fetching product:", err);
                setLoading(false);
            });
    }, [id]);

    const handleQuantityChange = (type) => {
        if (type === 'dec' && quantity > 1) {
            setQuantity(quantity - 1);
        } else if (type === 'inc' && quantity < 10) {
            setQuantity(quantity + 1);
        }
    };

    const handleAddToCart = () => {
        addToCart(product, quantity);
        // Optional feedback here
    };

    if (loading) {
        return (
            <div className="product-details-loading">
                <div className="spinner"></div>
                <p>Loading product...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="product-not-found">
                <h2>Product Not Found</h2>
                <p>The product you are looking for does not exist.</p>
                <button className="btn-primary" onClick={() => navigate('/shop')}>
                    Return to Shop
                </button>
            </div>
        );
    }

    const images = product.images ? product.images.split(',') : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'];
    const mainImage = images[0];

    return (
        <div className="product-details-page">
            <div className="product-details-container">
                <div className="breadcrumb">
                    <Link to="/"><ArrowLeft size={16}/> Back</Link> / 
                    <Link to="/shop">Shop</Link> / 
                    <span>{product.name}</span>
                </div>

                <div className="product-main-section">
                    <div className="product-gallery">
                        <div className="main-image-wrapper">
                            <img src={mainImage} alt={product.name} className="main-image" />
                        </div>
                        {/* Thumbnails if available */}
                        {images.length > 1 && (
                            <div className="thumbnail-list">
                                {images.map((img, idx) => (
                                    <div key={idx} className={`thumbnail ${idx === 0 ? 'active' : ''}`}>
                                        <img src={img} alt={`Thumbnail ${idx + 1}`} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="product-info-section">
                        <span className="product-category-badge">{product.category}</span>
                        <h1 className="product-title">{product.name}</h1>
                        
                        <div className="product-rating-row">
                            <div className="stars">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star 
                                        key={star} 
                                        size={18} 
                                        className={`star-icon ${star <= Math.round(product.rating) ? 'filled' : ''}`} 
                                    />
                                ))}
                            </div>
                            <span className="rating-value">{product.rating || 0} Rating</span>
                            <span className="review-count">({product.reviews || 0} Reviews)</span>
                        </div>

                        <div className="product-price-large">
                            ${(product.price || 0).toFixed(2)}
                        </div>

                        <p className="product-description">
                            {product.description}
                        </p>

                        <div className="product-actions-box">
                            <div className="quantity-selector">
                                <label>Quantity</label>
                                <div className="qty-controls">
                                    <button onClick={() => handleQuantityChange('dec')}><Minus size={16}/></button>
                                    <span>{quantity}</span>
                                    <button onClick={() => handleQuantityChange('inc')}><Plus size={16}/></button>
                                </div>
                            </div>

                            <div className="action-buttons">
                                <button className="btn-add-to-cart" onClick={handleAddToCart}>
                                    <ShoppingCart size={20} /> Add to Cart
                                </button>
                                <button className="btn-buy-now" onClick={() => {
                                    handleAddToCart();
                                    navigate('/cart');
                                }}>
                                    Buy Now
                                </button>
                            </div>
                        </div>

                        <div className="product-features-list">
                            <div className="feature-item">
                                <Truck size={20} className="feature-icon-small" />
                                <div>
                                    <strong>Free Shipping</strong>
                                    <p>On orders over $50.00</p>
                                </div>
                            </div>
                            <div className="feature-item">
                                <RotateCcw size={20} className="feature-icon-small" />
                                <div>
                                    <strong>30 Days Return</strong>
                                    <p>Hassle free returns policy</p>
                                </div>
                            </div>
                            <div className="feature-item">
                                <ShieldCheck size={20} className="feature-icon-small" />
                                <div>
                                    <strong>1 Year Warranty</strong>
                                    <p>Full protection on defects</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
