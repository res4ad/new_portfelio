'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Terminal, Github, Linkedin, Shield, Target, MessageCircle, Heart } from 'lucide-react';

const SOCIAL = [
  { icon: Github, href: 'https://github.com/res4ad', label: 'GitHub' },
  { icon: Linkedin, href: 'https://linkedin.com/in/res4ad', label: 'LinkedIn' },
  { icon: Target, href: 'https://app.hackthebox.com/profile/res4ad', label: 'HackTheBox' },
  { icon: Shield, href: 'https://tryhackme.com/p/res4ad', label: 'TryHackMe' },
  { icon: MessageCircle, href: 'https://discord.com/users/res4ad', label: 'Discord' },
];

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
  { href: '/terminal', label: 'Terminal' },
  { href: '/hire-me', label: 'Hire Me' },
];

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/administrator')) return null;

  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      background: 'var(--bg-secondary)',
      marginTop: '6rem',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '3rem 1.5rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2.5rem', marginBottom: '2.5rem' }}>
          {/* Brand */}
          <div>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', marginBottom: '1rem' }}>
              <div style={{
                width: 28, height: 28, background: 'var(--accent)', borderRadius: 5,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Terminal size={14} color="#000" strokeWidth={2.5} />
              </div>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: 'white', fontSize: '0.95rem' }}>res4ad</span>
            </Link>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.7, maxWidth: 260 }}>
              Pentester & Red Team Enthusiast. Focused on web application security and Active Directory attacks.
            </p>
          </div>

          {/* Nav */}
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem', fontFamily: 'JetBrains Mono, monospace' }}>Navigation</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {LINKS.map(l => (
                <Link key={l.href} href={l.href} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.875rem' }}
                >{l.label}</Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem', fontFamily: 'JetBrains Mono, monospace' }}>Contact</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <a href="mailto:me@res4ad.com" style={{ color: 'var(--accent)', fontSize: '0.875rem', textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace' }}>me@res4ad.com</a>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Baku, Azerbaijan</p>
              <span className="badge-available" style={{ width: 'fit-content', marginTop: '0.25rem' }}>Available for hire</span>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div style={{
          borderTop: '1px solid var(--border)',
          paddingTop: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', fontFamily: 'JetBrains Mono, monospace', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            © 2025 res4ad. Built with <Heart size={12} style={{ color: 'var(--accent)' }} /> in Baku.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {SOCIAL.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                title={label}
                className="social-link"
                style={{
                  width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 6, color: 'var(--text-muted)', textDecoration: 'none',
                }}
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
