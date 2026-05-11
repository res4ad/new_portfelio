import type { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { Award, Briefcase, GraduationCap, Globe, Code as Code2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Reshad Rustemov — pentester, red team enthusiast, and cybersecurity professional.',
};

async function getData() {
  const [
    { data: profile },
    { data: skills },
    { data: certs },
    { data: education },
    { data: experience },
    { data: languages },
  ] = await Promise.all([
    supabase.from('profile').select('*').maybeSingle(),
    supabase.from('skills').select('*').order('sort_order'),
    supabase.from('certifications').select('*').order('sort_order'),
    supabase.from('education').select('*').order('sort_order'),
    supabase.from('experience').select('*').order('sort_order'),
    supabase.from('languages').select('*').order('sort_order'),
  ]);
  return { profile, skills: skills || [], certs: certs || [], education: education || [], experience: experience || [], languages: languages || [] };
}

const SKILL_CATEGORIES = ['Core', 'Tools', 'Programming', 'Networking', 'OS', 'Web Vulns', 'Post-Exploitation'];

export default async function AboutPage() {
  const { profile, skills, certs, education, experience, languages } = await getData();

  const skillsByCategory = SKILL_CATEGORIES.reduce((acc: Record<string, typeof skills>, cat) => {
    const catSkills = skills.filter((s: { category: string }) => s.category === cat);
    if (catSkills.length) acc[cat] = catSkills;
    return acc;
  }, {});

  return (
    <div style={{ paddingTop: 80 }}>
      {/* Hero */}
      <section className="grid-bg" style={{ padding: '4rem 1.5rem 3rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent)', fontSize: '0.78rem', marginBottom: '0.75rem' }}>{'// about.me'}</p>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: 'white', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            About Me
          </h1>
          <div className="section-divider" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', marginTop: '2.5rem', alignItems: 'start' }}>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.85 }}>
                {profile?.bio || 'Focused on practical penetration testing, mainly in web applications and Active Directory environments.'}
              </p>
              {profile?.hire_available && (
                <span className="badge-available" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>Available for hire</span>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {[
                { label: 'Location', value: profile?.location || 'Baku, Azerbaijan' },
                { label: 'Email', value: profile?.email || 'me@res4ad.com' },
                { label: 'Specialization', value: 'Pentesting / Red Team' },
                { label: 'Status', value: 'Open to Work' },
              ].map(item => (
                <div key={item.label} className="card" style={{ padding: '1rem' }}>
                  <p style={{ color: 'var(--text-dim)', fontSize: '0.7rem', fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>{item.label}</p>
                  <p style={{ color: 'white', fontSize: '0.85rem', fontWeight: 500 }}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section style={{ padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <Briefcase size={20} style={{ color: 'var(--accent)' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>Work Experience</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {experience.map((exp: { id: string; company: string; role: string; start_date: string; end_date: string; is_current: boolean; description: string; technologies: string[] }) => (
              <div key={exp.id} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <div>
                    <h3 style={{ color: 'white', fontWeight: 600, fontSize: '1rem' }}>{exp.role}</h3>
                    <p style={{ color: 'var(--accent)', fontSize: '0.875rem', fontFamily: 'JetBrains Mono, monospace' }}>{exp.company}</p>
                  </div>
                  <span className="tag tag-gray" style={{ whiteSpace: 'nowrap' }}>
                    {exp.start_date ? new Date(exp.start_date).getFullYear() : ''}{exp.end_date && !exp.is_current ? ` - ${new Date(exp.end_date).getFullYear()}` : exp.is_current ? ' - Present' : ''}
                  </span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.7 }}>{exp.description}</p>
                {exp.technologies?.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                    {exp.technologies.map((t: string) => <span key={t} className="tag tag-gray">{t}</span>)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education */}
      <section style={{ padding: '4rem 1.5rem', background: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <GraduationCap size={20} style={{ color: 'var(--accent)' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>Education</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
            {education.map((edu: { id: string; institution: string; degree: string; field: string; start_year: number; end_year: number; is_current: boolean; description: string }) => (
              <div key={edu.id} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <GraduationCap size={16} style={{ color: 'var(--accent)', marginTop: 2, flexShrink: 0 }} />
                  <span className="tag tag-gray">{edu.start_year}{edu.end_year ? ` - ${edu.end_year}` : ''}{edu.is_current ? ' (Current)' : ''}</span>
                </div>
                <h3 style={{ color: 'white', fontWeight: 600, fontSize: '0.95rem', margin: '0.5rem 0 0.25rem' }}>{edu.institution}</h3>
                <p style={{ color: 'var(--accent)', fontSize: '0.825rem', fontFamily: 'JetBrains Mono, monospace' }}>{edu.degree} — {edu.field}</p>
                {edu.description && <p style={{ color: 'var(--text-muted)', fontSize: '0.83rem', marginTop: '0.5rem' }}>{edu.description}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section style={{ padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <Award size={20} style={{ color: 'var(--accent)' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>Certifications</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {certs.map((cert: { id: string; name: string; issuer: string; description: string; credential_url: string }) => (
              <div key={cert.id} className="card" style={{ padding: '1.5rem', borderLeft: '2px solid var(--accent)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Award size={16} style={{ color: 'var(--accent)' }} />
                  <span className="tag">{cert.issuer}</span>
                </div>
                <h3 style={{ color: 'white', fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.4rem', lineHeight: 1.4 }}>{cert.name}</h3>
                {cert.description && <p style={{ color: 'var(--text-muted)', fontSize: '0.83rem', lineHeight: 1.6 }}>{cert.description}</p>}
                {cert.credential_url && (
                  <a href={cert.credential_url} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--accent)', fontSize: '0.78rem', marginTop: '0.75rem', textDecoration: 'none' }}>
                    Verify Credential →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" style={{ padding: '4rem 1.5rem', background: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <Code2 size={20} style={{ color: 'var(--accent)' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>Technical Skills</h2>
          </div>
          {Object.entries(skillsByCategory).map(([category, catSkills]) => (
            <div key={category} style={{ marginBottom: '2.5rem' }}>
              <h3 style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--accent)' }}>$</span> {category}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.75rem' }}>
                {(catSkills as Array<{ id: string; name: string; proficiency: number }>).map(skill => (
                  <div key={skill.id} className="card" style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ color: 'white', fontSize: '0.85rem', fontWeight: 500 }}>{skill.name}</span>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent)', fontSize: '0.72rem' }}>{skill.proficiency}%</span>
                    </div>
                    <div className="skill-bar">
                      <div className="skill-bar-fill" style={{ width: `${skill.proficiency}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Languages */}
      {languages.length > 0 && (
        <section style={{ padding: '4rem 1.5rem' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
              <Globe size={20} style={{ color: 'var(--accent)' }} />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>Languages</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
              {languages.map((lang: { id: string; name: string; level: string }) => (
                <div key={lang.id} className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
                  <div style={{ color: 'white', fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.4rem' }}>{lang.name}</div>
                  <div style={{ color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem' }}>{lang.level}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
