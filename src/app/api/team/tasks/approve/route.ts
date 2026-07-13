import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { supabaseAdmin } from '../../../../../lib/supabase';
import { logEvent } from '../../../../../lib/logger';

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

    // 3. Parse and validate payload
    const { requestId } = await req.json();
    if (!requestId) {
      return NextResponse.json({ error: 'Missing required field: requestId' }, { status: 400 }) as unknown as Response;
    }

    // 4. Update request status to 'approved'
    const { data: task, error: dbError } = await supabaseAdmin
      .from('project_requests')
      .update({ status: 'approved' })
      .eq('id', requestId)
      .select()
      .single();

    if (dbError) {
      throw dbError;
    }

    // 5. Log delegation event
    const adminEmail = user.emailAddresses?.[0]?.emailAddress || 'admin@eternals.gg';
    await logEvent(
      'evt_task_approved',
      'contact',
      'info',
      `Administrator approved request "${task.subject}" and delegated it to the team portal.`,
      { actor: adminEmail, request_id: requestId }
    );

    return NextResponse.json({ success: true, task }) as unknown as Response;
  } catch (error: any) {
    console.error('Task Approval API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 }) as unknown as Response;
  }
}
