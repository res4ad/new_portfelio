import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE = 'admin_session';

async function verifySessionToken(token: string): Promise<boolean> {
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64url').toString());
    return decoded.exp > Date.now();
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /administrator routes (except login page and API)
  if (pathname.startsWith('/administrator') && !pathname.startsWith('/administrator/login')) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;

    if (!token || !(await verifySessionToken(token))) {
      const loginUrl = new URL('/administrator/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect admin API routes
  if (pathname.startsWith('/api/admin')) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    if (!token || !(await verifySessionToken(token))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  // Add security headers
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://*.supabase.co wss://*.supabase.co;"
  );
  return response;
}

export const config = {
  matcher: [
    '/administrator/:path*',
    '/api/admin/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
