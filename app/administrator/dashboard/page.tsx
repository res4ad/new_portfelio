import { createServiceClient } from '@/lib/supabase';
import { getAdminSession } from '@/lib/auth';
import { FolderOpen, BookOpen, Mail, Activity, FileText, Eye, Clock } from 'lucide-react';
import Link from 'next/link';

async function getDashboardData() {
  const db = createServiceClient();
  const [
    { count: projects },
    { count: posts },
    { count: messages },
    { count: unread },
    { data: recentLogs },
    { data: recentMessages },
    { count: analytics },
  ] = await Promise.all([
    db.from('projects').select('*', { count: 'exact', head: true }),
    db.from('blog_posts').select('*', { count: 'exact', head: true }),
    db.from('contact_messages').select('*', { count: 'exact', head: true }),
    db.from('contact_messages').select('*', { count: 'exact', head: true }).eq('status', 'unread'),
    db.from('audit_logs').select('action,admin_id,ip_address,created_at,success').order('created_at', { ascending: false }).limit(8),
    db.from('contact_messages').select('id,name,email,project_type,status,created_at').order('created_at', { ascending: false }).limit(5),
    db.from('analytics_events').select('*', { count: 'exact', head: true }),
  ]);

  return { projects, posts, messages, unread, recentLogs, recentMessages, analytics };
}

const STAT_COLORS: Record<string, string> = {
  projects: '#4499ff',
  posts: 'var(--accent)',
  messages: '#ffaa00',
  analytics: '#ff6644',
};

export default async function DashboardPage() {
  const session = await getAdminSession();
  const { projects, posts, messages, unread, recentLogs, recentMessages, analytics } = await getDashboardData();

  const stats = [
    { label: 'Projects', value: projects || 0, icon: FolderOpen, color: STAT_COLORS.projects, href: '/administrator/dashboard/projects' },
    { label: 'Blog Posts', value: posts || 0, icon: BookOpen, color: STAT_COLORS.posts, href: '/administrator/dashboard/blog' },
    { label: 'Messages', value: messages || 0, icon: Mail, color: STAT_COLORS.messages, href: '/administrator/dashboard/messages', badge: unread || 0 },
    { label: 'Page Views', value: analytics || 0, icon: Eye, color: STAT_COLORS.analytics, href: '/administrator/dashboard/analytics' },
  ];

  return (
    <div style={{ padding: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: 'white', fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.25rem' }}>Dashboard</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontFamily: 'JetBrains Mono, monospace' }}>
          Welcome back, <span style={{ color: 'var(--accent)' }}>{session?.adminId}</span>
        </p>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {stats.map(({ label, value, icon: Icon, color, href, badge }) => (
          <Link key={label} href={href} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ padding: '1.25rem', position: 'relative' }}>
              {badge ? (
                <div style={{
                  position: 'absolute', top: 10, right: 10,
                  background: '#ff4444', color: 'white', borderRadius: '50%',
                  width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.65rem', fontWeight: 700,
                }}>
                  {badge}
                </div>
              ) : null}
              <Icon size={18} style={{ color, marginBottom: '0.75rem' }} />
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1 }}>{value}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.3rem' }}>{label}</div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {/* Recent messages */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ color: 'white', fontWeight: 600, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={15} style={{ color: 'var(--accent)' }} /> Recent Messages
            </h2>
            <Link href="/administrator/dashboard/messages" style={{ color: 'var(--accent)', fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace', textDecoration: 'none' }}>
              View all →
            </Link>
          </div>
          {recentMessages && recentMessages.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentMessages.map((msg: { id: string; name: string; email: string; project_type: string; status: string; created_at: string }) => (
                <div key={msg.id} style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: 6, borderLeft: msg.status === 'unread' ? '2px solid var(--accent)' : '2px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                    <span style={{ color: 'white', fontSize: '0.83rem', fontWeight: 500 }}>{msg.name}</span>
                    <span style={{ color: msg.status === 'unread' ? 'var(--accent)' : 'var(--text-dim)', fontSize: '0.7rem', fontFamily: 'JetBrains Mono, monospace' }}>{msg.status}</span>
                  </div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{msg.email}</span>
                  {msg.project_type && <div><span className="tag tag-gray" style={{ marginTop: '0.3rem', fontSize: '0.68rem' }}>{msg.project_type}</span></div>}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-dim)', fontSize: '0.825rem', fontFamily: 'JetBrains Mono, monospace' }}>No messages yet.</p>
          )}
        </div>

        {/* Audit logs */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ color: 'white', fontWeight: 600, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={15} style={{ color: 'var(--accent)' }} /> Audit Log
            </h2>
            <Link href="/administrator/dashboard/logs" style={{ color: 'var(--accent)', fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace', textDecoration: 'none' }}>
              View all →
            </Link>
          </div>
          {recentLogs && recentLogs.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {recentLogs.map((log: { action: string; admin_id: string; ip_address: string; created_at: string; success: boolean }, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ flex: 1 }}>
                    <span style={{
                      color: log.success ? 'var(--accent)' : '#ff4444',
                      fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace',
                    }}>
                      {log.success ? '✓' : '✗'} {log.action}
                    </span>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.68rem', marginTop: '0.1rem', fontFamily: 'JetBrains Mono, monospace' }}>
                      {log.ip_address}
                    </div>
                  </div>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.68rem', fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'nowrap', marginLeft: '0.5rem' }}>
                    <Clock size={9} style={{ display: 'inline', marginRight: 2 }} />
                    {new Date(log.created_at).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-dim)', fontSize: '0.825rem', fontFamily: 'JetBrains Mono, monospace' }}>No logs yet.</p>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ marginTop: '1.5rem' }}>
        <h2 style={{ color: 'white', fontWeight: 600, fontSize: '0.95rem', marginBottom: '1rem' }}>Quick Actions</h2>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link href="/administrator/dashboard/projects" className="btn-outline" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
            + New Project
          </Link>
          <Link href="/administrator/dashboard/blog" className="btn-outline" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
            + New Post
          </Link>
          <Link href="/administrator/dashboard/messages" className="btn-outline" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
            View Messages {unread ? `(${unread})` : ''}
          </Link>
          <Link href="/administrator/dashboard/analytics" className="btn-outline" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
            <Activity size={14} /> Analytics
          </Link>
        </div>
      </div>
    </div>
  );
}
