import type { Metadata } from 'next';
import HireMeForm from './HireMeForm';
import { Mail, MapPin, Clock, Shield, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Hire Me',
  description: 'Contact Reshad Rustemov for penetration testing, security assessments, and red team engagements.',
};

const SERVICES = [
  { icon: Shield, title: 'Web Application Pentesting', desc: 'Comprehensive testing for OWASP Top 10 and beyond.' },
  { icon: Globe, title: 'Network Security Assessment', desc: 'Infrastructure scanning, enumeration, and exploitation testing.' },
  { icon: Shield, title: 'Active Directory Audit', desc: 'AD enumeration, attack path analysis, and privilege escalation testing.' },
  { icon: Clock, title: 'Security Consulting', desc: 'Vulnerability assessment reports and remediation guidance.' },
];

export default function HireMePage() {
  return (
    <div style={{ paddingTop: 80 }}>
      <section className="grid-bg" style={{ padding: '4rem 1.5rem 3rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent)', fontSize: '0.78rem', marginBottom: '0.75rem' }}>{'// contact.init()'}</p>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: 'white', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
            Hire Me
          </h1>
          <div className="section-divider" />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: 560, marginTop: '1rem' }}>
            Available for penetration testing engagements, security assessments, and freelance security work.
          </p>
        </div>
      </section>

      <section style={{ padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}>
          {/* Left: Info */}
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ color: 'white', fontWeight: 700, fontSize: '1.3rem', marginBottom: '1.25rem' }}>Services Offered</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {SERVICES.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="card" style={{ padding: '1rem 1.25rem', display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
                    <div style={{ width: 34, height: 34, background: 'var(--accent-glow)', border: '1px solid var(--border-accent)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={16} style={{ color: 'var(--accent)' }} />
                    </div>
                    <div>
                      <h3 style={{ color: 'white', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>{title}</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: 1.6 }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 style={{ color: 'white', fontWeight: 700, fontSize: '1.3rem', marginBottom: '1.25rem' }}>Contact Info</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <a href="mailto:me@res4ad.com" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
                  <Mail size={16} style={{ color: 'var(--accent)' }} />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent)', fontSize: '0.875rem' }}>me@res4ad.com</span>
                </a>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <MapPin size={16} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Baku, Azerbaijan</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Clock size={16} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>UTC+4 (AZT) • Response within 24h</span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <span className="badge-available">Currently available for work</span>
            </div>
          </div>

          {/* Right: Form */}
          <div>
            <h2 style={{ color: 'white', fontWeight: 700, fontSize: '1.3rem', marginBottom: '1.5rem' }}>Send a Message</h2>
            <HireMeForm />
          </div>
        </div>
      </section>
    </div>
  );
}
