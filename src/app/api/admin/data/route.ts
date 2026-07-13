import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { currentUser } from '@clerk/nextjs/server';
import { ContactMessage, SystemEvent, ProjectRequest, dbConnect } from '../../../../lib/db';
import { logEvent } from '../../../../lib/logger';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_key', {
  apiVersion: '2026-06-24.dahlia',
});

export async function GET(req: Request): Promise<Response> {
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

    await dbConnect();

    // 3. Log admin access audit event
    const adminEmail = user.emailAddresses?.[0]?.emailAddress || 'admin@eternals.gg';
    await logEvent(
      'evt_admin_login',
      'auth',
      'info',
      `Administrator session authorized for dashboard data view.`,
      { actor: adminEmail, userId: user.id }
    );

    // 4. Fetch transaction charges directly from Stripe
    let stripeOrders: any[] = [];
    try {
      const charges = await stripe.charges.list({ limit: 100 });
      
      stripeOrders = charges.data.map((charge) => ({
        id: charge.id,
        user_email: charge.billing_details?.email || charge.receipt_email || 'customer@example.com',
        total_amount: charge.amount / 100, // Cents to Dollars
        status: charge.status === 'succeeded' ? 'completed' : charge.status,
        created_at: new Date(charge.created * 1000).toISOString(),
      }));
    } catch (stripeErr: any) {
      console.warn('Stripe charges fetch failed, Admin dashboard will fall back to local mock data:', stripeErr.message);
      stripeOrders = [];
    }

    // 5. Fetch contact messages from MongoDB database
    let contactMessages: any[] = [];
    try {
      const dbMessages = await ContactMessage.find().sort({ created_at: -1 });
      contactMessages = (dbMessages || []).map((msg) => ({
        id: msg._id.toString(),
        name: msg.name,
        email: msg.email,
        subject: msg.subject,
        message: msg.message,
        status: msg.status,
        created_at: msg.created_at.toISOString(),
      }));
    } catch (dbErr: any) {
      console.warn('MongoDB messages query failed, Admin dashboard will fall back to local mock data:', dbErr.message);
      contactMessages = [];
    }

    // 6. Fetch system events from MongoDB database
    let systemEvents: any[] = [];
    try {
      const dbEvents = await SystemEvent.find().sort({ created_at: -1 });
      systemEvents = (dbEvents || []).map((evt) => ({
        id: evt._id.toString(),
        event_key: evt.event_key,
        category: evt.category,
        status: evt.status,
        message: evt.message,
        metadata: evt.metadata,
        created_at: evt.created_at.toISOString(),
      }));
    } catch (dbErr: any) {
      console.warn('MongoDB events query failed, Admin dashboard will fall back to local mock data:', dbErr.message);
      systemEvents = [];
    }

    // 7. Fetch project requests from MongoDB database
    let projectRequests: any[] = [];
    try {
      const dbRequests = await ProjectRequest.find().sort({ created_at: -1 });
      projectRequests = (dbRequests || []).map((reqItem) => ({
        id: reqItem._id.toString(),
        client_name: reqItem.client_name,
        client_email: reqItem.client_email,
        client_phone: reqItem.client_phone,
        subject: reqItem.subject,
        description: reqItem.description,
        file_url: reqItem.file_url,
        status: reqItem.status,
        assigned_to_id: reqItem.assigned_to_id,
        assigned_to_name: reqItem.assigned_to_name,
        invoice_url: reqItem.invoice_url,
        invoice_amount: reqItem.invoice_amount,
        collaborators: (reqItem.collaborators || []).map((collab) => ({
          user_id: collab.user_id,
          user_name: collab.user_name,
          joined_at: collab.joined_at.toISOString(),
        })),
        created_at: reqItem.created_at.toISOString(),
      }));
    } catch (dbErr: any) {
      console.warn('MongoDB project requests query failed:', dbErr.message);
      projectRequests = [];
    }

    return NextResponse.json({
      orders: stripeOrders,
      messages: contactMessages,
      events: systemEvents,
      requests: projectRequests,
    }) as unknown as Response;
  } catch (error: any) {
    console.error('Admin API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 }) as unknown as Response;
  }
}



