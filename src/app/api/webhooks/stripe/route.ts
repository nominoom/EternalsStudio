import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '../../../../lib/supabase';
import { logEvent } from '../../../../lib/logger';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_key', {
  apiVersion: '2026-06-24.dahlia',
});

export async function POST(req: Request): Promise<Response> {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') || '';

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
    
    // Log successful webhook verification
    await logEvent(
      'evt_stripe_webhook_recv',
      'stripe',
      'info',
      `Stripe webhook event verified: ${event.type}`,
      { event_id: event.id, type: event.type }
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed:`, err.message);
    await logEvent(
      'evt_stripe_webhook_error',
      'stripe',
      'error',
      `Stripe signature verification failed: ${err.message}`,
      { error: err.message }
    );
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 }) as unknown as Response;
  }

  // Handle checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    const checkoutType = session.metadata?.type || '';
    const requestId = session.metadata?.request_id || '';

    if (checkoutType === 'project_invoice' && requestId) {
      try {
        const { error: updateError } = await supabaseAdmin
          .from('project_requests')
          .update({ status: 'approved' })
          .eq('id', requestId);

        if (updateError) throw updateError;

        console.log(`Successfully completed payment for project request ${requestId}`);
        await logEvent(
          'evt_project_invoice_paid',
          'stripe',
          'success',
          `Client paid invoice for project request ID: ${requestId}. Delegated to Team Portal as Open Task.`,
          { request_id: requestId, amount: (session.amount_total || 0) / 100 }
        );
        return NextResponse.json({ received: true }) as unknown as Response;
      } catch (dbError: any) {
        console.error('Failed to update project status on webhook invoice payment:', dbError.message);
        return NextResponse.json({ error: dbError.message }, { status: 500 }) as unknown as Response;
      }
    }

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
      
      // Log successful order database writing
      await logEvent(
        'evt_stripe_order_logged',
        'stripe',
        'success',
        `Stripe order successfully written to Supabase for ${userEmail}.`,
        {
          order_id: orderData.id,
          user_id: userId,
          total_amount: totalAmount,
          items_count: orderItems.length,
        }
      );
    } catch (dbError: any) {
      console.error('Database logging error inside Stripe Webhook:', dbError.message);
      await logEvent(
        'evt_stripe_webhook_error',
        'stripe',
        'error',
        `Failed to store Stripe order records in database: ${dbError.message}`,
        { error: dbError.message, user_email: userEmail, stripe_session_id: stripeSessionId }
      );
      return NextResponse.json({ error: dbError.message }, { status: 500 }) as unknown as Response;
    }
  }

  return NextResponse.json({ received: true }) as unknown as Response;
}


