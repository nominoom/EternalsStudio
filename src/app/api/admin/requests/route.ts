import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { supabaseAdmin } from '../../../../lib/supabase';
import { logEvent } from '../../../../lib/logger';

// DELETE: Soft delete a project request (mark deleted_at = now())
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

    const { searchParams } = new URL(req.url);
    const requestId = searchParams.get('id');
    const purge = searchParams.get('purge') === 'true';

    if (!requestId) {
      return NextResponse.json({ error: 'Missing required query parameter: id' }, { status: 400 }) as unknown as Response;
    }

    let dbError;
    if (purge) {
      // Permanent hard delete
      console.log(`[Admin Request DELETE] Executing permanent purge for request ID: ${requestId}`);
      const { error } = await supabaseAdmin
        .from('project_requests')
        .delete()
        .eq('id', requestId);
      dbError = error;
    } else {
      // Soft delete
      console.log(`[Admin Request DELETE] Executing soft delete for request ID: ${requestId}`);
      const { error } = await supabaseAdmin
        .from('project_requests')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', requestId);
      dbError = error;
    }

    if (dbError) throw dbError;

    // 4. Log deletion audit event
    const adminEmail = user.emailAddresses?.[0]?.emailAddress || 'admin@eternals.gg';
    await logEvent(
      purge ? 'evt_request_purged' : 'evt_request_soft_deleted',
      'database',
      'warning',
      `Administrator ${purge ? 'permanently purged' : 'soft deleted'} project request with ID: ${requestId}.`,
      { actor: adminEmail, request_id: requestId }
    );

    return NextResponse.json({ success: true }) as unknown as Response;
  } catch (error: any) {
    console.error('[Admin Request DELETE] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 }) as unknown as Response;
  }
}

// PATCH: Restore a soft deleted project request (mark deleted_at = null)
export async function PATCH(req: Request): Promise<Response> {
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

    const { requestId } = await req.json();
    if (!requestId) {
      return NextResponse.json({ error: 'Missing required field: requestId' }, { status: 400 }) as unknown as Response;
    }

    // 3. Clear deleted_at timestamp in Supabase
    const { error: dbError } = await supabaseAdmin
      .from('project_requests')
      .update({ deleted_at: null })
      .eq('id', requestId);

    if (dbError) throw dbError;

    // 4. Log restore audit event
    const adminEmail = user.emailAddresses?.[0]?.emailAddress || 'admin@eternals.gg';
    await logEvent(
      'evt_request_restored',
      'database',
      'success',
      `Administrator restored project request with ID: ${requestId}.`,
      { actor: adminEmail, request_id: requestId }
    );

    return NextResponse.json({ success: true }) as unknown as Response;
  } catch (error: any) {
    console.error('[Admin Request PATCH] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 }) as unknown as Response;
  }
}
