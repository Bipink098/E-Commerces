import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Star, Shield, Truck, RotateCcw, Minus, Plus, Share2, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { Rating } from '../components/product/ProductCard';
import ProductCard from '../components/product/ProductCard';
import Breadcrumb from '../components/ui/Breadcrumb';
import OrderTimeline from '../components/product/OrderTimeline';
import { getProductById, getRelatedProducts, testimonials } from '../data/products';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = getProductById(id);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || '');
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [addedToCart, setAddedToCart] = useState(false);

  if (!product) {
    return (
      <div className="page-wrapper">
        <div className="empty-state" style={{ minHeight: '60vh' }}>
          <div className="empty-state-icon">😕</div>
          <h1 className="empty-state-title">Product Not Found</h1>
          <p className="empty-state-subtitle">The product you're looking for doesn't exist or has been removed.</p>
          <Link to="/shop" className="btn btn-primary">Back to Shop</Link>
        </div>
      </div>
    );
  }

  const related = getRelatedProducts(product, 4);
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedColor, selectedSize, quantity);
    setAddedToCart(true);
    toast.success(`${product.name.substring(0, 30)}... added to cart!`);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedColor, selectedSize, quantity);
    navigate('/checkout');
  };

  const handleWishlist = () => {
    toggleWishlist(product);
    toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist! ❤️');
  };

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'specifications', label: 'Specifications' },
    { id: 'reviews', label: `Reviews (${product.reviews})` },
    { id: 'shipping', label: 'Shipping & Returns' },
  ];

  return (
    <div className="page-wrapper">
      <div className="container">
        <Breadcrumb items={[
          { label: 'Shop', to: '/shop' },
          { label: product.category.replace('-', ' & '), to: `/category/${product.category}` },
          { label: product.name },
        ]} />

        {/* Main Product Layout */}
        <div className="product-details-layout">
          {/* Gallery */}
          <motion.div
            className="product-gallery"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-xl)', background: 'var(--color-bg-secondary)' }}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={product.images[selectedImage]}
                  alt={`${product.name} - Image ${selectedImage + 1}`}
                  className="product-main-image"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>

              {/* Badges overlay */}
              <div style={{ position: 'absolute', top: 16, left: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {product.bestseller && <span className="badge badge-primary">Bestseller</span>}
                {product.newArrival && <span className="badge badge-success">New Arrival</span>}
                {product.discount > 0 && <span className="badge badge-accent">-{product.discount}% Off</span>}
              </div>
            </div>

            <div className="product-thumbnails" role="list" aria-label="Product images">
              {product.images.map((img, i) => (
                <motion.button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`View image ${i + 1}`}
                  aria-pressed={selectedImage === i}
                  role="listitem"
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${i + 1}`}
                    className={`product-thumbnail${selectedImage === i ? ' active' : ''}`}
                  />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="product-details-brand">{product.brand}</p>
            <h1 className="product-details-name">{product.name}</h1>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <Rating value={product.rating} size={16} />
              <span style={{ fontWeight: 700, color: 'var(--color-text)' }}>{product.rating}</span>
              <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>({product.reviews.toLocaleString()} reviews)</span>
              <span style={{
                fontSize: '0.75rem', fontWeight: 600, padding: '2px 10px',
                borderRadius: 'var(--radius-full)',
                ...(product.stock > 0
                  ? { background: 'rgba(16,185,129,0.1)', color: 'var(--color-success)' }
                  : { background: 'rgba(239,68,68,0.1)', color: 'var(--color-error)' })
              }}>
                {product.stock > 0 ? `✓ In Stock (${product.stock} left)` : '✗ Out of Stock'}
              </span>
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
              <span className="product-details-price">${product.price.toFixed(2)}</span>
              {product.oldPrice > product.price && (
                <span style={{ fontSize: '1.1rem', textDecoration: 'line-through', color: 'var(--color-text-muted)' }}>
                  ${product.oldPrice.toFixed(2)}
                </span>
              )}
              {product.discount > 0 && (
                <span className="badge badge-success" style={{ fontSize: '0.875rem', padding: '4px 14px' }}>
                  Save {product.discount}% · ${(product.oldPrice - product.price).toFixed(2)} off
                </span>
              )}
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: 28 }}>
              {product.description}
            </p>

            {/* Colors */}
            {product.colors.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-secondary)', marginBottom: 10 }}>
                  Color: <span style={{ color: 'var(--color-primary)', textTransform: 'none', letterSpacing: 0 }}>{selectedColor}</span>
                </p>
                <div className="color-options" role="radiogroup" aria-label="Select color">
                  {product.colors.map(color => (
                    <motion.button
                      key={color}
                      className={`color-option${selectedColor === color ? ' selected' : ''}`}
                      onClick={() => setSelectedColor(color)}
                      whileTap={{ scale: 0.95 }}
                      role="radio"
                      aria-checked={selectedColor === color}
                      aria-label={`Color: ${color}`}
                    >
                      {color}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-secondary)', marginBottom: 10 }}>
                  Size: <span style={{ color: 'var(--color-primary)', textTransform: 'none', letterSpacing: 0 }}>{selectedSize}</span>
                </p>
                <div className="size-options" role="radiogroup" aria-label="Select size">
                  {product.sizes.map(size => (
                    <motion.button
                      key={size}
                      className={`size-option${selectedSize === size ? ' selected' : ''}`}
                      onClick={() => setSelectedSize(size)}
                      whileTap={{ scale: 0.95 }}
                      role="radio"
                      aria-checked={selectedSize === size}
                      aria-label={`Size: ${size}`}
                    >
                      {size}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div style={{ marginBottom: 28 }}>
              <p style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-secondary)', marginBottom: 10 }}>
                Quantity
              </p>
              <div className="quantity-selector" role="group" aria-label="Product quantity">
                <button
                  className="quantity-btn"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1}
                >
                  <Minus size={14} />
                </button>
                <span className="quantity-display" aria-live="polite" aria-label={`Quantity: ${quantity}`}>{quantity}</span>
                <button
                  className="quantity-btn"
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  aria-label="Increase quantity"
                  disabled={quantity >= product.stock}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
              <motion.button
                className="btn btn-primary btn-lg"
                style={{ flex: 1 }}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                whileTap={{ scale: 0.97 }}
                aria-label="Add to cart"
              >
                {addedToCart ? <><Check size={18} /> Added!</> : <><ShoppingCart size={18} /> Add to Cart</>}
              </motion.button>
              <motion.button
                className="btn btn-accent btn-lg"
                style={{ flex: 1 }}
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                whileTap={{ scale: 0.97 }}
                aria-label="Buy now"
              >
                Buy Now
              </motion.button>
              <motion.button
                className={`btn btn-secondary btn-icon btn-lg`}
                onClick={handleWishlist}
                whileTap={{ scale: 0.9 }}
                aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                aria-pressed={inWishlist}
              >
                <Heart size={20} fill={inWishlist ? 'var(--color-accent)' : 'none'} color={inWishlist ? 'var(--color-accent)' : 'currentColor'} />
              </motion.button>
            </div>

            {/* Trust Badges */}
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', padding: '16px 0', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
              {[
                { icon: <Shield size={16} />, text: 'Secure Payment' },
                { icon: <Truck size={16} />, text: 'Free Shipping over $100' },
                { icon: <RotateCcw size={16} />, text: 'Easy 30-Day Returns' },
              ].map(b => (
                <div key={b.text} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                  <span style={{ color: 'var(--color-success)' }}>{b.icon}</span> {b.text}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Product Tabs */}
        <div>
          <div className="product-tabs" role="tablist" aria-label="Product information">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`product-tab${activeTab === tab.id ? ' active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`tab-panel-${tab.id}`}
                id={`tab-${tab.id}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              id={`tab-panel-${activeTab}`}
              role="tabpanel"
              aria-labelledby={`tab-${activeTab}`}
              style={{ marginBottom: 64 }}
            >
              {activeTab === 'description' && (
                <div style={{ maxWidth: 720 }}>
                  <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>{product.description}</p>
                  <ul style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {['Premium quality materials', 'Authentic product with warranty', 'Carefully packaged for safe delivery', 'Eligible for 30-day easy returns'].map(f => (
                      <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                        <Check size={16} color="var(--color-success)" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'specifications' && (
                <div style={{ maxWidth: 560 }}>
                  <div className="card" style={{ overflow: 'hidden' }}>
                    {Object.entries(product.specifications || {}).map(([key, val], i) => (
                      <div key={key} style={{
                        display: 'flex', justifyContent: 'space-between',
                        padding: '14px 20px',
                        background: i % 2 === 0 ? 'var(--color-bg-secondary)' : 'var(--color-bg-card)',
                        fontSize: '0.875rem',
                      }}>
                        <span style={{ fontWeight: 600, color: 'var(--color-text-secondary)' }}>{key}</span>
                        <span style={{ color: 'var(--color-text)' }}>{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div style={{ maxWidth: 720 }}>
                  <div style={{ display: 'flex', gap: 48, alignItems: 'center', marginBottom: 40, padding: 32, background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--color-text)', lineHeight: 1 }}>{product.rating}</p>
                      <Rating value={product.rating} size={18} />
                      <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 8 }}>{product.reviews.toLocaleString()} reviews</p>
                    </div>
                    <div style={{ flex: 1 }}>
                      {[5,4,3,2,1].map(s => {
                        const pct = s === 5 ? 65 : s === 4 ? 20 : s === 3 ? 10 : s === 2 ? 3 : 2;
                        return (
                          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', width: 14 }}>{s}</span>
                            <Star size={12} fill="var(--color-star)" stroke="var(--color-star)" />
                            <div style={{ flex: 1, height: 8, background: 'var(--color-border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                              <div style={{ width: `${pct}%`, height: '100%', background: 'var(--color-star)', borderRadius: 'var(--radius-full)' }} />
                            </div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', width: 30 }}>{pct}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {testimonials.slice(0, 3).map((t, i) => (
                    <motion.div key={t.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                      style={{ padding: '20px 0', borderBottom: '1px solid var(--color-border)' }}>
                      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                        <img src={t.avatar} alt={t.name} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, flexWrap: 'wrap', gap: 8 }}>
                            <div>
                              <span style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '0.9rem' }}>{t.name}</span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--color-success)', marginLeft: 8 }}>✓ Verified Buyer</span>
                            </div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{t.date}</span>
                          </div>
                          <Rating value={t.rating} size={13} />
                          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginTop: 8 }}>{t.review}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === 'shipping' && (
                <div style={{ maxWidth: 560, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {[
                    { icon: <Truck size={20} />, title: 'Standard Shipping', desc: '5-7 business days · Free on orders over $100 · $9.99 for orders under $100' },
                    { icon: <Truck size={20} />, title: 'Express Shipping', desc: '2-3 business days · $14.99 flat rate' },
                    { icon: <RotateCcw size={20} />, title: 'Easy Returns', desc: '30-day hassle-free returns. Item must be unused and in original packaging.' },
                    { icon: <Shield size={20} />, title: 'Product Warranty', desc: 'All products come with a manufacturer warranty. Contact us for claims.' },
                  ].map(item => (
                    <div key={item.title} style={{ display: 'flex', gap: 16, padding: 20, background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                      <div style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: 2 }}>{item.icon}</div>
                      <div>
                        <p style={{ fontWeight: 700, color: 'var(--color-text)', marginBottom: 4 }}>{item.title}</p>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div style={{ paddingBottom: 80 }}>
            <h2 className="section-title" style={{ marginBottom: 32 }}>You Might Also Like</h2>
            <div className="products-grid products-grid-4">
              {related.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
