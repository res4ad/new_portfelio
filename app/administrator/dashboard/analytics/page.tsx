import { createServiceClient } from '@/lib/supabase';
import AnalyticsClient from './AnalyticsClient';

async function getAnalytics() {
  const db = createServiceClient();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [views, topPages, devices, countries] = await Promise.all([
    db.from('page_views').select('*').gte('created_at', thirtyDaysAgo).order('created_at', { ascending: false }),
    db.from('page_views').select('path').gte('created_at', thirtyDaysAgo),
    db.from('page_views').select('device').gte('created_at', thirtyDaysAgo),
    db.from('page_views').select('country').gte('created_at', thirtyDaysAgo),
  ]);

  const allViews = views.data || [];
  const pageMap: Record<string, number> = {};
  (topPages.data || []).forEach(v => { pageMap[v.path] = (pageMap[v.path] || 0) + 1; });
  const deviceMap: Record<string, number> = {};
  (devices.data || []).forEach(v => { if (v.device) deviceMap[v.device] = (deviceMap[v.device] || 0) + 1; });
  const countryMap: Record<string, number> = {};
  (countries.data || []).forEach(v => { if (v.country) countryMap[v.country] = (countryMap[v.country] || 0) + 1; });

  const dailyMap: Record<string, number> = {};
  allViews.forEach(v => {
    const day = v.created_at?.split('T')[0];
    if (day) dailyMap[day] = (dailyMap[day] || 0) + 1;
  });

  return {
    totalViews: allViews.length,
    uniqueVisitors: new Set(allViews.map(v => v.ip_address).filter(Boolean)).size,
    topPages: Object.entries(pageMap).sort((a, b) => b[1] - a[1]).slice(0, 10),
    devices: Object.entries(deviceMap).sort((a, b) => b[1] - a[1]),
    countries: Object.entries(countryMap).sort((a, b) => b[1] - a[1]).slice(0, 10),
    daily: Object.entries(dailyMap).sort((a, b) => a[0].localeCompare(b[0])).slice(-30),
  };
}

export default async function AdminAnalyticsPage() {
  const data = await getAnalytics();
  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: 'white', fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.25rem' }}>Analytics</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Traffic insights for the last 30 days.</p>
      </div>
      <AnalyticsClient data={data} />
    </div>
  );
}
