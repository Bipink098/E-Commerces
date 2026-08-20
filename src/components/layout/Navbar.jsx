import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ShoppingCart, Heart, Search, User, Menu, X, Moon, Sun,
  ChevronDown, Package, Home, Store, Info, Phone, LogOut, Settings
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { categories } from '../../data/products';

const SearchModal = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSearch = (val) => {
    setQuery(val);
    if (val.length > 1) {
      import('../../data/products').then(({ products }) => {
        const r = products.filter(p =>
          p.name.toLowerCase().includes(val.toLowerCase()) ||
          p.category.toLowerCase().includes(val.toLowerCase()) ||
          p.brand.toLowerCase().includes(val.toLowerCase())
        ).slice(0, 5);
        setResults(r);
      });
    } else {
      setResults([]);
    }
  };

  const handleResultClick = (id) => {
    navigate(`/product/${id}`);
    onClose();
  };

  return (
    <motion.div
      className="search-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="search-modal"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -30, opacity: 0 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="search-input-wrapper">
          <Search size={20} color="var(--color-primary)" />
          <input
            ref={inputRef}
            className="search-input"
            placeholder="Search products, brands, categories..."
            value={query}
            onChange={e => handleSearch(e.target.value)}
          />
          <button onClick={onClose} aria-label="Close search">
            <X size={18} color="var(--color-text-muted)" />
          </button>
        </div>
        <div className="search-results">
          {results.length > 0 ? results.map(product => (
            <div key={product.id} className="search-result-item" onClick={() => handleResultClick(product.id)}>
              <img src={product.images[0]} alt={product.name} className="search-result-image" />
              <div>
                <p className="search-result-name">{product.name}</p>
                <p className="search-result-category">{product.brand} · {product.category}</p>
              </div>
              <span className="search-result-price">${product.price.toFixed(2)}</span>
            </div>
          )) : query.length > 1 ? (
            <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '20px' }}>No products found.</p>
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '20px', fontSize: '0.875rem' }}>
              Start typing to search products...
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [catDropdown, setCatDropdown] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const catRef = useRef(null);
  const userRef = useRef(null);

  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { theme, toggleTheme, isDark } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) setCatDropdown(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserDropdown(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    setUserDropdown(false);
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: <Home size={16} /> },
    { to: '/shop', label: 'Shop', icon: <Store size={16} /> },
    { to: '/about', label: 'About', icon: <Info size={16} /> },
    { to: '/contact', label: 'Contact', icon: <Phone size={16} /> },
  ];

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`} role="navigation" aria-label="Main navigation">
        <div className="container navbar-inner">
          {/* Logo */}
          <Link to="/" className="navbar-logo" aria-label="SHOPORA - Home">SHOPORA</Link>

          {/* Desktop Nav */}
          <div className="navbar-nav" role="menubar">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                role="menuitem"
              >
                {link.label}
              </NavLink>
            ))}

            {/* Categories Dropdown */}
            <div className="dropdown" ref={catRef}>
              <button
                className="nav-link"
                onClick={() => setCatDropdown(v => !v)}
                aria-expanded={catDropdown}
                aria-haspopup="true"
                role="menuitem"
              >
                Categories <ChevronDown size={14} style={{ display: 'inline', marginLeft: 2 }} />
              </button>
              <AnimatePresence>
                {catDropdown && (
                  <motion.div
                    className="dropdown-menu"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    role="menu"
                  >
                    {categories.map(cat => (
                      <Link
                        key={cat.id}
                        to={`/category/${cat.id}`}
                        className="dropdown-item"
                        onClick={() => setCatDropdown(false)}
                        role="menuitem"
                      >
                        <span>{cat.icon}</span> {cat.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Actions */}
          <div className="navbar-actions">
            {/* Theme Toggle */}
            <button
              className="navbar-icon-btn"
              onClick={toggleTheme}
              aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
              {isDark ? <Sun size={19} /> : <Moon size={19} />}
            </button>

            {/* Search */}
            <button
              className="navbar-icon-btn"
              onClick={() => setSearchOpen(true)}
              aria-label="Search products"
            >
              <Search size={19} />
            </button>

            {/* Wishlist */}
            <Link to="/wishlist" className="navbar-icon-btn" aria-label={`Wishlist (${wishlistCount} items)`}>
              <Heart size={19} />
              {wishlistCount > 0 && (
                <span className="navbar-badge" aria-label={`${wishlistCount} wishlist items`}>{wishlistCount}</span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="navbar-icon-btn" aria-label={`Cart (${cartCount} items)`}>
              <ShoppingCart size={19} />
              {cartCount > 0 && (
                <span className="navbar-badge" aria-label={`${cartCount} cart items`}>{cartCount}</span>
              )}
            </Link>

            {/* User */}
            <div className="dropdown" ref={userRef}>
              <button
                className="navbar-icon-btn"
                onClick={() => setUserDropdown(v => !v)}
                aria-label="User account"
                aria-expanded={userDropdown}
                aria-haspopup="true"
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <User size={19} />
                )}
              </button>
              <AnimatePresence>
                {userDropdown && (
                  <motion.div
                    className="dropdown-menu"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    style={{ right: 0, left: 'auto', transform: 'none', minWidth: 180 }}
                    role="menu"
                  >
                    {user ? (
                      <>
                        <div style={{ padding: '10px 14px 6px', borderBottom: '1px solid var(--color-border)', marginBottom: 4 }}>
                          <p style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-text)' }}>{user.name}</p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{user.email}</p>
                        </div>
                        <Link to="/account" className="dropdown-item" onClick={() => setUserDropdown(false)} role="menuitem">
                          <User size={15} /> Account
                        </Link>
                        <Link to="/orders" className="dropdown-item" onClick={() => setUserDropdown(false)} role="menuitem">
                          <Package size={15} /> Orders
                        </Link>
                        <Link to="/wishlist" className="dropdown-item" onClick={() => setUserDropdown(false)} role="menuitem">
                          <Heart size={15} /> Wishlist
                        </Link>
                        <div className="divider" />
                        <button className="dropdown-item" onClick={handleLogout} role="menuitem" style={{ width: '100%', color: 'var(--color-error)' }}>
                          <LogOut size={15} /> Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link to="/login" className="dropdown-item" onClick={() => setUserDropdown(false)} role="menuitem">
                          <User size={15} /> Login
                        </Link>
                        <Link to="/register" className="dropdown-item" onClick={() => setUserDropdown(false)} role="menuitem">
                          <Settings size={15} /> Create Account
                        </Link>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="navbar-icon-btn"
              style={{ display: 'none' }}
              onClick={() => setMobileOpen(v => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              id="mobile-menu-toggle"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className="mobile-nav-link"
                onClick={() => setMobileOpen(false)}
              >
                {link.icon} {link.label}
              </NavLink>
            ))}
            <div style={{ padding: '12px 0 0', borderTop: '1px solid var(--color-border)', marginTop: 8 }}>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-muted)', padding: '8px 16px' }}>Categories</p>
              {categories.map(cat => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.id}`}
                  className="mobile-nav-link"
                  onClick={() => setMobileOpen(false)}
                >
                  <span>{cat.icon}</span> {cat.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
      </AnimatePresence>

      {/* Mobile toggle CSS override */}
      <style>{`
        @media (max-width: 768px) {
          #mobile-menu-toggle { display: flex !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;
