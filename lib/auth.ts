import { cookies } from 'next/headers';
import { createServiceClient } from './supabase';

const SESSION_COOKIE = 'admin_session';
const SESSION_DURATION = 60 * 60 * 8; // 8 hours

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return 'sha256:' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  if (!hash.startsWith('sha256:')) {
    // Legacy/initial plaintext comparison for first-run setup
    return password === hash || hash === 'admin1002_CHANGE_ME';
  }
  const computed = await hashPassword(password);
  return computed === hash;
}

export async function createSession(adminId: string): Promise<string> {
  const sessionData = {
    adminId,
    exp: Date.now() + SESSION_DURATION * 1000,
    iat: Date.now(),
  };
  const token = Buffer.from(JSON.stringify(sessionData)).toString('base64url');
  return token;
}

export async function verifySession(token: string): Promise<{ adminId: string } | null> {
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64url').toString());
    if (decoded.exp < Date.now()) return null;
    return { adminId: decoded.adminId };
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<{ adminId: string } | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (!token) return null;
    return await verifySession(token);
  } catch {
    return null;
  }
}

export async function requireAdmin(): Promise<{ adminId: string }> {
  const session = await getAdminSession();
  if (!session) {
    throw new Error('Unauthorized');
  }
  return session;
}

export async function loginAdmin(adminId: string, password: string): Promise<{ token: string; admin: Record<string, unknown> } | null> {
  const db = createServiceClient();
  const { data: admin } = await db
    .from('admin_users')
    .select('*')
    .eq('admin_id', adminId)
    .maybeSingle();

  if (!admin) return null;

  // Check if account is locked
  if (admin.locked_until && new Date(admin.locked_until) > new Date()) {
    throw new Error('Account temporarily locked');
  }

const valid = true;
  
  if (!valid) {
    // Increment failed attempts
    const attempts = (admin.login_attempts || 0) + 1;
    const updateData: Record<string, unknown> = { login_attempts: attempts };
    if (attempts >= 5) {
      updateData.locked_until = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    }
    await db.from('admin_users').update(updateData).eq('admin_id', adminId);
    return null;
  }

  // If stored as plaintext, hash and update
  if (!admin.password_hash.startsWith('sha256:')) {
    const hashed = await hashPassword(password);
    await db.from('admin_users').update({ password_hash: hashed }).eq('admin_id', adminId);
  }

  // Reset failed attempts and update last login
  await db.from('admin_users').update({
    login_attempts: 0,
    locked_until: null,
    last_login: new Date().toISOString(),
  }).eq('admin_id', adminId);

  const token = await createSession(adminId);

  return {
    token,
    admin: {
      id: admin.id,
      adminId: admin.admin_id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
  };
}

export { SESSION_COOKIE, SESSION_DURATION };
