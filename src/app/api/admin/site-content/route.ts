import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('site_content')
      .select('content, updated_at')
      .eq('id', 1)
      .maybeSingle();

    if (error) {
      console.warn('Database fetch warning for site_content:', error.message);
      return NextResponse.json({ content: null });
    }

    return NextResponse.json({ content: data?.content || null });
  } catch (err: any) {
    console.error('Error fetching site content:', err);
    return NextResponse.json({ content: null, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    const role = user?.publicMetadata?.role;

    if (!user || role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

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
