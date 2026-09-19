import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const noStoreHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'CDN-Cache-Control': 'no-store',
};

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('site_content')
      .select('content, updated_at')
      .eq('id', 1)
      .maybeSingle();

    if (error) {
      console.warn('Database fetch warning for site_content:', error.message);
      return NextResponse.json({ content: null }, { headers: noStoreHeaders });
    }

    return NextResponse.json({ content: data?.content || null }, { headers: noStoreHeaders });
  } catch (err: any) {
    console.error('Error fetching site content:', err);
    return NextResponse.json({ content: null, error: err.message }, { status: 500, headers: noStoreHeaders });
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    const body = await req.json();
    if (!body.content || typeof body.content !== 'object') {
      return NextResponse.json({ error: 'Invalid content data provided.' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('site_content')
      .upsert({
        id: 1,
        content: body.content,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to upsert site_content in Supabase:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, content: data.content });
  } catch (err: any) {
    console.error('Error saving site content:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
