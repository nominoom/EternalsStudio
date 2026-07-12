import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { currentUser } from '@clerk/nextjs/server';
import { supabaseAdmin } from '../../../../lib/supabase';
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

    // 5. Fetch contact messages from Supabase database
    let contactMessages: any[] = [];
    try {
      const { data: dbMessages, error: dbError } = await supabaseAdmin
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (dbError) throw dbError;
      contactMessages = dbMessages || [];
    } catch (dbErr: any) {
      console.warn('Supabase messages query failed, Admin dashboard will fall back to local mock data:', dbErr.message);
      contactMessages = [];
    }

    // 6. Fetch system events from Supabase database
    let systemEvents: any[] = [];
    try {
      const { data: dbEvents, error: dbError } = await supabaseAdmin
        .from('system_events')
        .select('*')
        .order('created_at', { ascending: false });

      if (dbError) throw dbError;
      systemEvents = dbEvents || [];
    } catch (dbErr: any) {
      console.warn('Supabase events query failed, Admin dashboard will fall back to local mock data:', dbErr.message);
      systemEvents = [];
    }

    return NextResponse.json({
      orders: stripeOrders,
      messages: contactMessages,
      events: systemEvents,
    }) as unknown as Response;
  } catch (error: any) {
    console.error('Admin API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 }) as unknown as Response;
  }
}


