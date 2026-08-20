import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) { toast.error('Please fill in all fields.'); return; }
    if (formData.password.length < 6) { toast.error('Password must be at least 6 characters.'); return; }
    if (formData.password !== formData.confirm) { toast.error('Passwords do not match.'); return; }
    if (!agreed) { toast.error('Please agree to the terms and conditions.'); return; }
    setLoading(true);
    await register(formData.name, formData.email, formData.password);
    setLoading(false);
    toast.success('Account created! Welcome to SHOPORA! 🎉');
    navigate('/account');
  };

  const passwordStrength = () => {
    const p = formData.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 6) score++;
    if (p.length >= 10) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  };

  const strength = passwordStrength();
  const strengthColors = ['', '#ef4444', '#f59e0b', '#f59e0b', '#10b981', '#10b981'];
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];

  return (
    <div className="auth-page">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Link to="/" className="auth-logo" aria-label="SHOPORA">SHOPORA</Link>
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join SHOPORA and start shopping today</p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="input-group">
            <label className="input-label" htmlFor="reg-name">Full Name</label>
            <div className="input-icon-wrapper">
              <User size={16} className="input-icon" />
              <input id="reg-name" name="name" type="text" className="input" placeholder="John Doe" value={formData.name} onChange={handleChange} required aria-required="true" />
            </div>
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="reg-email">Email Address</label>
            <div className="input-icon-wrapper">
              <Mail size={16} className="input-icon" />
              <input id="reg-email" name="email" type="email" className="input" placeholder="you@example.com" value={formData.email} onChange={handleChange} required aria-required="true" />
            </div>
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="reg-password">Password</label>
            <div className="input-icon-wrapper">
              <Lock size={16} className="input-icon" />
              <input id="reg-password" name="password" type={showPassword ? 'text' : 'password'} className="input" placeholder="Min. 6 characters" value={formData.password} onChange={handleChange} required aria-required="true" style={{ paddingRight: 44 }} />
              <button type="button" onClick={() => setShowPassword(v => !v)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {formData.password && (
              <div>
                <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                  {[1,2,3,4,5].map(i => (
                    <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= strength ? strengthColors[strength] : 'var(--color-border)', transition: 'all 0.3s' }} />
                  ))}
                </div>
                <p style={{ fontSize: '0.7rem', color: strengthColors[strength], marginTop: 4 }}>{strengthLabels[strength]}</p>
              </div>
            )}
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="reg-confirm">Confirm Password</label>
            <div className="input-icon-wrapper">
              <Lock size={16} className="input-icon" />
              <input id="reg-confirm" name="confirm" type="password" className="input" placeholder="Repeat your password" value={formData.confirm} onChange={handleChange} required aria-required="true" />
            </div>
            {formData.confirm && formData.password !== formData.confirm && (
              <p style={{ fontSize: '0.75rem', color: 'var(--color-error)', marginTop: 4 }}>Passwords do not match</p>
            )}
          </div>

          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
            <div
              style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${agreed ? 'var(--color-primary)' : 'var(--color-border)'}`, background: agreed ? 'var(--color-primary)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1, transition: 'all 0.2s' }}
              onClick={() => setAgreed(v => !v)}
              role="checkbox"
              aria-checked={agreed}
              tabIndex={0}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setAgreed(v => !v)}
            >
              {agreed && <Check size={12} color="white" />}
            </div>
            <span style={{ fontSize: '0.825rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
              I agree to the{' '}
              <Link to="/contact" className="auth-link">Terms of Service</Link>
              {' '}and{' '}
              <Link to="/contact" className="auth-link">Privacy Policy</Link>
            </span>
          </label>

          <motion.button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading} whileTap={{ scale: 0.97 }} aria-label="Create account">
            {loading ? 'Creating Account...' : 'Create Account'} {!loading && <ArrowRight size={18} />}
          </motion.button>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
