import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, MapPin, CreditCard, Calendar, Truck, Check, ArrowLeft } from 'lucide-react';
import Breadcrumb from '../components/ui/Breadcrumb';
import OrderTimeline from '../components/product/OrderTimeline';

const OrderDetails = () => {
  const { id } = useParams();
  const orderId = id || 'ORD-A1B2C3';

  const steps = [
    { label: 'Order Placed', date: 'Aug 15, 2026', description: 'Order confirmed and registered' },
    { label: 'Confirmed', date: 'Aug 15, 2026', description: 'Payment verified successfully' },
    { label: 'Shipped', date: 'Aug 16, 2026', description: 'Handed over to carrier (Courier ID: #89234)' },
    { label: 'Out for Delivery', date: 'Aug 18, 2026', description: 'Driver is on the way to delivery address' },
    { label: 'Delivered', date: 'Aug 18, 2026', description: 'Delivered to front door' },
  ];

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div className="container">
          <Breadcrumb items={[
            { label: 'Account', to: '/account' },
            { label: 'Orders', to: '/orders' },
            { label: orderId },
          ]} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 className="page-header-title">Order {orderId}</h1>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: 4 }}>
                Placed on August 15, 2026 · Paid via Credit Card
              </p>
            </div>
            <span className="order-status status-delivered" style={{ fontSize: '0.85rem', padding: '6px 16px' }}>
              Delivered
            </span>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32 }}>
          <div>
            {/* Timeline */}
            <div className="card" style={{ padding: 28, marginBottom: 32 }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 24 }}>Order Progress & Tracking</h2>
              <OrderTimeline steps={steps} currentStep={4} />
            </div>

            {/* Items */}
            <div className="card" style={{ padding: 28 }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 20 }}>Items in this Order</h2>
              {[
                { id: 1, name: 'Apple MacBook Air M3', price: 1099.00, quantity: 1, color: 'Midnight', size: '256GB', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&q=80' },
                { id: 2, name: 'Sony WH-1000XM5 Headphones', price: 279.00, quantity: 1, color: 'Black', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80' },
              ].map(item => (
                <div key={item.id} style={{ display: 'flex', gap: 16, alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--color-border)' }}>
                  <img src={item.image} alt={item.name} style={{ width: 72, height: 72, borderRadius: 'var(--radius-md)', objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <Link to={`/product/${item.id}`} style={{ fontWeight: 600, color: 'var(--color-text)' }}>{item.name}</Link>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
                      Color: {item.color} {item.size ? `· Size: ${item.size}` : ''}
                    </p>
                    <p style={{ fontSize: '0.875rem', fontWeight: 700, marginTop: 4 }}>${item.price.toFixed(2)} × {item.quantity}</p>
                  </div>
                  <p style={{ fontWeight: 800, fontSize: '1.1rem' }}>${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="card" style={{ padding: 24, marginBottom: 20 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <MapPin size={18} color="var(--color-primary)" /> Delivery Address
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                <strong>Alex Johnson</strong><br />
                123 Main Street, Apt 4B<br />
                New York, NY 10001<br />
                United States<br />
                +1 (555) 234-5678
              </p>
            </div>

            <div className="card" style={{ padding: 24, marginBottom: 20 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <CreditCard size={18} color="var(--color-primary)" /> Payment Details
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                Payment Method: <strong>Credit Card</strong><br />
                Card Ending: <strong>•••• 4242</strong><br />
                Status: <span style={{ color: 'var(--color-success)', fontWeight: 700 }}>Paid</span>
              </p>
            </div>

            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>Order Summary</h3>
              <div className="order-summary-row"><span>Subtotal</span><span>$1,378.00</span></div>
              <div className="order-summary-row discount"><span>Discount (SHOP10)</span><span>-$137.80</span></div>
              <div className="order-summary-row"><span>Shipping</span><span style={{ color: 'var(--color-success)' }}>FREE</span></div>
              <div className="order-summary-row"><span>Tax</span><span>$99.22</span></div>
              <div className="order-summary-row total"><span>Total</span><span>$1,339.42</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
