'use client';

import { useState } from 'react';
import { CircleAlert as AlertCircle, CircleCheck as CheckCircle, Info, Lock } from 'lucide-react';

interface Log {
  id: string; action: string; admin_id: string; details: string;
  ip_address: string; user_agent: string; created_at: string;
}

export default function LogsClient({ logs }: { logs: Log[] }) {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? logs : logs.filter(l => l.action.includes(filter));

  const actionIcon = (action: string) => {
    if (action.includes('login')) return <Lock size={14} color="#4499ff" />;
    if (action.includes('delete')) return <AlertCircle size={14} color="#ff4444" />;
    if (action.includes('create') || action.includes('update')) return <CheckCircle size={14} color="var(--accent)" />;
    return <Info size={14} color="var(--text-muted)" />;
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['all', 'login', 'create', 'update', 'delete'].map(f => (
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {filtered.length === 0 && (
          <p style={{ color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.825rem' }}>No logs found.</p>
        )}
        {filtered.map(log => (
          <div key={log.id} className="card" style={{ padding: '0.75rem 1.25rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <div style={{ marginTop: '0.15rem', flexShrink: 0 }}>{actionIcon(log.action)}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                  <span style={{ color: 'white', fontWeight: 600, fontSize: '0.85rem' }}>{log.action}</span>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.7rem', fontFamily: 'JetBrains Mono, monospace', flexShrink: 0 }}>
                    {new Date(log.created_at).toLocaleString()}
                  </span>
                </div>
                {log.details && (
                  <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace', marginBottom: '0.3rem', wordBreak: 'break-all' }}>
                    {log.details}
                  </div>
                )}
                <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.7rem', color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace' }}>
                  <span>IP: {log.ip_address}</span>
                  {log.user_agent && <span title={log.user_agent} style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>UA: {log.user_agent.split('/')[0]}</span>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
