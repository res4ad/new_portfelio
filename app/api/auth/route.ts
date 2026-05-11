import { NextRequest, NextResponse } from 'next/server';
import { loginAdmin, SESSION_COOKIE, SESSION_DURATION } from '@/lib/auth';
import { createServiceClient } from '@/lib/supabase';

const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function checkBruteForce(ip: string): boolean {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const limit = 10;

  const entry = loginAttempts.get(ip);
  if (!entry || now > entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';

  if (!checkBruteForce(ip)) {
    return NextResponse.json({ error: 'Too many login attempts. Try again later.' }, { status: 429 });
  }

  try {
    const { adminId, password } = await req.json();

    if (!adminId || !password) {
      return NextResponse.json({ error: 'Admin ID and password required.' }, { status: 400 });
    }

    const db = createServiceClient();

    let result;
    try {
      result = await loginAdmin(adminId, password);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login error';
      return NextResponse.json({ error: msg }, { status: 401 });
    }

    if (!result) {
      await db.from('audit_logs').insert({
        admin_id: adminId,
        action: 'login_failed',
        resource_type: 'admin_auth',
        ip_address: ip,
        user_agent: req.headers.get('user-agent') || '',
        success: false,
      });
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    await db.from('audit_logs').insert({
      admin_id: adminId,
      action: 'login_success',
      resource_type: 'admin_auth',
      ip_address: ip,
      user_agent: req.headers.get('user-agent') || '',
      success: true,
    });

    const res = NextResponse.json({ success: true, admin: result.admin });
    res.cookies.set(SESSION_COOKIE, result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_DURATION,
      path: '/',
    });

    return res;
  } catch (err) {
    console.error('Auth error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
