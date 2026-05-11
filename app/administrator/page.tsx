import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';

export default async function AdminRootPage() {
  const session = await getAdminSession();
  if (session) {
    redirect('/administrator/dashboard');
  } else {
    redirect('/administrator/login');
  }
}
