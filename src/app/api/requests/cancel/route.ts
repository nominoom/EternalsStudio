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

    // 2. Fetch the request to verify ownership and current status
    const { data: request, error: fetchError } = await supabaseAdmin
      .from('project_requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (fetchError || !request) {
      console.error('[Cancel API] Request not found or access error:', fetchError?.message);
      return NextResponse.json({ error: 'Request not found' }, { status: 404 }) as unknown as Response;
    }

    // 3. Secure check: Request must belong to this user (matching by email)
    if (request.client_email.toLowerCase() !== userEmail?.toLowerCase()) {
      return NextResponse.json({ error: 'Access denied: You are not authorized to cancel this request' }, { status: 403 }) as unknown as Response;
    }

    // 4. Validate cancellable status (only pending or awaiting_payment requests can be cancelled)
    if (request.status !== 'pending' && request.status !== 'awaiting_payment') {
      return NextResponse.json({ error: 'This request has already been purchased/processed and cannot be cancelled directly. Please contact support.' }, { status: 400 }) as unknown as Response;
    }

    // 5. Update status to 'cancelled' in Supabase
    const { data: updatedRequest, error: updateError } = await supabaseAdmin
      .from('project_requests')
      .update({ status: 'cancelled' })
      .eq('id', requestId)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    // 6. Log the event
    await logEvent(
      'evt_request_cancelled',
      'auth',
      'warning',
      `Client ${request.client_name} cancelled their project request: "${request.subject}".`,
      { request_id: requestId, actor: userEmail }
    );

    return NextResponse.json({ success: true, request: updatedRequest }) as unknown as Response;
  } catch (error: any) {
    console.error('[Cancel API] Exception:', error);
    return NextResponse.json({ error: error.message }, { status: 500 }) as unknown as Response;
  }
}
