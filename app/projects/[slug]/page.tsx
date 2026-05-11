import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Github, ExternalLink } from 'lucide-react';

interface Props {
  params: { slug: string };
}

async function getProject(slug: string) {
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();
  return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProject(params.slug);
  if (!project) return { title: 'Project Not Found' };
  return { title: project.title, description: project.description };
}

function renderMarkdown(content: string) {
  return content
    .replace(/^### (.+)$/gm, '<h3 style="color:white;font-weight:700;font-size:1.1rem;margin:1.5rem 0 0.5rem">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 style="color:white;font-weight:700;font-size:1.3rem;margin:2rem 0 0.75rem;padding-bottom:0.5rem;border-bottom:1px solid var(--border)">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 style="color:white;font-weight:800;font-size:1.6rem;margin:0 0 1rem">$1</h1>')
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre style="background:#0a0a0a;border:1px solid var(--border);border-radius:8px;padding:1.25rem;overflow-x:auto;margin:1rem 0"><code style="font-family:JetBrains Mono,monospace;font-size:0.82rem;color:#e0e0e0;line-height:1.65">$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code style="background:rgba(0,255,136,0.08);color:var(--accent);padding:0.15em 0.4em;border-radius:4px;font-family:JetBrains Mono,monospace;font-size:0.875em">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong style="color:white;font-weight:600">$1</strong>')
    .replace(/^- (.+)$/gm, '<li style="margin:0.35rem 0;color:var(--text-muted)">$1</li>')
    .replace(/(<li[^>]*>.*<\/li>\n?)+/g, '<ul style="padding-left:1.5rem;margin:0.75rem 0">$&</ul>')
    .replace(/\n\n/g, '</p><p style="color:var(--text-muted);line-height:1.85;margin-bottom:1rem">');
}

export default async function ProjectPage({ params }: Props) {
  const project = await getProject(params.slug);
  if (!project) notFound();

  return (
    <div style={{ paddingTop: 80 }}>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '3rem 1.5rem' }}>
        <Link href="/projects" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem', marginBottom: '2rem' }}>
          <ArrowLeft size={15} /> Back to Projects
        </Link>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <span className="tag">{project.category}</span>
          <span style={{
            fontSize: '0.72rem', fontFamily: 'JetBrains Mono, monospace',
            color: project.difficulty === 'Hard' ? '#ff6644' : project.difficulty === 'Easy' ? 'var(--accent)' : '#ffaa00',
          }}>{project.difficulty}</span>
        </div>

        <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: 'white', lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
          {project.title}
        </h1>

        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.75, marginBottom: '2rem' }}>
          {project.description}
        </p>

        {/* Tech stack */}
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {project.tech_stack?.map((t: string) => <span key={t} className="tag tag-gray">{t}</span>)}
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2.5rem' }}>
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
              <Github size={15} /> Source Code
            </a>
          )}
          {project.demo_url && (
            <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
              <ExternalLink size={15} /> Live Demo
            </a>
          )}
        </div>

        {/* Tags */}
        {project.tags?.length > 0 && (
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            {project.tags.map((t: string) => <span key={t} className="tag">{t}</span>)}
          </div>
        )}

        {/* Content */}
        {project.content && (
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2.5rem' }}>
            <div className="prose-dark" dangerouslySetInnerHTML={{ __html: renderMarkdown(project.content) }} />
          </div>
        )}
      </div>
    </div>
  );
}
