import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import Breadcrumb from '../components/ui/Breadcrumb';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
    toast.success('Message sent successfully! We\'ll respond within 24 hours.');
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div className="container">
          <Breadcrumb items={[{ label: 'Contact Us' }]} />
          <h1 className="page-header-title">Get in Touch</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: 4 }}>
            We'd love to hear from you. Our team is always here to help.
          </p>
        </div>
      </div>

      <div className="container">
        <div className="contact-layout">
          {/* Contact Info */}
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 24 }}>Contact Information</h2>

            {[
              { icon: <Mail size={20} />, title: 'Email Us', line1: 'support@shopora.com', line2: 'sales@shopora.com' },
              { icon: <Phone size={20} />, title: 'Call Us', line1: '+1 (555) 123-4567', line2: 'Mon-Fri 9am-6pm EST' },
              { icon: <MapPin size={20} />, title: 'Visit Us', line1: '100 Innovation Way, Suite 400', line2: 'New York, NY 10001, USA' },
              { icon: <Clock size={20} />, title: 'Business Hours', line1: 'Monday – Friday: 9:00 AM – 6:00 PM', line2: 'Saturday – Sunday: 10:00 AM – 4:00 PM' },
            ].map(info => (
              <motion.div key={info.title} className="contact-info-card" whileHover={{ y: -2 }}>
                <div className="contact-info-icon">{info.icon}</div>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text)', marginBottom: 4 }}>{info.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{info.line1}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{info.line2}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="card" style={{ padding: 36 }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 8 }}>Send Us a Message</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: 28 }}>
              Fill out the form below and our team will get back to you within 24 hours.
            </p>

            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form key="form" onSubmit={handleSubmit} noValidate className="auth-form">
                  <div className="form-grid-2">
                    <div className="input-group">
                      <label className="input-label" htmlFor="contact-name">Your Name <span style={{ color: 'var(--color-accent)' }}>*</span></label>
                      <input
                        id="contact-name"
                        type="text"
                        className="input"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                        required
                        aria-required="true"
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label" htmlFor="contact-email">Your Email <span style={{ color: 'var(--color-accent)' }}>*</span></label>
                      <input
                        id="contact-email"
                        type="email"
                        className="input"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                        required
                        aria-required="true"
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="input-label" htmlFor="contact-subject">Subject</label>
                    <input
                      id="contact-subject"
                      type="text"
                      className="input"
                      placeholder="Order inquiry, feedback, etc."
                      value={formData.subject}
                      onChange={e => setFormData(p => ({ ...p, subject: e.target.value }))}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label" htmlFor="contact-message">Message <span style={{ color: 'var(--color-accent)' }}>*</span></label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      className="input"
                      placeholder="How can we help you?"
                      value={formData.message}
                      onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                      required
                      aria-required="true"
                      style={{ resize: 'vertical' }}
                    />
                  </div>

                  <motion.button
                    type="submit"
                    className="btn btn-primary btn-lg w-full"
                    disabled={loading}
                    whileTap={{ scale: 0.97 }}
                    aria-label="Send message"
                  >
                    {loading ? 'Sending...' : 'Send Message'} {!loading && <Send size={18} />}
                  </motion.button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ textAlign: 'center', padding: '40px 0' }}
                >
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(16,185,129,0.1)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                    <CheckCircle size={32} />
                  </div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 8 }}>Message Sent!</h3>
                  <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24 }}>
                    Thank you for contacting SHOPORA. We have received your message and will respond shortly.
                  </p>
                  <button className="btn btn-secondary" onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', subject: '', message: '' }); }}>
                    Send Another Message
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
