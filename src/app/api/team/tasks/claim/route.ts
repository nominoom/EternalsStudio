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

    // 2. Validate team/admin privileges
    const role = user.publicMetadata?.role;
    const hasAccess = role === 'admin' || role === 'team';
    if (!hasAccess) {
      return NextResponse.json({ error: 'Access denied: Administrative or Team role required' }, { status: 403 }) as unknown as Response;
    }

    // 3. Parse and validate payload
    const { requestId } = await req.json();
    if (!requestId) {
      return NextResponse.json({ error: 'Missing required field: requestId' }, { status: 400 }) as unknown as Response;
    }

    const userName = user.firstName 
      ? `${user.firstName} ${user.lastName || ''}`.trim() 
      : user.emailAddresses?.[0]?.emailAddress || 'Team Member';

    // 4. Update request status to 'claimed' and assign
    const { data: task, error: dbError } = await supabaseAdmin
      .from('project_requests')
      .update({
        status: 'claimed',
        assigned_to_id: user.id,
        assigned_to_name: userName,
      })
      .eq('id', requestId)
      .eq('status', 'approved') // Safety check: can only claim approved, open tasks
      .select()
      .single();

    if (dbError) {
      throw dbError;
    }

    // 5. Log assignment event
    await logEvent(
      'evt_task_claimed',
      'auth',
      'success',
      `Team member ${userName} claimed task "${task.subject}".`,
      { actor: user.emailAddresses?.[0]?.emailAddress || userName, request_id: requestId, user_id: user.id }
    );

    return NextResponse.json({ success: true, task }) as unknown as Response;
  } catch (error: any) {
    console.error('Task Claim API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 }) as unknown as Response;
  }
}
