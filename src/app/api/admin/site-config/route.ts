import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('site_config')
      .select('config, updated_at')
      .eq('id', 1)
      .maybeSingle();

    if (error) {
      console.warn('Database fetch warning for site_config:', error.message);
      return NextResponse.json({ config: null });
    }

    return NextResponse.json({ config: data?.config || null });
  } catch (err: any) {
    console.error('Error fetching site config:', err);
    return NextResponse.json({ config: null, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    const role = user?.publicMetadata?.role;

    // Check if user is authenticated and has admin role
    if (!user || role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const body = await req.json();
    if (!body.config || typeof body.config !== 'object') {
      return NextResponse.json({ error: 'Invalid config data provided.' }, { status: 400 });
    }

    // Upsert single row id = 1
    const { data, error } = await supabaseAdmin
      .from('site_config')
      .upsert({
        id: 1,
        config: body.config,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to upsert site_config in Supabase:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, config: data.config });
  } catch (err: any) {
    console.error('Error saving site config:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
