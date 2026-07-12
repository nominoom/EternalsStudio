import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { currentUser } from '@clerk/nextjs/server';
import { supabaseAdmin } from '../../../../lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_key', {
  apiVersion: '2025-01-27.academics' as any,
});

export async function GET(req: Request) {
  try {
    // 1. Authenticate with Clerk
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // 2. Validate administrator privileges
    const isAdmin = user.publicMetadata?.role === 'admin';
    if (!isAdmin) {
      return NextResponse.json({ error: 'Access denied: Administrator privileges required' }, { status: 403 });
    }

    // 3. Fetch transaction charges directly from Stripe
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
      // We set to empty array/null so the client fallback trigger initiates
      stripeOrders = [];
    }

    // 4. Fetch contact messages from Supabase database
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

    return NextResponse.json({
      orders: stripeOrders,
      messages: contactMessages,
    });
  } catch (error: any) {
    console.error('Admin API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
