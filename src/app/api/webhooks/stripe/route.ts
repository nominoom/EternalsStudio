import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '../../../../lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-01-27.academics' as any,
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') || '';

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed:`, err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
        const userId = session.metadata?.userId || '';
    const userEmail = session.metadata?.userEmail || '';
    const totalAmount = (session.amount_total || 0) / 100; // Cents to dollars
    const stripeSessionId = session.id;

    try {
      // 1. Write the main invoice order
      const { data: orderData, error: orderError } = await supabaseAdmin
        .from('orders')
        .insert({
          user_id: userId,
          user_email: userEmail,
          total_amount: totalAmount,
          status: 'completed',
          stripe_session_id: stripeSessionId,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Retrieve actual line items from Stripe API
      const lineItems = await stripe.checkout.sessions.listLineItems(stripeSessionId);

      // 3. Write the individual order items
      const orderItems = lineItems.data.map(item => ({
        order_id: orderData.id,
        product_name: item.description || 'Premium Digital Resource',
        price: (item.amount_total || 0) / 100, // Cents to dollars
      }));

      const { error: itemsError } = await supabaseAdmin
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      console.log(`Successfully logged Stripe order for User ${userId}`);
    } catch (dbError: any) {
      console.error('Database logging error inside Stripe Webhook:', dbError.message);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
