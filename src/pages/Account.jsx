import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Package, Heart, MapPin, Settings, LogOut,
  ShoppingBag, Clock, CheckCircle, TrendingUp, Edit2, Save
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import Breadcrumb from '../components/ui/Breadcrumb';

const MOCK_ORDERS = [
  { id: 'ORD-A1B2C3', date: 'Aug 15, 2026', items: 3, total: 429.97, status: 'Delivered', payment: 'Card' },
  { id: 'ORD-D4E5F6', date: 'Aug 05, 2026', items: 1, total: 199.99, status: 'Shipped', payment: 'UPI' },
  { id: 'ORD-G7H8I9', date: 'Jul 22, 2026', items: 2, total: 89.98, status: 'Processing', payment: 'COD' },
];

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <TrendingUp size={17} /> },
  { id: 'profile', label: 'Profile', icon: <User size={17} /> },
  { id: 'orders', label: 'My Orders', icon: <Package size={17} /> },
  { id: 'wishlist', label: 'Wishlist', icon: <Heart size={17} /> },
  { id: 'addresses', label: 'Addresses', icon: <MapPin size={17} /> },
  { id: 'settings', label: 'Settings', icon: <Settings size={17} /> },
];

const Account = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({ name: '', phone: '' });
  const { user, logout } = useAuth();
  const { wishlistCount } = useWishlist();
  const { toast } = useToast();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="page-wrapper">
        <div className="empty-state" style={{ minHeight: '60vh' }}>
          <div className="empty-state-icon">🔒</div>
          <h1 className="empty-state-title">Please Sign In</h1>
          <p className="empty-state-subtitle">You need to be signed in to access your account.</p>
          <Link to="/login" className="btn btn-primary btn-lg">Sign In</Link>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    toast.info('You have been signed out.');
    navigate('/');
  };

  const statusColor = (s) => {
    if (s === 'Delivered') return 'status-delivered';
    if (s === 'Shipped') return 'status-shipped';
    return 'status-processing';
  };

  const content = {
    dashboard: (
      <div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 24 }}>Dashboard</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 32 }}>
          {[
            { icon: <Package size={22} />, label: 'Total Orders', value: MOCK_ORDERS.length, color: '#6c47ff', bg: 'rgba(108,71,255,0.1)' },
            { icon: <Clock size={22} />, label: 'Pending', value: 1, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
            { icon: <CheckCircle size={22} />, label: 'Delivered', value: 1, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
            { icon: <Heart size={22} />, label: 'Wishlist Items', value: wishlistCount, color: '#ff6b6b', bg: 'rgba(255,107,107,0.1)' },
          ].map(card => (
            <motion.div key={card.label} className="stat-card" whileHover={{ y: -3 }}>
              <div className="stat-icon" style={{ background: card.bg, color: card.color }}>{card.icon}</div>
              <p className="stat-value" style={{ color: card.color }}>{card.value}</p>
              <p className="stat-label">{card.label}</p>
            </motion.div>
          ))}
        </div>

        <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: '1rem' }}>Recent Orders</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {MOCK_ORDERS.slice(0, 3).map(order => (
            <div key={order.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <p style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '0.875rem', color: 'var(--color-primary)' }}>{order.id}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 2 }}>{order.date} · {order.items} items</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <span className={`order-status ${statusColor(order.status)}`}>{order.status}</span>
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>${order.total.toFixed(2)}</span>
                <Link to={`/orders/${order.id}`} className="btn btn-ghost btn-sm" style={{ padding: '4px 12px' }}>View →</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),

    profile: (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Profile</h2>
          <button className="btn btn-secondary btn-sm" onClick={() => setEditMode(v => !v)} aria-label={editMode ? 'Cancel edit' : 'Edit profile'}>
            {editMode ? 'Cancel' : <><Edit2 size={14} /> Edit</>}
          </button>
        </div>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 28, padding: 20, background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-lg)' }}>
          <img src={user.avatar} alt={user.name} style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--color-primary-muted)' }} />
          <div>
            <p style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--color-text)' }}>{user.name}</p>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{user.email}</p>
            <span className="badge badge-primary" style={{ marginTop: 6 }}>Premium Member</span>
          </div>
        </div>

        <div style={{ display: 'grid', gap: 14, maxWidth: 480 }}>
          {[
            { label: 'Full Name', value: user.name, field: 'name' },
            { label: 'Email Address', value: user.email },
            { label: 'Phone Number', value: user.phone || '+1 (555) 234-5678', field: 'phone' },
            { label: 'Member Since', value: 'January 2025' },
          ].map(item => (
            <div key={item.label} className="input-group">
              <label className="input-label">{item.label}</label>
              {editMode && item.field ? (
                <input className="input" defaultValue={item.value} onChange={e => setProfileData(p => ({ ...p, [item.field]: e.target.value }))} aria-label={item.label} />
              ) : (
                <div style={{ padding: '12px 16px', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}>
                  {item.value}
                </div>
              )}
            </div>
          ))}
          {editMode && (
            <motion.button className="btn btn-primary" onClick={() => { setEditMode(false); toast.success('Profile updated!'); }} whileTap={{ scale: 0.97 }} aria-label="Save profile">
              <Save size={16} /> Save Changes
            </motion.button>
          )}
        </div>
      </div>
    ),

    orders: (
      <div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 24 }}>My Orders</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {MOCK_ORDERS.map(order => (
            <motion.div key={order.id} className="card" style={{ padding: 20 }} whileHover={{ y: -2 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <p style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--color-primary)', fontSize: '0.9rem' }}>{order.id}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 2 }}>{order.date} · {order.items} items · {order.payment}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className={`order-status ${statusColor(order.status)}`}>{order.status}</span>
                  <span style={{ fontWeight: 800, fontSize: '1rem' }}>${order.total.toFixed(2)}</span>
                </div>
              </div>
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--color-border)', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Link to={`/orders/${order.id}`} className="btn btn-primary btn-sm" aria-label={`View order ${order.id}`}>View Details</Link>
                {order.status !== 'Delivered' && (
                  <button className="btn btn-secondary btn-sm" onClick={() => toast.info('Order tracking feature coming soon!')} aria-label="Track order">Track Order</button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    ),

    wishlist: (
      <div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 24 }}>Wishlist</h2>
        <div className="empty-state">
          <Heart size={48} color="var(--color-accent)" style={{ marginBottom: 16 }} />
          <p className="empty-state-subtitle">View and manage your saved items.</p>
          <Link to="/wishlist" className="btn btn-primary" aria-label="View wishlist">View Wishlist ({wishlistCount} items)</Link>
        </div>
      </div>
    ),

    addresses: (
      <div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 24 }}>Saved Addresses</h2>
        <div className="card" style={{ padding: 20, marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontWeight: 700 }}>{user.name}</span>
                <span className="badge badge-primary">Default</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>123 Main Street, Apt 4B<br />New York, NY 10001<br />United States</p>
            </div>
            <button className="btn btn-secondary btn-sm" aria-label="Edit address"><Edit2 size={14} /> Edit</button>
          </div>
        </div>
        <button className="btn btn-outline btn-sm" aria-label="Add new address">+ Add New Address</button>
      </div>
    ),

    settings: (
      <div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 24 }}>Account Settings</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { label: 'Email Notifications', desc: 'Receive order updates and promotions' },
            { label: 'SMS Notifications', desc: 'Get text alerts for deliveries' },
            { label: 'Newsletter', desc: 'Monthly style guides and exclusive offers' },
          ].map(setting => (
            <div key={setting.label} className="card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: '0.9rem' }}>{setting.label}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 2 }}>{setting.desc}</p>
              </div>
              <div style={{ width: 44, height: 24, borderRadius: 12, background: 'var(--color-primary)', display: 'flex', alignItems: 'center', cursor: 'pointer', padding: 3, justifyContent: 'flex-end' }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'white' }} />
              </div>
            </div>
          ))}
          <div style={{ marginTop: 16 }}>
            <button className="btn" style={{ background: 'rgba(239,68,68,0.08)', color: 'var(--color-error)', border: '1px solid rgba(239,68,68,0.2)' }} onClick={() => toast.warning('Account deletion requires confirmation.')} aria-label="Delete account">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    ),
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div className="container">
          <Breadcrumb items={[{ label: 'Account' }]} />
          <h1 className="page-header-title">My Account</h1>
        </div>
      </div>

      <div className="container">
        <div className="dashboard-layout">
          {/* Sidebar */}
          <aside className="dashboard-sidebar" aria-label="Account navigation">
            <div className="dashboard-user">
              <img src={user.avatar} alt={user.name} className="dashboard-avatar" />
              <div>
                <p className="dashboard-username">{user.name}</p>
                <p className="dashboard-email">{user.email}</p>
              </div>
            </div>
            <nav role="navigation" aria-label="Account sections">
              {navItems.map(item => (
                <button
                  key={item.id}
                  className={`dashboard-nav-item${activeSection === item.id ? ' active' : ''}`}
                  onClick={() => setActiveSection(item.id)}
                  role="menuitem"
                  aria-current={activeSection === item.id ? 'page' : undefined}
                >
                  {item.icon} {item.label}
                </button>
              ))}
              <div className="divider" style={{ margin: '8px 0' }} />
              <button className="dashboard-nav-item danger" onClick={handleLogout} role="menuitem" aria-label="Sign out">
                <LogOut size={17} /> Sign Out
              </button>
            </nav>
          </aside>

          {/* Content */}
          <main>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                className="card"
                style={{ padding: 28 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {content[activeSection]}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Account;
