import { createServiceClient } from '@/lib/supabase';
import MessagesClient from './MessagesClient';

async function getMessages() {
  const db = createServiceClient();
  const { data } = await db
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });
  return data || [];
}

export default async function MessagesPage() {
  const messages = await getMessages();
  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: 'white', fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.25rem' }}>Messages</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Contact form submissions from potential clients.</p>
      </div>
      <MessagesClient messages={messages} />
    </div>
  );
}
