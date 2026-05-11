'use client';

import { useState } from 'react';
import { Mail, Clock, User, Briefcase, DollarSign, Trash2 } from 'lucide-react';

interface Message {
  id: string; name: string; email: string; company: string;
  project_type: string; budget: string; message: string;
  ip_address: string; status: string; created_at: string;
}

export default function MessagesClient({ messages }: { messages: Message[] }) {
  const [selected, setSelected] = useState<Message | null>(null);
  const [list, setList] = useState(messages);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? list : list.filter(m => m.status === filter);

  const updateStatus = async (id: string, status: string) => {
    await fetch('/api/admin/messages', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
    setList(prev => prev.map(m => m.id === id ? { ...m, status } : m));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null);
  };

  const STATUS_COLORS: Record<string, string> = {
    unread: 'var(--accent)', read: 'var(--text-muted)', replied: '#4499ff', archived: 'var(--text-dim)',
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: '1.5rem' }}>
      {/* List */}
      <div>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          {['all', 'unread', 'read', 'replied', 'archived'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{
                background: filter === f ? 'var(--accent-glow)' : 'var(--bg-card)',
                color: filter === f ? 'var(--accent)' : 'var(--text-muted)',
                border: `1px solid ${filter === f ? 'var(--border-accent)' : 'var(--border)'}`,
                borderRadius: 6, padding: '0.3rem 0.75rem', cursor: 'pointer',
                fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace',
              }}
            >{f}</button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.length === 0 && (
            <p style={{ color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.825rem' }}>No messages.</p>
          )}
          {filtered.map(msg => (
            <div key={msg.id}
              onClick={() => { setSelected(msg); updateStatus(msg.id, msg.status === 'unread' ? 'read' : msg.status); }}
              className="card"
              style={{
                padding: '1rem 1.25rem', cursor: 'pointer',
                borderLeft: msg.status === 'unread' ? '2px solid var(--accent)' : '2px solid var(--border)',
                background: selected?.id === msg.id ? 'var(--bg-card-hover)' : undefined,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                <span style={{ color: 'white', fontWeight: 600, fontSize: '0.875rem' }}>{msg.name}</span>
                <span style={{ color: STATUS_COLORS[msg.status] || 'var(--text-dim)', fontSize: '0.68rem', fontFamily: 'JetBrains Mono, monospace' }}>{msg.status}</span>
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{msg.email}</div>
              {msg.project_type && <span className="tag tag-gray" style={{ marginTop: '0.35rem', fontSize: '0.68rem' }}>{msg.project_type}</span>}
              <div style={{ color: 'var(--text-dim)', fontSize: '0.7rem', marginTop: '0.35rem', fontFamily: 'JetBrains Mono, monospace' }}>
                {new Date(msg.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail */}
      {selected && (
        <div className="card" style={{ padding: '1.5rem', alignSelf: 'start', position: 'sticky', top: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ color: 'white', fontWeight: 700, fontSize: '1.1rem' }}>{selected.name}</h2>
              <a href={`mailto:${selected.email}`} style={{ color: 'var(--accent)', fontSize: '0.85rem', textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace' }}>{selected.email}</a>
            </div>
            <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
            {selected.company && (
              <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: 6 }}>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.68rem', fontFamily: 'JetBrains Mono, monospace', marginBottom: '0.2rem' }}>COMPANY</div>
                <div style={{ color: 'white', fontSize: '0.85rem' }}>{selected.company}</div>
              </div>
            )}
            {selected.project_type && (
              <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: 6 }}>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.68rem', fontFamily: 'JetBrains Mono, monospace', marginBottom: '0.2rem' }}>PROJECT TYPE</div>
                <div style={{ color: 'white', fontSize: '0.85rem' }}>{selected.project_type}</div>
              </div>
            )}
            {selected.budget && (
              <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: 6 }}>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.68rem', fontFamily: 'JetBrains Mono, monospace', marginBottom: '0.2rem' }}>BUDGET</div>
                <div style={{ color: 'white', fontSize: '0.85rem' }}>{selected.budget}</div>
              </div>
            )}
            <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: 6 }}>
              <div style={{ color: 'var(--text-dim)', fontSize: '0.68rem', fontFamily: 'JetBrains Mono, monospace', marginBottom: '0.2rem' }}>IP</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontFamily: 'JetBrains Mono, monospace' }}>{selected.ip_address}</div>
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.68rem', fontFamily: 'JetBrains Mono, monospace', marginBottom: '0.5rem' }}>MESSAGE</div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.75, whiteSpace: 'pre-wrap', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 6 }}>
              {selected.message}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['read', 'replied', 'archived'].map(s => (
              <button key={s} onClick={() => updateStatus(selected.id, s)}
                style={{
                  background: selected.status === s ? 'var(--accent-glow)' : 'var(--bg-card)',
                  color: selected.status === s ? 'var(--accent)' : 'var(--text-muted)',
                  border: `1px solid ${selected.status === s ? 'var(--border-accent)' : 'var(--border)'}`,
                  borderRadius: 6, padding: '0.35rem 0.75rem', cursor: 'pointer', fontSize: '0.75rem',
                }}
              >{s}</button>
            ))}
            <a href={`mailto:${selected.email}`} className="btn-primary" style={{ fontSize: '0.78rem', padding: '0.35rem 0.875rem', marginLeft: 'auto' }}>
              <Mail size={13} /> Reply
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
