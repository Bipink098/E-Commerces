import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  ArrowRight, ShoppingBag, Zap, Shield, Truck, Star,
  CheckCircle, Mail, Sparkles, TrendingUp, Award
} from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import CategoryCard from '../components/product/CategoryCard';
import { useToast } from '../context/ToastContext';
import {
  products, categories, testimonials,
  getFeaturedProducts, getBestsellers, getNewArrivals
} from '../data/products';

/* ---- Animated Counter ---- */
const Counter = ({ end, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1500;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
};

/* ---- Hero ---- */
const Hero = () => (
  <section className="hero" aria-label="Hero section">
    <div className="hero-bg-orbs" aria-hidden="true">
      <div className="hero-orb hero-orb-1" />
      <div className="hero-orb hero-orb-2" />
      <div className="hero-orb hero-orb-3" />
    </div>
    <div className="container">
      <div className="hero-content">
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <motion.div
            className="hero-label"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles size={14} />
            <span>New Season — Summer 2026</span>
          </motion.div>

          <h1 className="hero-title">
            Discover<br />
            Products{' '}
            <span className="hero-title-accent">You'll Love.</span>
          </h1>

          <p className="hero-subtitle">
            Shop the latest trends, everyday essentials and premium products—all in one place. Quality you can trust, prices you'll love.
          </p>

          <div className="hero-actions">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link to="/shop" className="btn btn-primary btn-lg" aria-label="Shop now">
                <ShoppingBag size={18} /> Shop Now
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link to="/shop?sort=newest" className="btn btn-secondary btn-lg" aria-label="Explore collection">
                Explore Collection <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>

          <div className="hero-stats" aria-label="SHOPORA statistics">
            {[
              { value: 10000, suffix: '+', label: 'Happy Customers' },
              { value: 500, suffix: '+', label: 'Products' },
              { value: 50, suffix: '+', label: 'Brands' },
            ].map(stat => (
              <div key={stat.label} className="hero-stat">
                <p className="hero-stat-value">
                  <Counter end={stat.value} suffix={stat.suffix} />
                </p>
                <p className="hero-stat-label">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Image */}
        <motion.div
          className="hero-image-wrapper"
          initial={{ opacity: 0, x: 40, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80"
            alt="Premium fashion and lifestyle products - Shop at SHOPORA"
            className="hero-image"
          />

          {/* Float Cards */}
          <motion.div
            className="hero-float-card hero-float-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            aria-hidden="true"
          >
            <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--color-primary-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={18} color="var(--color-primary)" />
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-text)' }}>Trending Now</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>1,240 new products</p>
            </div>
          </motion.div>

          <motion.div
            className="hero-float-card hero-float-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            aria-hidden="true"
          >
            <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={18} color="var(--color-success)" />
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-text)' }}>Secure Shopping</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>100% Guaranteed</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  </section>
);

/* ---- Feature Strip ---- */
const FeatureStrip = () => (
  <section style={{ background: 'var(--color-bg-secondary)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', padding: '28px 0' }}>
    <div className="container">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }} role="list" aria-label="Shopping benefits">
        {[
          { icon: <Truck size={22} />, title: 'Free Shipping', desc: 'On orders over $100' },
          { icon: <Shield size={22} />, title: 'Secure Payments', desc: '100% protected & safe' },
          { icon: <Award size={22} />, title: 'Premium Quality', desc: 'Curated top brands' },
          { icon: <Zap size={22} />, title: '24/7 Support', desc: 'Always here for you' },
        ].map(f => (
          <motion.div
            key={f.title}
            style={{ display: 'flex', alignItems: 'center', gap: 14 }}
            whileHover={{ scale: 1.02 }}
            role="listitem"
          >
            <div style={{
              width: 48, height: 48, borderRadius: 'var(--radius-md)',
              background: 'var(--color-primary-muted)', color: 'var(--color-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }} aria-hidden="true">
              {f.icon}
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-text)' }}>{f.title}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
    <style>{`@media(max-width:768px){.feature-strip-grid{grid-template-columns: repeat(2,1fr)!important;}}`}</style>
  </section>
);

/* ---- Section Header ---- */
const SectionHeader = ({ label, title, subtitle, center = true }) => (
  <div className={`section-header${center ? '' : ''}`} style={{ textAlign: center ? 'center' : 'left' }}>
    {label && <p className="section-label">{label}</p>}
    <h2 className="section-title">{title}</h2>
    {subtitle && <p className="section-subtitle" style={{ margin: center ? '12px auto 0' : '12px 0 0' }}>{subtitle}</p>}
  </div>
);

/* ---- Newsletter ---- */
const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.includes('@')) { toast.error('Please enter a valid email address.'); return; }
    setSent(true);
    toast.success('🎉 Welcome! Your 10% discount code is on its way!');
    setEmail('');
  };

  return (
    <section className="section-sm">
      <div className="container">
        <motion.div
          className="newsletter-section"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div style={{ position: 'relative', zIndex: 1 }}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', borderRadius: 'var(--radius-full)', padding: '6px 16px', fontSize: '0.8rem', fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginBottom: 16, letterSpacing: '0.05em' }}
            >
              ✉️ EXCLUSIVE OFFER
            </motion.div>
            <h2 className="newsletter-title">Get 10% Off Your First Order</h2>
            <p className="newsletter-subtitle">
              Join 10,000+ subscribers and be the first to hear about new arrivals, exclusive deals, and style tips.
            </p>
            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.2)', padding: '14px 24px', borderRadius: 'var(--radius-full)', color: 'white', fontWeight: 600 }}
              >
                <CheckCircle size={20} /> You're in! Check your inbox for your discount code.
              </motion.div>
            ) : (
              <form className="newsletter-form" onSubmit={handleSubmit} noValidate>
                <input
                  type="email"
                  className="newsletter-input"
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  aria-label="Email address for newsletter subscription"
                  id="newsletter-email"
                />
                <motion.button
                  type="submit"
                  className="btn btn-secondary btn-lg"
                  style={{ flexShrink: 0, background: 'white', color: 'var(--color-primary)' }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  aria-label="Subscribe to newsletter"
                >
                  Subscribe <ArrowRight size={18} />
                </motion.button>
              </form>
            )}
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: 12 }}>
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ---- Testimonials ---- */
const Testimonials = () => (
  <section className="section" style={{ background: 'var(--color-bg-secondary)' }}>
    <div className="container">
      <SectionHeader
        label="Customer Love"
        title="What Our Customers Say"
        subtitle="Don't just take our word for it. Here's what our happy customers have to say."
      />
      <div className="testimonials-grid">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.id}
            className="testimonial-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
          >
            <img src={t.avatar} alt={t.name} className="testimonial-avatar" />
            <div>
              <p className="testimonial-name">{t.name}</p>
              <p className="testimonial-product">Bought: {t.product}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="stars" aria-label={`${t.rating} stars`}>
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={14} fill={s <= t.rating ? 'var(--color-star)' : 'none'} stroke={s <= t.rating ? 'var(--color-star)' : 'var(--color-border)'} />
                ))}
              </span>
              <span className="verified-badge">
                <CheckCircle size={12} /> Verified Buyer
              </span>
            </div>
            <p className="testimonial-text">"{t.review}"</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 8 }}>{t.date}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ---- Promo Banner ---- */
