import { createServiceClient } from '@/lib/supabase';
import CertificationsAdmin from './CertificationsAdmin';

async function getCerts() {
  const db = createServiceClient();
  const { data } = await db.from('certifications').select('*').order('sort_order');
  return data || [];
}

export default async function AdminCertificationsPage() {
  const certs = await getCerts();
  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: 'white', fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.25rem' }}>Certifications</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Manage your certifications and credentials.</p>
      </div>
      <CertificationsAdmin certs={certs} />
    </div>
  );
}
