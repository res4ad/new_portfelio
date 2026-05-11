import { createServiceClient } from '@/lib/supabase';
import SettingsAdmin from './SettingsAdmin';

async function getSettings() {
  const db = createServiceClient();
  const { data } = await db.from('site_settings').select('*');
  return data || [];
}

export default async function AdminSettingsPage() {
  const settings = await getSettings();
  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: 'white', fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.25rem' }}>Settings</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Manage site settings and configuration.</p>
      </div>
      <SettingsAdmin settings={settings} />
    </div>
  );
}
