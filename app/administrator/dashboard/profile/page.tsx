import { createServiceClient } from '@/lib/supabase';
import ProfileAdmin from './ProfileAdmin';

async function getData() {
  const db = createServiceClient();
  const [profile, skills, languages] = await Promise.all([
    db.from('profile').select('*').maybeSingle(),
    db.from('skills').select('*').order('category').order('sort_order'),
    db.from('languages').select('*').order('sort_order'),
  ]);
  return {
    profile: profile.data,
    skills: skills.data || [],
    languages: languages.data || [],
  };
}

export default async function AdminProfilePage() {
  const data = await getData();
  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: 'white', fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.25rem' }}>Profile & Skills</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Manage your profile information, skills, and languages.</p>
      </div>
      <ProfileAdmin {...data} />
    </div>
  );
}
