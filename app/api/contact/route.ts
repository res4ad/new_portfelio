import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const limit = 5;

  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

function sanitize(str: string): string {
  return str.replace(/<[^>]*>/g, '').trim().slice(0, 2000);
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || 'unknown';

    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const body = await req.json();
    const { name, email, company, project_type, budget, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    const db = createServiceClient();
    const { error } = await db.from('contact_messages').insert({
      name: sanitize(name),
      email: sanitize(email),
      company: company ? sanitize(company) : null,
      project_type: project_type ? sanitize(project_type) : null,
      budget: budget ? sanitize(budget) : null,
      message: sanitize(message),
      ip_address: ip,
      user_agent: req.headers.get('user-agent') || '',
      status: 'unread',
    });

    if (error) {
      console.error('Contact insert error:', error);
      return NextResponse.json({ error: 'Failed to submit. Please try again.' }, { status: 500 });
    }

    // Log the submission
    await db.from('audit_logs').insert({
      action: 'contact_form_submitted',
      resource_type: 'contact_message',
      details: { email: sanitize(email), project_type: project_type || null },
      ip_address: ip,
      user_agent: req.headers.get('user-agent') || '',
      success: true,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Contact route error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
