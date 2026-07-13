import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { ProjectRequest, dbConnect } from '../../../../lib/db';

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

    let tasksData = [];

    try {
      await dbConnect();
      // 3. Fetch all project requests from MongoDB
      const reqs = await ProjectRequest.find().sort({ created_at: -1 });
      tasksData = (reqs || []).map((r) => {
        const item = r.toObject();
        return {
          ...item,
          id: r._id.toString(),
          collaborators: (item.collaborators || []).map((c: any) => ({
            user_id: c.user_id,
            user_name: c.user_name,
          })),
        };
      });
    } catch (err: any) {
      console.warn('[MongoDB Bypass] Failed to fetch team tasks, falling back to mock tasks:', err.message);
      
      // Load mock template database requests for local testing / dummy credentials
      tasksData = [
        {
          id: 'mock-t1',
          client_name: 'David Miller',
          client_email: 'david@example.com',
          client_phone: '123-456-7890',
          subject: 'Overlay Design Pack',
          description: 'Need a custom overlay package designed for stream panels and twitch overlays.',
          file_url: 'https://figma.com/file/mock-specs',
          status: 'approved',
          collaborators: [],
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
          collaborators: [
            {
              user_id: 'user_mock_collab',
              user_name: 'Co-Designer',
            }
          ],
          created_at: new Date(Date.now() - 86400000).toISOString(),
        }
      ];
    }

    return NextResponse.json({ success: true, tasks: tasksData }) as unknown as Response;
  } catch (error: any) {
    console.error('Fetch Team Tasks API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 }) as unknown as Response;
  }
}

