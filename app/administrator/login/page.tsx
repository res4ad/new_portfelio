'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Terminal, Lock, User, Eye, EyeOff, CircleAlert as AlertCircle } from 'lucide-react';
import { Suspense } from 'react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/administrator/dashboard';

  const [form, setForm] = useState({ adminId: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId: form.adminId, password: form.password }),
      });
      const data = await res.json();

      if (res.ok) {
        router.push(from);
      } else {
        setError(data.error || 'Authentication failed.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }} className="grid-bg">
      <div style={{
        width: '100%',
        maxWidth: 400,
        animation: 'fadeInUp 0.5s ease forwards',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            width: 52, height: 52, background: 'var(--accent)', borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 0 30px var(--accent-glow)',
          }}>
            <Terminal size={26} color="#000" strokeWidth={2.5} />
          </div>
          <h1 style={{ color: 'white', fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.25rem', fontFamily: 'JetBrains Mono, monospace' }}>
            res4ad<span style={{ color: 'var(--accent)' }}>_admin</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem' }}>Secure Admin Access</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: '2rem',
        }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.4rem', fontFamily: 'JetBrains Mono, monospace' }}>
              ADMIN ID
            </label>
            <div style={{ position: 'relative' }}>
              <User size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input
                type="text"
                value={form.adminId}
                onChange={e => setForm(p => ({ ...p, adminId: e.target.value }))}
                placeholder="0001"
                required
                autoFocus
                className="input-dark"
                style={{ paddingLeft: '2.25rem' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.4rem', fontFamily: 'JetBrains Mono, monospace' }}>
              PASSWORD
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input
                type={showPw ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                placeholder="••••••••"
                required
                className="input-dark"
                style={{ paddingLeft: '2.25rem', paddingRight: '2.5rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                style={{
                  position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: 0,
                }}
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.2)',
              borderRadius: 6, padding: '0.65rem 0.875rem', marginBottom: '1.25rem',
            }}>
              <AlertCircle size={14} style={{ color: '#ff4444', flexShrink: 0 }} />
              <span style={{ color: '#ff6644', fontSize: '0.8rem', fontFamily: 'JetBrains Mono, monospace' }}>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.75 : 1 }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: 14, height: 14, border: '2px solid rgba(0,0,0,0.3)', borderTopColor: '#000', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                Authenticating...
              </span>
            ) : (
              'Access Dashboard'
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.72rem', marginTop: '1.5rem', fontFamily: 'JetBrains Mono, monospace' }}>
          All access attempts are logged and monitored.
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--bg)' }} />}>
      <LoginForm />
    </Suspense>
  );
}
