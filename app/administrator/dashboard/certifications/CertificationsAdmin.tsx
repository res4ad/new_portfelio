'use client';

import { useState } from 'react';
import { Plus, Save, Trash2, X, Award } from 'lucide-react';

interface Cert {
  id: string; name: string; issuer: string; issue_date: string;
  expiry_date: string; credential_id: string; credential_url: string;
  badge_url: string; is_active: boolean; sort_order: number;
}

const EMPTY: Omit<Cert, 'id'> = {
  name: '', issuer: '', issue_date: '', expiry_date: '', credential_id: '',
  credential_url: '', badge_url: '', is_active: true, sort_order: 0,
};

export default function CertificationsAdmin({ certs: initial }: { certs: Cert[] }) {
  const [certs, setCerts] = useState(initial);
  const [editing, setEditing] = useState<Cert | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const save = async () => {
    if (!editing) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/certifications', {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      });
      const data = await res.json();
      if (res.ok) {
        if (isNew) setCerts(c => [...c, data.cert]);
        else setCerts(c => c.map(x => x.id === data.cert.id ? data.cert : x));
        setEditing(null); setIsNew(false);
        flash('Saved!');
      } else flash(data.error || 'Error');
    } finally { setLoading(false); }
  };

  const del = async (id: string) => {
    if (!confirm('Delete certification?')) return;
    await fetch(`/api/admin/certifications?id=${id}`, { method: 'DELETE' });
    setCerts(c => c.filter(x => x.id !== id));
  };

  const sf = (k: keyof Cert, v: unknown) => setEditing(prev => prev ? { ...prev, [k]: v } : prev);

  return (
    <div>
      {msg && <div style={{ background: 'rgba(0,255,136,0.08)', border: '1px solid var(--border-accent)', borderRadius: 6, padding: '0.65rem 1rem', marginBottom: '1rem', color: 'var(--accent)', fontSize: '0.825rem' }}>{msg}</div>}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.25rem' }}>
        <button onClick={() => { setEditing({ ...EMPTY, id: '' } as Cert); setIsNew(true); }} className="btn-primary" style={{ fontSize: '0.85rem' }}>
          <Plus size={15} /> Add Certification
        </button>
      </div>

      {editing && (
        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>{isNew ? 'New Certification' : 'Edit Certification'}</h2>
            <button onClick={() => { setEditing(null); setIsNew(false); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={18} /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {([
              { k: 'name', label: 'Cert Name', ph: 'e.g. CRTA' },
              { k: 'issuer', label: 'Issuer', ph: 'e.g. CyberWarFare Labs' },
              { k: 'issue_date', label: 'Date Obtained', ph: '2024-01-01', type: 'date' },
              { k: 'expiry_date', label: 'Expiry Date', ph: '2027-01-01', type: 'date' },
              { k: 'credential_id', label: 'Credential ID', ph: 'CWL-CRTA-...' },
              { k: 'credential_url', label: 'Credential URL', ph: 'https://...' },
              { k: 'badge_url', label: 'Badge Image URL', ph: 'https://...' },
            ] as { k: keyof Cert; label: string; ph: string; type?: string }[]).map(({ k, label, ph, type }) => (
              <div key={k as string}>
                <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.72rem', marginBottom: '0.35rem', fontFamily: 'JetBrains Mono, monospace' }}>{label}</label>
                <input type={type || 'text'} value={(editing[k] as string) || ''} onChange={e => sf(k, e.target.value)} placeholder={ph} className="input-dark" />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', alignItems: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={editing.is_active} onChange={e => sf('is_active', e.target.checked)} /> Active
            </label>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button onClick={save} disabled={loading} className="btn-primary" style={{ fontSize: '0.85rem' }}>
              <Save size={14} /> {loading ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => { setEditing(null); setIsNew(false); }} className="btn-outline" style={{ fontSize: '0.85rem' }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {certs.map(cert => (
          <div key={cert.id} className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
              <div style={{ width: 40, height: 40, background: 'var(--accent-glow)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Award size={20} color="var(--accent)" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>{cert.name}</div>
                <div style={{ color: 'var(--accent)', fontSize: '0.78rem', fontFamily: 'JetBrains Mono, monospace' }}>{cert.issuer}</div>
              </div>
            </div>
            {cert.issue_date && (
              <div style={{ color: 'var(--text-dim)', fontSize: '0.72rem', fontFamily: 'JetBrains Mono, monospace', marginBottom: '0.5rem' }}>
                Issued: {cert.issue_date}
                {cert.expiry_date && ` · Expires: ${cert.expiry_date}`}
              </div>
            )}
            {cert.credential_id && <div style={{ color: 'var(--text-dim)', fontSize: '0.7rem', fontFamily: 'JetBrains Mono, monospace' }}>ID: {cert.credential_id}</div>}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
              <button onClick={() => { setEditing(cert); setIsNew(false); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.78rem', fontFamily: 'JetBrains Mono, monospace' }}>Edit</button>
              <button onClick={() => del(cert.id)} style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer' }}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        {certs.length === 0 && <p style={{ color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.825rem' }}>No certifications yet.</p>}
      </div>
    </div>
  );
}
