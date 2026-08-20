import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { Rating } from '../components/product/ProductCard';
import Breadcrumb from '../components/ui/Breadcrumb';

const Wishlist = () => {
  const { items, removeFromWishlist, wishlistCount } = useWishlist();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (product) => {
    addToCart(product, product.colors[0] || 'Default', product.sizes[0] || 'One Size');
    toast.success(`${product.name.substring(0, 30)}... added to cart!`);
  };

  if (items.length === 0) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <Breadcrumb items={[{ label: 'Wishlist' }]} />
        </div>
        <div className="empty-state" style={{ minHeight: '60vh' }}>
          <motion.div
            className="empty-state-icon"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            aria-hidden="true"
          >❤️</motion.div>
          <h1 className="empty-state-title">Your wishlist is empty</h1>
          <p className="empty-state-subtitle">Save items you love to your wishlist. Review them anytime and easily add them to your cart.</p>
          <Link to="/shop" className="btn btn-primary btn-lg" aria-label="Explore products">
            Explore Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div className="container">
          <Breadcrumb items={[{ label: 'Wishlist' }]} />
          <h1 className="page-header-title">My Wishlist</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: 4 }}>
            {wishlistCount} {wishlistCount === 1 ? 'item' : 'items'} saved
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px 80px' }}>
        <div className="wishlist-grid">
          <AnimatePresence>
            {items.map((product, i) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                className="card"
                style={{ overflow: 'hidden' }}
              >
                <div style={{ position: 'relative' }}>
                  <Link to={`/product/${product.id}`} aria-label={`View ${product.name}`}>
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }}
                    />
                  </Link>
                  <button
                    style={{ position: 'absolute', top: 10, right: 10, width: 34, height: 34, borderRadius: 'var(--radius-md)', background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent)', boxShadow: 'var(--shadow-sm)' }}
                    onClick={() => { removeFromWishlist(product.id); toast.info('Removed from wishlist'); }}
                    aria-label={`Remove ${product.name} from wishlist`}
                  >
                    <Heart size={16} fill="currentColor" />
                  </button>
                  {product.discount > 0 && (
                    <span className="badge badge-accent" style={{ position: 'absolute', top: 10, left: 10 }}>-{product.discount}%</span>
                  )}
                </div>

                <div style={{ padding: 16 }}>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                    {product.brand}
                  </p>
                  <Link to={`/product/${product.id}`}>
                    <h3 style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text)', marginBottom: 8, lineHeight: 1.4 }}>
                      {product.name}
                    </h3>
                  </Link>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                    <Rating value={product.rating} size={12} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>({product.reviews.toLocaleString()})</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                    <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>${product.price.toFixed(2)}</span>
                    {product.oldPrice > product.price && (
                      <span style={{ textDecoration: 'line-through', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>${product.oldPrice.toFixed(2)}</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <motion.button
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1 }}
                      onClick={() => handleAddToCart(product)}
                      whileTap={{ scale: 0.97 }}
                      aria-label={`Add ${product.name} to cart`}
                    >
                      <ShoppingCart size={14} /> Add to Cart
                    </motion.button>
                    <motion.button
                      className="btn btn-secondary btn-sm"
                      onClick={() => { removeFromWishlist(product.id); toast.info('Removed from wishlist'); }}
                      whileTap={{ scale: 0.97 }}
                      aria-label={`Remove ${product.name}`}
                      style={{ padding: '8px 12px' }}
                    >
                      <Trash2 size={14} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
