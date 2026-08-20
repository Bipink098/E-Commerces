import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, CheckCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.includes('@')) { toast.error('Please enter a valid email address.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
  };

  return (
    <div className="auth-page">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link to="/" className="auth-logo" aria-label="SHOPORA">SHOPORA</Link>

        <AnimatePresence mode="wait">
          {!sent ? (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h1 className="auth-title">Forgot Password?</h1>
              <p className="auth-subtitle">Enter your email address and we'll send you a link to reset your password.</p>

              <form className="auth-form" onSubmit={handleSubmit} noValidate>
                <div className="input-group">
                  <label className="input-label" htmlFor="forgot-email">Email Address</label>
                  <div className="input-icon-wrapper">
                    <Mail size={16} className="input-icon" />
                    <input id="forgot-email" type="email" className="input" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required aria-required="true" />
                  </div>
                </div>
                <motion.button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading} whileTap={{ scale: 0.97 }} aria-label="Send reset link">
                  {loading ? 'Sending...' : 'Send Reset Link'} {!loading && <ArrowRight size={18} />}
                </motion.button>
              </form>
            </motion.div>
          ) : (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(16,185,129,0.1)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <CheckCircle size={32} />
              </div>
              <h1 className="auth-title">Check Your Email</h1>
              <p className="auth-subtitle">
                We've sent a password reset link to <strong style={{ color: 'var(--color-primary)' }}>{email}</strong>.<br />
                Please check your inbox and follow the instructions.
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 16 }}>
                Didn't receive the email?{' '}
                <button style={{ color: 'var(--color-primary)', fontWeight: 600 }} onClick={() => setSent(false)}>
                  Try again
                </button>
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="auth-footer" style={{ marginTop: 24 }}>
          <Link to="/login" className="auth-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <ArrowLeft size={14} /> Back to Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
