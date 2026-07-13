import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { supabaseAdmin } from '../../../../lib/supabase';

export async function GET(req: Request): Promise<Response> {
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

    // 3. Fetch all project requests from Supabase
    const { data: requests, error: reqError } = await supabaseAdmin
      .from('project_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (reqError) throw reqError;

    // 4. Fetch all collaborators
    const { data: collaborators, error: colError } = await supabaseAdmin
      .from('request_collaborators')
      .select('*');

    if (colError) throw colError;

    // 5. Merge collaborators with requests
    const tasksWithCollaborators = (requests || []).map((task) => {
      const taskCols = (collaborators || [])
        .filter((c) => c.request_id === task.id)
        .map((c) => ({
          user_id: c.user_id,
          user_name: c.user_name,
        }));

      return {
        ...task,
        collaborators: taskCols,
      };
    });

    return NextResponse.json({ success: true, tasks: tasksWithCollaborators }) as unknown as Response;
  } catch (error: any) {
    console.error('Fetch Team Tasks API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 }) as unknown as Response;
  }
}
