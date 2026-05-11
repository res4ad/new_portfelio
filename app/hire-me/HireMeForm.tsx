'use client';

import { useState } from 'react';
import { Send, Loader as Loader2, CircleCheck as CheckCircle } from 'lucide-react';

const PROJECT_TYPES = [
  'Web Application Pentest',
  'Network Security Assessment',
  'Active Directory Audit',
  'Red Team Engagement',
  'Security Consulting',
  'CTF / Training',
  'Other',
];

const BUDGETS = ['< $500', '$500 - $1,000', '$1,000 - $5,000', '$5,000+', 'Let\'s discuss'];

export default function HireMeForm() {
  const [form, setForm] = useState({
    name: '', email: '', company: '', project_type: '', budget: '', message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError('Name, email, and message are required.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSuccess(true);
        setForm({ name: '', email: '', company: '', project_type: '', budget: '', message: '' });
      } else {
        const data = await res.json();
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{
        background: 'rgba(0,255,136,0.05)', border: '1px solid var(--border-accent)',
        borderRadius: 10, padding: '2.5rem', textAlign: 'center',
      }}>
        <CheckCircle size={40} style={{ color: 'var(--accent)', margin: '0 auto 1rem' }} />
        <h3 style={{ color: 'white', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>Message Sent!</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.7 }}>
          Thanks for reaching out. I&apos;ll get back to you within 24 hours.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="btn-outline"
          style={{ marginTop: '1.5rem', fontSize: '0.85rem' }}
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div>
          <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '0.35rem', fontFamily: 'JetBrains Mono, monospace' }}>
            Name *
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="John Doe"
            required
            className="input-dark"
          />
        </div>
        <div>
          <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '0.35rem', fontFamily: 'JetBrains Mono, monospace' }}>
            Email *
          </label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="john@company.com"
            required
            className="input-dark"
          />
        </div>
      </div>

      <div>
        <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '0.35rem', fontFamily: 'JetBrains Mono, monospace' }}>
          Company (optional)
        </label>
        <input
          name="company"
          value={form.company}
          onChange={handleChange}
          placeholder="Your Company"
          className="input-dark"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div>
          <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '0.35rem', fontFamily: 'JetBrains Mono, monospace' }}>
            Project Type
          </label>
          <select
            name="project_type"
            value={form.project_type}
            onChange={handleChange}
            className="input-dark"
            style={{ cursor: 'pointer' }}
          >
            <option value="">Select type...</option>
            {PROJECT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '0.35rem', fontFamily: 'JetBrains Mono, monospace' }}>
            Budget
          </label>
          <select
            name="budget"
            value={form.budget}
            onChange={handleChange}
            className="input-dark"
            style={{ cursor: 'pointer' }}
          >
            <option value="">Select budget...</option>
            {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '0.35rem', fontFamily: 'JetBrains Mono, monospace' }}>
          Message *
        </label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Tell me about your project, scope, and requirements..."
          required
          rows={5}
          className="input-dark"
          style={{ resize: 'vertical', minHeight: 120 }}
        />
      </div>

      {error && (
        <p style={{ color: '#ff6644', fontSize: '0.825rem', fontFamily: 'JetBrains Mono, monospace' }}>
          [ERROR] {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-primary"
        style={{ justifyContent: 'center', opacity: loading ? 0.7 : 1 }}
      >
        {loading ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={15} />}
        {loading ? 'Sending...' : 'Send Message'}
      </button>

      <p style={{ color: 'var(--text-dim)', fontSize: '0.72rem', textAlign: 'center', fontFamily: 'JetBrains Mono, monospace' }}>
        Your data is secure and will never be shared with third parties.
      </p>
    </form>
  );
}
