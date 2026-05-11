'use client';

import { useState } from 'react';
import { Plus, CreditCard as Edit2, Trash2, Eye, EyeOff, Save, X } from 'lucide-react';

interface Post {
  id: string; title: string; slug: string; excerpt: string; content: string;
  category: string; tags: string[]; is_published: boolean; is_featured: boolean; read_time: number;
}

const EMPTY: Omit<Post, 'id'> = {
  title: '', slug: '', excerpt: '', content: '', category: 'Writeup',
  tags: [], is_published: false, is_featured: false, read_time: 5,
};

export default function BlogAdmin({ posts: initial }: { posts: Post[] }) {
  const [posts, setPosts] = useState(initial);
  const [editing, setEditing] = useState<Post | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const save = async () => {
    if (!editing) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/blog', {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      });
      const data = await res.json();
      if (res.ok) {
        if (isNew) setPosts(p => [data.post, ...p]);
        else setPosts(p => p.map(pr => pr.id === data.post.id ? data.post : pr));
        setEditing(null); setIsNew(false);
        setMsg('Saved!'); setTimeout(() => setMsg(''), 3000);
      } else setMsg(data.error || 'Error');
    } finally { setLoading(false); }
  };

  const toggle = async (id: string, field: 'is_published' | 'is_featured') => {
    const post = posts.find(p => p.id === id);
    if (!post) return;
    const updated = { ...post, [field]: !post[field] };
    await fetch('/api/admin/blog', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated) });
    setPosts(prev => prev.map(p => p.id === id ? updated : p));
  };

  const del = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    await fetch(`/api/admin/blog?id=${id}`, { method: 'DELETE' });
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  const setField = (field: keyof Post, value: unknown) => setEditing(prev => prev ? { ...prev, [field]: value } : prev);

  return (
    <div>
      {msg && <div style={{ background: 'rgba(0,255,136,0.08)', border: '1px solid var(--border-accent)', borderRadius: 6, padding: '0.65rem 1rem', marginBottom: '1rem', color: 'var(--accent)', fontSize: '0.825rem' }}>{msg}</div>}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.25rem' }}>
        <button onClick={() => { setEditing({ ...EMPTY, id: '' } as Post); setIsNew(true); }} className="btn-primary" style={{ fontSize: '0.85rem' }}>
          <Plus size={15} /> New Post
        </button>
      </div>

      {editing && (
        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>{isNew ? 'New Post' : 'Edit Post'}</h2>
            <button onClick={() => { setEditing(null); setIsNew(false); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={18} /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {[
              { field: 'title', label: 'Title', placeholder: 'Post title' },
              { field: 'slug', label: 'Slug', placeholder: 'post-slug' },
              { field: 'category', label: 'Category', placeholder: 'Writeup' },
            ].map(({ field, label, placeholder }) => (
              <div key={field}>
                <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.72rem', marginBottom: '0.35rem', fontFamily: 'JetBrains Mono, monospace' }}>{label}</label>
                <input value={(editing as Record<string, any>)[field] || ''} onChange={e => setField(field as keyof Post, e.target.value)} placeholder={placeholder} className="input-dark" />
              </div>
            ))}
            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.72rem', marginBottom: '0.35rem', fontFamily: 'JetBrains Mono, monospace' }}>Read Time (min)</label>
              <input type="number" value={editing.read_time} onChange={e => setField('read_time', parseInt(e.target.value))} className="input-dark" />
            </div>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.72rem', marginBottom: '0.35rem', fontFamily: 'JetBrains Mono, monospace' }}>Excerpt</label>
            <textarea value={editing.excerpt} onChange={e => setField('excerpt', e.target.value)} rows={2} className="input-dark" style={{ resize: 'vertical' }} />
          </div>
          <div style={{ marginTop: '1rem' }}>
            <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.72rem', marginBottom: '0.35rem', fontFamily: 'JetBrains Mono, monospace' }}>Content (Markdown)</label>
            <textarea value={editing.content} onChange={e => setField('content', e.target.value)} rows={12} className="input-dark" style={{ resize: 'vertical', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem' }} placeholder="# Post content in markdown..." />
          </div>
          <div style={{ marginTop: '1rem' }}>
            <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.72rem', marginBottom: '0.35rem', fontFamily: 'JetBrains Mono, monospace' }}>Tags (comma-separated)</label>
            <input value={editing.tags?.join(', ') || ''} onChange={e => setField('tags', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} className="input-dark" placeholder="CTF, Web, AD, ..." />
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={editing.is_published} onChange={e => setField('is_published', e.target.checked)} /> Published
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={editing.is_featured} onChange={e => setField('is_featured', e.target.checked)} /> Featured
            </label>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button onClick={save} disabled={loading} className="btn-primary" style={{ fontSize: '0.85rem' }}>
              <Save size={14} /> {loading ? 'Saving...' : 'Save Post'}
            </button>
            <button onClick={() => { setEditing(null); setIsNew(false); }} className="btn-outline" style={{ fontSize: '0.85rem' }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {posts.map(post => (
          <div key={post.id} className="card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>{post.title}</span>
                {post.is_featured && <span className="tag" style={{ fontSize: '0.65rem' }}>Featured</span>}
              </div>
              <span className="tag tag-gray" style={{ marginTop: '0.3rem', fontSize: '0.7rem' }}>{post.category}</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => toggle(post.id, 'is_published')} style={{ background: 'none', border: 'none', color: post.is_published ? 'var(--accent)' : 'var(--text-dim)', cursor: 'pointer' }}>
                {post.is_published ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
              <button onClick={() => { setEditing(post); setIsNew(false); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <Edit2 size={15} />
              </button>
              <button onClick={() => del(post.id)} style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer' }}>
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
        {posts.length === 0 && <p style={{ color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.825rem' }}>No posts yet.</p>}
      </div>
    </div>
  );
}
