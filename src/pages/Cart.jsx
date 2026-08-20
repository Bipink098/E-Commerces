import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ShoppingBag, Tag, ArrowRight, ChevronRight, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import Breadcrumb from '../components/ui/Breadcrumb';

const Cart = () => {
  const { items, cartCount, subtotal, coupon, couponDiscount, shipping, tax, total, removeFromCart, updateQuantity, applyCoupon, removeCoupon } = useCart();
  const { toast } = useToast();
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) { toast.error('Please enter a coupon code.'); return; }
    setCouponLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const result = applyCoupon(couponCode);
    setCouponLoading(false);
    if (result.success) {
      toast.success(`Coupon applied! ${result.discount}% discount added.`);
      setCouponCode('');
    } else {
      toast.error('Invalid coupon code. Try: SHOP10, SAVE20, SUMMER50');
    }
  };

  if (items.length === 0) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <Breadcrumb items={[{ label: 'Cart' }]} />
        </div>
        <div className="empty-state" style={{ minHeight: '60vh' }}>
          <motion.div
            className="empty-state-icon"
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            aria-hidden="true"
          >🛒</motion.div>
          <h1 className="empty-state-title">Your cart is empty</h1>
          <p className="empty-state-subtitle">Your cart is feeling a little empty. Add some amazing products to get started!</p>
          <Link to="/shop" className="btn btn-primary btn-lg" aria-label="Start shopping">
            <ShoppingBag size={18} /> Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div className="container">
          <Breadcrumb items={[{ label: 'Cart' }]} />
          <h1 className="page-header-title">Shopping Cart</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: 4 }}>
            {cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
      </div>

      <div className="container">
        <div className="cart-layout">
          {/* Cart Items */}
          <div>
            <AnimatePresence>
              {items.map(item => (
                <motion.div
                  key={item.cartId}
                  className="cart-item"
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0, padding: 0, overflow: 'hidden' }}
                  transition={{ duration: 0.25 }}
                >
                  <Link to={`/product/${item.id}`} aria-label={`View ${item.name}`}>
                    <img src={item.images[0]} alt={item.name} className="cart-item-image" />
                  </Link>
                  <div className="cart-item-details">
                    <Link to={`/product/${item.id}`}>
                      <h3 className="cart-item-name">{item.name}</h3>
                    </Link>
                    <p className="cart-item-meta">
                      {item.selectedColor !== 'Default' && `Color: ${item.selectedColor}`}
                      {item.selectedColor !== 'Default' && item.selectedSize !== 'One Size' && ' · '}
                      {item.selectedSize !== 'One Size' && `Size: ${item.selectedSize}`}
                      {!item.selectedColor && !item.selectedSize && item.brand}
                    </p>
                    <div className="quantity-selector" role="group" aria-label={`Quantity for ${item.name}`}>
                      <button
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                      >−</button>
                      <span className="quantity-display" aria-live="polite">{item.quantity}</span>
                      <button
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >+</button>
                    </div>
                  </div>
                  <div className="cart-item-price">
                    <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-text)' }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      ${item.price.toFixed(2)} each
                    </span>
                    <button
                      className="cart-remove-btn"
                      onClick={() => { removeFromCart(item.cartId); toast.info('Item removed from cart.'); }}
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, flexWrap: 'wrap', gap: 12 }}>
              <Link to="/shop" className="btn btn-secondary" aria-label="Continue shopping">
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <motion.div
              className="order-summary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="order-summary-title">Order Summary</h2>

              <div className="order-summary-row">
                <span>Subtotal ({cartCount} items)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              {couponDiscount > 0 && (
                <div className="order-summary-row discount">
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Tag size={14} /> Coupon ({coupon.code})
                    <button onClick={removeCoupon} style={{ color: 'var(--color-error)' }} aria-label="Remove coupon">
                      <X size={14} />
                    </button>
                  </span>
                  <span>-${couponDiscount.toFixed(2)}</span>
                </div>
              )}

              <div className="order-summary-row">
                <span>Shipping</span>
                <span style={{ color: shipping === 0 ? 'var(--color-success)' : 'inherit' }}>
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </span>
              </div>

              {shipping > 0 && (
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: -4, marginBottom: 4 }}>
                  Add ${(100 - subtotal).toFixed(2)} more for free shipping
                </p>
              )}

              <div className="order-summary-row">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>

              <div className="order-summary-row total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              {/* Coupon */}
              <div className="coupon-section">
                <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 10 }}>
                  <Tag size={14} style={{ display: 'inline', marginRight: 4 }} /> Have a coupon code?
                </p>
                <div className="coupon-input-row">
                  <input
                    type="text"
                    className="input coupon-input"
                    placeholder="e.g. SHOP10"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value.toUpperCase())}
                    onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                    aria-label="Coupon code"
                    id="coupon-code"
                  />
                  <motion.button
                    className="btn btn-primary btn-sm"
                    onClick={handleApplyCoupon}
                    disabled={couponLoading}
                    whileTap={{ scale: 0.97 }}
                    aria-label="Apply coupon"
                  >
                    {couponLoading ? '...' : 'Apply'}
                  </motion.button>
                </div>
                <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: 6 }}>
                  Try: SHOP10, SAVE20, FIRST15, SUMMER50
                </p>
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/checkout"
                  className="btn btn-primary btn-lg w-full"
                  style={{ width: '100%', justifyContent: 'center' }}
                  aria-label="Proceed to checkout"
                >
                  Proceed to Checkout <ArrowRight size={18} />
                </Link>
              </motion.div>

              <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
                {['🔒 SSL Secured', '💳 Safe Payment', '✓ Easy Returns'].map(t => (
                  <span key={t} style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{t}</span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
