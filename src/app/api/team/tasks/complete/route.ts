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
    const isAdmin = role === 'admin';
    const isTeam = role === 'team';
    if (!isAdmin && !isTeam) {
      return NextResponse.json({ error: 'Access denied: Administrative or Team role required' }, { status: 403 }) as unknown as Response;
    }

    // 3. Parse and validate payload
    const { requestId } = await req.json();
    if (!requestId) {
      return NextResponse.json({ error: 'Missing required field: requestId' }, { status: 400 }) as unknown as Response;
    }

    // 4. Fetch the task to verify ownership
    const { data: task, error: fetchError } = await supabaseAdmin
      .from('project_requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (fetchError || !task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 }) as unknown as Response;
    }

    // 5. Secure check: Only the assignee or an Admin can mark a task complete
    if (!isAdmin && task.assigned_to_id !== user.id) {
      return NextResponse.json({ error: 'Access denied: Only the task owner or an administrator can mark it complete' }, { status: 403 }) as unknown as Response;
    }

    // 6. Update task status to 'completed'
    const { data: updatedTask, error: dbError } = await supabaseAdmin
      .from('project_requests')
      .update({ status: 'completed' })
      .eq('id', requestId)
      .select()
      .single();

    if (dbError) {
      throw dbError;
    }

    // 7. Log completion event
    const userName = user.firstName 
      ? `${user.firstName} ${user.lastName || ''}`.trim() 
      : user.emailAddresses?.[0]?.emailAddress || 'Team Member';

    await logEvent(
      'evt_task_completed',
      'auth',
      'success',
      `Task "${updatedTask.subject}" was marked as completed by ${userName}.`,
      { actor: user.emailAddresses?.[0]?.emailAddress || userName, request_id: requestId, user_id: user.id }
    );

    return NextResponse.json({ success: true, task: updatedTask }) as unknown as Response;
  } catch (error: any) {
    console.error('Task Complete API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 }) as unknown as Response;
  }
}
