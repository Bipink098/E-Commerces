import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, MapPin, Truck, CreditCard, ChevronRight, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import Breadcrumb from '../components/ui/Breadcrumb';

const STEPS = ['Shipping Address', 'Delivery Method', 'Payment'];

const Checkout = () => {
  const [step, setStep] = useState(0);
  const [shippingData, setShippingData] = useState({ fullName: '', email: '', phone: '', address: '', city: '', state: '', zip: '' });
  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardData, setCardData] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [upiId, setUpiId] = useState('');
  const [errors, setErrors] = useState({});
  const [isPlacing, setIsPlacing] = useState(false);

  const { items, subtotal, couponDiscount, tax, total, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  const deliveryOptions = [
    { id: 'standard', label: 'Standard Delivery', desc: '5-7 business days', price: subtotal >= 100 ? 0 : 9.99, badge: subtotal >= 100 ? 'Free' : null },
    { id: 'express', label: 'Express Delivery', desc: '2-3 business days', price: 14.99, badge: 'Fast' },
  ];

  const selectedDelivery = deliveryOptions.find(d => d.id === deliveryMethod);
  const orderTotal = total + (deliveryMethod === 'express' ? 14.99 : 0);

  const validateStep0 = () => {
    const e = {};
    if (!shippingData.fullName.trim()) e.fullName = 'Required';
    if (!shippingData.email.includes('@')) e.email = 'Valid email required';
    if (!shippingData.phone.trim()) e.phone = 'Required';
    if (!shippingData.address.trim()) e.address = 'Required';
    if (!shippingData.city.trim()) e.city = 'Required';
    if (!shippingData.state.trim()) e.state = 'Required';
    if (!shippingData.zip.trim()) e.zip = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 0 && !validateStep0()) { toast.error('Please fill in all required fields.'); return; }
    setStep(s => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = async () => {
    setIsPlacing(true);
    await new Promise(r => setTimeout(r, 1800));
    const orderId = 'ORD-' + Date.now().toString(36).toUpperCase();
    clearCart();
    navigate('/order-success', { state: { orderId, total: orderTotal.toFixed(2), delivery: deliveryMethod } });
  };

  const InputField = ({ label, field, type = 'text', placeholder }) => (
    <div className="input-group">
      <label className="input-label" htmlFor={`checkout-${field}`}>{label} <span style={{ color: 'var(--color-accent)' }}>*</span></label>
      <input
        id={`checkout-${field}`}
        type={type}
        className={`input${errors[field] ? ' input-error' : ''}`}
        style={errors[field] ? { borderColor: 'var(--color-error)' } : {}}
        placeholder={placeholder}
        value={shippingData[field]}
        onChange={e => setShippingData(prev => ({ ...prev, [field]: e.target.value }))}
        aria-invalid={!!errors[field]}
        aria-describedby={errors[field] ? `${field}-error` : undefined}
        required
      />
      {errors[field] && <span id={`${field}-error`} style={{ fontSize: '0.75rem', color: 'var(--color-error)' }}>{errors[field]}</span>}
    </div>
  );

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div className="container">
          <Breadcrumb items={[{ label: 'Cart', to: '/cart' }, { label: 'Checkout' }]} />
          <h1 className="page-header-title">Checkout</h1>
        </div>
      </div>

      <div className="container">
        <div className="checkout-layout">
          <div>
            {/* Steps Indicator */}
            <div className="checkout-steps" role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={3}>
              {STEPS.map((s, i) => (
                <div key={s} className="checkout-step" style={{ flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <div className={`checkout-step-dot ${i < step ? 'done' : ''} ${i === step ? 'active' : ''}`}
                      style={{
                        background: i < step ? 'var(--color-success)' : i === step ? 'var(--color-primary)' : 'var(--color-bg-card)',
                        border: `2px solid ${i < step ? 'var(--color-success)' : i === step ? 'var(--color-primary)' : 'var(--color-border)'}`,
                        color: i <= step ? 'white' : 'var(--color-text-muted)'
                      }}>
                      {i < step ? <Check size={14} /> : i + 1}
                    </div>
                    {i < STEPS.length - 1 && (
                      <div style={{ flex: 1, height: 2, background: i < step ? 'var(--color-success)' : 'var(--color-border)', margin: '0 4px', marginBottom: 20 }} />
                    )}
                  </div>
                  <p className="checkout-step-label" style={{ color: i === step ? 'var(--color-primary)' : i < step ? 'var(--color-success)' : 'var(--color-text-muted)' }}>
                    {s}
                  </p>
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {/* Step 0: Shipping */}
              {step === 0 && (
                <motion.div key="step0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="checkout-form-card">
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <MapPin size={20} color="var(--color-primary)" /> Shipping Address
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <InputField label="Full Name" field="fullName" placeholder="John Doe" />
                    <div className="form-grid-2">
                      <InputField label="Email" field="email" type="email" placeholder="john@example.com" />
                      <InputField label="Phone Number" field="phone" type="tel" placeholder="+1 (555) 000-0000" />
                    </div>
                    <InputField label="Address" field="address" placeholder="123 Main Street, Apt 4B" />
                    <div className="form-grid-2">
                      <InputField label="City" field="city" placeholder="New York" />
                      <InputField label="State" field="state" placeholder="NY" />
                    </div>
                    <div style={{ maxWidth: 200 }}>
                      <InputField label="ZIP / Pincode" field="zip" placeholder="10001" />
                    </div>
                  </div>
                  <div style={{ marginTop: 28, display: 'flex', justifyContent: 'flex-end' }}>
                    <motion.button className="btn btn-primary btn-lg" onClick={handleNext} whileTap={{ scale: 0.97 }} aria-label="Continue to delivery">
                      Continue <ChevronRight size={18} />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Step 1: Delivery */}
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="checkout-form-card">
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Truck size={20} color="var(--color-primary)" /> Delivery Method
                  </h2>
                  {deliveryOptions.map(opt => (
                    <div
                      key={opt.id}
                      className={`delivery-option${deliveryMethod === opt.id ? ' selected' : ''}`}
                      onClick={() => setDeliveryMethod(opt.id)}
                      role="radio"
                      aria-checked={deliveryMethod === opt.id}
                      tabIndex={0}
                      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setDeliveryMethod(opt.id)}
                    >
                      <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${deliveryMethod === opt.id ? 'var(--color-primary)' : 'var(--color-border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {deliveryMethod === opt.id && <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--color-primary)' }} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <p style={{ fontWeight: 700, color: 'var(--color-text)' }}>{opt.label}</p>
                          {opt.badge && <span className="badge badge-success">{opt.badge}</span>}
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 2 }}>{opt.desc}</p>
                      </div>
                      <p style={{ fontWeight: 700, color: opt.price === 0 ? 'var(--color-success)' : 'var(--color-text)' }}>
                        {opt.price === 0 ? 'FREE' : `$${opt.price.toFixed(2)}`}
                      </p>
                    </div>
                  ))}
                  <div style={{ marginTop: 28, display: 'flex', justifyContent: 'space-between' }}>
                    <button className="btn btn-secondary" onClick={() => setStep(0)} aria-label="Go back">← Back</button>
                    <motion.button className="btn btn-primary btn-lg" onClick={handleNext} whileTap={{ scale: 0.97 }} aria-label="Continue to payment">
                      Continue <ChevronRight size={18} />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Payment */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="checkout-form-card">
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <CreditCard size={20} color="var(--color-primary)" /> Payment Method
                  </h2>

                  {/* Payment Options */}
                  {[
                    { id: 'card', label: 'Credit / Debit Card', icon: '💳' },
                    { id: 'upi', label: 'UPI Payment', icon: '📱' },
                    { id: 'cod', label: 'Cash on Delivery', icon: '💵' },
                  ].map(opt => (
                    <div
                      key={opt.id}
                      className={`payment-option${paymentMethod === opt.id ? ' selected' : ''}`}
                      onClick={() => setPaymentMethod(opt.id)}
                      role="radio"
                      aria-checked={paymentMethod === opt.id}
                      tabIndex={0}
                      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setPaymentMethod(opt.id)}
                    >
                      <span style={{ fontSize: '1.4rem' }}>{opt.icon}</span>
                      <p style={{ fontWeight: 600, color: 'var(--color-text)' }}>{opt.label}</p>
                      {paymentMethod === opt.id && <Check size={18} color="var(--color-primary)" style={{ marginLeft: 'auto' }} />}
                    </div>
                  ))}

                  {/* Card Form */}
                  {paymentMethod === 'card' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                      <div className="input-group">
                        <label className="input-label" htmlFor="card-number">Card Number</label>
                        <input id="card-number" type="text" className="input" placeholder="1234 5678 9012 3456" maxLength={19}
                          value={cardData.number} onChange={e => setCardData(p => ({ ...p, number: e.target.value }))} />
                      </div>
                      <div className="input-group">
                        <label className="input-label" htmlFor="card-name">Name on Card</label>
                        <input id="card-name" type="text" className="input" placeholder="John Doe"
                          value={cardData.name} onChange={e => setCardData(p => ({ ...p, name: e.target.value }))} />
                      </div>
                      <div className="form-grid-2">
                        <div className="input-group">
                          <label className="input-label" htmlFor="card-expiry">Expiry Date</label>
                          <input id="card-expiry" type="text" className="input" placeholder="MM/YY" maxLength={5}
                            value={cardData.expiry} onChange={e => setCardData(p => ({ ...p, expiry: e.target.value }))} />
                        </div>
                        <div className="input-group">
                          <label className="input-label" htmlFor="card-cvv">CVV</label>
                          <input id="card-cvv" type="password" className="input" placeholder="•••" maxLength={4}
                            value={cardData.cvv} onChange={e => setCardData(p => ({ ...p, cvv: e.target.value }))} />
                        </div>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>🔒 Your payment information is secure and encrypted.</p>
                    </motion.div>
                  )}

                  {/* UPI */}
                  {paymentMethod === 'upi' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ marginTop: 20 }}>
                      <div className="input-group">
                        <label className="input-label" htmlFor="upi-id">UPI ID</label>
                        <input id="upi-id" type="text" className="input" placeholder="yourname@upi"
                          value={upiId} onChange={e => setUpiId(e.target.value)} />
                      </div>
                    </motion.div>
                  )}

                  {paymentMethod === 'cod' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 20, padding: 16, background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                      💡 Pay with cash when your order is delivered. No additional charges.
                    </motion.div>
                  )}

                  <div style={{ marginTop: 28, display: 'flex', justifyContent: 'space-between' }}>
                    <button className="btn btn-secondary" onClick={() => setStep(1)} aria-label="Go back">← Back</button>
                    <motion.button
                      className="btn btn-primary btn-lg"
                      onClick={handlePlaceOrder}
                      disabled={isPlacing}
                      whileTap={{ scale: 0.97 }}
                      aria-label="Place order"
                    >
                      {isPlacing ? (
                        <><span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Processing...</>
                      ) : (
                        <><Package size={18} /> Place Order — ${orderTotal.toFixed(2)}</>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <motion.div className="order-summary" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="order-summary-title">Order Summary</h2>
              <div style={{ maxHeight: 240, overflowY: 'auto', marginBottom: 16 }}>
                {items.map(item => (
                  <div key={item.cartId} style={{ display: 'flex', gap: 12, marginBottom: 14, alignItems: 'center' }}>
                    <img src={item.images[0]} alt={item.name} style={{ width: 52, height: 52, borderRadius: 'var(--radius-md)', objectFit: 'cover' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Qty: {item.quantity}</p>
                    </div>
                    <p style={{ fontSize: '0.875rem', fontWeight: 700, flexShrink: 0 }}>${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="divider" />
              <div className="order-summary-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              {couponDiscount > 0 && <div className="order-summary-row discount"><span>Discount</span><span>-${couponDiscount.toFixed(2)}</span></div>}
              <div className="order-summary-row">
                <span>Shipping</span>
                <span style={{ color: selectedDelivery?.price === 0 ? 'var(--color-success)' : 'inherit' }}>
                  {selectedDelivery?.price === 0 ? 'FREE' : `$${selectedDelivery?.price?.toFixed(2)}`}
                </span>
              </div>
              <div className="order-summary-row"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
              <div className="order-summary-row total"><span>Total</span><span>${orderTotal.toFixed(2)}</span></div>

              {step >= 1 && (
                <div style={{ marginTop: 16, padding: 14, background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem' }}>
                  <p style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: 4 }}>📦 {selectedDelivery?.label}</p>
                  <p style={{ color: 'var(--color-text-muted)' }}>{selectedDelivery?.desc}</p>
                </div>
              )}

              {step >= 0 && shippingData.fullName && (
                <div style={{ marginTop: 10, padding: 14, background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem' }}>
                  <p style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: 2 }}>📍 Shipping to:</p>
                  <p style={{ color: 'var(--color-text-muted)' }}>{shippingData.fullName}</p>
                  <p style={{ color: 'var(--color-text-muted)' }}>{shippingData.city}, {shippingData.state}</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Checkout;
