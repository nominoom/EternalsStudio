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

    const { requestId } = await req.json();
    if (!requestId) {
      return NextResponse.json({ error: 'Missing required field: requestId' }, { status: 400 }) as unknown as Response;
    }

    const userEmail = user.emailAddresses?.[0]?.emailAddress;
    if (!userEmail) {
      return NextResponse.json({ error: 'User email not found' }, { status: 400 }) as unknown as Response;
    }

    // 2. Query request to verify ownership
    const { data: request, error: fetchError } = await supabaseAdmin
      .from('project_requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (fetchError || !request) {
      console.log(`[Client Delete API] Request ${requestId} not found in DB or local mock, confirming client delete`);
      return NextResponse.json({ success: true, localOnly: true }) as unknown as Response;
    }

    // 3. Security: Check that the request belongs to the authenticated user (matching client_email)
    const isAdmin = user.publicMetadata?.role === 'admin';
    if (!isAdmin && request.client_email.toLowerCase() !== userEmail.toLowerCase()) {
      return NextResponse.json({ error: 'Access denied: You are not authorized to delete this request' }, { status: 403 }) as unknown as Response;
    }

    // 4. Soft delete in Supabase
    const { error: updateError } = await supabaseAdmin
      .from('project_requests')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', requestId);

    if (updateError) {
      throw updateError;
    }

    // 5. Log audit event
    await logEvent(
      'evt_client_request_deleted',
      'client',
      'info',
      `Client ${userEmail} deleted project request "${request.subject}" (${requestId}).`,
      { requestId, actor: userEmail }
    );

    return NextResponse.json({ success: true }) as unknown as Response;
  } catch (error: any) {
    console.error('[Client Delete API] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 }) as unknown as Response;
  }
}
