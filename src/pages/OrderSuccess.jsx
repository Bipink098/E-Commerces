import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, Home, ArrowRight, Calendar, Truck } from 'lucide-react';

const OrderSuccess = () => {
  const { state } = useLocation();
  const orderId = state?.orderId || 'ORD-' + Math.random().toString(36).slice(2, 9).toUpperCase();
  const total = state?.total || '0.00';
  const delivery = state?.delivery || 'standard';

  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + (delivery === 'express' ? 3 : 7));
  const dateStr = estimatedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="success-page">
      <motion.div
        className="success-card"
        initial={{ opacity: 0, scale: 0.8, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        {/* Success Icon */}
        <motion.div
          className="success-icon"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
        >
          <CheckCircle size={40} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h1 className="success-title">Order Placed Successfully! 🎉</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', marginBottom: 32 }}>
            Thank you for shopping at SHOPORA. Your order has been confirmed and is being processed.
          </p>

          {/* Order Details */}
          <div style={{ background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-lg)', padding: 20, marginBottom: 28, textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Order ID</p>
                <p style={{ fontWeight: 700, color: 'var(--color-primary)', fontFamily: 'monospace', fontSize: '1rem' }}>{orderId}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Amount Paid</p>
                <p style={{ fontWeight: 800, color: 'var(--color-text)', fontSize: '1.25rem' }}>${total}</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 14, paddingTop: 14, borderTop: '1px solid var(--color-border)', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.825rem', color: 'var(--color-text-secondary)' }}>
                <Calendar size={15} color="var(--color-primary)" />
                <span>Order placed: {new Date().toLocaleDateString()}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.825rem', color: 'var(--color-text-secondary)' }}>
                <Truck size={15} color="var(--color-success)" />
                <span>Est. delivery: {dateStr}</span>
              </div>
            </div>
          </div>

          {/* Info */}
          <div style={{ background: 'rgba(108,71,255,0.06)', border: '1px solid rgba(108,71,255,0.15)', borderRadius: 'var(--radius-md)', padding: '14px 16px', marginBottom: 32, fontSize: '0.825rem', color: 'var(--color-text-secondary)' }}>
            📧 A confirmation email has been sent to your registered email address. You'll receive tracking updates as your order progresses.
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link to="/orders" className="btn btn-primary btn-lg" aria-label="View order">
                <Package size={18} /> View Order
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link to="/" className="btn btn-secondary btn-lg" aria-label="Continue shopping">
                <Home size={18} /> Continue Shopping
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;
