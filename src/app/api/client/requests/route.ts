import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { ProjectRequest, dbConnect } from '../../../../lib/db';

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const email = user.emailAddresses?.[0]?.emailAddress;
    if (!email) {
      return NextResponse.json({ error: 'No email address associated with Clerk user' }, { status: 400 });
    }

    await dbConnect();
    const requests = await ProjectRequest.find({ client_email: email }).sort({ created_at: -1 });

    // Map _id to id
    const formattedRequests = requests.map((r) => ({
      ...r.toObject(),
      id: r._id.toString(),
      collaborators: (r.collaborators || []).map((collab) => ({
        user_id: collab.user_id,
        user_name: collab.user_name,
        joined_at: collab.joined_at.toISOString(),
      })),
    }));

    return NextResponse.json(formattedRequests);
  } catch (error: any) {
    console.error('Fetch client requests error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
