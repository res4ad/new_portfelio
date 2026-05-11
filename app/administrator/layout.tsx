import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Admin Panel | res4ad',
    template: '%s | Admin | res4ad',
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
