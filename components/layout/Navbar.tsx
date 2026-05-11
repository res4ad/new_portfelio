'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Terminal, Menu, X, Shield } from 'lucide-react';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
  { href: '/terminal', label: 'Terminal' },
  { href: '/hire-me', label: 'Hire Me' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (pathname?.startsWith('/administrator')) return null;

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: 'all 0.3s ease',
        background: scrolled ? 'rgba(8,8,8,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <div style={{
              width: 32, height: 32, background: 'var(--accent)', borderRadius: 6,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Terminal size={16} color="#000" strokeWidth={2.5} />
            </div>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: '1rem', color: 'white' }}>
              res4ad
            </span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent)', fontSize: '1rem' }}>_</span>
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="hidden md:flex">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link"
                style={{
                  padding: '0.4rem 0.875rem',
                  borderRadius: 6,
                  color: pathname === link.href ? 'var(--accent)' : 'var(--text-muted)',
                  background: pathname === link.href ? 'var(--accent-glow)' : 'transparent',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  transition: 'all 0.2s',
                  textDecoration: 'none',
                }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/hire-me"
              style={{
                marginLeft: '0.5rem',
                background: 'var(--accent)',
                color: '#000',
                padding: '0.4rem 1rem',
                borderRadius: 6,
                fontSize: '0.8rem',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'var(--accent-dim)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'var(--accent)';
              }}
            >
              <Shield size={12} />
              Hire Me
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
            }}
            className="md:hidden"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            style={{
              borderTop: '1px solid var(--border)',
              paddingBottom: '1rem',
              animation: 'fadeIn 0.2s ease',
            }}
            className="md:hidden"
          >
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  display: 'block',
                  padding: '0.75rem 0.5rem',
                  color: pathname === link.href ? 'var(--accent)' : 'var(--text-muted)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  borderBottom: '1px solid var(--border)',
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