const PromoBanner = () => (
  <section className="section-sm">
    <div className="container">
      <motion.div
        className="promo-banner"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="promo-banner-content">
          <div className="promo-tag">🔥 Limited Time Deal</div>
          <h2 className="promo-title">Summer Sale<br />Up to 50% Off</h2>
          <p className="promo-subtitle">Use code <strong style={{ color: '#ff9b9b' }}>SUMMER50</strong> at checkout</p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Link to="/shop?sale=true" className="btn btn-accent btn-lg" aria-label="Shop sale items">
              Shop Sale <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  </section>
);

/* ---- Home Page ---- */
const Home = () => {
  const featured = getFeaturedProducts();
  const bestsellers = getBestsellers().slice(0, 4);
  const newArrivals = getNewArrivals().slice(0, 4);
  const trending = products.slice(0, 8);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <main>
      <Hero />
      <FeatureStrip />

      {/* Featured Categories */}
      <section className="section" id="categories">
        <div className="container">
          <SectionHeader
            label="Browse By Category"
            title="Shop Our Collections"
            subtitle="Explore our curated selection of premium products across all categories."
          />
          <div className="categories-grid">
            {categories.map((cat, i) => (
              <CategoryCard key={cat.id} category={cat} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="section" style={{ background: 'var(--color-bg-secondary)' }} id="trending">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <p className="section-label">Hot Right Now</p>
              <h2 className="section-title">Trending Products</h2>
            </div>
            <Link to="/shop" className="btn btn-outline" aria-label="View all products">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <motion.div
            className="products-grid products-grid-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {trending.map(product => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Promo Banner */}
      <PromoBanner />

      {/* New Arrivals */}
      <section className="section" id="new-arrivals">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <p className="section-label">Just Dropped</p>
              <h2 className="section-title">New Arrivals</h2>
            </div>
            <Link to="/shop?sort=newest" className="btn btn-outline" aria-label="View all new arrivals">
              View All New <ArrowRight size={16} />
            </Link>
          </div>
          <motion.div
            className="products-grid products-grid-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {newArrivals.map(product => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="section" style={{ background: 'var(--color-bg-secondary)' }} id="bestsellers">
        <div className="container">
          <SectionHeader
            label="Customer Favorites"
            title="Best Sellers"
            subtitle="The products our customers love the most, tried and tested."
          />
          <motion.div
            className="products-grid products-grid-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {bestsellers.map(product => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link to="/shop" className="btn btn-primary btn-lg" aria-label="View all products">
              <ShoppingBag size={18} /> View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Newsletter */}
      <Newsletter />
    </main>
  );
};

export default Home;
