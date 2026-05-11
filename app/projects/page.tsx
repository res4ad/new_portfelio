import type { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Github, ExternalLink, Filter } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Security research projects, tools, and penetration testing work by Reshad Rustemov.',
};

async function getProjects() {
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('is_published', true)
    .order('sort_order');
  return data || [];
}

export default async function ProjectsPage() {
  const projects = await getProjects();
  const categories = ['All', ...Array.from(new Set(projects.map((p: { category: string }) => p.category)))];

  return (
    <div style={{ paddingTop: 80 }}>
      <section className="grid-bg" style={{ padding: '4rem 1.5rem 3rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent)', fontSize: '0.78rem', marginBottom: '0.75rem' }}>{'// portfolio'}</p>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: 'white', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
            Projects
          </h1>
          <div className="section-divider" />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: 560, marginTop: '1rem' }}>
            Security research, penetration testing tools, and CTF writeup projects.
          </p>
        </div>
      </section>

      <section style={{ padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {projects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <p style={{ color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>// No projects yet. Check back soon.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: '1.25rem' }}>
              {projects.map((project: {
                id: string; title: string; slug: string; description: string;
                tech_stack: string[]; tags: string[]; category: string; difficulty: string;
                github_url: string; demo_url: string; is_featured: boolean;
              }) => (
                <div key={project.id} className="card" style={{ padding: '1.5rem', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                  {project.is_featured && (
                    <div style={{ position: 'absolute', top: 12, right: 12 }}>
                      <span className="tag" style={{ fontSize: '0.68rem' }}>Featured</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.875rem', flexWrap: 'wrap' }}>
                    <span className="tag">{project.category}</span>
                    <span style={{
                      fontSize: '0.72rem', fontFamily: 'JetBrains Mono, monospace',
                      color: project.difficulty === 'Hard' ? '#ff6644' : project.difficulty === 'Easy' ? 'var(--accent)' : project.difficulty === 'Insane' ? '#ff3333' : '#ffaa00',
                    }}>{project.difficulty}</span>
                  </div>
                  <h3 style={{ color: 'white', fontWeight: 600, fontSize: '1rem', marginBottom: '0.5rem', lineHeight: 1.4 }}>{project.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.7, flex: 1, marginBottom: '1.25rem' }}>
                    {project.description}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '1rem' }}>
                    {project.tech_stack?.slice(0, 5).map((t: string) => <span key={t} className="tag tag-gray">{t}</span>)}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: 'auto' }}>
                    {project.github_url && (
                      <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="project-link"
                        style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-muted)', fontSize: '0.8rem', textDecoration: 'none', transition: 'color 0.2s' }}
                      >
                        <Github size={14} /> Source
                      </a>
                    )}
                    {project.demo_url && (
                      <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="project-link"
                        style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-muted)', fontSize: '0.8rem', textDecoration: 'none', transition: 'color 0.2s' }}
                      >
                        <ExternalLink size={14} /> Demo
                      </a>
                    )}
                    <Link href={`/projects/${project.slug}`}
                      style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5, color: 'var(--accent)', fontSize: '0.8rem', textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace' }}>
                      Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
