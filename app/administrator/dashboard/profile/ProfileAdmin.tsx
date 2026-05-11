'use client';

import { useState } from 'react';
import { Save, Plus, Trash2, X } from 'lucide-react';

interface Profile {
  id: string; name: string; title: string; bio: string; email: string;
  phone: string; location: string; avatar_url: string; github_url: string;
  linkedin_url: string; cv_url: string; years_experience: number; is_available: boolean;
}
interface Skill { id: string; name: string; category: string; level: number; sort_order: number; }
interface Language { id: string; name: string; level: string; sort_order: number; }

interface Props {
  profile: Profile | null;
  skills: Skill[];
  languages: Language[];
}

const SKILL_EMPTY = { id: '', name: '', category: 'Offensive Security', level: 80, sort_order: 0 };
const LANG_EMPTY = { id: '', name: '', level: 'B2', sort_order: 0 };

export default function ProfileAdmin({ profile: initial, skills: initSkills, languages: initLangs }: Props) {
  const [profile, setProfile] = useState<Profile>(initial || {
    id: '', name: '', title: '', bio: '', email: '', phone: '', location: '',
    avatar_url: '', github_url: '', linkedin_url: '', cv_url: '',
    years_experience: 0, is_available: true,
  });
  const [skills, setSkills] = useState<Skill[]>(initSkills);
  const [languages, setLanguages] = useState<Language[]>(initLangs);
  const [tab, setTab] = useState<'profile' | 'skills' | 'languages'>('profile');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [editingLang, setEditingLang] = useState<Language | null>(null);

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const saveProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (res.ok) flash('Profile saved!');
      else flash(data.error || 'Error');
    } finally { setLoading(false); }
  };

  const saveSkill = async () => {
    if (!editingSkill) return;
    const isNew = !editingSkill.id;
    const res = await fetch('/api/admin/profile/skills', {
      method: isNew ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingSkill),
    });
    const data = await res.json();
    if (res.ok) {
      if (isNew) setSkills(s => [...s, data.skill]);
      else setSkills(s => s.map(x => x.id === data.skill.id ? data.skill : x));
      setEditingSkill(null);
      flash('Skill saved!');
    }
  };

  const deleteSkill = async (id: string) => {
    if (!confirm('Delete skill?')) return;
    await fetch(`/api/admin/profile/skills?id=${id}`, { method: 'DELETE' });
    setSkills(s => s.filter(x => x.id !== id));
  };

  const saveLang = async () => {
    if (!editingLang) return;
    const isNew = !editingLang.id;
    const res = await fetch('/api/admin/profile/languages', {
      method: isNew ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingLang),
    });
    const data = await res.json();
    if (res.ok) {
      if (isNew) setLanguages(l => [...l, data.language]);
      else setLanguages(l => l.map(x => x.id === data.language.id ? data.language : x));
      setEditingLang(null);
      flash('Language saved!');
    }
  };

  const deleteLang = async (id: string) => {
    if (!confirm('Delete language?')) return;
    await fetch(`/api/admin/profile/languages?id=${id}`, { method: 'DELETE' });
    setLanguages(l => l.filter(x => x.id !== id));
  };

  const pf = (k: keyof Profile, v: unknown) => setProfile(p => ({ ...p, [k]: v }));

  const CATEGORIES = ['Offensive Security', 'Active Directory', 'Web Security', 'Networking', 'Programming', 'Tools', 'Other'];

  const grouped = CATEGORIES.reduce((acc, cat) => {
    const items = skills.filter(s => s.category === cat);
    if (items.length) acc[cat] = items;
    return acc;
  }, {} as Record<string, Skill[]>);

  const tabStyle = (t: string) => ({
    padding: '0.5rem 1.25rem',
    background: tab === t ? 'var(--accent-glow)' : 'transparent',
    color: tab === t ? 'var(--accent)' : 'var(--text-muted)',
    border: `1px solid ${tab === t ? 'var(--border-accent)' : 'var(--border)'}`,
    borderRadius: 6, cursor: 'pointer', fontSize: '0.8rem',
    fontFamily: 'JetBrains Mono, monospace',
  });

  return (
    <div>
      {msg && <div style={{ background: 'rgba(0,255,136,0.08)', border: '1px solid var(--border-accent)', borderRadius: 6, padding: '0.65rem 1rem', marginBottom: '1rem', color: 'var(--accent)', fontSize: '0.825rem' }}>{msg}</div>}

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {(['profile', 'skills', 'languages'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={tabStyle(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
        ))}
      </div>

      {tab === 'profile' && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {([
              { k: 'name', label: 'Full Name', ph: 'Reshad Rustemov' },
              { k: 'title', label: 'Title', ph: 'Pentester & Red Team Enthusiast' },
              { k: 'email', label: 'Email', ph: 'me@res4ad.com' },
              { k: 'phone', label: 'Phone', ph: '+994 77 5060636' },
              { k: 'location', label: 'Location', ph: 'Baku, Azerbaijan' },
              { k: 'github_url', label: 'GitHub URL', ph: 'https://github.com/...' },
              { k: 'linkedin_url', label: 'LinkedIn URL', ph: 'https://linkedin.com/...' },
              { k: 'cv_url', label: 'CV URL', ph: 'https://cv.res4ad.com' },
              { k: 'years_experience', label: 'Years Experience', ph: '3', type: 'number' },
            ] as { k: keyof Profile; label: string; ph: string; type?: string }[]).map(({ k, label, ph, type }) => (
              <div key={k as string}>
                <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.72rem', marginBottom: '0.35rem', fontFamily: 'JetBrains Mono, monospace' }}>{label}</label>
                <input type={type || 'text'} value={(profile[k] as string | number) || ''} onChange={e => pf(k, type === 'number' ? parseInt(e.target.value) || 0 : e.target.value)} placeholder={ph} className="input-dark" />
              </div>
            ))}
          </div>
          <div style={{ marginTop: '1rem' }}>
            <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.72rem', marginBottom: '0.35rem', fontFamily: 'JetBrains Mono, monospace' }}>Bio</label>
            <textarea value={profile.bio || ''} onChange={e => pf('bio', e.target.value)} rows={5} className="input-dark" style={{ resize: 'vertical' }} placeholder="Professional bio..." />
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', alignItems: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={!!profile.is_available} onChange={e => pf('is_available', e.target.checked)} />
              Available for hire
            </label>
          </div>
          <div style={{ marginTop: '1.5rem' }}>
            <button onClick={saveProfile} disabled={loading} className="btn-primary" style={{ fontSize: '0.85rem' }}>
              <Save size={14} /> {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </div>
      )}

      {tab === 'skills' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button onClick={() => setEditingSkill({ ...SKILL_EMPTY })} className="btn-primary" style={{ fontSize: '0.85rem' }}>
              <Plus size={15} /> Add Skill
            </button>
          </div>

          {editingSkill && (
            <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ color: 'white', fontWeight: 700, fontSize: '0.95rem' }}>{editingSkill.id ? 'Edit Skill' : 'New Skill'}</h3>
                <button onClick={() => setEditingSkill(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={16} /></button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.72rem', marginBottom: '0.35rem', fontFamily: 'JetBrains Mono, monospace' }}>Skill Name</label>
                  <input value={editingSkill.name} onChange={e => setEditingSkill(s => s ? { ...s, name: e.target.value } : s)} className="input-dark" placeholder="e.g. Burp Suite" />
                </div>
                <div>
                  <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.72rem', marginBottom: '0.35rem', fontFamily: 'JetBrains Mono, monospace' }}>Category</label>
                  <select value={editingSkill.category} onChange={e => setEditingSkill(s => s ? { ...s, category: e.target.value } : s)} className="input-dark">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.72rem', marginBottom: '0.35rem', fontFamily: 'JetBrains Mono, monospace' }}>Level (0-100)</label>
                  <input type="number" min={0} max={100} value={editingSkill.level} onChange={e => setEditingSkill(s => s ? { ...s, level: parseInt(e.target.value) || 0 } : s)} className="input-dark" />
                </div>
              </div>
              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
                <button onClick={saveSkill} className="btn-primary" style={{ fontSize: '0.85rem' }}><Save size={14} /> Save</button>
                <button onClick={() => setEditingSkill(null)} className="btn-outline" style={{ fontSize: '0.85rem' }}>Cancel</button>
              </div>
            </div>
          )}

          {Object.entries(grouped).map(([cat, items]) => (
            <div key={cat} style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: 'var(--accent)', fontSize: '0.78rem', fontFamily: 'JetBrains Mono, monospace', marginBottom: '0.75rem', letterSpacing: '0.1em' }}>{cat.toUpperCase()}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {items.map(skill => (
                  <div key={skill.id} className="card" style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                        <span style={{ color: 'white', fontSize: '0.85rem' }}>{skill.name}</span>
                        <span style={{ color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>{skill.level}%</span>
                      </div>
                      <div style={{ height: 3, background: 'var(--bg)', borderRadius: 2 }}>
                        <div style={{ height: '100%', width: `${skill.level}%`, background: 'var(--accent)', borderRadius: 2, transition: 'width 0.3s' }} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <button onClick={() => setEditingSkill(skill)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}>
                        <Save size={13} />
                      </button>
                      <button onClick={() => deleteSkill(skill.id)} style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', padding: '0.25rem' }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {skills.length === 0 && <p style={{ color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.825rem' }}>No skills yet.</p>}
        </div>
      )}

      {tab === 'languages' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button onClick={() => setEditingLang({ ...LANG_EMPTY })} className="btn-primary" style={{ fontSize: '0.85rem' }}>
              <Plus size={15} /> Add Language
            </button>
          </div>

          {editingLang && (
            <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ color: 'white', fontWeight: 700, fontSize: '0.95rem' }}>{editingLang.id ? 'Edit Language' : 'New Language'}</h3>
                <button onClick={() => setEditingLang(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={16} /></button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.72rem', marginBottom: '0.35rem', fontFamily: 'JetBrains Mono, monospace' }}>Language</label>
                  <input value={editingLang.name} onChange={e => setEditingLang(l => l ? { ...l, name: e.target.value } : l)} className="input-dark" placeholder="English" />
                </div>
                <div>
                  <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.72rem', marginBottom: '0.35rem', fontFamily: 'JetBrains Mono, monospace' }}>Level</label>
                  <select value={editingLang.level} onChange={e => setEditingLang(l => l ? { ...l, level: e.target.value } : l)} className="input-dark">
                    {['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Native'].map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
                <button onClick={saveLang} className="btn-primary" style={{ fontSize: '0.85rem' }}><Save size={14} /> Save</button>
                <button onClick={() => setEditingLang(null)} className="btn-outline" style={{ fontSize: '0.85rem' }}>Cancel</button>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {languages.map(lang => (
              <div key={lang.id} className="card" style={{ padding: '0.875rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>{lang.name}</span>
                  <span className="tag" style={{ fontSize: '0.7rem' }}>{lang.level}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  <button onClick={() => setEditingLang(lang)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><Save size={13} /></button>
                  <button onClick={() => deleteLang(lang.id)} style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer' }}><Trash2 size={13} /></button>
                </div>
              </div>
            ))}
            {languages.length === 0 && <p style={{ color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.825rem' }}>No languages yet.</p>}
          </div>
        </div>
      )}
    </div>
  );
}
