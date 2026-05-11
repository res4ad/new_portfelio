import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) {
    redirect('/administrator/login');
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <AdminSidebar />
      <main style={{ flex: 1, overflow: 'auto', minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  );
}
