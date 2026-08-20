import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Award, Truck, HeartHandshake, Users, ShoppingBag, Sparkles, CheckCircle } from 'lucide-react';
import Breadcrumb from '../components/ui/Breadcrumb';

const About = () => {
  return (
    <div className="page-wrapper">
      {/* Hero */}
      <div className="about-hero">
        <div className="container">
          <Breadcrumb items={[{ label: 'About Us' }]} />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ maxWidth: 720, margin: '0 auto' }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(108,71,255,0.2)', color: '#a78bfa', padding: '6px 16px', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20 }}>
              <Sparkles size={14} /> Our Story
            </div>
            <h1 className="hero-title" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', marginBottom: 20 }}>
              Elevating Your Shopping Experience Every Day.
            </h1>
            <p className="hero-subtitle" style={{ maxWidth: 600, margin: '0 auto 32px' }}>
              At SHOPORA, we believe that premium quality, exceptional design, and outstanding customer service should be accessible to everyone.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ background: 'var(--color-bg-secondary)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <div className="about-stats">
            {[
              { value: '10K+', label: 'Happy Customers' },
              { value: '500+', label: 'Curated Products' },
              { value: '50+', label: 'Global Brands' },
              { value: '24/7', label: 'Dedicated Support' },
            ].map(stat => (
              <div key={stat.label} className="about-stat">
                <p className="about-stat-value">{stat.value}</p>
                <p className="about-stat-label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <p className="section-label">Our Mission</p>
              <h2 className="section-title" style={{ marginBottom: 20 }}>Driven by Passion, Defined by Excellence</h2>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, fontSize: '1rem', marginBottom: 20 }}>
                Founded in 2024, SHOPORA was built with a simple mission: to create a seamless, inspiring, and transparent online shopping destination where quality is never compromised.
              </p>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, fontSize: '1rem' }}>
                We curate top-tier electronics, fashion, beauty, and lifestyle items from the world's most trusted manufacturers and deliver them straight to your doorstep with speed and care.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=700&q=80"
                alt="SHOPORA team working together"
                style={{ borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-xl)', width: '100%', objectFit: 'cover' }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section" style={{ background: 'var(--color-bg-secondary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p className="section-label">Why Choose Us</p>
            <h2 className="section-title">The SHOPORA Advantage</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              { icon: <Award size={28} />, title: 'Curated Quality Products', desc: 'Every item in our catalog undergoes rigorous quality inspection to ensure authenticity and premium standards.' },
              { icon: <Truck size={28} />, title: 'Fast & Reliable Delivery', desc: 'Enjoy lightning-fast shipping options with real-time tracking from dispatch to your doorstep.' },
              { icon: <Shield size={28} />, title: '100% Secure Shopping', desc: 'Your personal data and payments are safeguarded with bank-grade SSL encryption and security protocols.' },
              { icon: <HeartHandshake size={28} />, title: 'Customer First Policy', desc: '30-day hassle-free returns and money-back guarantee if you are not completely satisfied.' },
              { icon: <Users size={28} />, title: 'Thriving Community', desc: 'Join over 10,000 satisfied shoppers who trust SHOPORA for their everyday lifestyle needs.' },
              { icon: <ShoppingBag size={28} />, title: 'Best Value Guarantee', desc: 'Fair pricing, regular sales, and exclusive rewards for our loyal community members.' },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                className="card"
                style={{ padding: 32 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
              >
                <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-md)', background: 'var(--color-primary-muted)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  {card.icon}
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 10, color: 'var(--color-text)' }}>{card.title}</h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-sm">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="section-title" style={{ marginBottom: 16 }}>Ready to Upgrade Your Shopping?</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 32, fontSize: '1.1rem' }}>
            Explore thousands of products with free shipping on orders over $100.
          </p>
          <Link to="/shop" className="btn btn-primary btn-lg" aria-label="Explore collection">
            Explore Collection Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
