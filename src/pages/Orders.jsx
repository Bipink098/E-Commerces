import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle, Truck, ArrowRight } from 'lucide-react';
import Breadcrumb from '../components/ui/Breadcrumb';

const MOCK_ORDERS = [
  {
    id: 'ORD-A1B2C3',
    date: 'August 15, 2026',
    total: 429.97,
    status: 'Delivered',
    paymentStatus: 'Paid',
    items: [
      { id: 1, name: 'Apple MacBook Air M3', price: 1099.00, quantity: 1, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&q=80' },
      { id: 2, name: 'Sony WH-1000XM5 Headphones', price: 279.00, quantity: 1, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80' },
    ]
  },
  {
    id: 'ORD-D4E5F6',
    date: 'August 05, 2026',
    total: 199.99,
    status: 'Shipped',
    paymentStatus: 'Paid',
    items: [
      { id: 13, name: 'Fossil Gen 6 Smartwatch', price: 199.99, quantity: 1, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80' },
    ]
  },
  {
    id: 'ORD-G7H8I9',
    date: 'July 22, 2026',
    total: 89.98,
    status: 'Processing',
    paymentStatus: 'Pending',
    items: [
      { id: 6, name: 'Premium Denim Jacket', price: 89.99, quantity: 1, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&q=80' },
    ]
  },
];

const statusBadge = (status) => {
  if (status === 'Delivered') return 'status-delivered';
  if (status === 'Shipped') return 'status-shipped';
  return 'status-processing';
};

const Orders = () => {
  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div className="container">
          <Breadcrumb items={[{ label: 'Account', to: '/account' }, { label: 'My Orders' }]} />
          <h1 className="page-header-title">Order History</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: 4 }}>
            Track, return, or buy items again
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px 80px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {MOCK_ORDERS.map((order, i) => (
            <motion.div
              key={order.id}
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
              style={{ overflow: 'hidden' }}
            >
              {/* Header */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '16px 24px', background: 'var(--color-bg-secondary)',
                borderBottom: '1px solid var(--color-border)', flexWrap: 'wrap', gap: 12
              }}>
                <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order Placed</span>
                    <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{order.date}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Amount</span>
                    <p style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-text)' }}>${order.total.toFixed(2)}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order ID</span>
                    <p style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '0.875rem', color: 'var(--color-primary)' }}>{order.id}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span className={`order-status ${statusBadge(order.status)}`}>{order.status}</span>
                  <Link to={`/orders/${order.id}`} className="btn btn-secondary btn-sm" aria-label={`View order ${order.id}`}>
                    View Order Details
                  </Link>
                </div>
              </div>

              {/* Order Items */}
              <div style={{ padding: 24 }}>
                {order.items.map(item => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
                    <img src={item.image} alt={item.name} style={{ width: 64, height: 64, borderRadius: 'var(--radius-md)', objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <Link to={`/product/${item.id}`} style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: '0.95rem' }}>
                        {item.name}
                      </Link>
                      <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
                        Qty: {item.quantity} · ${item.price.toFixed(2)} each
                      </p>
                    </div>
                    <Link to={`/product/${item.id}`} className="btn btn-outline btn-sm">
                      Buy Again
                    </Link>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
