import { createServiceClient } from '@/lib/supabase';
import ProjectsAdmin from './ProjectsAdmin';

async function getProjects() {
  const db = createServiceClient();
  const { data } = await db.from('projects').select('*').order('sort_order');
  return data || [];
}

export default async function AdminProjectsPage() {
  const projects = await getProjects();
  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: 'white', fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.25rem' }}>Projects</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Manage your portfolio projects.</p>
      </div>
      <ProjectsAdmin projects={projects} />
    </div>
  );
}
