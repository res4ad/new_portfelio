'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';

interface Setting {
  id: string; key: string; value: string; description: string;
}

export default function SettingsAdmin({ settings: initial }: { settings: Setting[] }) {
  const [settings, setSettings] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const updateSetting = async (key: string, value: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      });
      if (res.ok) {
        setSettings(s => {
          const existing = s.find(x => x.key === key);
          if (existing) return s.map(x => x.key === key ? { ...x, value } : x);
          return [...s, { id: '', key, value, description: '' }];
        });
        flash('Setting updated!');
      }
    } finally { setLoading(false); }
  };

  const sf = (k: string, v: string) => updateSetting(k, v);

  const settingCategories = {
    'General': ['site_title', 'site_description', 'contact_email'],
    'Social': ['github_url', 'linkedin_url', 'twitter_url', 'discord_url'],
    'Features': ['enable_blog', 'enable_projects', 'enable_terminal', 'enable_hire_me'],
    'Notifications': ['discord_webhook', 'telegram_token', 'telegram_chat_id'],
  };

  return (
    <div>
      {msg && <div style={{ background: 'rgba(0,255,136,0.08)', border: '1px solid var(--border-accent)', borderRadius: 6, padding: '0.65rem 1rem', marginBottom: '1rem', color: 'var(--accent)', fontSize: '0.825rem' }}>{msg}</div>}

      {Object.entries(settingCategories).map(([category, keys]) => (
        <div key={category} style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ color: 'var(--accent)', fontSize: '0.8rem', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.1em', marginBottom: '1rem', textTransform: 'uppercase' }}>
            {category}
          </h2>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {keys.map(key => {
              const setting = settings.find(s => s.key === key);
              const value = setting?.value || '';
              return (
                <div key={key} className="card" style={{ padding: '1.25rem' }}>
                  <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.72rem', marginBottom: '0.5rem', fontFamily: 'JetBrains Mono, monospace' }}>
                    {key.replace(/_/g, ' ').toUpperCase()}
                  </label>
                  {key.includes('webhook') || key.includes('token') ? (
                    <textarea
                      value={value}
                      onChange={e => sf(key, e.target.value)}
                      rows={3}
                      className="input-dark"
                      style={{ resize: 'vertical', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}
                      placeholder={`Enter ${key.replace(/_/g, ' ')}`}
                    />
                  ) : (
                    <input
                      type={key.includes('email') ? 'email' : key.includes('url') ? 'url' : key.includes('enable') ? 'checkbox' : 'text'}
                      checked={key.includes('enable') ? value === 'true' : undefined}
                      value={key.includes('enable') ? undefined : value}
                      onChange={e => sf(key, key.includes('enable') ? (e.target.checked ? 'true' : 'false') : e.target.value)}
                      className="input-dark"
                      placeholder={`Enter ${key.replace(/_/g, ' ')}`}
                    />
                  )}
                  {setting?.description && (
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.7rem', marginTop: '0.35rem', fontFamily: 'JetBrains Mono, monospace' }}>
                      {setting.description}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <button onClick={() => { /* trigger full refresh */ location.reload(); }} disabled={loading} className="btn-primary" style={{ fontSize: '0.85rem' }}>
        <Save size={14} /> Save All Settings
      </button>
    </div>
  );
}
