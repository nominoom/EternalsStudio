import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { supabaseAdmin } from '../../../../lib/supabase';
import { logEvent } from '../../../../lib/logger';

export async function POST(req: Request): Promise<Response> {
  try {
    // 1. Authenticate with Clerk
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 }) as unknown as Response;
    }

    // 2. Validate administrator privileges
    const isAdmin = user.publicMetadata?.role === 'admin';
    if (!isAdmin) {
      return NextResponse.json({ error: 'Access denied: Administrator privileges required' }, { status: 403 }) as unknown as Response;
    }

    // 3. Parse and validate body
    const { title, subtitle, category, description, tags, image_url } = await req.json();

    if (!title || !category || !subtitle || !description) {
      return NextResponse.json({ error: 'Missing required fields: title, category, subtitle, or description' }, { status: 400 }) as unknown as Response;
    }

    // 4. Insert into Supabase Table
    const { data: project, error: dbError } = await supabaseAdmin
      .from('portfolio')
      .insert([
        {
          title,
          subtitle,
          category,
          description,
          tags: tags || [],
          image_url: image_url || '',
          badges: ['Client']
        }
      ])
      .select()
      .single();

    if (dbError) {
      throw dbError;
    }

    // 5. Log audit event
    const adminEmail = user.emailAddresses?.[0]?.emailAddress || 'admin@eternals.gg';
    await logEvent(
      'evt_portfolio_created',
      'database',
      'success',
      `Administrator uploaded project "${title}" to portfolio under category "${category}".`,
      { actor: adminEmail, project_id: project.id, category }
    );

    return NextResponse.json({ success: true, project }) as unknown as Response;
  } catch (error: any) {
    console.error('Portfolio Creation API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 }) as unknown as Response;
  }
}

export async function DELETE(req: Request): Promise<Response> {
  try {
    // 1. Authenticate with Clerk
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 }) as unknown as Response;
    }

    // 2. Validate administrator privileges
    const isAdmin = user.publicMetadata?.role === 'admin';
    if (!isAdmin) {
      return NextResponse.json({ error: 'Access denied: Administrator privileges required' }, { status: 403 }) as unknown as Response;
    }

    // 3. Parse target ID
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('id');

    if (!projectId) {
      return NextResponse.json({ error: 'Missing ID parameter' }, { status: 400 }) as unknown as Response;
    }

    // 4. Delete from Supabase Table
    const { error: dbError } = await supabaseAdmin
      .from('portfolio')
      .delete()
      .eq('id', projectId);

    if (dbError) {
      throw dbError;
    }

    // 5. Log audit event
    const adminEmail = user.emailAddresses?.[0]?.emailAddress || 'admin@eternals.gg';
    await logEvent(
      'evt_portfolio_deleted',
      'database',
      'warning',
      `Administrator deleted portfolio project ID: ${projectId}.`,
      { actor: adminEmail, project_id: projectId }
    );

    return NextResponse.json({ success: true }) as unknown as Response;
  } catch (error: any) {
    console.error('Portfolio Deletion API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 }) as unknown as Response;
  }
}
