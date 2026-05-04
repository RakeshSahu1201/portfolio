import React, { useState } from 'react';
import { useContact } from '../hooks/useApi';

const styles = {
  section: {
    padding: '100px 0',
    borderTop: '1px solid var(--border)',
    borderBottom: '1px solid var(--border)',
  },
  title: {
    fontSize: 'clamp(32px, 5vw, 52px)',
    fontFamily: 'var(--font-display)',
    fontWeight: 800,
    letterSpacing: '-0.02em',
    marginBottom: 48,
  },
  form: {
    maxWidth: 600,
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  group: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  label: {
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    color: 'var(--text-muted)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  input: {
    background: 'var(--bg2)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: '12px 16px',
    fontFamily: 'var(--font-base)',
    fontSize: 14,
    color: 'var(--text)',
    transition: 'border-color var(--transition)',
    outline: 'none',
  },
  textarea: {
    background: 'var(--bg2)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: '12px 16px',
    fontFamily: 'var(--font-base)',
    fontSize: 14,
    color: 'var(--text)',
    transition: 'border-color var(--transition)',
    outline: 'none',
    minHeight: 150,
    resize: 'vertical',
  },
  button: {
    background: 'var(--accent)',
    color: 'var(--bg1)',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    padding: '12px 24px',
    fontFamily: 'var(--font-display)',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all var(--transition)',
  },
  message: {
    padding: '12px 16px',
    borderRadius: 'var(--radius-md)',
    fontFamily: 'var(--font-mono)',
    fontSize: 13,
  },
  successMessage: {
    background: 'rgba(52, 211, 153, 0.1)',
    border: '1px solid var(--green)',
    color: 'var(--green)',
  },
  errorMessage: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid var(--red)',
    color: 'var(--red)',
  },
};

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const { submitContact, loading, error, success } = useContact();
  const [showMessage, setShowMessage] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowMessage(false);

    const result = await submitContact(formData);
    if (result) {
      setFormData({ name: '', email: '', subject: '', message: '' });
    }
    setShowMessage(true);
  };

  return (
    <section style={styles.section}>
      <div className="container">
        <h2 style={styles.title}>Get in Touch</h2>
        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.group}>
            <label htmlFor="name" style={styles.label}>Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              style={styles.input}
              required
              onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
              onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
            />
          </div>

          <div style={styles.group}>
            <label htmlFor="email" style={styles.label}>Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              style={styles.input}
              required
              onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
              onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
            />
          </div>

          <div style={styles.group}>
            <label htmlFor="subject" style={styles.label}>Subject</label>
            <input
              id="subject"
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="What's this about?"
              style={styles.input}
              required
              onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
              onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
            />
          </div>

          <div style={styles.group}>
            <label htmlFor="message" style={styles.label}>Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your message here..."
              style={styles.textarea}
              required
              onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
              onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
            />
          </div>

          <button
            type="submit"
            style={styles.button}
            disabled={loading}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>

          {showMessage && (
            <div style={{
              ...styles.message,
              ...(success ? styles.successMessage : styles.errorMessage),
            }}>
              {success ? '✓ Message sent successfully!' : `✕ ${error || 'Failed to send message'}`}
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
