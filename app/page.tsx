import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import HeroTerminal from '@/components/home/HeroTerminal';
import { Github, Linkedin, Target, Shield, MessageCircle, ArrowRight, Download, Mail, Code as Code2, Lock, ChevronRight, Star, Zap, BookOpen, Terminal, Server } from 'lucide-react';

async function getHomeData() {
  const [{ data: projects }, { data: posts }, { data: skills }] = await Promise.all([
    supabase.from('projects').select('id,title,slug,description,tech_stack,tags,category,difficulty').eq('is_published', true).eq('is_featured', true).limit(3),
    supabase.from('blog_posts').select('id,title,slug,excerpt,category,tags,read_time,published_at').eq('is_published', true).order('published_at', { ascending: false }).limit(3),
    supabase.from('skills').select('id,name,category,proficiency').eq('is_featured', true).order('sort_order').limit(8),
  ]);
  return { projects: projects || [], posts: posts || [], skills: skills || [] };
}

const STATS = [
  { label: 'Certifications', value: '2', icon: Star },
  { label: 'CTF Challenges', value: '50+', icon: Zap },
  { label: 'Tools Mastered', value: '15+', icon: Lock },
  { label: 'HTB Machines', value: '20+', icon: Server },
];

const SOCIAL = [
  { icon: Github, href: 'https://github.com/res4ad', label: 'GitHub', color: '#e0e0e0' },
  { icon: Linkedin, href: 'https://linkedin.com/in/res4ad', label: 'LinkedIn', color: '#4499ff' },
  { icon: Target, href: 'https://app.hackthebox.com/profile/res4ad', label: 'HackTheBox', color: '#9fef00' },
  { icon: Shield, href: 'https://tryhackme.com/p/res4ad', label: 'TryHackMe', color: '#ff6644' },
  { icon: MessageCircle, href: 'https://discord.com/users/res4ad', label: 'Discord', color: '#5865f2' },
];

