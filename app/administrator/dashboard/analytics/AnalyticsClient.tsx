'use client';

import { Eye, Users, Globe, Monitor } from 'lucide-react';

interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  topPages: [string, number][];
  devices: [string, number][];
  countries: [string, number][];
  daily: [string, number][];
}

export default function AnalyticsClient({ data }: { data: AnalyticsData }) {
  const maxDaily = Math.max(...data.daily.map(d => d[1]), 1);
  const maxPage = Math.max(...data.topPages.map(p => p[1]), 1);
  const totalDevices = data.devices.reduce((s, [, v]) => s + v, 0) || 1;

  const statCard = (icon: React.ReactNode, label: string, value: string | number) => (
    <div className="card" style={{ padding: '1.25rem 1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <div style={{ width: 44, height: 44, background: 'var(--accent-glow)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div style={{ color: 'var(--text-dim)', fontSize: '0.72rem', fontFamily: 'JetBrains Mono, monospace', marginBottom: '0.2rem' }}>{label}</div>
        <div style={{ color: 'white', fontWeight: 700, fontSize: '1.75rem', lineHeight: 1 }}>{value.toLocaleString()}</div>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {statCard(<Eye size={20} color="var(--accent)" />, 'TOTAL PAGE VIEWS', data.totalViews)}
        {statCard(<Users size={20} color="var(--accent)" />, 'UNIQUE VISITORS', data.uniqueVisitors)}
        {statCard(<Globe size={20} color="var(--accent)" />, 'COUNTRIES', data.countries.length)}
        {statCard(<Monitor size={20} color="var(--accent)" />, 'DEVICE TYPES', data.devices.length)}
      </div>

      {/* Daily chart */}
      {data.daily.length > 0 && (
        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem', marginBottom: '1.25rem' }}>Daily Page Views (Last 30 Days)</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 120 }}>
            {data.daily.map(([day, count]) => (
              <div key={day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div
                  title={`${day}: ${count} views`}
                  style={{
                    width: '100%', background: 'var(--accent)',
                    height: `${Math.max(4, (count / maxDaily) * 100)}px`,
                    borderRadius: '2px 2px 0 0', opacity: 0.8, transition: 'opacity 0.2s', cursor: 'default',
                  }}
                />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
            <span style={{ color: 'var(--text-dim)', fontSize: '0.65rem', fontFamily: 'JetBrains Mono, monospace' }}>
              {data.daily[0]?.[0]}
            </span>
            <span style={{ color: 'var(--text-dim)', fontSize: '0.65rem', fontFamily: 'JetBrains Mono, monospace' }}>
              {data.daily[data.daily.length - 1]?.[0]}
            </span>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {/* Top pages */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem', marginBottom: '1.25rem' }}>Top Pages</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {data.topPages.length === 0 && <p style={{ color: 'var(--text-dim)', fontSize: '0.825rem' }}>No data yet.</p>}
            {data.topPages.map(([path, count]) => (
              <div key={path}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontFamily: 'JetBrains Mono, monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>{path}</span>
                  <span style={{ color: 'var(--accent)', fontSize: '0.78rem', fontFamily: 'JetBrains Mono, monospace' }}>{count}</span>
                </div>
                <div style={{ height: 3, background: 'var(--bg)', borderRadius: 2 }}>
                  <div style={{ height: '100%', width: `${(count / maxPage) * 100}%`, background: 'var(--accent)', borderRadius: 2, opacity: 0.6 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Devices */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem', marginBottom: '1.25rem' }}>Devices</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {data.devices.length === 0 && <p style={{ color: 'var(--text-dim)', fontSize: '0.825rem' }}>No data yet.</p>}
            {data.devices.map(([device, count]) => (
              <div key={device}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{device}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontFamily: 'JetBrains Mono, monospace' }}>
                    {count} ({Math.round((count / totalDevices) * 100)}%)
                  </span>
                </div>
                <div style={{ height: 3, background: 'var(--bg)', borderRadius: 2 }}>
                  <div style={{ height: '100%', width: `${(count / totalDevices) * 100}%`, background: '#4499ff', borderRadius: 2 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Countries */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem', marginBottom: '1.25rem' }}>Top Countries</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {data.countries.length === 0 && <p style={{ color: 'var(--text-dim)', fontSize: '0.825rem' }}>No data yet.</p>}
            {data.countries.map(([country, count]) => (
              <div key={country} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{country || 'Unknown'}</span>
                <span style={{ color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem' }}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {data.totalViews === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem' }}>
          No analytics data yet. Visits to your site will appear here.
        </div>
      )}
    </div>
  );
}
