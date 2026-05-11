import type { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { BookOpen, Clock, Tag } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog & Writeups',
  description: 'Security writeups, CTF solutions, and penetration testing articles by Reshad Rustemov.',
};

async function getPosts() {
  const { data } = await supabase
    .from('blog_posts')
    .select('id,title,slug,excerpt,category,tags,read_time,published_at,views')
    .eq('is_published', true)
    .order('published_at', { ascending: false });
  return data || [];
}

export default async function BlogPage() {
  const posts = await getPosts();
  const categories = ['All', ...Array.from(new Set(posts.map((p: { category: string }) => p.category)))];

  return (
    <div style={{ paddingTop: 80 }}>
      <section className="grid-bg" style={{ padding: '4rem 1.5rem 3rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent)', fontSize: '0.78rem', marginBottom: '0.75rem' }}>{'// writeups'}</p>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: 'white', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
            Blog & Writeups
          </h1>
          <div className="section-divider" />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: 560, marginTop: '1rem' }}>
            Security research, CTF writeups, methodology guides, and technical deep dives.
          </p>

          {/* Category filter display */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <span key={cat} className={cat === 'All' ? 'tag' : 'tag tag-gray'} style={{ cursor: 'pointer' }}>{cat}</span>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <BookOpen size={32} style={{ color: 'var(--text-dim)', margin: '0 auto 1rem' }} />
              <p style={{ color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>// No posts yet. Check back soon.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {posts.map((post: {
                id: string; title: string; slug: string; excerpt: string;
                category: string; tags: string[]; read_time: number; published_at: string; views: number;
              }) => (
                <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                  <div className="card" style={{ padding: '1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <span className="tag">{post.category}</span>
                        <span style={{ color: 'var(--text-dim)', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: 3 }}>
                          <Clock size={11} /> {post.read_time} min read
                        </span>
                        {post.published_at && (
                          <span style={{ color: 'var(--text-dim)', fontSize: '0.72rem', fontFamily: 'JetBrains Mono, monospace' }}>
                            {new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                        )}
                      </div>
                      <h2 style={{ color: 'white', fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.5rem', lineHeight: 1.4, transition: 'color 0.2s' }}>
                        {post.title}
                      </h2>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.7 }}>
                        {post.excerpt}
                      </p>
                      {post.tags?.length > 0 && (
                        <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                          {post.tags.slice(0, 4).map((t: string) => (
                            <span key={t} className="tag tag-gray" style={{ fontSize: '0.68rem', display: 'flex', alignItems: 'center', gap: 3 }}>
                              <Tag size={9} />{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent)', fontSize: '0.8rem', whiteSpace: 'nowrap', flexShrink: 0 }}>
                      Read →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
