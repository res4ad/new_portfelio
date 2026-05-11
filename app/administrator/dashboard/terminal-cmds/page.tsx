import { createServiceClient } from '@/lib/supabase';
import TerminalCmdsAdmin from './TerminalCmdsAdmin';

async function getCmds() {
  const db = createServiceClient();
  const { data } = await db.from('terminal_commands').select('*').order('sort_order');
  return data || [];
}

export default async function AdminTerminalCmdsPage() {
  const cmds = await getCmds();
  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: 'white', fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.25rem' }}>Terminal Commands</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Manage commands available in the interactive terminal simulator.</p>
      </div>
      <TerminalCmdsAdmin cmds={cmds} />
    </div>
  );
}