export default async function HomePage() {
  const { projects, posts, skills } = await getHomeData();

  return (
    <div>
      {/* Hero */}
      <section className="grid-bg" style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        padding: '0 1.5rem',
        paddingTop: 80,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)',
          width: 700, height: 700,
          background: 'radial-gradient(circle, rgba(0,255,136,0.035) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3.5rem',
            alignItems: 'center',
          }}>
            {/* Left */}
            <div style={{ animation: 'fadeInUp 0.7s ease forwards' }}>
              <span className="badge-available" style={{ marginBottom: '1.5rem', display: 'inline-flex' }}>
                Available for work
              </span>
              <h1 style={{
                fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                marginBottom: '0.875rem',
                color: 'white',
                letterSpacing: '-0.02em',
                marginTop: '1rem',
              }}>
                Reshad <span style={{ color: 'var(--accent)' }}>Rustemov</span>
              </h1>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 'clamp(0.85rem, 2vw, 1rem)',
                color: 'var(--text-muted)',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                <span style={{ color: 'var(--accent)' }}>&gt;</span>
                Pentester &amp; Red Team Enthusiast
              </div>
              <p style={{
                color: 'var(--text-muted)',
                fontSize: '0.95rem',
                lineHeight: 1.8,
                maxWidth: 480,
                marginBottom: '2rem',
              }}>
                Focused on practical penetration testing in web applications and Active Directory
                environments. Building attack chains, breaking things ethically, documenting the journey.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', marginBottom: '2.5rem' }}>
                <Link href="/hire-me" className="btn-primary"><Mail size={15} />Hire Me</Link>
                <Link href="/projects" className="btn-outline"><Code2 size={15} />View Projects</Link>
                <a href="#" className="btn-outline"><Download size={15} />Download CV</a>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {SOCIAL.map(({ icon: Icon, href, label }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" title={label} className="social-link-home"
                    style={{
                      width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'var(--bg-card)', border: '1px solid var(--border)',
                      borderRadius: 7, color: 'var(--text-muted)', transition: 'all 0.2s',
                    }}
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            {/* Right: Terminal */}
            <div style={{ animation: 'fadeInUp 0.7s ease 0.15s both' }}>
              <HeroTerminal />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '3.5rem 1.5rem', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
            {STATS.map(({ label, value, icon: Icon }) => (
              <div key={label} style={{ textAlign: 'center', padding: '1.5rem 1rem' }} className="card">
                <Icon size={20} style={{ color: 'var(--accent)', margin: '0 auto 0.6rem' }} />
                <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'white', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1.1 }}>{value}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.35rem' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      {skills.length > 0 && (
        <section style={{ padding: '5rem 1.5rem' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ marginBottom: '2.5rem' }}>
              <p style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent)', fontSize: '0.78rem', marginBottom: '0.5rem' }}>{'// expertise'}</p>
              <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'white' }}>Core Skills</h2>
              <div className="section-divider" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
              {skills.map(skill => (
                <div key={skill.id} className="card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                    <span style={{ fontWeight: 600, color: 'white', fontSize: '0.875rem' }}>{skill.name}</span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent)', fontSize: '0.75rem' }}>{skill.proficiency}%</span>
                  </div>
                  <div className="skill-bar">
                    <div className="skill-bar-fill" style={{ width: `${skill.proficiency}%` }} />
                  </div>
                  <div style={{ marginTop: '0.5rem' }}>
                    <span className="tag tag-gray" style={{ fontSize: '0.7rem' }}>{skill.category}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <Link href="/about#skills" className="btn-outline" style={{ display: 'inline-flex' }}>
                View All Skills <ChevronRight size={15} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section style={{ padding: '5rem 1.5rem', background: 'var(--bg-secondary)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <p style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent)', fontSize: '0.78rem', marginBottom: '0.5rem' }}>{'// portfolio'}</p>
                <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'white' }}>Featured Projects</h2>
                <div className="section-divider" />
              </div>
              <Link href="/projects" className="btn-outline" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
                All Projects <ArrowRight size={14} />
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {projects.map((project: { id: string; title: string; slug: string; description: string; tech_stack: string[]; tags: string[]; category: string; difficulty: string }) => (
                <Link key={project.id} href={`/projects/${project.slug}`} style={{ textDecoration: 'none' }}>
                  <div className="card" style={{ padding: '1.5rem', height: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
                      <span className="tag">{project.category}</span>
                      <span style={{ fontSize: '0.72rem', color: project.difficulty === 'Hard' ? '#ff6644' : project.difficulty === 'Easy' ? 'var(--accent)' : '#ffaa00', fontFamily: 'JetBrains Mono, monospace' }}>
                        {project.difficulty}
                      </span>
                    </div>
                    <h3 style={{ color: 'white', fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.5rem', lineHeight: 1.4 }}>{project.title}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.83rem', lineHeight: 1.65, marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {project.description}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                      {project.tech_stack?.slice(0, 4).map((t: string) => <span key={t} className="tag tag-gray">{t}</span>)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Blog */}
      {posts.length > 0 && (
        <section style={{ padding: '5rem 1.5rem' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <p style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent)', fontSize: '0.78rem', marginBottom: '0.5rem' }}>{'// writeups'}</p>
                <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'white' }}>Latest Writeups</h2>
                <div className="section-divider" />
              </div>
              <Link href="/blog" className="btn-outline" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
                All Posts <ArrowRight size={14} />
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {posts.map((post: { id: string; title: string; slug: string; excerpt: string; category: string; tags: string[]; read_time: number }) => (
                <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                  <div className="card" style={{ padding: '1.5rem', height: '100%' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.875rem', alignItems: 'center' }}>
                      <span className="tag">{post.category}</span>
                      <span style={{ color: 'var(--text-dim)', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <BookOpen size={11} /> {post.read_time} min
                      </span>
                    </div>
                    <h3 style={{ color: 'white', fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.5rem', lineHeight: 1.4 }}>{post.title}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.83rem', lineHeight: 1.65, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{
        padding: '5rem 1.5rem',
        borderTop: '1px solid var(--border)',
        background: 'linear-gradient(135deg, rgba(0,255,136,0.025) 0%, transparent 60%)',
      }}>
        <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent)', fontSize: '0.78rem', marginBottom: '0.75rem' }}>{'// contact.init()'}</p>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'white', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            Ready to work together?
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.8, marginBottom: '2rem' }}>
            Available for penetration testing engagements, security assessments, and freelance work.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/hire-me" className="btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '0.95rem' }}>
              <Mail size={16} />Get In Touch
            </Link>
            <Link href="/terminal" className="btn-outline" style={{ padding: '0.75rem 2rem', fontSize: '0.95rem' }}>
              <Terminal size={16} />Try Terminal
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
