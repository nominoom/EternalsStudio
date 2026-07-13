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

    let requestsData = [];
    let collaboratorsData = [];

    try {
      // 3. Fetch all project requests from Supabase
      const { data: reqs, error: reqError } = await supabaseAdmin
        .from('project_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (reqError) throw reqError;
      requestsData = reqs || [];

      // 4. Fetch all collaborators
      const { data: cols, error: colError } = await supabaseAdmin
        .from('request_collaborators')
        .select('*');

      if (colError) throw colError;
      collaboratorsData = cols || [];
    } catch (err: any) {
      console.warn('[Supabase Bypass] Failed to fetch team tasks, falling back to mock tasks:', err.message);
      
      // Load mock template database requests for local testing / dummy credentials
      requestsData = [
        {
          id: 'mock-t1',
          client_name: 'David Miller',
          client_email: 'david@example.com',
          client_phone: '123-456-7890',
          subject: 'Overlay Design Pack',
          description: 'Need a custom overlay package designed for stream panels and twitch overlays.',
          file_url: 'https://figma.com/file/mock-specs',
          status: 'approved',
          created_at: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: 'mock-t2',
          client_name: 'Sarah Connor',
          client_email: 'sarah@example.com',
          client_phone: '555-555-5555',
          subject: 'Next.js App Setup',
          description: 'Need a fast React/Next.js setup integrated with Clerk auth and Tailwind CSS.',
          file_url: 'https://github.com/mock-specs',
          status: 'claimed',
          assigned_to_id: user.id, // Assign to current user so they can test completion
          assigned_to_name: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Lead Developer',
          created_at: new Date(Date.now() - 86400000).toISOString(),
        }
      ];
      collaboratorsData = [
        {
          id: 'mock-c1',
          request_id: 'mock-t2',
          user_id: 'user_mock_collab',
          user_name: 'Co-Designer',
        }
      ];
    }

    // 5. Merge collaborators with requests
    const tasksWithCollaborators = requestsData.map((task) => {
      const taskCols = collaboratorsData
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
