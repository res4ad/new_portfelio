'use client';

import { useState } from 'react';
import { Plus, Save, Trash2, X, Terminal } from 'lucide-react';

interface TermCmd {
  id: string; command: string; output: string; description: string;
  output_type: string; sort_order: number;
}

const EMPTY: Omit<TermCmd, 'id'> = {
  command: '', output: '', description: '', output_type: 'output', sort_order: 0,
};

export default function TerminalCmdsAdmin({ cmds: initial }: { cmds: TermCmd[] }) {
  const [cmds, setCmds] = useState(initial);
  const [editing, setEditing] = useState<TermCmd | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const save = async () => {
    if (!editing) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/terminal', {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      });
      const data = await res.json();
      if (res.ok) {
        if (isNew) setCmds(c => [...c, data.cmd]);
        else setCmds(c => c.map(x => x.id === data.cmd.id ? data.cmd : x));
        setEditing(null); setIsNew(false);
        flash('Saved!');
      } else flash(data.error || 'Error');
    } finally { setLoading(false); }
  };

  const del = async (id: string) => {
    if (!confirm('Delete command?')) return;
    await fetch(`/api/admin/terminal?id=${id}`, { method: 'DELETE' });
    setCmds(c => c.filter(x => x.id !== id));
  };

  const sf = (k: keyof TermCmd, v: unknown) => setEditing(prev => prev ? { ...prev, [k]: v } : prev);

  return (
    <div>
      {msg && <div style={{ background: 'rgba(0,255,136,0.08)', border: '1px solid var(--border-accent)', borderRadius: 6, padding: '0.65rem 1rem', marginBottom: '1rem', color: 'var(--accent)', fontSize: '0.825rem' }}>{msg}</div>}

      <div style={{ background: 'rgba(0,255,136,0.04)', border: '1px solid var(--border-accent)', borderRadius: 8, padding: '0.75rem 1rem', marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '0.78rem', fontFamily: 'JetBrains Mono, monospace' }}>
        These commands are available in the interactive terminal at /terminal. Built-in commands (ls, cd, whoami, etc.) are always available.
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.25rem' }}>
        <button onClick={() => { setEditing({ ...EMPTY, id: '' } as TermCmd); setIsNew(true); }} className="btn-primary" style={{ fontSize: '0.85rem' }}>
          <Plus size={15} /> Add Command
        </button>
      </div>

      {editing && (
        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>{isNew ? 'New Command' : 'Edit Command'}</h2>
            <button onClick={() => { setEditing(null); setIsNew(false); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={18} /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.72rem', marginBottom: '0.35rem', fontFamily: 'JetBrains Mono, monospace' }}>Command</label>
              <input value={editing.command} onChange={e => sf('command', e.target.value)} className="input-dark" placeholder="e.g. nmap --help" style={{ fontFamily: 'JetBrains Mono, monospace' }} />
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.72rem', marginBottom: '0.35rem', fontFamily: 'JetBrains Mono, monospace' }}>Description</label>
              <input value={editing.description} onChange={e => sf('description', e.target.value)} className="input-dark" placeholder="Short description" />
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.72rem', marginBottom: '0.35rem', fontFamily: 'JetBrains Mono, monospace' }}>Output Type</label>
              <select value={editing.output_type} onChange={e => sf('output_type', e.target.value)} className="input-dark">
                {['output', 'error', 'system', 'success'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.72rem', marginBottom: '0.35rem', fontFamily: 'JetBrains Mono, monospace' }}>Output</label>
            <textarea value={editing.output} onChange={e => sf('output', e.target.value)} rows={6} className="input-dark" placeholder="Command output text..." style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', resize: 'vertical' }} />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button onClick={save} disabled={loading} className="btn-primary" style={{ fontSize: '0.85rem' }}>
              <Save size={14} /> {loading ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => { setEditing(null); setIsNew(false); }} className="btn-outline" style={{ fontSize: '0.85rem' }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {cmds.map(cmd => (
          <div key={cmd.id} className="card" style={{ padding: '0.875rem 1.25rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ width: 32, height: 32, background: 'rgba(0,255,136,0.06)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Terminal size={15} color="var(--accent)" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', marginBottom: '0.2rem' }}>$ {cmd.command}</div>
              {cmd.description && <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>{cmd.description}</div>}
              <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontFamily: 'JetBrains Mono, monospace', marginTop: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 400 }}>
                {cmd.output?.split('\n')[0]}...
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.35rem', flexShrink: 0 }}>
              <button onClick={() => { setEditing(cmd); setIsNew(false); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace' }}>Edit</button>
              <button onClick={() => del(cmd.id)} style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer' }}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        {cmds.length === 0 && <p style={{ color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.825rem' }}>No custom commands yet.</p>}
      </div>
    </div>
  );
}
