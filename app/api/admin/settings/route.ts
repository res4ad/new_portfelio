import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase';
import { getAdminSession } from '@/lib/auth';

async function auth() {
  const session = await getAdminSession();
  return !!session;
}

export async function POST(req: NextRequest) {
  if (!await auth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { key, value } = await req.json();
  if (!key) return NextResponse.json({ error: 'Missing key' }, { status: 400 });

  const db = createServiceClient();
  const existing = await db.from('site_settings').select('id').eq('key', key).maybeSingle();

  let data, error;
  if (existing.data) {
    ({ data, error } = await db.from('site_settings').update({ value }).eq('key', key).select().single());
  } else {
    ({ data, error } = await db.from('site_settings').insert({ key, value }).select().single());
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ setting: data });
}
