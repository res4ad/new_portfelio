'use client';

import { useState } from 'react';
import { Plus, CreditCard as Edit2, Trash2, Eye, EyeOff, Github, ExternalLink, Save, X } from 'lucide-react';

interface Project {
  id: string; title: string; slug: string; description: string; content: string;
  tech_stack: string[]; tags: string[]; category: string; difficulty: string;
  github_url: string; demo_url: string; is_published: boolean; is_featured: boolean;
  sort_order: number;
}

const EMPTY: Omit<Project, 'id'> = {
  title: '', slug: '', description: '', content: '', tech_stack: [], tags: [],
  category: 'Web Security', difficulty: 'Medium', github_url: '', demo_url: '',
  is_published: false, is_featured: false, sort_order: 0,
};

export default function ProjectsAdmin({ projects: initial }: { projects: Project[] }) {
  const [projects, setProjects] = useState(initial);
  const [editing, setEditing] = useState<Project | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const openNew = () => {
    setEditing({ ...EMPTY, id: '' } as Project);
    setIsNew(true);
  };

  const save = async () => {
    if (!editing) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/projects', {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      });
      const data = await res.json();
      if (res.ok) {
        if (isNew) {
          setProjects(p => [...p, data.project]);
        } else {
          setProjects(p => p.map(pr => pr.id === data.project.id ? data.project : pr));
        }
        setEditing(null);
        setIsNew(false);
        setMsg('Saved successfully!');
        setTimeout(() => setMsg(''), 3000);
      } else {
        setMsg(data.error || 'Error saving.');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggle = async (id: string, field: 'is_published' | 'is_featured') => {
    const project = projects.find(p => p.id === id);
    if (!project) return;
    const updated = { ...project, [field]: !project[field] };
    await fetch('/api/admin/projects', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated) });
    setProjects(prev => prev.map(p => p.id === id ? updated : p));
  };

  const del = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    await fetch(`/api/admin/projects?id=${id}`, { method: 'DELETE' });
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const setField = (field: keyof Project, value: unknown) => {
    setEditing(prev => prev ? { ...prev, [field]: value } : prev);
  };

  return (
    <div>
      {msg && <div style={{ background: 'rgba(0,255,136,0.08)', border: '1px solid var(--border-accent)', borderRadius: 6, padding: '0.65rem 1rem', marginBottom: '1rem', color: 'var(--accent)', fontSize: '0.825rem', fontFamily: 'JetBrains Mono, monospace' }}>{msg}</div>}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.25rem' }}>
        <button onClick={openNew} className="btn-primary" style={{ fontSize: '0.85rem' }}>
          <Plus size={15} /> New Project
        </button>
      </div>

      {/* Edit form */}
      {editing && (
        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>{isNew ? 'New Project' : 'Edit Project'}</h2>
            <button onClick={() => { setEditing(null); setIsNew(false); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={18} /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {[
              { field: 'title', label: 'Title', type: 'text', placeholder: 'Project title' },
              { field: 'slug', label: 'Slug', type: 'text', placeholder: 'project-slug' },
              { field: 'category', label: 'Category', type: 'text', placeholder: 'Web Security' },
              { field: 'github_url', label: 'GitHub URL', type: 'text', placeholder: 'https://github.com/...' },
              { field: 'demo_url', label: 'Demo URL', type: 'text', placeholder: 'https://...' },
            ].map(({ field, label, type, placeholder }) => (
              <div key={field}>
                <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.72rem', marginBottom: '0.35rem', fontFamily: 'JetBrains Mono, monospace' }}>{label}</label>
                <input type={type} value={(editing as Record<string, any>)[field] || ''} onChange={e => setField(field as keyof Project, e.target.value)} placeholder={placeholder} className="input-dark" />
              </div>
            ))}
            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.72rem', marginBottom: '0.35rem', fontFamily: 'JetBrains Mono, monospace' }}>Difficulty</label>
              <select value={editing.difficulty} onChange={e => setField('difficulty', e.target.value)} className="input-dark">
                {['Easy', 'Medium', 'Hard', 'Insane'].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.72rem', marginBottom: '0.35rem', fontFamily: 'JetBrains Mono, monospace' }}>Description</label>
            <textarea value={editing.description} onChange={e => setField('description', e.target.value)} rows={3} className="input-dark" placeholder="Short project description..." style={{ resize: 'vertical' }} />
          </div>
          <div style={{ marginTop: '1rem' }}>
            <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.72rem', marginBottom: '0.35rem', fontFamily: 'JetBrains Mono, monospace' }}>Content (Markdown)</label>
            <textarea value={editing.content} onChange={e => setField('content', e.target.value)} rows={8} className="input-dark" placeholder="# Project details in markdown..." style={{ resize: 'vertical', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.72rem', marginBottom: '0.35rem', fontFamily: 'JetBrains Mono, monospace' }}>Tech Stack (comma-separated)</label>
              <input value={editing.tech_stack?.join(', ') || ''} onChange={e => setField('tech_stack', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} className="input-dark" placeholder="Python, Burp Suite, ..." />
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.72rem', marginBottom: '0.35rem', fontFamily: 'JetBrains Mono, monospace' }}>Tags (comma-separated)</label>
              <input value={editing.tags?.join(', ') || ''} onChange={e => setField('tags', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} className="input-dark" placeholder="Web, SQLi, ..." />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={editing.is_published} onChange={e => setField('is_published', e.target.checked)} />
              Published
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={editing.is_featured} onChange={e => setField('is_featured', e.target.checked)} />
              Featured
            </label>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button onClick={save} disabled={loading} className="btn-primary" style={{ fontSize: '0.85rem', opacity: loading ? 0.75 : 1 }}>
              <Save size={14} /> {loading ? 'Saving...' : 'Save Project'}
            </button>
            <button onClick={() => { setEditing(null); setIsNew(false); }} className="btn-outline" style={{ fontSize: '0.85rem' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Project list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {projects.map(project => (
          <div key={project.id} className="card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>{project.title}</span>
                {project.is_featured && <span className="tag" style={{ fontSize: '0.65rem' }}>Featured</span>}
              </div>
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                <span className="tag tag-gray">{project.category}</span>
                <span style={{ color: project.difficulty === 'Hard' ? '#ff6644' : 'var(--text-dim)', fontSize: '0.72rem', fontFamily: 'JetBrains Mono, monospace' }}>{project.difficulty}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button onClick={() => toggle(project.id, 'is_published')} title={project.is_published ? 'Unpublish' : 'Publish'}
                style={{ background: 'none', border: 'none', color: project.is_published ? 'var(--accent)' : 'var(--text-dim)', cursor: 'pointer' }}>
                {project.is_published ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
              <button onClick={() => { setEditing(project); setIsNew(false); }}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <Edit2 size={15} />
              </button>
              <button onClick={() => del(project.id)}
                style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer' }}>
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <p style={{ color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.825rem' }}>No projects yet. Create one above.</p>
        )}
      </div>
    </div>
  );
}
