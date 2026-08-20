import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();

  const shopLinks = [
    { label: 'New Arrivals', to: '/shop?sort=newest' },
    { label: 'Best Sellers', to: '/shop?sort=popular' },
    { label: 'Sale', to: '/shop?discount=true' },
    { label: 'All Products', to: '/shop' },
  ];

  const companyLinks = [
    { label: 'About Us', to: '/about' },
    { label: 'Contact', to: '/contact' },
    { label: 'Careers', to: '/about' },
    { label: 'Blog', to: '/about' },
  ];

  const legalLinks = [
    { label: 'Privacy Policy', to: '/contact' },
    { label: 'Terms & Conditions', to: '/contact' },
    { label: 'Cookie Policy', to: '/contact' },
    { label: 'Returns Policy', to: '/contact' },
  ];

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <Link to="/" className="footer-logo" aria-label="SHOPORA - Home">SHOPORA</Link>
            <p className="footer-tagline">
              Everything You Love, In One Place.<br />
              Shop the latest trends, everyday essentials and premium products with confidence.
            </p>
            <div className="footer-social" aria-label="Social media links">
              {/* Facebook SVG */}
              <a href="#" className="footer-social-btn" aria-label="Facebook" rel="noopener noreferrer" target="_blank">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              {/* Instagram SVG */}
              <a href="#" className="footer-social-btn" aria-label="Instagram" rel="noopener noreferrer" target="_blank">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              {/* Twitter / X SVG */}
              <a href="#" className="footer-social-btn" aria-label="Twitter X" rel="noopener noreferrer" target="_blank">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                </svg>
              </a>
              {/* LinkedIn SVG */}
              <a href="#" className="footer-social-btn" aria-label="LinkedIn" rel="noopener noreferrer" target="_blank">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Shop */}
          <nav aria-label="Shop navigation">
            <h3 className="footer-col-title">Shop</h3>
            <ul className="footer-links" role="list">
              {shopLinks.map(l => (
                <li key={l.label}>
                  <Link to={l.to} className="footer-link">{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company */}
          <nav aria-label="Company navigation">
            <h3 className="footer-col-title">Company</h3>
            <ul className="footer-links" role="list">
              {companyLinks.map(l => (
                <li key={l.label}>
                  <Link to={l.to} className="footer-link">{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal */}
          <nav aria-label="Legal navigation">
            <h3 className="footer-col-title">Legal</h3>
            <ul className="footer-links" role="list">
              {legalLinks.map(l => (
                <li key={l.label}>
                  <Link to={l.to} className="footer-link">{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">© {year} SHOPORA. All rights reserved.</p>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <a href="mailto:support@shopora.com" className="footer-link" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Mail size={14} /> support@shopora.com
            </a>
            <a href="tel:+15551234567" className="footer-link" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Phone size={14} /> +1 (555) 123-4567
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
