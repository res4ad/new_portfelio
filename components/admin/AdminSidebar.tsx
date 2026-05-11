'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Terminal, LayoutDashboard, FolderOpen, BookOpen, Mail, Settings, Users, FileText, Activity, LogOut, Shield, Code as Code2, Award, Menu, X } from 'lucide-react';

const NAV = [
  { href: '/administrator/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/administrator/dashboard/projects', icon: FolderOpen, label: 'Projects' },
  { href: '/administrator/dashboard/blog', icon: BookOpen, label: 'Blog Posts' },
  { href: '/administrator/dashboard/messages', icon: Mail, label: 'Messages' },
  { href: '/administrator/dashboard/profile', icon: Users, label: 'Profile & Skills' },
  { href: '/administrator/dashboard/certifications', icon: Award, label: 'Certifications' },
  { href: '/administrator/dashboard/terminal-cmds', icon: Code2, label: 'Terminal Cmds' },
  { href: '/administrator/dashboard/analytics', icon: Activity, label: 'Analytics' },
  { href: '/administrator/dashboard/logs', icon: FileText, label: 'Audit Logs' },
  { href: '/administrator/dashboard/settings', icon: Settings, label: 'Settings' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    router.push('/administrator/login');
  };

  const SidebarContent = () => (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: '#0a0a0a',
      borderRight: '1px solid var(--border)',
    }}>
      {/* Logo */}
      <div style={{
        padding: '1.25rem',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        gap: '0.75rem',
      }}>
        {!collapsed && (
          <Link href="/administrator/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <div style={{ width: 28, height: 28, background: 'var(--accent)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Terminal size={14} color="#000" strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', fontWeight: 700, color: 'white' }}>res4ad</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace' }}>admin panel</div>
            </div>
          </Link>
        )}
        <button onClick={() => setCollapsed(!collapsed)} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '0.2rem' }}>
          <Menu size={16} />
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0.75rem 0.5rem', overflowY: 'auto' }}>
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.7rem',
              padding: collapsed ? '0.7rem 0.65rem' : '0.6rem 0.875rem',
              justifyContent: collapsed ? 'center' : 'flex-start',
              borderRadius: 7,
              marginBottom: '0.15rem',
              textDecoration: 'none',
              background: active ? 'rgba(0,255,136,0.08)' : 'transparent',
              color: active ? 'var(--accent)' : 'var(--text-muted)',
              transition: 'all 0.15s',
              fontSize: '0.825rem',
              fontWeight: active ? 600 : 400,
              borderLeft: active ? '2px solid var(--accent)' : '2px solid transparent',
            }}
              onMouseEnter={e => { if (!active) { const el = e.currentTarget as HTMLAnchorElement; el.style.background = 'rgba(255,255,255,0.04)'; el.style.color = 'white'; } }}
              onMouseLeave={e => { if (!active) { const el = e.currentTarget as HTMLAnchorElement; el.style.background = 'transparent'; el.style.color = 'var(--text-muted)'; } }}
              title={collapsed ? label : undefined}
            >
              <Icon size={15} style={{ flexShrink: 0 }} />
              {!collapsed && label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '0.75rem 0.5rem', borderTop: '1px solid var(--border)' }}>
        <Link href="/" target="_blank" style={{
          display: 'flex', alignItems: 'center', gap: '0.7rem', padding: '0.6rem 0.875rem',
          borderRadius: 7, textDecoration: 'none', color: 'var(--text-muted)', fontSize: '0.825rem', marginBottom: '0.15rem',
          justifyContent: collapsed ? 'center' : 'flex-start',
        }}
          title={collapsed ? 'View Site' : undefined}
        >
          <Shield size={15} />
          {!collapsed && 'View Site'}
        </Link>
        <button onClick={handleLogout} style={{
          display: 'flex', alignItems: 'center', gap: '0.7rem', padding: '0.6rem 0.875rem',
          borderRadius: 7, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
          fontSize: '0.825rem', width: '100%', justifyContent: collapsed ? 'center' : 'flex-start',
          transition: 'all 0.15s',
        }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background = 'rgba(255,68,68,0.08)'; el.style.color = '#ff4444'; }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background = 'none'; el.style.color = 'var(--text-muted)'; }}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut size={15} />
          {!collapsed && 'Logout'}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div
        style={{
          width: collapsed ? 56 : 220,
          flexShrink: 0,
          height: '100vh',
          position: 'sticky',
          top: 0,
          transition: 'width 0.2s ease',
        }}
        className="hidden md:block"
      >
        <SidebarContent />
      </div>

      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        style={{
          position: 'fixed', bottom: '1rem', right: '1rem', zIndex: 200,
          width: 44, height: 44, background: 'var(--accent)', border: 'none',
          borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
        }}
        className="md:hidden"
      >
        {mobileOpen ? <X size={18} color="#000" /> : <Menu size={18} color="#000" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 150, background: 'rgba(0,0,0,0.7)' }}
          onClick={() => setMobileOpen(false)}
          className="md:hidden"
        >
          <div
            style={{ width: 220, height: '100%', position: 'absolute', left: 0 }}
            onClick={e => e.stopPropagation()}
          >
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}
