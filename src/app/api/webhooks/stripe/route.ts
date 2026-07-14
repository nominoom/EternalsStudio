import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';
import { supabaseAdmin } from '../../../../lib/supabase';
import { logEvent } from '../../../../lib/logger';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_key', {
  apiVersion: '2026-06-24.dahlia',
});

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder_key');

export async function POST(req: Request): Promise<Response> {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') || '';

  console.log('[Stripe Webhook] Received HTTP POST request to /api/webhooks/stripe');
  console.log('[Stripe Webhook] Signature present:', !!signature);
  console.log('[Stripe Webhook] Webhook Secret present:', !!process.env.STRIPE_WEBHOOK_SECRET);

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
    
    console.log('[Stripe Webhook] Webhook signature verification successful. Event type:', event.type);
    
    // Log successful webhook verification
    await logEvent(
      'evt_stripe_webhook_recv',
      'stripe',
      'info',
      `Stripe webhook event verified: ${event.type}`,
      { event_id: event.id, type: event.type }
    );
  } catch (err: any) {
    console.error(`[Stripe Webhook] Webhook signature verification failed:`, err.message);
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

    console.log('[Stripe Webhook] checkout.session.completed session details:', {
      id: session.id,
      payment_status: session.payment_status,
      checkoutType,
      requestId
    });

    if (checkoutType === 'project_invoice' && requestId) {
      console.log('[Stripe Webhook] Processing project request invoice payment for Request ID:', requestId);
      try {
        // Fetch current request details to get client metadata
        console.log('[Stripe Webhook] Querying Supabase for project request details...');
        const { data: request, error: fetchError } = await supabaseAdmin
          .from('project_requests')
          .select('*')
          .eq('id', requestId)
          .single();

        if (fetchError || !request) {
          console.error('[Stripe Webhook] Failed to find project request in database:', fetchError?.message || 'Not found');
          throw fetchError || new Error('Request not found');
        }

        console.log('[Stripe Webhook] Found project request in DB. Current status:', request.status);

        // Only update status and send confirmation if it wasn't already processed
        if (request.status !== 'approved' && request.status !== 'claimed' && request.status !== 'completed') {
          console.log('[Stripe Webhook] Updating project request status to "approved" in DB...');
          const { error: updateError } = await supabaseAdmin
            .from('project_requests')
            .update({ status: 'approved' })
            .eq('id', requestId);

          if (updateError) {
            console.error('[Stripe Webhook] Database update error:', updateError.message);
            throw updateError;
          }
          console.log('[Stripe Webhook] Successfully updated project request status to "approved" in DB.');

          // Dispatch confirmation email via Resend
          const amount = (session.amount_total || 0) / 100;
          const origin = req.headers.get('origin') || 'https://eternals.studio';
          console.log('[Stripe Webhook] Dispatching confirmation email via Resend to client:', request.client_email);
          try {
            await resend.emails.send({
              from: 'Eternals Studio <onboarding@resend.dev>',
              to: request.client_email,
              subject: `Payment Confirmed & Project Approved: ${request.subject}`,
              html: `
                <div style="font-family: sans-serif; padding: 24px; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px;">
                  <h2 style="color: #0d9488; font-weight: 800;">Eternals Studio Quote Paid</h2>
                  <p>Hello <strong>${request.client_name}</strong>,</p>
                  <p>Thank you for your payment! We have successfully received your payment of <strong>$${amount.toFixed(2)}</strong> for the project <strong>"${request.subject}"</strong>.</p>
                  <p>Your project status has been updated to <strong>"Approved" (Paid)</strong> and has been delegated as an active task in the Team Portal. Our team is starting work immediately.</p>
                  <p>You can track the progress of your project in real-time from your <a href="${origin}/client" style="color: #0d9488; font-weight: bold;">Client Dashboard</a>.</p>
                  <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
                  <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">Eternals Studio &copy; 2026. All rights reserved.</p>
                </div>
              `,
            });
            console.log(`[Stripe Webhook] Webhook confirmation email sent to: ${request.client_email}`);
          } catch (mailErr: any) {
            console.warn('[Stripe Webhook] Webhook confirmation email bypassed or failed:', mailErr.message);
          }

          console.log(`[Stripe Webhook] Successfully completed payment for project request ${requestId}`);
          await logEvent(
            'evt_project_invoice_paid',
            'stripe',
            'success',
            `Client paid invoice for project request ID: ${requestId}. Delegated to Team Portal as Open Task.`,
            { request_id: requestId, amount }
          );
        } else {
          console.log('[Stripe Webhook] Project request is already processed. Status:', request.status);
        }
        return NextResponse.json({ received: true }) as unknown as Response;
      } catch (dbError: any) {
        console.error('[Stripe Webhook] Failed to update project status on webhook invoice payment:', dbError.message);
        return NextResponse.json({ error: dbError.message }, { status: 500 }) as unknown as Response;
      }
    } else {
      console.log('[Stripe Webhook] Webhook does not match project_invoice metadata or missing request_id.');
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


