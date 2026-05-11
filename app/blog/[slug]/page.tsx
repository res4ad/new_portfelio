import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Clock, Tag, BookOpen } from 'lucide-react';

interface Props {
  params: { slug: string };
}

async function getPost(slug: string) {
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();
  return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: 'Post Not Found' };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt },
  };
}

function renderMarkdown(content: string) {
  return content
    .replace(/^### (.+)$/gm, '<h3 style="color:white;font-weight:700;font-size:1.15rem;margin:1.5rem 0 0.5rem">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 style="color:white;font-weight:700;font-size:1.35rem;margin:2rem 0 0.75rem;padding-bottom:0.5rem;border-bottom:1px solid var(--border)">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 style="color:white;font-weight:800;font-size:1.75rem;margin:0 0 1rem">$1</h1>')
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre style="background:#0a0a0a;border:1px solid var(--border);border-radius:8px;padding:1.25rem;overflow-x:auto;margin:1rem 0"><code style="font-family:JetBrains Mono,monospace;font-size:0.82rem;color:#e0e0e0;line-height:1.65">$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code style="background:rgba(0,255,136,0.08);color:var(--accent);padding:0.15em 0.4em;border-radius:4px;font-family:JetBrains Mono,monospace;font-size:0.875em">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong style="color:white;font-weight:600">$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li style="margin:0.35rem 0;padding-left:0.5rem">$1</li>')
    .replace(/(<li[^>]*>.*<\/li>\n?)+/g, '<ul style="padding-left:1.5rem;margin:0.75rem 0;color:var(--text-muted)">$&</ul>')
    .replace(/\n\n/g, '</p><p style="color:var(--text-muted);line-height:1.85;margin-bottom:1rem">')
    .replace(/^(?!<[h|u|p|c|l])(.+)/gm, '<p style="color:var(--text-muted);line-height:1.85;margin-bottom:1rem">$1</p>');
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  return (
    <div style={{ paddingTop: 80 }}>
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '3rem 1.5rem' }}>
        <Link href="/blog" className="back-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem', marginBottom: '2rem', transition: 'color 0.2s' }}
        >
          <ArrowLeft size={15} /> Back to Blog
        </Link>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span className="tag">{post.category}</span>
          <span style={{ color: 'var(--text-dim)', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: 3 }}>
            <Clock size={11} /> {post.read_time} min read
          </span>
          {post.published_at && (
            <span style={{ color: 'var(--text-dim)', fontSize: '0.72rem', fontFamily: 'JetBrains Mono, monospace' }}>
              {new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          )}
        </div>

        <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: 'white', lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
          {post.title}
        </h1>

        {post.excerpt && (
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem', padding: '1rem', background: 'var(--bg-card)', borderLeft: '2px solid var(--accent)', borderRadius: '0 8px 8px 0' }}>
            {post.excerpt}
          </p>
        )}

        {post.tags?.length > 0 && (
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            {post.tags.map((t: string) => (
              <span key={t} className="tag tag-gray" style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Tag size={10} />{t}
              </span>
            ))}
          </div>
        )}

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2.5rem' }}>
          {post.content ? (
            <div
              className="prose-dark"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
            />
          ) : (
            <p style={{ color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>// Content coming soon...</p>
          )}
        </div>

        <div style={{ borderTop: '1px solid var(--border)', marginTop: '3rem', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/blog" className="btn-outline" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
            <ArrowLeft size={14} /> All Posts
          </Link>
          <Link href="/hire-me" className="btn-primary" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
            Hire Me
          </Link>
        </div>
      </div>
    </div>
  );
}
