import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
 
	icons: {
  	icon: '/favicon.ico',
},
    title: {
    default: 'res4ad — Pentester & Red Team Enthusiast',
    template: '%s | res4ad',
  },
  description: 'Reshad Rustemov — Cybersecurity professional specializing in penetration testing, web application security, and red team operations.',
  keywords: ['pentester', 'cybersecurity', 'red team', 'bug bounty', 'web security', 'CTF'],
  authors: [{ name: 'Reshad Rustemov', url: 'https://res4ad.com' }],
  creator: 'Reshad Rustemov',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://res4ad.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'res4ad',
    title: 'res4ad — Pentester & Red Team Enthusiast',
    description: 'Cybersecurity professional specializing in penetration testing and red team operations.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'res4ad — Pentester & Red Team Enthusiast',
    description: 'Cybersecurity professional specializing in penetration testing and red team operations.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className} style={{ background: 'var(--bg)', minHeight: '100vh' }}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}



