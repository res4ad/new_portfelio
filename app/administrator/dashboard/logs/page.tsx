import { createServiceClient } from '@/lib/supabase';
import LogsClient from './LogsClient';

async function getLogs() {
  const db = createServiceClient();
  const { data } = await db.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(200);
  return data || [];
}

export default async function AdminLogsPage() {
  const logs = await getLogs();
  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: 'white', fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.25rem' }}>Audit Logs</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Recent system events and security audit trail (last 200 entries).</p>
      </div>
      <LogsClient logs={logs} />
    </div>
  );
}
